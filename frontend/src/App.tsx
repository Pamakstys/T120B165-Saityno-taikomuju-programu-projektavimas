import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoginPage from "./pages/authentication/LoginPage";
import RegisterPage from "./pages/authentication/RegisterPage";
import HomePage from "./pages/dashboard/HomePage";
import ArtistsPage from "./pages/dashboard/ArtistsPage";
import AlbumsPage from "./pages/dashboard/AlbumsPage";
import SongsPage from "./pages/dashboard/SongsPage";
import SettingsPage from "./pages/profile/SettingsPage";
import AdminPage from "./pages/admin/AdminPage";
import StartPage from "./pages/public/StartPage";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";

function App() {

  return (
    <Layout>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<StartPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}

        <Route path="/homepage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/artists" element={<ProtectedRoute><ArtistsPage /></ProtectedRoute>} />
        <Route path="/albums" element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />
        <Route path="/songs" element={<ProtectedRoute><SongsPage /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminPage /></RoleProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
