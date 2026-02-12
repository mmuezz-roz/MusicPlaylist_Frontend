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
    <div className="min-h-screen pt-32 pb-12 flex flex-col items-center justify-center px-6 relative bg-zinc-50">

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center text-center max-w-3xl"
      >
        {/* Badge */}
        <motion.span
          variants={itemVariants}
          className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-600 text-xs font-medium mb-8"
        >
          Your personal cloud music library
        </motion.span>

        {/* Hero Section */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-6xl font-semibold tracking-tighter text-zinc-900 mb-6 leading-[1.1]"
        >
          Music, <span className="text-zinc-400">Simplified.</span>
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-zinc-500 mb-12 max-w-sm"
        >
          Upload your tracks, create playlists, and listen anywhere. No clutter, just your music.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button onClick={() => navigate("/login")} className="btn-primary">
            Start Listening
          </button>
          <button onClick={() => navigate("/songs")} className="btn-secondary">
            Browse Library
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
        >
          <motion.div
            whileHover={{ y: -2 }}
            className="minimal-card p-6 rounded-xl text-left cursor-pointer group bg-white"
            onClick={() => navigate("/upload")}
          >
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center text-zinc-900 mb-4 group-hover:bg-zinc-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">Upload Tracks</h3>
            <p className="text-sm text-zinc-500">Securely store your audio files in the cloud.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -2 }}
            className="minimal-card p-6 rounded-xl text-left cursor-pointer group bg-white"
            onClick={() => navigate("/playlist")}
          >
            <div className="w-10 h-10 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-center text-zinc-900 mb-4 group-hover:bg-zinc-100 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-zinc-900">Organize Playlists</h3>
            <p className="text-sm text-zinc-500">Curate your perfect mix for every mood.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
