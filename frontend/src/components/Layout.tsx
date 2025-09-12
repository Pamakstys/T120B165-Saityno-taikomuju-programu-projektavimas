import React, { type ReactNode } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logout } from "./../pages/authentication/services";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const isAuthPage = ["/login", "/register", "/"].includes(location.pathname);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const sidebarLinks = [
    { label: "Home", path: "/homepage", roles: ["user", "admin"] },
    { label: "Artists", path: "/artists", roles: ["user", "admin"] },
    { label: "Albums", path: "/albums", roles: ["user", "admin"] },
    { label: "Songs", path: "/songs", roles: ["user", "admin"] },
    { label: "Settings", path: "/settings", roles: ["user", "admin"] },
    { label: "Admin", path: "/admin", roles: ["admin"] },
  ];

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-56 bg-gray-800 flex flex-col p-4">
        <div className="text-2xl font-bold mb-8">Music App</div>
        <nav className="flex-1 space-y-2">
          {sidebarLinks
            .filter(link => !user || link.roles.includes(user.role))
            .map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded ${
                  location.pathname === link.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700 text-gray-300"
                }`}
              >
                {link.label}
              </Link>
            ))}
        </nav>
        <button
          onClick={logout}
          className="mt-8 px-3 py-2 rounded bg-red-600 hover:bg-red-700 text-white w-full text-left"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-900">{children}</main>
    </div>
  );
};

export default Layout;
