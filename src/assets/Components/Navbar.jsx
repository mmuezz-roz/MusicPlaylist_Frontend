import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");
  const [isDark, setIsDark] = useState(localStorage.getItem("theme") === "dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    setMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleTheme = () => setIsDark(!isDark);

  const navLinks = ['Home', 'Songs', 'Playlist'];

  const isActive = (path) => {
    if (path === 'Home' && location.pathname === '/Home') return true;
    if (path === 'Home' && location.pathname === '/') return true;
    return location.pathname.toLowerCase().includes(path.toLowerCase());
  };

  const getIcon = (item, active) => {
    const strokeWidth = active ? 2 : 1.5;

    switch (item) {
      case 'Home':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
          </svg>
        );
      case 'Songs':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.97-.276 1.94-.386 2.943-.324M5.653 5.441l.955.516l2.153-1.166l-1.66-2.195l-1.448.845z" />
          </svg>
        );
      case 'Playlist':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={strokeWidth} stroke="currentColor" className="w-6 h-6 mb-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="minimal-nav fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-6"
      >
        <div className="container-custom flex items-center justify-between">
          {/* LOGO */}
          <motion.div
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer group flex-shrink-0 relative z-50"
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

          {/* DESKTOP LINKS */}
          <ul className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-[var(--text-muted)]">
            {navLinks.map((item) => (
              <motion.li key={item} whileHover={{ y: -1 }} className={`hover:text-[var(--text-main)] transition-colors ${isActive(item) ? "text-[var(--text-main)] font-semibold" : ""}`}>
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
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l1.591 1.591M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Desktop Auth Buttons */}
            {!token ? (
              <div className="flex items-center gap-2 lg:gap-3">
                <button
                  className="hidden md:block text-xs sm:text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors px-2 sm:px-3 py-2"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </button>
                <button
                  className="hidden md:flex btn-primary text-xs sm:text-sm px-3 sm:px-4 py-2"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>
                {/* Mobile Login Button Small */}
                <button
                  className="md:hidden btn-primary text-xs px-3 py-1.5 h-8"
                  onClick={() => navigate("/login")}
                >
                  Log In
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

            {/* Hamburger - Hidden on Mobile because we have Bottom Nav, but kept for future use if needed, 
               or we can remove it. Spotify usually puts settings in top right. 
               Since we have Logout/Theme in top right, we don't need Hamburger for links anymore. 
               The Bottom Nav takes over. */}
          </div>
        </div>
      </motion.nav>

      {/* MOBILE BOTTOM NAVIGATION - SPOTIFY STYLE */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-[72px] bg-[var(--surface)]/95 backdrop-blur-lg border-t border-[var(--border)] z-50 pb-safe">
        <div className="flex justify-around items-center h-full px-2">
          {navLinks.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item}
                to={item === 'Home' ? '/Home' : `/${item.toLowerCase()}`}
                className={`flex flex-col items-center justify-center w-full h-full transition-all duration-200 active:scale-90 ${active ? 'text-[var(--text-main)]' : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'}`}
              >
                {getIcon(item, active)}
                <span className="text-[10px] font-medium tracking-wide">{item === 'Playlist' ? 'Library' : item}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </>
  );
}

export default Navbar;
