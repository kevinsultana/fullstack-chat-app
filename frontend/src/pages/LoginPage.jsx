import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const { isLoggingIn, login } = useAuthStore();

  const validate = () => {
    const { email, password } = formData;

    if (!email || !password) {
      return toast.error("Email and Password are required");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return toast.error("Please enter a valid email address");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      return;
    }

    try {
      const result = await login(formData);
      if (!result.success) {
        return toast.error(result.message);
      }
      navigate("/");
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="card w-full max-w-md shadow-xl bg-base-100">
        <div className="card-body">
          <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
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
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                className="absolute right-3 top-12 text-base-content/60 hover:text-base-content"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.274.816-.632 1.582-1.07 2.276M15.362 17.362A9.953 9.953 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.978 9.978 0 012.042-3.362"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.978 9.978 0 012.042-3.362M6.634 6.634A9.953 9.953 0 0112 5c4.477 0 8.268 2.943 9.542 7a9.978 9.978 0 01-4.21 5.042M3 3l18 18"
                    />
                  </svg>
                )}
              </button>
            </div>
            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary w-full"
            >
              {isLoggingIn ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-center text-sm">
              Don't have an account?{" "}
              <a href="/register" className="link link-primary">
                Register here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
