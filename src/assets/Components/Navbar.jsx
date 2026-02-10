import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  };
  ///removeItem("token");//

  return (
    <motion.nav 
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white px-6 py-4 shadow-lg"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <motion.h1 
          whileHover={{ scale: 1.05 }}
          className="text-2xl font-extrabold tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          🎵 MusicPlaylist
        </motion.h1>

        {/* LINKS */}
        <ul className="hidden md:flex items-center gap-8 text-lg font-medium">

          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/Home">Home</Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/songs">Songs</Link>
          </motion.li>

          <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/playlist">Playlists</Link>
          </motion.li>

          {/* <motion.li whileHover={{ scale: 1.1 }}>
            <Link to="/favorites">Favorites</Link>
          </motion.li> */}

        </ul>

        {/* BUTTONS */}
        <div className="flex gap-4">

          {!token ? (
            <>
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-lg bg-white text-blue-600 font-semibold hover:bg-blue-200 transition"
                onClick={() => navigate("/")}
              >
                Login
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-300 transition"
                onClick={() => navigate("/register")}
              >
                Register
              </motion.button>
            </>
          ) : (
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="px-4 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-400 transition"
              onClick={handleLogout}
            >
              Logout
            </motion.button>
          )}

        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
