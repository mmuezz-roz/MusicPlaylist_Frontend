import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Loginser() {

    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const [userData, setUserData] = useState({
        email: "",
        password: ""
    });

    const HandleChange = (e) => {
        setUserData({
            ...userData, [e.target.name]: e.target.value,
        });
    }

    const HandleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (!userData.email || !userData.password) {
                setMessage("All fields are required")
                return;
            }
            const res = await api.post("/login", userData)
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            toast.success("Welcome back! 🎧")
            navigate("/Home")

        } catch (error) {
            console.log(error);
            toast.error("Invalid credentials. Please try again.")
        }
    }

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-6 relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 blur-[120px] rounded-full" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md relative z-10"
            >
                <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-purple-500/20">
                            👋
                        </div>
                        <h2 className="text-4xl font-bold mb-3 tracking-tight">
                            Welcome <span className="text-gradient">Back</span>
                        </h2>
                        <p className="text-gray-400">Login to manage your playlists</p>
                    </div>

                    <form onSubmit={HandleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="name@example.com"
                                className="input-field"
                                onChange={HandleChange}
                                value={userData.email}
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-sm font-semibold text-gray-300">Password</label>
                            </div>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="input-field"
                                onChange={HandleChange}
                                value={userData.password}
                            />
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full btn-primary h-14 text-lg mt-4"
                        >
                            Sign In 🚀
                        </motion.button>

                        <div className="text-center mt-8">
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                New to MelodyHub? <span className="text-purple-400 font-bold ml-1">Create account</span>
                            </button>
                        </div>

                        {message && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-center text-sm font-medium bg-red-400/10 py-2 rounded-lg"
                            >
                                {message}
                            </motion.p>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default Loginser
