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
                setMessage("Please enter all fields")
                return;
            }
            const res = await api.post("/login", userData)
            localStorage.setItem("token", res.data.token)
            localStorage.setItem("user", JSON.stringify(res.data.user))
            toast.success("Welcome back")
            navigate("/Home")

        } catch (error) {
            console.log(error);
            toast.error("Invalid email or password")
        }
    }

    return (
        <div className="min-h-screen pt-20 flex items-center justify-center px-6 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="minimal-card p-8 md:p-12 rounded-2xl bg-[var(--surface)] shadow-sm">
                    <div className="text-center mb-10">
                        <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-[var(--primary-text)] mx-auto mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-[var(--text-muted)] text-sm">Sign in to manage your music</p>
                    </div>

                    <form onSubmit={HandleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Email Address</label>
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
                            <label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Password</label>
                            <input
                                type="password"
                                name="password"
                                placeholder="••••••••"
                                className="input-field"
                                onChange={HandleChange}
                                value={userData.password}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary h-12 text-base mt-2"
                        >
                            Sign In
                        </button>

                        <div className="text-center pt-4 border-t border-[var(--border)] mt-6">
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                            >
                                New here? <span className="text-[var(--text-main)] font-semibold underline underline-offset-4">Create account</span>
                            </button>
                        </div>

                        {message && (
                            <p className="text-center text-red-500 text-sm font-medium py-2 rounded-lg bg-red-500/10">
                                {message}
                            </p>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    )
}

export default Loginser
