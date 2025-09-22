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
  }, [checkAuth]);

  if (isCheckingAuth) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/10 via-base-200 to-base-100 text-base-content">
        <span className="loading loading-dots loading-lg text-primary"></span>
        <p className="text-sm font-medium text-base-content/70">
          Preparing your messaging experience...
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-base-200 via-base-300/60 to-base-200 text-base-content">
      <Navbar />
      <main className="flex-1 overflow-hidden pt-20">
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
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--b1))",
            color: "hsl(var(--bc))",
            borderRadius: "1rem",
            border: "1px solid hsl(var(--b3))",
          },
        }}
      />
    </div>
  );
}
