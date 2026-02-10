import { useNavigate } from "react-router-dom";

function Home() {

    const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col items-center justify-center px-4">

      {/* Hero Section */}
      <h1 className="text-5xl font-bold text-gray-800 text-center">
        Discover Your Music World 🎶
      </h1>
      <p className="mt-4 text-gray-600 text-center max-w-xl">
        Upload songs, create playlists, and enjoy your favorite music all in one place.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <button onClick={()=> navigate("/login")} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
        <button onClick={()=> navigate("/songs")} className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition">
          Explore Songs
        </button>
      </div>

      {/* Feature Cards */}
      <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          🎵
          <h3 onClick={()=> navigate("/upload")} className="text-xl font-semibold mt-2">Upload Songs</h3>
          <p className="text-gray-500 mt-2">Add your favorite tracks easily.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          📂
          <h3 onClick={()=> navigate("/playlist")} className="text-xl font-semibold mt-2">Create Playlists</h3>
          <p className="text-gray-500 mt-2">Organize music your way.</p>
        </div>

        {/* <div className="bg-white p-6 rounded-xl shadow hover:scale-105 transition">
          ❤️
          <h3 className="text-xl font-semibold mt-2">Manage Favorites</h3>
          <p className="text-gray-500 mt-2">Keep songs you love close.</p>
        </div> */}
      </div>
    </div>
  );
}
export default Home