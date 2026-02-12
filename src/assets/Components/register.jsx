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
      await api.post("/register", formData);
      toast.success("Account created successfully");
      navigate("/login");
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
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className={`input-field ${errors.password ? "border-red-300 focus:border-red-400 focus:ring-red-50" : ""}`}
                onChange={handleChange}
                value={formData.password}
              />
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
