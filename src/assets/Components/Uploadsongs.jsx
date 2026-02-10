import { useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import api from "../../api/axios"

function UploadSongs(){

    const [ SongData , setSongData] = useState({
            title:"",
            artist:"",
        })
    
        const [file, SetFile] = useState(null)
        const [title,SetTitle] = useState("")
        const [artist,SetArtist] = useState("")
        const [message,setMessage] = useState("")

        const navigate = useNavigate()


    const HandleChange = (e)=>{
        setSongData({
            ...SongData,[e.target.name]:e.target.value,
        })
    }

    const HandleFile = (e)=>{
            SetFile(e.target.files[0])
            };
    
            

         const HandleSubmit = async (e)=>{
                e.preventDefault();
                if(!title.trim() || !artist.trim()){
                    setMessage("Required All Field..")
                }
                
                if(!file){
                    toast.error("Please upload a File!")
                    return;
                }
                
                const form = new FormData();
                form.append("title",SongData.title);
                form.append("artist",SongData.artist);
                form.append("file",file)
                
                try {
                    
                    
                    const token = localStorage.getItem("token")
                    if(!token){
                         toast.error("please login!!")
                        navigate("/login")
                        return;
                    }
        
        
                    const res = await api.post("/addSong",form,{
                        headers:{
                            "Content-Type":"multipart/form-data"
                        }
                        
                    })
                    toast.success("song uploaded successfully!");
               
        
        
            } catch (error) {
                console.log(error);
                toast.error("Song upload Failed")
            }}
        
        return(
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 to-blue-100 p-6">
  <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl transition-transform hover:scale-[1.02]">

    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
      🎵 Upload Song
    </h1>

    <form onSubmit={HandleSubmit} className="space-y-4">

      <input
        type="text"
        name="title"
        placeholder="Song title"
        className="w-full border border-gray-300 p-3 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition"
        onChange={HandleChange}
        value={SongData.title}
      />

      <input
        type="text"
        name="artist"
        placeholder="Artist name"
        className="w-full border border-gray-300 p-3 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   transition"
        onChange={HandleChange}
        value={SongData.artist}
      />

      <input
        type="file"
        accept="audio/*"
        className="w-full border border-dashed border-gray-300 p-3 rounded-lg
                   cursor-pointer file:mr-4 file:py-2 file:px-4
                   file:rounded-full file:border-0
                   file:bg-blue-50 file:text-blue-600
                   hover:border-blue-400 transition"
        onChange={HandleFile}
      />

      {message && (
        <p className="text-center text-red-500 text-sm">
          {message}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-3 rounded-lg
                   font-semibold tracking-wide
                   hover:bg-blue-700 hover:shadow-lg
                   active:scale-95 transition-all"
      >
        Upload Song 🎶
      </button>

    </form>
  </div>
</div>

        )

}

export default UploadSongs