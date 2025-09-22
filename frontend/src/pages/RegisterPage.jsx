import React, { useState } from "react";
import { Eye, EyeClosed, UserCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const { signUp, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
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
      return toast.error("Full name is required");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      return;
    }
    try {
      const res = await signUp(formData);
      if (res.success) {
        toast.success("Account created successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 pb-12">
      <div className="grid w-full max-w-5xl gap-6 rounded-[2.5rem] border border-base-300/60 bg-base-100/80 p-6 shadow-2xl backdrop-blur lg:grid-cols-[0.9fr,1.1fr]">
        <div className="rounded-[2rem] border border-base-300/60 bg-gradient-to-br from-secondary/10 via-primary/10 to-base-100/60 p-8 text-base-content">
          <div className="flex h-full flex-col justify-between gap-8">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary">
                <UserCheck size={18} /> Create your profile
              </span>
              <h1 className="mt-4 text-3xl font-bold">
                Join Kevin Chats today
              </h1>
              <p className="mt-3 text-sm text-base-content/70">
                Personalize your chat experience, discover new friends, and enjoy seamless communication with a beautifully crafted interface.
              </p>
            </div>
            <div className="space-y-3 text-sm text-base-content/70">
              <p className="font-semibold text-base-content">What you get</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>Instant messaging with photo sharing.</li>
                <li>Smart notifications about friend requests.</li>
                <li>Profile customization to showcase your personality.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-base-300/60 bg-base-100/90 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-base-content">Create account</h2>
            <p className="mt-2 text-sm text-base-content/60">
              Fill out your details to get started.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Full name</span>
              </label>
              <input
                type="text"
                id="fullName"
                className="input input-bordered input-lg"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Your full name"
                autoComplete="name"
                required
              />
            </div>
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
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="text-base-content/60 hover:text-base-content"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="btn btn-primary btn-lg w-full"
            >
              {isSigningUp ? (
                <span className="loading loading-dots loading-sm"></span>
              ) : (
                "Create account"
              )}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-base-content/70">
            Already have an account?
            <button
              type="button"
              className="btn btn-link text-sm"
              onClick={() => navigate("/login")}
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
