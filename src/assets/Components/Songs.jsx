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
      const res = await api.get("/getsongs"); // Corrected endpoint based on previous file history
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
    <div className="min-h-screen pt-24 pb-12 px-6 bg-zinc-50">
      <div className="container-custom">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Explore</h2>
            <p className="text-zinc-500 mt-1 text-sm">Discover new sounds</p>
          </div>
          <button
            onClick={() => navigate("/upload")}
            className="btn-primary text-sm bg-zinc-900 text-white"
          >
            Upload Track
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {songs.map((song, index) => (
              <motion.div
                key={song._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="minimal-card p-5 rounded-xl bg-white group hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center text-zinc-400 group-hover:bg-zinc-100 group-hover:text-zinc-900 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.97-.276 1.94-.386 2.943-.324M5.653 5.441l.955.516l2.153-1.166l-1.66-2.195l-1.448.845z" />
                    </svg>
                  </div>
                  <button
                    onClick={() => openAddModal(song)}
                    className="text-zinc-400 hover:text-zinc-900 transition-colors p-1"
                    title="Add to playlist"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </button>
                </div>

                <h3 className="font-semibold text-lg text-zinc-900 truncate mb-1">{song.title}</h3>
                <p className="text-zinc-500 text-sm truncate mb-4">{song.artist}</p>

                {song.filepath && (
                  <audio
                    controls
                    className="w-full h-8 scale-[0.98] origin-left opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <source src={song.filepath} type="audio/mp3" />
                  </audio>
                )}
              </motion.div>
            ))}
          </div>
        )}

        {!loading && songs.length === 0 && (
          <div className="text-center py-20 bg-white border border-dashed border-zinc-200 rounded-2xl">
            <p className="text-zinc-500">No songs found. Start by uploading one!</p>
          </div>
        )}

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
              onClick={() => setModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="minimal-card bg-white p-6 rounded-xl w-full max-w-sm shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-zinc-900">Add to Playlist</h3>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="text-zinc-400 hover:text-zinc-600"
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
                        className="w-full text-left px-4 py-3 rounded-lg hover:bg-zinc-50 transition-colors flex items-center justify-between group"
                      >
                        <span className="text-sm font-medium text-zinc-700 group-hover:text-zinc-900">{pl.title}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-zinc-300 group-hover:text-zinc-500">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                      </button>
                    ))
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-sm text-zinc-500 mb-3">No playlists found</p>
                      <button
                        onClick={() => navigate("/playlist")}
                        className="text-xs font-semibold text-zinc-900 hover:underline"
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
