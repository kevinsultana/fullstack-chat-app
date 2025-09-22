import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { Eye, EyeOff, Sparkles } from "lucide-react";

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
      return toast.error("Email and password are required");
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
      console.error("Login failed:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 pb-12">
      <div className="grid w-full max-w-5xl gap-6 rounded-[2.5rem] border border-base-300/60 bg-base-100/80 p-6 shadow-2xl backdrop-blur lg:grid-cols-[1.1fr,0.9fr]">
        <div className="hidden flex-col justify-between rounded-[2rem] border border-base-300/60 bg-gradient-to-br from-primary/10 via-secondary/10 to-base-100/60 p-8 lg:flex">
          <div className="space-y-4">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary">
              <Sparkles size={18} /> Premium messaging experience
            </span>
            <h1 className="text-3xl font-bold text-base-content">
              Welcome back to Kevin Chats
            </h1>
            <p className="text-sm text-base-content/70">
              Stay connected with your friends and communities in a delightful and modern chat experience powered by real-time messaging.
            </p>
          </div>
          <div className="space-y-3 text-sm text-base-content/70">
            <p className="font-semibold text-base-content">Why you'll love it</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>Instant notifications keep your conversations active.</li>
              <li>Personalized profiles help friends recognize you faster.</li>
              <li>Dark and light modes for every mood.</li>
            </ul>
          </div>
        </div>

        <div className="rounded-[2rem] border border-base-300/60 bg-base-100/90 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-base-content">Sign in</h2>
            <p className="mt-2 text-sm text-base-content/60">
              Enter your credentials to continue the conversation.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email</span>
              </label>
              <input
                type="email"
                id="email"
                className="input input-bordered input-lg"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="name@example.com"
                autoComplete="email"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Password</span>
              </label>
              <div className="input input-bordered input-lg flex items-center gap-3">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full bg-transparent outline-none"
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
                  className="text-base-content/60 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="btn btn-primary btn-lg w-full"
            >
              {isLoggingIn ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-base-content/70">
            Don't have an account?
            <button
              type="button"
              className="btn btn-link text-sm"
              onClick={() => navigate("/register")}
            >
              Create one now
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
