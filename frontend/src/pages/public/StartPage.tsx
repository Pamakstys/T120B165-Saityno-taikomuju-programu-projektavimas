import React from "react";
import { Link } from "react-router-dom";

const StartPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-900 to-black">
    <h1 className="text-5xl font-bold text-white mb-4">Welcome to Musicfy</h1>
    <p className="text-lg text-gray-300 mb-8">
      Discover, listen, and manage your favorite music.
    </p>
    <div className="space-x-4">
      <Link
        to="/login"
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition"
      >
        Register
      </Link>
    </div>
  </div>
);

export default StartPage;