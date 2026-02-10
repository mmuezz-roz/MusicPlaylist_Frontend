import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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

  const addSongToPlayList = async(playlistId)=>{
        try {
            const res = await api.put(`/playlists/${playlistId}/add-song/${selectedSongId}`)
            console.log("hyyyyy",res)
            toast.success("Song Added Succesfully..")
            setShowModal(false);
        } catch (error) {
            console.log(error);
            toast.error("Failed to Add Song!!")
        }
    }

  useEffect(() => {
    fetchAllSongs();
  }, []);

  return (
    <>
    
      {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg w-80">
        <h3 className="text-lg font-bold mb-4">Select Playlist</h3>

       {playlist?.map((pl) => (
              <div
                key={pl._id}
                onClick={() => addSongToPlayList(pl._id)}
                className="border p-2 mb-2 cursor-pointer hover:bg-gray-100 rounded"
              >
                {pl.title}
              </div>
            ))}

            <button
              onClick={() => setShowModal(false)}
              className="mt-3 bg-red-500 text-white px-3 py-1 rounded w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-3xl mx-auto mt-10">

         
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">All Songs</h2>

            <button
              type="button"
              onClick={() => navigate("/upload")}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg
                         hover:bg-blue-700 transition shadow"
            >
              Upload Song
            </button>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {songs.map((Song) => (
              <div
                key={Song._id}
                className="bg-white p-4 shadow rounded-lg hover:shadow-lg transition"
              >
                <h3 className="font-bold text-lg">{Song.title}</h3>
                <p className="text-gray-600">{Song.artist}</p>

                {Song.filepath && (
                  <audio controls className="mt-3 w-full">
                    <source src={Song.filepath} type="audio/mp3" />
                  </audio>
                )}

                <button
                  className="bg-green-600 text-white px-3 py-1 rounded mt-3
                             hover:bg-green-700 transition text-lg"
                  onClick={() => openPlaylistModal(Song._id)}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Songs;
