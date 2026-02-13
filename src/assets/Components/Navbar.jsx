import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="minimal-nav fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-6"
    >
      <div className="container-custom flex items-center justify-between">

        {/* LOGO */}
        <motion.div
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group flex-shrink-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--primary)] rounded-lg flex items-center justify-center text-[var(--primary-text)] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5 sm:w-4 sm:h-4">
              <path fillRule="evenodd" d="M19.952 1.651a.75.75 0 01.298.599V16.303a3 3 0 01-2.176 2.884l-4.69 1.563a6 6 0 00-4.382-3.238l-4.72-1.258a3 3 0 01-2.2-2.906V5.454c0-.361.127-.714.363-.984a.75.75 0 01.385-.262l12.35-3.07a.75.75 0 01.554.126.375.375 0 01.218.387z" clipRule="evenodd" />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl font-semibold tracking-tight text-[var(--text-main)] group-hover:opacity-70 transition-opacity">
            MelodyHub
          </h1>
        </motion.div>

        {/* LINKS */}
        <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[var(--text-muted)]">
          {['Home', 'Songs', 'Playlist'].map((item) => (
            <motion.li key={item} whileHover={{ y: -1 }} className="hover:text-[var(--text-main)] transition-colors">
              <Link to={item === 'Home' ? '/Home' : `/${item.toLowerCase()}`}>
                {item}
              </Link>
            </motion.li>
          ))}
        </ul>

        {/* ACTIONS */}
        <div className="flex gap-2 sm:gap-3 lg:gap-4 items-center">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-lg bg-[var(--surface-hover)] text-[var(--text-main)] transition-colors flex-shrink-0"
            title="Toggle color theme"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
              </svg>
            )}
          </button>

          {!token ? (
            <div className="hidden sm:flex items-center gap-2 lg:gap-3">
              <button
                className="text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-2 sm:px-3 py-2"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
              <button
                className="btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
            </div>
          ) : (
            <button
              className="text-xs sm:text-sm font-medium text-red-500 hover:text-red-400 transition-colors px-2 sm:px-3 py-1.5 sm:py-2 bg-red-500/5 rounded-lg border border-red-500/10"
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
