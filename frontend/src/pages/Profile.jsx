import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, Upload, Calendar } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const [formData, setFormData] = useState({
    fullName: authUser?.fullName || "",
    email: authUser?.email || "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const profileData = {
        ...formData,
        profilePic: selectedImg,
      };
      await updateProfile(profileData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile update failed:", error);
      toast.error("Failed to update profile");
    }
  };

  if (!authUser) {
    return (
      <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <span className="loading loading-dots loading-xl text-primary"></span>
          <p className="text-base-content/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-start justify-center px-4 pb-12">
      <div className="w-full max-w-5xl space-y-6">
        <div className="rounded-[2.5rem] border border-base-300/60 bg-base-100/80 p-8 shadow-2xl backdrop-blur">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
            <div className="flex flex-col items-center gap-6 lg:w-1/3">
              <div className="relative">
                <div className="avatar">
                  <div className="w-40 rounded-full border-4 border-primary/30 bg-base-200 p-1 shadow-lg">
                    {selectedImg || authUser.profilePic ? (
                      <img
                        src={selectedImg || authUser.profilePic}
                        alt="Profile"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center rounded-full bg-base-300">
                        <User className="h-16 w-16 text-base-content/40" />
                      </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="btn btn-primary btn-circle btn-sm absolute bottom-4 right-4"
                >
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold text-base-content">
                  {authUser.fullName}
                </h1>
                <p className="text-sm text-base-content/60">
                  Personalize your presence for friends and collaborators.
                </p>
              </div>
            </div>

            <div className="flex-1">
              <div className="rounded-[2rem] border border-base-300/60 bg-base-100/90 p-6">
                <h2 className="text-xl font-semibold text-base-content">
                  Profile details
                </h2>
                <p className="mt-1 text-sm text-base-content/60">
                  Update your display information and profile photo.
                </p>

                <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        <User className="mr-2 inline h-4 w-4" /> Full name
                      </span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered input-lg"
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text font-semibold">
                        <Mail className="mr-2 inline h-4 w-4" /> Email
                      </span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered input-lg"
                      value={formData.email}
                      disabled
                      placeholder="Email address"
                    />
                    <label className="label">
                      <span className="label-text-alt text-base-content/60">
                        Email cannot be changed
                      </span>
                    </label>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button
                      type="submit"
                      disabled={isUpdatingProfile}
                      className="btn btn-primary btn-lg flex-1"
                    >
                      {isUpdatingProfile ? (
                        <>
                          <Upload className="mr-2 h-5 w-5 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-5 w-5" />
                          Save changes
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline btn-lg"
                      onClick={() => {
                        setFormData({
                          fullName: authUser.fullName,
                          email: authUser.email,
                        });
                        setSelectedImg(null);
                      }}
                    >
                      Reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 rounded-[2.5rem] border border-base-300/60 bg-base-100/70 p-6 backdrop-blur lg:grid-cols-3">
          <div className="rounded-2xl bg-primary/10 p-4 text-primary">
            <p className="text-xs uppercase tracking-[0.3em]">Friends</p>
            <p className="mt-3 text-3xl font-bold">
              {authUser.friends?.length || 0}
            </p>
            <p className="text-xs text-primary/70">Active connections</p>
          </div>
          <div className="rounded-2xl bg-secondary/10 p-4 text-secondary">
            <p className="text-xs uppercase tracking-[0.3em]">Requests</p>
            <p className="mt-3 text-3xl font-bold">
              {authUser.friendRequestsSent?.length || 0}
            </p>
            <p className="text-xs text-secondary/70">Pending invites</p>
          </div>
          <div className="rounded-2xl bg-base-200/80 p-4 text-base-content">
            <p className="text-xs uppercase tracking-[0.3em]">Member since</p>
            <p className="mt-3 flex items-center gap-2 text-xl font-semibold">
              <Calendar className="h-5 w-5" />
              {authUser.createdAt
                ? new Date(authUser.createdAt).toLocaleDateString()
                : "N/A"}
            </p>
            <p className="text-xs text-base-content/60">Thanks for being part of the community!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
