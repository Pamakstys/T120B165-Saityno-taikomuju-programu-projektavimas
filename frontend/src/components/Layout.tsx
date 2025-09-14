import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";
import UserSettingsModal from "./UserSettingsModal";
import Header from "./Header";
import Footer from "./Footer"

interface LayoutProps {
  children: React.ReactNode;
}

const linkIcons: Record<string, React.ReactElement> = {
  Home: (
    <svg className="w-5 h-5 mr-2 text-blue-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M4 10v10a1 1 0 001 1h3m10-11v10a1 1 0 01-1 1h-3m-6 0h6" />
    </svg>
  ),
  Artists: (
    <svg className="w-5 h-5 mr-2 text-pink-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a7.5 7.5 0 0113 0" />
    </svg>
  ),
  "My Artists": (
    <svg className="w-5 h-5 mr-2 text-green-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.5 21a7.5 7.5 0 0113 0" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v7" />
    </svg>
  ),
  Albums: (
    <svg className="w-5 h-5 mr-2 text-yellow-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h18" />
    </svg>
  ),
  Songs: (
    <svg className="w-5 h-5 mr-2 text-purple-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6h13M9 6l-7 7 7 7" />
    </svg>
  ),
  Admin: (
    <svg className="w-5 h-5 mr-2 text-red-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
    </svg>
  ),
  Settings: (
    <svg className="w-5 h-5 mr-2 text-cyan-400 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06A1.65 1.65 0 0015 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 008.6 15a1.65 1.65 0 00-1.82-.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.6a1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0015 8.6a1.65 1.65 0 001.82.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 15z" />
    </svg>
  ),
};

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAuthPage = ["/login", "/register", "/"].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { label: "Home", path: "/homepage", roles: ["user", "admin", "publisher"] },
    { label: "Artists", path: "/artists", roles: ["user", "admin", "publisher"] },
    { label: "My Artists", path: "/my_artists", roles: ["publisher"] },
    { label: "Albums", path: "/albums", roles: ["user", "admin", "publisher"] },
    { label: "Songs", path: "/songs", roles: ["user", "admin", "publisher"] },
    { label: "Admin", path: "/admin", roles: ["admin"] },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white" style={{ height: "100dvh" }}>
      
      <Header user={user ? { name: user.name, role: user.role } : undefined} setSidebarOpen={setSidebarOpen} />

      <div className="flex flex-1 w-full">
        <aside
          className={`
            fixed top-0 left-0 h-full w-56 bg-gray-800 flex flex-col p-4 z-40
            transition-transform duration-200
            md:static md:translate-x-0 md:flex
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
          style={{ minWidth: "14rem" }}
        >
          
          <button
            className="md:hidden self-end mb-4 text-gray-400 hover:text-white text-2xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            &times;
          </button>
          <nav className="flex-1 space-y-2">
            {sidebarLinks
              .filter(link => !user || link.roles.includes(user.role))
              .map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded ${
                    location.pathname === link.path
                      ? "bg-blue-600 text-white font-bold"
                      : "hover:bg-gray-700 text-gray-300"
                  } flex items-center`}
                  onClick={() => setSidebarOpen(false)}
                >
                  {linkIcons[link.label]}
                  {link.label}
                </Link>
              ))}

            {user && (
              <button
                type="button"
                onClick={() => {
                  setSettingsOpen(true);
                  setSidebarOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded hover:bg-gray-700 text-gray-300 flex items-center"
              >
                {linkIcons.Settings}
                Settings
              </button>
            )}
            <LogoutButton />
          </nav>
        </aside>

        {/* Overlay for mobile sidebar */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gray-900 rounded-lg shadow-inner min-h-[calc(100vh-128px)]">
          {children}
        </main>
      </div>

        <Footer/>

      <UserSettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
};

export default Layout;