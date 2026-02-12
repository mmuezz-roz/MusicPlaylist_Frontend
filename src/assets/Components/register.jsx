import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        return value.length < 3 ? "Name must be at least 3 characters" : "";
      case "email":
        return !/^\S+@\S+\.\S+$/.test(value)
          ? "Enter a valid email address"
          : "";
      case "password":
        return value.length < 6
          ? "Password must be at least 6 characters"
          : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const isFormValid =
    !errors.name &&
    !errors.email &&
    !errors.password &&
    formData.name &&
    formData.email &&
    formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error("Please fix validation errors");
      return;
    }

    try {
      const res = await api.post("/register", formData);
      toast.success(res.data.message || "Welcome to MelodyHub! 🎵");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/10 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-purple-500/20">
              ✨
            </div>
            <h2 className="text-4xl font-bold mb-3 tracking-tight">
              Create <span className="text-gradient">Account</span>
            </h2>
            <p className="text-gray-400">Join MelodyHub and start creating playlists</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className={`input-field ${errors.name ? "!border-red-500/50" : ""}`}
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && (
                <p className="text-red-400 text-xs ml-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className={`input-field ${errors.email ? "!border-red-500/50" : ""}`}
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && (
                <p className="text-red-400 text-xs ml-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300 ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className={`input-field ${errors.password ? "!border-red-500/50" : ""}`}
                onChange={handleChange}
                value={formData.password}
              />
              {errors.password && (
                <p className="text-red-400 text-xs ml-1">{errors.password}</p>
              )}
            </div>

            <motion.button
              whileHover={isFormValid ? { scale: 1.02 } : {}}
              whileTap={isFormValid ? { scale: 0.98 } : {}}
              type="submit"
              disabled={!isFormValid}
              className={`w-full btn-primary h-14 text-lg mt-4 ${!isFormValid ? "opacity-50 grayscale cursor-not-allowed" : ""
                }`}
            >
              Sign Up 🚀
            </motion.button>

            <div className="text-center mt-8">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Already have an account? <span className="text-purple-400 font-bold ml-1">Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterUser;

