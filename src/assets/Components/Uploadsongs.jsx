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
  const [coverImage, setCoverImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState("")
  const [isUploading, setIsUploading] = useState(false);
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

    setIsUploading(true);
    const form = new FormData();
    form.append("title", SongData.title);
    form.append("artist", SongData.artist);
    form.append("file", file);

    if (coverImage) {
      form.append("coverImage", coverImage);
    }

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        toast.error("Please login first")
        navigate("/login")
        return;
      }

      await api.post("/addSong", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      })
      toast.success("Song uploaded successfully!");
      navigate("/songs");
    } catch (error) {
      console.log(error);
      const errorMsg = error.response?.data?.error || "Song upload failed";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="min-h-screen pt-20 sm:pt-24 md:pt-28 pb-28 md:pb-12 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl mx-auto"
      >
        <div className="minimal-card p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl bg-[var(--surface)]">
          <div className="text-center mb-8 sm:mb-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--primary)] rounded-lg sm:rounded-xl flex items-center justify-center text-[var(--primary-text)] mx-auto mb-4 sm:mb-6 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
              Upload Track
            </h1>
            <p className="text-[var(--text-muted)] text-xs sm:text-sm">Add new music to your library</p>
          </div>

          <form onSubmit={HandleSubmit} className="space-y-5 sm:space-y-6">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] ml-1">Song Title</label>
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
              <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] ml-1">Artist Name</label>
              <input
                type="text"
                name="artist"
                placeholder="e.g. Beethoven"
                className="input-field"
                onChange={HandleChange}
                value={SongData.artist}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Cover Image Upload */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] ml-1">Cover Image (Optional)</label>
                <div className="relative group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="cover-upload"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        setCoverImage(file);
                        const reader = new FileReader();
                        reader.onloadend = () => setPreview(reader.result);
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                  <label
                    htmlFor="cover-upload"
                    className="flex flex-col items-center justify-center w-full h-28 sm:h-32 bg-[var(--surface-hover)] border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:opacity-80 transition-all overflow-hidden relative"
                  >
                    {preview ? (
                      <img src={preview} alt="Cover preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-5 sm:pb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-muted)] mb-2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                        </svg>
                        <p className="text-xs sm:text-sm text-[var(--text-muted)] px-3 text-center">Upload Cover</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              {/* Audio File Upload */}
              <div className="space-y-2">
                <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] ml-1">Audio File</label>
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
                    className="flex flex-col items-center justify-center w-full h-28 sm:h-32 bg-[var(--surface-hover)] border-2 border-dashed border-[var(--border)] rounded-xl cursor-pointer hover:opacity-80 transition-all"
                  >
                    <div className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-5 sm:pb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 sm:w-6 sm:h-6 text-[var(--text-muted)] mb-2 group-hover:opacity-80">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.59c.97-.276 1.94-.386 2.943-.324M5.653 5.441l.955.516l2.153-1.166l-1.66-2.195l-1.448.845z" />
                      </svg>
                      <p className="text-xs sm:text-sm text-[var(--text-muted)] px-3 text-center">
                        {file ? <span className="text-[var(--text-main)] font-medium truncate max-w-xs block">{file.name}</span> : "Upload Audio"}
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {message && (
              <p className="text-center text-red-500 text-sm font-medium py-2 rounded-lg bg-red-500/10">
                {message}
              </p>
            )}

            <button
              type="submit"
              className="w-full btn-primary h-11 sm:h-12 text-sm sm:text-base shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isUploading || !file || !SongData.title || !SongData.artist}
            >
              {isUploading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Uploading...</span>
                </div>
              ) : (
                "Upload to Cloud"
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  )
}

export default UploadSongs
