import React from "react";

interface HeaderProps {
  user?: { name: string; role: string };
  setSidebarOpen?: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ user, setSidebarOpen }) => (
  <header className="w-full bg-gradient-to-r from-blue-900 via-blue-700 to-blue-500 shadow-lg flex items-center justify-between px-8 py-4">
    <div className="flex items-center gap-4">
      {setSidebarOpen && (
        <button
          className="md:hidden bg-gray-800 p-2 rounded focus:outline-none"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      <span className="text-3xl font-extrabold tracking-widest text-white drop-shadow">Music App</span>
    </div>
    <div className="flex items-center gap-6">
      {user && (
        <span className="bg-white/10 px-4 py-1 rounded-full text-sm font-semibold text-white shadow">
          {user.name} ({user.role})
        </span>
      )}
    </div>
  </header>
);

export default Header;