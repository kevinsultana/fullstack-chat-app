import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import Profile from "./pages/Profile";
import { useAuthStore } from "./store/useAuthStore";
import Navbar from "./components/Navbar";
import { Toaster } from "react-hot-toast";
import FindFriendsPage from "./pages/FindFriendsPage";

export default function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="flex h-screen items-center justify-center">
        <span className="loading loading-dots loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="flex max-h-screen flex-col bg-base-200">
      <Navbar />
      <main className="">
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
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/find-friends"
            element={
              authUser ? <FindFriendsPage /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}
