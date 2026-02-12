import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Songs() {

  const [songs, setSongs] = useState([]);
  const [playlist, setPlaylist] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSongId, setSelectedSongId] = useState(null);

  const navigate = useNavigate();

  const fetchAllSongs = async () => {
    try {
      const res = await api.get("/getsongs");
      setSongs(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const FetchAllPlaylist = async () => {
    try {
      const res = await api.get("/playlists/getAllPlaylist");
      setPlaylist(res.data.playListData);
    } catch (error) {
      console.log(error);
    }
  };

  const openPlaylistModal = (songId) => {
    setSelectedSongId(songId);
    setShowModal(true);
    FetchAllPlaylist();
  };

  const addSongToPlayList = async (playlistId) => {
    try {
      await api.put(`/playlists/${playlistId}/add-song/${selectedSongId}`)
      toast.success("Added to playlist! 🎵")
      setShowModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to add song")
    }
  }

  useEffect(() => {
    fetchAllSongs();
  }, []);

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
              className="glass-card p-8 rounded-3xl w-full max-w-md border border-white/10"
            >
              <h3 className="text-2xl font-bold mb-6 text-gradient">Select Playlist</h3>

              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {playlist?.length > 0 ? (
                  playlist.map((pl) => (
                    <motion.div
                      key={pl._id}
                      whileHover={{ x: 5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                      onClick={() => addSongToPlayList(pl._id)}
                      className="p-4 bg-white/5 border border-white/5 rounded-xl cursor-pointer transition-all flex items-center justify-between group"
                    >
                      <span className="font-semibold">{pl.title}</span>
                      <span className="text-xs text-gray-500 group-hover:text-purple-400 transition-colors">Add Here +</span>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-gray-400 text-center py-4">No playlists found. Create one first!</p>
                )}
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="mt-8 btn-primary !bg-red-500/10 !text-red-500 border border-red-500/20 w-full hover:!bg-red-500/20 !from-transparent !to-transparent"
              >
                Cancel
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-2">All <span className="text-gradient">Songs</span></h2>
            <p className="text-gray-400">Discover and listen to your favorite tracks</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/upload")}
            className="btn-primary flex items-center gap-2"
          >
            <span>Upload New Song</span>
            <span className="text-xl">+</span>
          </motion.button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {songs.map((Song, index) => (
            <motion.div
              key={Song._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -5 }}
              className="glass-card p-6 rounded-3xl border border-white/5 group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openPlaylistModal(Song._id)}
                  className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center text-purple-400 hover:bg-purple-500 hover:text-white transition-all shadow-lg"
                  title="Add to playlist"
                >
                  <span className="text-xl">+</span>
                </button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform shadow-inner">
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-xl truncate pr-8">{Song.title}</h3>
                  <p className="text-gray-400 truncate">{Song.artist}</p>
                </div>
              </div>

              {Song.filepath && (
                <div className="bg-black/20 p-3 rounded-2xl">
                  <audio controls className="w-full h-8 brightness-90 contrast-125">
                    <source src={Song.filepath} type="audio/mp3" />
                  </audio>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {songs.length === 0 && (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
            <p className="text-gray-500 text-xl">No songs found. Start by uploading one!</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Songs;

