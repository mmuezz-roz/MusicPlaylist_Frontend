import { useEffect, useRef, useState } from "react";
import api from "../../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Songs() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSong, setSelectedSong] = useState(null);
  const [playlists, setPlaylists] = useState([]);

  // ── Global Audio Management ───────────────────────────────────────────────
  const audioRef = useRef(null);
  const [playingId, setPlayingId] = useState(null);   // The active song ID
  const [isPlaying, setIsPlaying] = useState(false);  // Playing vs Paused
  const [isBuffering, setIsBuffering] = useState(false); // True while loading track
  // ──────────────────────────────────────────────────────────────────────────

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Helper to remove listeners from existing audio instance
  const cleanupAudioListeners = (audio) => {
    if (!audio) return;
    audio.onended = null;
    audio.onerror = null;
    audio.oncanplay = null;
    audio.onwaiting = null;
    audio.onplaying = null;
  };

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/getsongs");
      setSongs(res.data.data || []);
    } catch (err) {
      toast.error("Failed to load songs");
      setSongs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    if (!token) return;
    try {
      const res = await api.get("/playlists/getAllPlaylist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(res.data.playListData || []);
    } catch (err) {
      console.log("Error fetching playlists");
    }
  };

  useEffect(() => {
    fetchSongs();
    fetchPlaylists();
  }, []);

  // Final cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        cleanupAudioListeners(audioRef.current);
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current.load(); // Force release
        audioRef.current = null;
      }
    };
  }, []);

  const handlePlay = (song) => {
    if (!song.filepath) return;

    // ── Case 1: Toggle current song ───────────────────────────────────────
    if (playingId === song._id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        setIsBuffering(false);
      } else {
        setIsBuffering(true);
        audioRef.current.play().catch(err => {
          if (err.name !== "AbortError") console.error("Play aborted:", err);
          setIsBuffering(false);
        });
        setIsPlaying(true);
      }
      return;
    }

    // ── Case 2: Switch to new song ────────────────────────────────────────
    setIsBuffering(true);
    setIsPlaying(false);

    // Stop and clean up previous instance FIRST
    if (audioRef.current) {
      audioRef.current.pause();
      cleanupAudioListeners(audioRef.current);
      audioRef.current.src = "";
      audioRef.current.load();
    }

    const audio = new Audio(song.filepath);
    audioRef.current = audio;
    setPlayingId(song._id);

    // Event: Audio is ready to play
    audio.oncanplay = () => {
      setIsBuffering(false);
      if (playingId === song._id || !playingId) { // Verify we are still on this song
        audio.play().catch(err => {
          if (err.name !== "AbortError") console.error("Playback failed:", err);
        });
        setIsPlaying(true);
      }
    };

    // Event: Buffering (stalled)
    audio.onwaiting = () => setIsBuffering(true);
    audio.onplaying = () => setIsBuffering(false);

    // Event: Success/End
    audio.onended = () => {
      setIsPlaying(false);
      setPlayingId(null);
      setIsBuffering(false);
    };

    // Event: Real Error (Filtered out cleanup-triggered errors)
    audio.onerror = () => {
      // Only show toast if the source actually failed and we haven't manually cleared it
      if (audio.src && audio.src !== window.location.href) {
        toast.error("Failed to load audio. URL might be expired or broken.");
      }
      setIsPlaying(false);
      setPlayingId(null);
      setIsBuffering(false);
    };

    // Trigger load
    audio.load();
  };

  const openAddModal = (song) => {
    if (!token) {
      toast.error("Please login to add songs to playlists");
      navigate("/login");
      return;
    }
    setSelectedSong(song);
    setModalOpen(true);
  };

  const addToPlaylist = async (playlistId) => {
    try {
      await api.put(`/playlists/${playlistId}/add-song/${selectedSong._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Song added to playlist");
      setModalOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add song");
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-28 md:pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">Explore</h2>
            <p className="text-[var(--text-muted)] mt-1 text-xs sm:text-sm">Discover new sounds</p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="btn-primary text-xs sm:text-sm w-full sm:w-auto"
          >
            Upload Track
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-[var(--border)] border-t-[var(--text-main)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {songs.map((song, index) => {
              const isActive = playingId === song._id;
              const isCurrentPlaying = isActive && isPlaying;
              const isCurrentBuffering = isActive && isBuffering;

              return (
                <motion.div
                  key={song._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`minimal-card p-4 sm:p-5 rounded-xl bg-[var(--surface)] group hover:shadow-md transition-shadow relative overflow-hidden ${isActive ? 'border-[var(--primary)]' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    {/* Play/Pause/Loading Button */}
                    <button
                      onClick={() => handlePlay(song)}
                      disabled={isCurrentBuffering}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all overflow-hidden relative focus:outline-none disabled:cursor-wait"
                    >
                      {song.coverImage && (
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className={`w-full h-full object-cover absolute inset-0 transition-opacity ${isCurrentPlaying ? "opacity-30" : "opacity-100"}`}
                        />
                      )}

                      <div className="relative z-10">
                        {isCurrentBuffering ? (
                          <div className="w-5 h-5 sm:w-6 sm:h-6 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                        ) : isCurrentPlaying ? (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7">
                            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={`w-6 h-6 sm:w-7 sm:h-7 ${isActive ? "text-[var(--text-main)]" : "opacity-0 group-hover:opacity-100"}`}>
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={() => openAddModal(song)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-main)] p-1.5 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-[var(--text-main)] truncate mb-0.5">{song.title}</h3>
                  <p className={`text-xs sm:text-sm truncate font-medium ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                    {song.artist}
                    {isCurrentPlaying && <span className="ml-2 inline-flex gap-0.5">
                      <span className="w-0.5 h-3 bg-[var(--primary)] animate-pulse"></span>
                      <span className="w-0.5 h-3 bg-[var(--primary)] animate-pulse delay-75"></span>
                      <span className="w-0.5 h-3 bg-[var(--primary)] animate-pulse delay-150"></span>
                    </span>}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Playlists Modal */}
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="minimal-card bg-[var(--surface)] p-6 rounded-xl w-full max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold">Add to Playlist</h3>
                  <button onClick={() => setModalOpen(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {playlists.map((pl) => (
                    <button
                      key={pl._id}
                      onClick={() => addToPlaylist(pl._id)}
                      className="w-full text-left p-3 rounded-lg hover:bg-[var(--surface-hover)] border border-transparent hover:border-[var(--border)] transition-all flex items-center justify-between"
                    >
                      <span>{pl.title}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 opacity-50" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Songs;
