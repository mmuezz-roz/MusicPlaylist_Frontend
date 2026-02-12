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
      toast.success("Playlist created! 📂");
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
    <div className="min-h-screen pt-24 pb-12 px-6">
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card p-8 rounded-3xl w-full max-w-sm border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-4 text-center">Are you sure?</h3>
              <p className="text-gray-400 text-center mb-8">This action cannot be undone. All songs will be removed from this playlist.</p>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    DeletePlaylist(selectedPlaylistId);
                    setShowModal(false);
                  }}
                  className="btn-primary !from-red-500 !to-red-600"
                >
                  Delete
                </button>

                <button
                  onClick={() => setShowModal(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">My <span className="text-gradient">Playlists</span></h2>
            <p className="text-gray-400">Organize and manage your music collections</p>
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl mb-12 flex flex-col sm:flex-row gap-4">
          <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="input-field flex-grow"
            placeholder="New playlist name..."
          />
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreatePlaylist}
            className="btn-primary whitespace-nowrap"
          >
            Create Playlist
          </motion.button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Playlists Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <h3 className="text-xl font-bold mb-4 px-2">Your Collections</h3>
            {playlists.length > 0 ? (
              playlists.map((pl) => (
                <motion.div
                  key={pl._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-5 rounded-2xl cursor-pointer transition-all border ${selectedPlaylistId === pl._id
                      ? "bg-purple-500/10 border-purple-500/30 ring-1 ring-purple-500/30"
                      : "bg-white/5 border-white/5 hover:bg-white/10"
                    }`}
                  onClick={() => toggleSongs(pl._id)}
                >
                  <div className="flex justify-between items-center">
                    <div className="min-w-0">
                      <h4 className="font-bold truncate">{pl.title}</h4>
                      <p className="text-sm text-gray-400">{pl.songs.length} tracks</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedPlaylistId(pl._id);
                        setShowModal(true);
                      }}
                      className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-10 bg-white/5 rounded-2xl border border-dashed border-white/10">
                <p className="text-gray-500">No playlists yet</p>
              </div>
            )}
          </div>

          {/* Songs List */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {selectedPlaylistId ? (
                <motion.div
                  key={selectedPlaylistId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card p-8 rounded-3xl min-h-[400px]"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-2xl font-bold">
                      {playlists.find(p => p._id === selectedPlaylistId)?.title}
                    </h3>
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-semibold">
                      {songs.length} Songs
                    </span>
                  </div>

                  <div className="space-y-4">
                    {songs.length === 0 ? (
                      <div className="text-center py-20">
                        <div className="text-4xl mb-4">🎵</div>
                        <p className="text-gray-500">This playlist is empty</p>
                        <button
                          onClick={() => navigate("/songs")}
                          className="mt-4 text-purple-400 font-semibold hover:underline"
                        >
                          Explore songs to add
                        </button>
                      </div>
                    ) : (
                      songs.map((song, index) => (
                        <motion.div
                          key={song._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="bg-white/5 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-4 hover:bg-white/10 transition-colors group"
                        >
                          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-xl">
                            🎶
                          </div>
                          <div className="flex-grow">
                            <h4 className="font-bold">{song.title}</h4>
                            <p className="text-gray-400 text-sm">{song.artist}</p>
                          </div>

                          {song.filepath && (
                            <div className="flex-grow sm:max-w-[200px]">
                              <audio controls className="w-full h-8 opacity-70 hover:opacity-100 transition-opacity">
                                <source src={song.filepath} type="audio/mp3" />
                              </audio>
                            </div>
                          )}

                          <button
                            onClick={() => RemoveSongFMplaylist(selectedPlaylistId, song._id)}
                            className="px-4 py-2 bg-red-500/10 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                          >
                            Remove
                          </button>
                        </motion.div>
                      ))
                    )}
                  </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center glass-card rounded-3xl p-8 text-center text-gray-500">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-6">
                    👈
                  </div>
                  <h3 className="text-xl font-bold text-gray-300 mb-2">Select a Playlist</h3>
                  <p>Choose a collection from the sidebar to view and manage its tracks.</p>
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

