import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAudio } from "../Context/AudioContext";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const { currentSong, isPlaying, isBuffering, playSong } = useAudio();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists/getAllPlaylist", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPlaylists(res.data.playListData || []);
    } catch (err) {
      toast.error("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!token) return navigate("/login"), toast.error("Please Login");
    if (!playlistName) return toast.error("Enter playlist name");

    try {
      await api.post("/playlists/Playlist", { title: playlistName, owner: user._id }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Playlist created");
      setPlaylistName("");
      fetchPlaylists();
      setShowCreateModal(false);
    } catch (err) {
      toast.error("Playlist creation failed");
    }
  };

  const fetchSongs = async (playlistId) => {
    try {
      const res = await api.get(`/playlists/getplaylistbyId/${playlistId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSongs(res.data.data.songs || []);
    } catch (err) {
      toast.error("Failed to load songs");
    }
  };

  const RemoveSongFMplaylist = async (playlistId, songId) => {
    try {
      await api.put(`/playlists/${playlistId}/remove-song/${songId}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Song removed");
      fetchSongs(playlistId);
    } catch (err) {
      toast.error("Failed to remove song");
    }
  };

  const DeletePlaylist = async (id) => {
    try {
      await api.delete(`/playlists/DeleteAplaylist/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Playlist deleted");
      setSelectedPlaylistId(null);
      setSongs([]);
      fetchPlaylists();
    } catch (err) {
      toast.error("Failed to delete playlist");
    }
  };

  const toggleSongs = (playlistId) => {
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
      setSongs([]);
    } else {
      setSelectedPlaylistId(playlistId);
      fetchSongs(playlistId);
    }
  };

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-32 md:pb-32 px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="minimal-card p-6 rounded-xl w-full max-w-sm bg-[var(--surface)]"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold mb-2">Delete Playlist?</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6">This action cannot be undone.</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    DeletePlaylist(selectedPlaylistId);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[var(--surface-hover)] text-[var(--text-main)] rounded-lg font-medium hover:opacity-80 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded-2xl w-full max-w-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--text-main)]">Create Playlist</h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1 hover:bg-[var(--surface-hover)] rounded-full transition-colors text-[var(--text-muted)]"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 block px-1">
                    Playlist Name
                  </label>
                  <input
                    autoFocus
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                    className="w-full px-4 py-3 bg-[var(--surface-hover)] border border-[var(--border)] rounded-xl outline-none text-[var(--text-main)] placeholder-zinc-500 focus:border-[var(--primary)] transition-all"
                    placeholder="e.g. My Favorite Hits"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleCreatePlaylist();
                      }
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-3 bg-[var(--surface-hover)] text-[var(--text-main)] rounded-xl font-semibold flex-1 hover:opacity-80 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreatePlaylist}
                    className="px-4 py-3 bg-[var(--primary)] text-[var(--primary-text)] rounded-xl font-semibold flex-1 hover:opacity-90 transition shadow-lg shadow-[var(--primary)]/20"
                  >
                    Create
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom">
        <div className="flex items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">Library</h2>
            <p className="text-[var(--text-muted)] text-sm mt-1">Manage your collections</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="md:hidden p-2 bg-[var(--surface-hover)] hover:bg-[var(--border)] rounded-full transition-colors text-[var(--text-main)]"
            aria-label="New Playlist"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex bg-[var(--surface)] border border-[var(--border)] p-1 rounded-xl mb-8 shadow-sm max-w-md">
          <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="flex-grow px-4 py-2 bg-transparent outline-none text-[var(--text-main)] placeholder-zinc-400 text-sm"
            placeholder="New playlist name..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleCreatePlaylist();
              }
            }}
          />
          <button
            onClick={handleCreatePlaylist}
            className="hidden md:block bg-[var(--primary)] text-[var(--primary-text)] px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition"
          >
            Create
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Playlists Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">Playlists</h3>
            {playlists.map((pl, index) => (
              <motion.div
                key={pl._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{
                  x: 8,
                  backgroundColor: selectedPlaylistId === pl._id ? "var(--primary)" : "var(--surface-hover)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ delay: index * 0.05, type: "spring", stiffness: 400, damping: 25 }}
                className={`p-3.5 rounded-2xl cursor-pointer transition-all flex justify-between items-center group mb-2 border border-transparent ${selectedPlaylistId === pl._id
                  ? "bg-[var(--primary)] text-[var(--primary-text)] shadow-xl shadow-[var(--primary)]/30 border-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:border-[var(--border)]"
                  }`}
                onClick={() => toggleSongs(pl._id)}
              >
                <div className="flex items-center gap-3.5 overflow-hidden">
                  <motion.div
                    animate={{ rotate: selectedPlaylistId === pl._id ? 5 : 0 }}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${selectedPlaylistId === pl._id ? 'bg-white/20' : 'bg-[var(--surface-hover)]'}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                  </motion.div>
                  <span className="font-bold truncate text-sm sm:text-base">{pl.title}</span>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs opacity-50">{pl.songs.length}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPlaylistId(pl._id);
                      setShowModal(true);
                    }}
                    className="p-1 hover:text-red-500 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Songs List */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedPlaylistId ? (
                <motion.div
                  key={selectedPlaylistId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6 shadow-sm min-h-[400px]"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-[var(--border)]">
                    <h3 className="text-xl font-bold">{playlists.find(p => p._id === selectedPlaylistId)?.title}</h3>
                    <span className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-widest">{songs.length} Tracks</span>
                  </div>

                  <div className="space-y-1">
                    {songs.map((song, index) => {
                      const isActive = currentSong?._id === song._id;
                      const isCurrentPlaying = isActive && isPlaying;
                      const isCurrentBuffering = isActive && isBuffering;

                      return (
                        <motion.div
                          key={song._id}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          whileHover={{ x: 4, backgroundColor: 'var(--surface-hover)' }}
                          transition={{ delay: index * 0.03 }}
                          className={`group flex items-center gap-4 p-3 rounded-xl transition-all border border-transparent ${isActive ? 'bg-[var(--surface-hover)] border-[var(--border)] shadow-sm' : ''}`}
                        >
                          {/* Play/Buffering Cell */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => playSong(song)}
                            disabled={isCurrentBuffering}
                            className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-[var(--surface-hover)] rounded-xl flex items-center justify-center text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors overflow-hidden border border-[var(--border)] relative"
                          >
                            {song.coverImage && (
                              <img src={song.coverImage} alt={song.title} className={`w-full h-full object-cover absolute inset-0 ${isCurrentPlaying ? "opacity-30" : "opacity-100"}`} />
                            )}
                            <div className="relative z-10 transition-all">
                              {isCurrentBuffering ? (
                                <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin"></div>
                              ) : isCurrentPlaying ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[var(--primary)]" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isActive ? 'text-[var(--text-main)]' : 'opacity-0 group-hover:opacity-100'}`} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                          </motion.button>

                          <div className="flex-grow min-w-0">
                            <h4 className={`font-semibold text-sm truncate ${isActive ? 'text-[var(--primary)]' : 'text-[var(--text-main)]'}`}>{song.title}</h4>
                            <p className="text-[var(--text-muted)] text-xs truncate font-medium">{song.artist}</p>
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.2, color: 'rgb(239 44 44)' }}
                            whileTap={{ scale: 0.8 }}
                            onClick={() => RemoveSongFMplaylist(selectedPlaylistId, song._id)}
                            className="p-2 text-[var(--text-muted)] transition-all opacity-0 group-hover:opacity-100 bg-[var(--surface-hover)] rounded-lg hover:shadow-md"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center text-[var(--text-muted)]">
                  <p className="text-sm font-medium">Please select a playlist to start listening</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Playlist;
