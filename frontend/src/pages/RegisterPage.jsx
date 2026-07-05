import React, { useState } from "react";
import { Eye, EyeClosed, UserCheck, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/useAuthStore";
import { useNavigate } from "react-router";

export default function RegisterPage() {
  const { signUp, isSigningUp } = useAuthStore();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const validate = () => {
    const newErrors = {};
    const { fullName, email, password } = formData;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await signUp(formData);
      if (res.success) {
        toast.success("Account created successfully!");
        navigate("/");
      } else {
        toast.error(res.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    }
  };

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-5xl flex-col overflow-hidden rounded-[2.5rem] border border-base-300/60 bg-base-100/80 shadow-2xl shadow-base-300/20 backdrop-blur lg:flex-row-reverse">
        {/* ── Brand panel ── */}
        <div className="flex flex-col justify-between gap-8 bg-gradient-to-br from-secondary/10 via-primary/10 to-base-100/60 p-8 lg:w-[45%] lg:border-l lg:border-base-300/60">
          <div className="space-y-4">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1.5 text-sm font-semibold text-secondary">
              <UserCheck size={16} /> Create your profile
            </span>
            <h1 className="text-3xl font-bold text-base-content">
              Join{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Kevin Chats
              </span>{" "}
              today
            </h1>
            <p className="text-sm leading-relaxed text-base-content/70">
              Personalize your chat experience, discover new friends, and enjoy
              seamless communication with a beautifully crafted interface.
            </p>
          </div>
          <div className="space-y-3 text-sm text-base-content/70">
            <p className="font-semibold text-base-content">What you get</p>
            <ul className="space-y-2.5 pl-1">
              {[
                "Instant messaging with photo sharing.",
                "Smart notifications about friend requests.",
                "Profile customization to showcase your personality.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Form panel ── */}
        <div className="flex flex-1 flex-col justify-center p-8 lg:p-10">
          <div className="mx-auto w-full max-w-sm">
            <div className="mb-8 text-center lg:text-left">
              <h2 className="text-2xl font-bold text-base-content">
                Create account
              </h2>
              <p className="mt-1.5 text-sm text-base-content/60">
                Fill out your details to get started.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full name */}
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="fullName">
                  <span className="label-text font-medium text-base-content/80">
                    Full name
                  </span>
                </label>
                <input
                  type="text"
                  id="fullName"
                  className={`input input-bordered h-12 w-full transition-colors focus:outline-none ${
                    errors.fullName ? "input-error" : "focus:border-primary/50"
                  }`}
                  value={formData.fullName}
                  onChange={(e) => {
                    setFormData({ ...formData, fullName: e.target.value });
                    if (errors.fullName)
                      setErrors((prev) => ({ ...prev, fullName: "" }));
                  }}
                  placeholder="Your full name"
                  autoComplete="name"
                />
                {errors.fullName && (
                  <span className="mt-1 text-xs text-error">
                    {errors.fullName}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="email">
                  <span className="label-text font-medium text-base-content/80">
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  id="email"
                  className={`input input-bordered h-12 w-full transition-colors focus:outline-none ${
                    errors.email ? "input-error" : "focus:border-primary/50"
                  }`}
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email)
                      setErrors((prev) => ({ ...prev, email: "" }));
                  }}
                  placeholder="name@example.com"
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="mt-1 text-xs text-error">
                    {errors.email}
                  </span>
                )}
              </div>

              {/* Password */}
              <div className="form-control">
                <label className="label pb-1.5" htmlFor="password">
                  <span className="label-text font-medium text-base-content/80">
                    Password
                  </span>
                </label>
                <div
                  className={`input input-bordered flex w-full h-12 items-center gap-3 px-4 transition-colors ${
                    errors.password
                      ? "input-error"
                      : "focus-within:border-primary/50"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    className="h-full w-full bg-transparent outline-none"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password)
                        setErrors((prev) => ({ ...prev, password: "" }));
                    }}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    className="shrink-0 text-base-content/50 hover:text-base-content"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeClosed size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && (
                  <span className="mt-1 text-xs text-error">
                    {errors.password}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isSigningUp}
                className="btn btn-primary btn-lg h-12 w-full"
              >
                {isSigningUp ? (
                  <span className="loading loading-dots loading-sm" />
                ) : (
                  <>
                    <UserPlus size={18} />
                    Create account
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-base-content/60">
              Already have an account?{" "}
              <button
                type="button"
                className="btn btn-link btn-sm px-0 text-primary underline-offset-4 hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign in instead
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
