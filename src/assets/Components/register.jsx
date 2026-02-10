import { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function RegisterUser() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  
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
      toast.success(res.data.message || "Registered successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Registration failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-500">
      <form
        onSubmit={handleSubmit}
        className="w-96 rounded-lg bg-white p-6 shadow-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Register</h2>

        
        <input
          type="text"
          name="name"
          placeholder="Enter name"
          className={`w-full p-2 border rounded ${
            errors.name ? "border-red-500" : "border-gray-300"
          }`}
          onChange={handleChange}
          value={formData.name}
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}

        
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          className={`w-full p-2 mt-3 border rounded ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
          onChange={handleChange}
          value={formData.email}
        />
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}

        
        <input
          type="password"
          name="password"
          placeholder="Enter password"
          className={`w-full p-2 mt-3 border rounded ${
            errors.password ? "border-red-500" : "border-gray-300"
          }`}
          onChange={handleChange}
          value={formData.password}
        />
        {errors.password && (
          <p className="text-red-500 text-xs mt-1">{errors.password}</p>
        )}

       
        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full mt-4 py-2 rounded text-white transition ${
            isFormValid
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Register
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          className="mt-4 w-full text-sm text-blue-600 hover:underline"> Already registered?
        <span className="font-medium">Sign in</span>
        </button>
      </form>
    </div>
  );
}

export default RegisterUser;
