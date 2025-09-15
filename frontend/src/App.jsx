import React from "react";
import { Routes, Route } from "react-router";
import Homepage from "./pages/Homepage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import SettingPage from "./pages/SettingPage";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<SettingPage />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
