import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="glass-nav fixed top-0 left-0 right-0 z-50 px-6 py-4"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <span className="text-xl">🎵</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gradient">
            MelodyHub
          </h1>
        </motion.div>

        {/* LINKS */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium">
          {['Home', 'Songs', 'Playlist'].map((item) => (
            <motion.li key={item} whileHover={{ y: -2 }} className="relative group">
              <Link
                to={item === 'Home' ? '/Home' : `/${item.toLowerCase()}`}
                className="text-gray-300 hover:text-white transition-colors"
              >
                {item}
              </Link>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 transition-all group-hover:w-full" />
            </motion.li>
          ))}
        </ul>

        {/* BUTTONS */}
        <div className="flex gap-4 items-center">
          {!token ? (
            <>
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="text-sm font-semibold text-gray-300 hover:text-white transition-colors"
                onClick={() => navigate("/login")}
              >
                Sign In
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-sm"
                onClick={() => navigate("/register")}
              >
                Get Started
              </motion.button>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-sm bg-none bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 !text-red-500 !from-transparent !to-transparent"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;

