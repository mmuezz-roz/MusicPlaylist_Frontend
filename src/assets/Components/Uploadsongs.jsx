import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"
import { motion } from "framer-motion"

function UploadSongs() {

  const [SongData, setSongData] = useState({
    title: "",
    artist: "",
  })

  const [file, SetFile] = useState(null)
  const [message, setMessage] = useState("")

  const navigate = useNavigate()


  const HandleChange = (e) => {
    setSongData({
      ...SongData, [e.target.name]: e.target.value,
    })
  }

  const HandleFile = (e) => {
    SetFile(e.target.files[0])
  };

  const HandleSubmit = async (e) => {
    e.preventDefault();
    if (!SongData.title.trim() || !SongData.artist.trim()) {
      setMessage("All fields are required.")
      return;
    }

    if (!file) {
      toast.error("Please select an audio file!")
      return;
    }

    const form = new FormData();
    form.append("title", SongData.title);
    form.append("artist", SongData.artist);
    form.append("file", file)

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login first")
        navigate("/login")
        return;
      }

      const res = await api.post("/addSong", form, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      })
      toast.success("Song uploaded successfully! 🎵");
      navigate("/songs");
    } catch (error) {
      console.log(error);
      toast.error("Song upload failed")
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl relative z-10"
      >
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-purple-500/20">
              📤
            </div>
            <h1 className="text-4xl font-bold mb-3 tracking-tight">
              Upload <span className="text-gradient">Music</span>
            </h1>
            <p className="text-gray-400">Add your favorite tracks to the cloud library</p>
          </div>

          <form onSubmit={HandleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Song Title</label>
              <input
                type="text"
                name="title"
                placeholder="e.g. Moonlight Sonata"
                className="input-field"
                onChange={HandleChange}
                value={SongData.title}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Artist Name</label>
              <input
                type="text"
                name="artist"
                placeholder="e.g. Beethoven"
                className="input-field"
                onChange={HandleChange}
                value={SongData.artist}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Audio File</label>
              <div className="relative group">
                <input
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  id="file-upload"
                  onChange={HandleFile}
                />
                <label
                  htmlFor="file-upload"
                  className="flex flex-col items-center justify-center w-full h-32 bg-white/5 border-2 border-dashed border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 hover:border-purple-500/50 transition-all group"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <span className="text-3xl mb-2 group-hover:scale-110 transition-transform">🎧</span>
                    <p className="text-sm text-gray-400">
                      {file ? <span className="text-purple-400 font-semibold">{file.name}</span> : "Click to select or drag and drop"}
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-red-400 text-sm font-medium bg-red-400/10 py-2 rounded-lg"
              >
                {message}
              </motion.p>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full btn-primary h-14 text-lg"
            >
              Start Upload 🚀
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default UploadSongs
