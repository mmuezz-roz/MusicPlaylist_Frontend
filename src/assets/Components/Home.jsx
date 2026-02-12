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
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center max-w-4xl"
      >
        {/* Badge */}
        <motion.span
          variants={itemVariants}
          className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-400 text-sm font-semibold mb-6"
        >
          ✨ Experience the beats like never before
        </motion.span>

        {/* Hero Section */}
        <motion.h1
          variants={itemVariants}
          className="text-6xl md:text-7xl font-extrabold tracking-tight mb-6"
        >
          Discover Your <span className="text-gradient">Music World</span> 🎶
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="text-lg text-gray-400 mb-10 max-w-2xl leading-relaxed"
        >
          Upload songs, create personalized playlists, and immerse yourself in a world of high-quality audio. Your music, your way, anywhere.
        </motion.p>

        {/* Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap gap-4 justify-center"
        >
          <button onClick={() => navigate("/login")} className="btn-primary flex items-center gap-2">
            Get Started <span className="text-xl">→</span>
          </button>
          <button onClick={() => navigate("/songs")} className="btn-secondary">
            Explore Songs
          </button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          variants={itemVariants}
          className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
        >
          <motion.div
            whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            className="glass-card p-8 rounded-3xl text-left group cursor-pointer"
            onClick={() => navigate("/upload")}
          >
            <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              🎵
            </div>
            <h3 className="text-2xl font-bold mb-3">Upload Songs</h3>
            <p className="text-gray-400">Share your favorite tracks and build your private cloud music library easily.</p>
          </motion.div>

          <motion.div
            whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            className="glass-card p-8 rounded-3xl text-left group cursor-pointer"
            onClick={() => navigate("/playlist")}
          >
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
              📂
            </div>
            <h3 className="text-2xl font-bold mb-3">Create Playlists</h3>
            <p className="text-gray-400">Organize your mood. Create unlimited playlists and customize them as you like.</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Home;
