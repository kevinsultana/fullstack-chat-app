import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Camera, User, Mail, Upload } from "lucide-react";
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
      toast.error("Failed to update profile");
    }
  };

  if (!authUser) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <span className="loading loading-dots loading-xl text-primary"></span>
          <p className="text-base-content/60">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl shadow-xl bg-base-100">
        <div className="card-body">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-base-content/60">Manage your account information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="avatar">
                  <div className="w-32 h-32 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                    {selectedImg || authUser.profilePic ? (
                      <img
                        src={selectedImg || authUser.profilePic}
                        alt="Profile"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center bg-base-300">
                        <User className="w-16 h-16 text-base-content/40" />
                      </div>
                    )}
                  </div>
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="btn btn-primary btn-circle btn-sm absolute bottom-0 right-0"
                >
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    id="avatar-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                </label>
              </div>
              <p className="text-sm text-base-content/60">
                Click the camera icon to upload a new photo
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    <User className="w-4 h-4 inline mr-2" />
                    Full Name
                  </span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text font-semibold">
                    <Mail className="w-4 h-4 inline mr-2" />
                    Email
                  </span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full input-disabled"
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="btn btn-primary flex-1"
              >
                {isUpdatingProfile ? (
                  <>
                    <Upload className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Update Profile
                  </>
                )}
              </button>
              <button
                type="button"
                className="btn btn-outline"
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

          {/* User Info Display */}
          <div className="divider"></div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Account Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Member since:</span>
                <span className="font-medium">
                  {authUser.createdAt ? new Date(authUser.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base-content/60">Account status:</span>
                <div className="badge badge-success">Active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}