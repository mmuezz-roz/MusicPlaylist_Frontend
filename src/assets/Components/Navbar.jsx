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
      className="minimal-nav fixed top-0 left-0 right-0 z-50 py-4 px-6"
    >
      <div className="container-custom flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-4.69 1.563a6 6 0 00-4.382-3.238l-4.72-1.258a3 3 0 01-2.2-2.906V5.454c0-.361.127-.714.363-.984a.75.75 0 01.385-.262l12.35-3.07a.75.75 0 01.554.126.375.375 0 01.218.387z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 group-hover:text-zinc-600 transition-colors">
            MelodyHub
          </h1>
        </motion.div>

        {/* LINKS */}
        <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-500">
          {['Home', 'Songs', 'Playlist'].map((item) => (
            <motion.li key={item} whileHover={{ y: -1 }} className="hover:text-zinc-900 transition-colors">
              <Link to={item === 'Home' ? '/Home' : `/${item.toLowerCase()}`}>
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* BUTTONS */}
        <div className="flex gap-3 items-center">
          {!token ? (
            <>
              <button
                className="text-sm font-medium text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-2"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>

              <button
                className="btn-primary text-sm px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800 transition-colors"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </>
          ) : (
            <button
              className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors px-3 py-2 border border-red-100 rounded-md hover:bg-red-50"
              onClick={handleLogout}
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
