import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]);
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user] = useState(JSON.parse(localStorage.getItem("user")))

  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  const fetchPlaylists = async () => {
    try {
      const res = await api.get("/playlists/getAllPlaylist", { headers: { Authorization: `Bearer ${token}` } });
      setPlaylists(res.data.playListData);
    } catch (err) {
      toast.error("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleCreatePlaylist = async () => {
    if (!token) return navigate("/login"), toast.error("Please Login")
    if (!playlistName) return toast.error("Enter playlist name");

    try {
      await api.post("/playlists/Playlist", { title: playlistName, owner: user._id }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success("Playlist created");
      setPlaylistName("");
      fetchPlaylists();
    } catch (err) {
      toast.error("Playlist creation failed");
    }
  };

  const fetchSongs = async (playlistId) => {
    try {
      const res = await api.get(`/playlists/getplaylistbyId/${playlistId}`, { headers: { Authorization: `Bearer ${token}` } });
      setSongs(res.data.data.songs)
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
    <div className="min-h-screen pt-24 pb-12 px-6 bg-zinc-50">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="minimal-card p-6 rounded-xl w-full max-w-sm bg-white"
            >
              <h3 className="text-lg font-semibold mb-2 text-zinc-900">Delete Playlist?</h3>
              <p className="text-sm text-zinc-500 mb-6">This action cannot be undone.</p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    DeletePlaylist(selectedPlaylistId);
                    setShowModal(false);
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Delete
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-100 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-200 transition"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-zinc-900 tracking-tight">Library</h2>
            <p className="text-zinc-500 text-sm mt-1">Manage your collections</p>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-1 rounded-xl mb-8 flex shadow-sm max-w-md">
          <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="flex-grow px-4 py-2 bg-transparent outline-none text-zinc-900 placeholder-zinc-400 text-sm"
            placeholder="New playlist name..."
          />
          <button
            onClick={handleCreatePlaylist}
            className="bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition"
          >
            Create
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Playlists Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2 px-1">Playlists</h3>
            {playlists.length > 0 ? (
              playlists.map((pl) => (
                <motion.div
                  key={pl._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-3 rounded-lg cursor-pointer transition-all flex justify-between items-center group ${selectedPlaylistId === pl._id
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  onClick={() => toggleSongs(pl._id)}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 flex-shrink-0">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                    </svg>
                    <span className="font-medium truncate text-sm">{pl.title}</span>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs text-zinc-400">{pl.songs.length}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylistId(pl._id);
                        setShowModal(true);
                      }}
                      className="p-1 hover:bg-zinc-200 rounded text-zinc-400 hover:text-red-500 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8 border border-dashed border-zinc-200 rounded-lg">
                <p className="text-zinc-400 text-sm">No playlists</p>
              </div>
            )}
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
                  className="bg-white border border-zinc-200 rounded-xl p-6 shadow-sm min-h-[400px]"
                >
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-zinc-100">
                    <h3 className="text-xl font-bold text-zinc-900">
                      {playlists.find(p => p._id === selectedPlaylistId)?.title}
                    </h3>
                    <span className="text-xs font-mono text-zinc-400">
                      {songs.length} TRACKS
                    </span>
                  </div>

                  <div className="space-y-1">
                    {songs.length === 0 ? (
                      <div className="text-center py-20 flex flex-col items-center">
                        <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center mb-4">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-zinc-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.97-.276 1.94-.386 2.943-.324M5.653 5.441l.955.516l2.153-1.166l-1.66-2.195l-1.448.845z" />
                          </svg>
                        </div>
                        <p className="text-zinc-500 text-sm">Playlist is empty</p>
                        <button
                          onClick={() => navigate("/songs")}
                          className="mt-3 text-zinc-900 text-sm font-medium hover:underline"
                        >
                          Add songs
                        </button>
                      </div>
                    ) : (
                      songs.map((song, index) => (
                        <motion.div
                          key={song._id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: index * 0.05 }}
                          className="group flex items-center gap-4 p-3 hover:bg-zinc-50 rounded-lg transition-colors border border-transparent hover:border-zinc-100"
                        >
                          <div className="w-8 h-8 flex items-center justify-center bg-zinc-100 text-zinc-500 rounded text-xs font-mono">
                            {index + 1}
                          </div>

                          <div className="flex-grow min-w-0">
                            <h4 className="font-medium text-zinc-900 truncate text-sm">{song.title}</h4>
                            <p className="text-zinc-500 text-xs truncate">{song.artist}</p>
                          </div>

                          {song.filepath && (
                            <div className="w-32 sm:w-48">
                              <audio controls className="w-full h-8 scale-90 origin-right opacity-60 hover:opacity-100 transition-opacity">
                                <source src={song.filepath} type="audio/mp3" />
                              </audio>
                            </div>
                          )}

                          <button
                            onClick={() => RemoveSongFMplaylist(selectedPlaylistId, song._id)}
                            className="p-2 text-zinc-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                            title="Remove from playlist"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                            </svg>
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-zinc-200 rounded-xl p-8 text-center">
                  <p className="text-zinc-400 text-sm font-medium">Select a playlist to view tracks</p>
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
