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

  // ── Single global audio instance ──────────────────────────────────────────
  // One ref for the Audio object, one state for which song id is "active"
  const audioRef = useRef(null);          // the single Audio instance
  const [playingId, setPlayingId] = useState(null);   // song._id currently playing
  const [isPlaying, setIsPlaying] = useState(false);  // play / pause toggle
  // ──────────────────────────────────────────────────────────────────────────

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchSongs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/getsongs");
      setSongs(res.data.data || []);
    } catch (err) {
      console.log(err);
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

  // Cleanup: pause and release audio when the component unmounts
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
        audioRef.current = null;
      }
    };
  }, []);

  /**
   * handlePlay — the single source of truth for playback.
   *
   * Cases:
   *  1. Clicking the SAME song that is currently PLAYING  → pause it
   *  2. Clicking the SAME song that is currently PAUSED   → resume it
   *  3. Clicking a DIFFERENT song                         → stop current, start new
   */
  const handlePlay = (song) => {
    if (!song.filepath) return;

    // ── Case 1 & 2: same song ─────────────────────────────────────────────
    if (playingId === song._id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
      return;
    }

    // ── Case 3: different song ────────────────────────────────────────────
    // Stop whatever is currently playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";      // release the old resource
    }

    // Create a fresh Audio instance for the new song
    const audio = new Audio(song.filepath);
    audioRef.current = audio;

    // When the track ends, reset UI state
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setPlayingId(null);
    });

    // Handle load/play errors gracefully
    audio.addEventListener("error", () => {
      toast.error("Failed to load audio. Try again.");
      setIsPlaying(false);
      setPlayingId(null);
    });

    audio.play().catch((err) => {
      console.error("Playback error:", err);
      toast.error("Playback failed.");
      setIsPlaying(false);
      setPlayingId(null);
    });

    setPlayingId(song._id);
    setIsPlaying(true);
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
              const active = playingId === song._id;
              const playing = active && isPlaying;

              return (
                <motion.div
                  key={song._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="minimal-card p-4 sm:p-5 rounded-xl bg-[var(--surface)] group hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3 sm:mb-4">
                    {/* Album art / play button */}
                    <button
                      onClick={() => handlePlay(song)}
                      disabled={!song.filepath}
                      className="w-12 h-12 sm:w-16 sm:h-16 bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all overflow-hidden flex-shrink-0 relative group/play focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
                      title={playing ? "Pause" : "Play"}
                    >
                      {/* Cover image dimmed when playing */}
                      {song.coverImage && (
                        <img
                          src={song.coverImage}
                          alt={song.title}
                          className={`w-full h-full object-cover absolute inset-0 transition-opacity ${playing ? "opacity-40" : "opacity-100"}`}
                        />
                      )}

                      {/* Play / Pause / Music note icon */}
                      <span className={`relative z-10 transition-opacity ${song.coverImage ? (playing || "group-hover/play:opacity-100 opacity-0") : "opacity-100"}`}>
                        {playing ? (
                          // Pause icon
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--text-main)]">
                            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                          </svg>
                        ) : active ? (
                          // Play icon (paused state of active song)
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 sm:w-7 sm:h-7 text-[var(--text-main)]">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          // Music note (default, no cover)
                          !song.coverImage && (
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 sm:w-8 sm:h-8">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.97-.276 1.94-.386 2.943-.324M5.653 5.441l.955.516l2.153-1.166l-1.66-2.195l-1.448.845z" />
                            </svg>
                          )
                        )}
                      </span>

                      {/* Animated equalizer bars when playing */}
                      {playing && (
                        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-[2px] items-end z-20">
                          {[1, 2, 3].map((i) => (
                            <span
                              key={i}
                              className="w-[3px] bg-[var(--primary)] rounded-full"
                              style={{
                                height: `${6 + i * 3}px`,
                                animation: `eq-bar ${0.5 + i * 0.1}s ease-in-out infinite alternate`,
                              }}
                            />
                          ))}
                        </span>
                      )}
                    </button>

                    {/* Add to playlist button */}
                    <button
                      onClick={() => openAddModal(song)}
                      className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1.5 sm:p-1"
                      title="Add to playlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                      </svg>
                    </button>
                  </div>

                  <h3 className="font-semibold text-base sm:text-lg text-[var(--text-main)] truncate mb-1">{song.title}</h3>
                  <p className={`text-xs sm:text-sm truncate ${active ? "text-[var(--primary)]" : "text-[var(--text-muted)]"}`}>
                    {song.artist}
                    {playing && <span className="ml-1 text-xs">▶ Playing</span>}
                    {active && !playing && <span className="ml-1 text-xs opacity-60">⏸ Paused</span>}
                  </p>
                </motion.div>
              );
            })}
          </div>
        )}

        {!loading && songs.length === 0 && (
          <div className="text-center py-20 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[var(--text-muted)]">No songs found, Start by uploading one!</p>
          </div>
        )}

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="minimal-card bg-[var(--surface)] p-6 rounded-xl w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[var(--text-main)]">Add to Playlist</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="space-y-1 max-h-60 overflow-y-auto pr-2">
                  {playlists.length > 0 ? (
                    playlists.map((pl) => (
                      <button
                        key={pl._id}
                        onClick={() => addToPlaylist(pl._id)}
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-[var(--surface-hover)] transition-colors flex items-center justify-between group"
                      >
                        <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-main)]">{pl.title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-[var(--border)] group-hover:text-[var(--text-muted)]">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-[var(--text-muted)] mb-3">No playlists found</p>
                      <button
                        onClick={() => navigate("/playlist")}
                        className="text-xs font-semibold text-[var(--text-main)] hover:underline"
                      >
                        Create new playlist
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Equalizer bar animation keyframes */}
      <style>{`
        @keyframes eq-bar {
          from { transform: scaleY(0.4); }
          to   { transform: scaleY(1.2); }
        }
      `}</style>
    </div>
  );
}

export default Songs;
