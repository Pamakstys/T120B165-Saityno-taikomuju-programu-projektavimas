import React from "react";

const Footer: React.FC = () => (
  <footer className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 py-6 px-8 flex flex-col md:flex-row items-center justify-between mt-auto">
    <div className="flex items-center gap-2 text-gray-300">
      <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19V6h13M9 6l-7 7 7 7" />
      </svg>
      <span className="font-semibold">Music App &copy; {new Date().getFullYear()}</span>
    </div>
    <div className="flex gap-4 mt-4 md:mt-0">
      <a href="https://github.com/Pamakstys/T120B165-Saityno-taikomuju-programu-projektavimas" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
        GitHub
      </a>
      <a href="mailto:pamavitalijus@gmail.com" className="text-blue-400 hover:underline">
        Support
      </a>
      <a href="/homepage" className="text-blue-400 hover:underline">
        Privacy Policy
      </a>
    </div>
  </footer>
);

export default Footer;