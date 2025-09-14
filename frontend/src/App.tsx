import { Routes, Route } from "react-router-dom";
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
import AlbumPage from "./pages/dashboard/AlbumPage";
import ArtistPage from "./pages/dashboard/ArtistPage";
import ArtistEditPage from "./pages/dashboard/ArtistEditPage";
import AlbumEditPage from "./pages/dashboard/AlbumEditPage";
import SongEditPage from "./pages/dashboard/SongEditPage";
import MyArtistsPage from "./pages/dashboard/MyArtistsPage";
import ArtistCreatePage from "./pages/dashboard/ArtistCreatePage";
import AlbumCreatePage from "./pages/dashboard/AlbumCreatePage";
import SongCreatePage from "./pages/dashboard/SongCreatePage";

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

        <Route path="/my_artists" element={<RoleProtectedRoute allowedRoles={["publisher"]}><MyArtistsPage /></RoleProtectedRoute>} />
        <Route path="/artists" element={<ProtectedRoute><ArtistsPage /></ProtectedRoute>} />
        <Route path="/artists/:id" element={<ProtectedRoute><ArtistPage /></ProtectedRoute>} />
        <Route path="/artists/:id/edit" element={<RoleProtectedRoute allowedRoles={["publisher", "admin"]}><ArtistEditPage /></RoleProtectedRoute>} />
        <Route path="/artists/create" element={<RoleProtectedRoute allowedRoles={["publisher"]}><ArtistCreatePage /></RoleProtectedRoute>} />

        <Route path="/albums" element={<ProtectedRoute><AlbumsPage /></ProtectedRoute>} />
        <Route path="/albums/:id" element={<ProtectedRoute><AlbumPage /></ProtectedRoute>} />
        <Route path="/albums/:id/edit" element={<RoleProtectedRoute allowedRoles={["publisher", "admin"]}><AlbumEditPage /></RoleProtectedRoute>} />
        <Route path="/artists/:id/create" element={<RoleProtectedRoute allowedRoles={["publisher"]}><AlbumCreatePage /></RoleProtectedRoute>} />


        <Route path="/songs" element={<ProtectedRoute><SongsPage /></ProtectedRoute>} />
        <Route path="/songs/:id/edit" element={<RoleProtectedRoute allowedRoles={["publisher", "admin"]}><SongEditPage /></RoleProtectedRoute>} />
        <Route path="/albums/:id/add" element={<RoleProtectedRoute allowedRoles={["publisher", "admin"]}><SongCreatePage /></RoleProtectedRoute>} />

        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin" element={<RoleProtectedRoute allowedRoles={["admin"]}><AdminPage /></RoleProtectedRoute>} />
      </Routes>
    </Layout>
  );
}

export default App;
