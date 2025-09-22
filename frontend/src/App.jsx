import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";

export default function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="h-screen flex justify-center items-center flex-col">
        <div className="flex flex-col items-center space-y-4">
          <span className="loading loading-dots loading-xl text-primary"></span>
          <span className="text-xl">Checking authentication...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Homepage /> : <Navigate to="/login" replace />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/register"
          element={!authUser ? <RegisterPage /> : <Navigate to="/" replace />}
        />
        <Route
          path="/settings"
          element={
            authUser ? <SettingPage /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" replace />}
        />
      </Routes>

      <Toaster />
    </div>
  );
}
