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

  const [showPassword, setShowPassword] = useState(false);
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
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.data));
      toast.success("Account created successfully");
      navigate("/Home");
      window.location.reload(); // Refresh to update Navbar state
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-6 bg-[var(--background)]">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="minimal-card p-8 md:p-12 rounded-2xl bg-[var(--surface)] shadow-sm">
          <div className="text-center mb-10">
            <div className="w-12 h-12 bg-[var(--primary)] rounded-xl flex items-center justify-center text-[var(--primary-text)] mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                <path d="M6.25 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM3.25 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM19.75 7.5a.75.75 0 00-1.5 0v2.25H16a.75.75 0 000 1.5h2.25V13.5a.75.75 0 001.5 0v-2.25H22a.75.75 0 000-1.5h-2.25V7.5z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-[var(--text-main)] mb-2">
              Join MelodyHub
            </h2>
            <p className="text-[var(--text-muted)] text-sm">Create an account to start your library</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className={`input-field ${errors.name ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""}`}
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && (
                <p className="text-red-500 text-xs ml-1">{errors.name}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="john@example.com"
                className={`input-field ${errors.email ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""}`}
                onChange={handleChange}
                value={formData.email}
              />
              {errors.email && (
                <p className="text-red-500 text-xs ml-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-[var(--text-muted)] ml-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className={`input-field pr-12 ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""}`}
                  onChange={handleChange}
                  value={formData.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs ml-1">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full btn-primary h-12 text-base mt-4 ${!isFormValid ? "opacity-50 grayscale cursor-not-allowed" : ""
                }`}
            >
              Create Account
            </button>

            <div className="text-center pt-4 border-t border-[var(--border)] mt-6">
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="text-sm text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
              >
                Already have an account? <span className="text-[var(--text-main)] font-semibold underline underline-offset-4">Sign in</span>
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}

export default RegisterUser;
