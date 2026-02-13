import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function Loginser() {
    const navigate = useNavigate()
    const [message, setMessage] = useState("")
    const [showPassword, setShowPassword] = useState(false);
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
        <div className="min-h-screen pt-16 sm:pt-20 md:pt-24 pb-8 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-[var(--background)]">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md mx-auto"
            >
                <div className="minimal-card p-6 sm:p-8 md:p-10 lg:p-12 rounded-xl sm:rounded-2xl bg-[var(--surface)] shadow-sm">
                    <div className="text-center mb-8 sm:mb-10">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[var(--primary)] rounded-lg sm:rounded-xl flex items-center justify-center text-[var(--primary-text)] mx-auto mb-4 sm:mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 sm:w-6 sm:h-6">
                                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
                            Welcome Back
                        </h2>
                        <p className="text-[var(--text-muted)] text-xs sm:text-sm">Sign in to manage your music</p>
                    </div>

                    <form onSubmit={HandleSubmit} className="space-y-4 sm:space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] ml-1">Email Address</label>
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
                            <label className="text-xs sm:text-sm font-semibold text-[var(--text-muted)] ml-1">Password</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="••••••••"
                                    className="input-field pr-12"
                                    onChange={HandleChange}
                                    value={userData.password}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-1"
                                >
                                    {showPassword ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                                        </svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="w-full btn-primary h-11 sm:h-12 text-sm sm:text-base mt-2"
                        >
                            Sign In
                        </button>

                        <div className="text-center pt-4 border-t border-[var(--border)] mt-5 sm:mt-6">
                            <button
                                type="button"
                                onClick={() => navigate("/register")}
                                className="text-xs sm:text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
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
