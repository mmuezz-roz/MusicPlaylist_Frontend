import { useEffect, useRef, useState, useMemo } from "react";
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
  const [searchQuery, setSearchQuery] = useState("");

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
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  // ── Client-side Filtering ──────────────────────────────────────────────────
  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const query = searchQuery.toLowerCase().trim();
    return songs.filter(song =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query)
    );
  }, [songs, searchQuery]);
  // ──────────────────────────────────────────────────────────────────────────

  const handlePlay = (song) => {
    if (!song.filepath) return;

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

    setIsBuffering(true);
    setIsPlaying(false);

    if (audioRef.current) {
      audioRef.current.pause();
      cleanupAudioListeners(audioRef.current);
      audioRef.current.src = "";
      audioRef.current.load();
    }

    const audio = new Audio(song.filepath);
    audioRef.current = audio;
    setPlayingId(song._id);

    audio.oncanplay = () => {
      setIsBuffering(false);
      if (playingId === song._id || !playingId) {
        audio.play().catch(err => {
          if (err.name !== "AbortError") console.error("Playback failed:", err);
        });
        setIsPlaying(true);
      }
    };

    audio.onwaiting = () => setIsBuffering(true);
    audio.onplaying = () => setIsBuffering(false);

    audio.onended = () => {
      setIsPlaying(false);
      setPlayingId(null);
      setIsBuffering(false);
    };

    audio.onerror = () => {
      if (audio.src && audio.src !== window.location.href) {
        toast.error("Failed to load audio. URL might be expired or broken.");
      }
      setIsPlaying(false);
      setPlayingId(null);
      setIsBuffering(false);
    };

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
        {/* Header Section with Search Bar */}
        <div className="flex flex-col gap-4 mb-8 sm:mb-10">
          <div className="flex flex-row justify-between items-center w-full">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-main)] tracking-tight">Explore</h2>
              <p className="hidden sm:block text-[var(--text-muted)] mt-1 text-xs sm:text-sm">Discover new sounds</p>
            </div>

            {/* Desktop Search Bar (Hidden on Mobile) */}
            <div className="hidden md:flex flex-1 justify-center px-8">
              <div className="relative w-full max-w-[400px]">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
                <input
                  type="text"
                  placeholder="Search songs or artists..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-[var(--surface-hover)] border border-[var(--border)] rounded-full pl-10 pr-10 text-sm text-[var(--text-main)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)] transition-all placeholder-[var(--text-muted)]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 group"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => navigate("/upload")}
              className="btn-primary text-xs sm:text-sm whitespace-nowrap px-4 sm:px-6"
            >
              Upload Track
            </button>
          </div>

          {/* Mobile Search Bar (Sticky) */}
          <div className="md:hidden sticky top-20 z-10 w-full px-1">
            <div className="relative w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                type="text"
                placeholder="Search songs or artists..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 bg-[var(--surface)] border border-[var(--border)] rounded-full pl-10 pr-10 text-sm text-[var(--text-main)] focus:outline-none shadow-lg backdrop-blur-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-4"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-7 h-7 sm:w-8 sm:h-8 border-2 border-[var(--border)] border-t-[var(--text-main)] rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              <AnimatePresence mode="popLayout">
                {filteredSongs.map((song, index) => {
                  const isActive = playingId === song._id;
                  const isCurrentPlaying = isActive && isPlaying;
                  const isCurrentBuffering = isActive && isBuffering;

                  return (
                    <motion.div
                      key={song._id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className={`minimal-card p-4 sm:p-5 rounded-xl bg-[var(--surface)] group hover:shadow-md transition-shadow relative overflow-hidden ${isActive ? 'border-[var(--primary)]' : ''}`}
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
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
              </AnimatePresence>
            </div>

            {/* No Songs Found State */}
            {filteredSongs.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-20 text-center"
              >
                <div className="w-16 h-16 bg-[var(--surface-hover)] rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[var(--text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-[var(--text-main)]">No songs found</h3>
                <p className="text-[var(--text-muted)] text-sm max-w-xs mt-2">
                  We couldn't find any tracks matching "{searchQuery}". Try a different search term.
                </p>
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="mt-6 text-sm font-medium text-[var(--primary)] hover:underline"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            )}
          </>
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
