import React, { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";
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
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Register</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full Name</span>
              </label>
              <input
                type="text"
                id="fullName"
                className="input input-bordered w-full"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Enter your full name"
                autoComplete="name"
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered w-full"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Enter your email"
                autoComplete="email"
              />
            </div>
            <div className="form-control relative">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                className="input input-bordered w-full pr-12"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                autoComplete="new-password"
              />
              <button
                type="button"
                className="absolute right-3 top-12 text-base-content/60 hover:text-base-content"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <Eye className="w-5 h-5" />
                ) : (
                  <EyeClosed className="w-5 h-5" />
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-primary w-full"
            >
              {isSigningUp ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Register"
              )}
            </button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="link link-primary">
                Login here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
