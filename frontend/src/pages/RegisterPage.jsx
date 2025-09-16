import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { baseURL } from "../api/BaseUrl";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";

export default function RegisterPage() {
  const { signUp, isSigningUp } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validate = () => {
    const { fullName, email, password } = formData;
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return toast.error("Please enter a valid email address");
    }
    if (!fullName) {
      return toast.error("Full Name is required");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      return;
    }
    try {
      const res = await signUp(formData);
      console.log(res.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center text-black dark:text-white transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-700">
        <h1 className="text-3xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="fullName"
              className="block mb-2 font-semibold dark:text-white"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Enter your full name"
              autoComplete="name"
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block mb-2 font-semibold dark:text-white"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter your email"
              autoComplete="email"
            />
          </div>
          <div className="relative ">
            <label
              htmlFor="password"
              className="block mb-2 font-semibold dark:text-white"
            >
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Enter your password"
              autoComplete="new-password"
            />
            <button
              type="button"
              className="absolute right-3 top-9 text-blue-500 dark:text-blue-300"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? (
                <Eye className="w-5 h-5 " />
              ) : (
                <EyeClosed className="w-5 h-5 " />
              )}
            </button>
          </div>
          <button
            type="submit"
            disabled={isSigningUp}
            className="w-full py-2 bg-blue-500 dark:bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors duration-200"
          >
            {isSigningUp ? (
              <span className="loading loading-dots loading-sm"></span>
            ) : (
              "Register"
            )}
          </button>
          <p className="mt-2 text-center text-sm">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-blue-500 dark:text-blue-300 hover:underline"
            >
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
