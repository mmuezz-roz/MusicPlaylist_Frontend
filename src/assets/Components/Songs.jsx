import { useEffect, useState } from "react";
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
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-10 sm:pb-12 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
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
            {songs.map((song, index) => (
              <motion.div
                key={song._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="minimal-card p-4 sm:p-5 rounded-xl bg-[var(--surface)] group hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.97-.276 1.94-.386 2.943-.324M5.653 5.441l.955.516l2.153-1.166l-1.66-2.195l-1.448.845z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => openAddModal(song)}
                    className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1.5 sm:p-1"
                    title="Add to playlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                <h3 className="font-semibold text-base sm:text-lg text-[var(--text-main)] truncate mb-1">{song.title}</h3>
                <p className="text-[var(--text-muted)] text-xs sm:text-sm truncate mb-3 sm:mb-4">{song.artist}</p>

                {song.filepath && (
                  <audio
                    controls
                    className="w-full h-7 sm:h-8 scale-[0.98] origin-left opacity-70 hover:opacity-100 transition-opacity invert dark:invert-0"
                  >
                    <source src={song.filepath} type="audio/mp3" />
                  </audio>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && songs.length === 0 && (
          <div className="text-center py-20 bg-[var(--surface)] border border-dashed border-[var(--border)] rounded-2xl">
            <p className="text-[var(--text-muted)]">No songs found. Start by uploading one!</p>
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
    </div>
  );
}

export default Songs;
