import { useEffect, useState } from "react";
import api from "../../api/axios";
import toast from "react-hot-toast";
import { Navigate, useNavigate } from "react-router-dom";


function Playlist() {
  const [playlists, setPlaylists] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [songs, setSongs] = useState([]); 
  const [selectedPlaylistId, setSelectedPlaylistId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [user,setUser] = useState(
    JSON.parse(localStorage.getItem("user")))

    const navigate = useNavigate()
  
  const token = localStorage.getItem("token")
  console.log("Tokenn Createdd",token);
  
  
  const fetchPlaylists = async () => {
    try {


      const res = await api.get("/playlists/getAllPlaylist" ,{headers:{Authorization:`Bearer ${token}`}});
      setPlaylists(res.data.playListData);
      console.log("TOKEN SAVED 👉", res.data.token);

    } catch (err) {
      toast.error("Failed to fetch playlists");
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

 
  const handleCreatePlaylist = async () => {
    if (!token) return navigate("/login") ,toast.error("Please Login")
      
    if (!playlistName) return toast.error("Enter playlist name");
    

    try {
      await api.post("/playlists/Playlist", { title: playlistName,owner:user._id },{headers:{Authorization:`Bearer ${token}`}});
      console.log(user._id)
      
      toast.success("Playlist created");
      setPlaylistName("");
      fetchPlaylists();
    } catch (err) {
      toast.error("Playlist creation failed");
    }
  };

 
 const fetchSongs = async (playlistId) => {
  try {
    const res = await api.get(`/playlists/getplaylistbyId/${playlistId}`,{headers:{Authorization:`Bearer ${token}`}});
    console.log("PLAYLIST API RESPONSE 👉", res.data); 
   
    setSongs(res.data.data.songs)
    console.log(res.data.data.songs);
    
  } catch (err) {
    toast.error("Failed to load songs");
  }
};



 
  const RemoveSongFMplaylist = async (playlistId, songId) => {
    try {
      
     const res =  await api.put(`/playlists/${playlistId}/remove-song/${songId}`,{},{headers:{Authorization:`Bearer ${token}`}});
      toast.success("Song removed");
     
      
      fetchSongs(playlistId);
      
    } catch (err) {
      toast.error("Failed to remove song");
    }
  };

  

  
  const DeletePlaylist = async (id) => {
    try {
      await api.delete(`/playlists/DeleteAplaylist/${id}`,{headers:{Authorization:`Bearer ${token}`}});
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
  // getPlaylistById()
   const openDeleteModal = async(selectedPlaylistId)=>{

    setShowModal(true)
  }


  return (
  <>
    
    {showModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-xl w-80 shadow-xl">
          <h3 className="text-lg font-bold mb-4 text-center">
            Are you sure?
          </h3>

          <div className="flex justify-between gap-3">
            <button
              onClick={() => {
                DeletePlaylist(selectedPlaylistId);
                setShowModal(false);
              }}
              className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
            >
              Delete
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="flex-1 bg-gray-300 py-2 rounded-lg hover:bg-gray-400 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}

    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="max-w-4xl mx-auto">

        
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          🎧 Create Playlist
        </h2>

        <div className="bg-white p-4 rounded-xl shadow mb-8 flex gap-3">
          <input
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg flex-grow
                       focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Playlist name"
          />
          <button
            onClick={handleCreatePlaylist}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg
                       hover:bg-blue-700 transition shadow"
          >
            Create
          </button>
        </div>

        
        {playlists.map((pl) => (
          <div
            key={pl._id}
            className="bg-white p-5 mb-5 rounded-xl shadow
                       hover:shadow-lg transition"
          >
            
            <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
              {pl.title}
             </h3>
              <p className="text-sm text-gray-500">
               🎵 {pl.songs.length} songs
               </p>
              </div>

              <div className="flex items-center gap-4">
                <button
                  className="text-blue-600 font-medium hover:underline"
                  onClick={() => toggleSongs(pl._id)}
                >
                  {selectedPlaylistId === pl._id
                    ? "Hide Songs"
                    : "Show Songs"}
                </button>

                <button
                  className="text-red-600 font-medium hover:underline"
                  onClick={() => {
                    setSelectedPlaylistId(pl._id);
                    setShowModal(true);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>

            
            {selectedPlaylistId === pl._id && (
              <div className="mt-6 space-y-4">
                {songs.length === 0 ? (
                  <p className="text-gray-500 italic">
                    No songs in this playlist
                  </p>
                ) : (
                  songs.map((song) => (
                    <div
                      key={song._id}
                      className="bg-gray-50 p-4 rounded-lg border
                                 hover:bg-gray-100 transition">
                    
                      <p className="text-lg font-semibold">
                        {song.title}
                      </p>
                      <p className="text-gray-600">
                        {song.artist}
                      </p>

                      {song.filepath && (
                        <audio controls className="w-full mt-3">
                        <source
                          src={song.filepath}
                          type="audio/mp3"
                        />
                        </audio>
                      )}

                    <button
                        onClick={() =>
                          RemoveSongFMplaylist(pl._id, song._id)
                        }
                        className="mt-3 px-4 py-1.5 bg-teal-500 text-white
                                   text-sm font-semibold rounded-md
                                   hover:bg-teal-400 transition"
                      >
                        Remove
                    </button>
                 </div>
              ))
             )}
         </div>
        )}
    </div>
    ))}
  </div>
 </div>
</>
);}
export default Playlist
