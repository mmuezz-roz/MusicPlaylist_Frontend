import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function Home() {
  const navigate = useNavigate()

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 md:pt-32 pb-28 md:pb-12 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 relative bg-[var(--background)]">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-3xl w-full"
      >
        {/* Badge */}
        <motion.span
          variants={itemVariants}
          className="px-2.5 sm:px-3 py-1 rounded-full bg-[var(--surface-hover)] border border-[var(--border)] text-[var(--text-muted)] text-xs font-medium mb-6 sm:mb-8"
        >
          Your personal cloud music library
        </motion.span>

        {/* Hero Section */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tighter text-[var(--text-main)] mb-5 sm:mb-6 leading-[1.1]"
        >
          Music, <span className="text-[var(--text-muted)]">Simplified.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-base sm:text-lg text-[var(--text-muted)] mb-10 sm:mb-12 max-w-sm px-4 sm:px-0"
        >
          Upload your tracks, create playlists, and listen anywhere. No clutter, just your music.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center w-full sm:w-auto px-4 sm:px-0"
        >
          <button
            onClick={() => {
              const token = localStorage.getItem("token");
              if (token) {
                navigate("/songs");
              } else {
                navigate("/login");
              }
            }}
            className="btn-primary w-full sm:w-auto"
          >
            Start Listening
          </button>
          <button onClick={() => navigate("/songs")} className="btn-secondary w-full sm:w-auto">
            Browse Library
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="mt-16 sm:mt-20 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 w-full px-4 sm:px-0"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="minimal-card p-5 sm:p-6 rounded-xl text-left cursor-pointer group bg-[var(--surface)]"
            onClick={() => navigate("/upload")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-main)] mb-3 sm:mb-4 group-hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-[var(--text-main)]">Upload Tracks</h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">Securely store your audio files in the cloud.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="minimal-card p-5 sm:p-6 rounded-xl text-left cursor-pointer group bg-[var(--surface)]"
            onClick={() => navigate("/playlist")}
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 bg-[var(--surface-hover)] border border-[var(--border)] rounded-lg flex items-center justify-center text-[var(--text-main)] mb-3 sm:mb-4 group-hover:opacity-80 transition-opacity">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-[var(--text-main)]">Organize Playlists</h3>
            <p className="text-xs sm:text-sm text-[var(--text-muted)]">Curate your perfect mix for every mood.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
