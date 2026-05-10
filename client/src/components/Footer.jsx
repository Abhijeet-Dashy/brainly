import React from "react";
import { Globe } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-black dark:bg-[#111111] text-[#f5f5f5] dark:text-gray-300 py-20 px-6 font-inter relative overflow-hidden transition-colors">
      {/* Optional faint halftone over the black bg */}
      <div className="absolute inset-0 halftone-bg opacity-10 mix-blend-screen pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-12 relative z-10">
        <div className="max-w-md">
          <span className="text-3xl font-black tracking-tighter uppercase mb-4 inline-block border-2 border-[#f5f5f5] dark:border-white px-2 py-1 bg-black dark:bg-[#1a1a1a] shadow-[4px_4px_0_0_rgba(245,245,245,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-colors">
            Brainly
          </span>
          <p className="mt-8 text-gray-400 dark:text-gray-400 font-bold text-sm max-w-sm leading-relaxed uppercase tracking-wide transition-colors">
            A structural philosophy for technical documentation. Organized with
            intent, built for speed.
          </p>
        </div>

        <div className="flex-1 flex flex-col items-start md:items-end mt-12 md:mt-0">
          <h4 className="text-xs font-black uppercase tracking-widest mb-6 border-b-2 border-gray-600 dark:border-gray-500 inline-block pb-1 transition-colors">
            Connect
          </h4>
          <div className="flex flex-wrap gap-4 justify-start md:justify-end">
            <a
              href="https://github.com/Abhijeet-Dashy"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 border-2 border-gray-600 dark:border-gray-500 hover:bg-[#f5f5f5] hover:text-black hover:border-[#f5f5f5] dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all shadow-[4px_4px_0_0_rgba(107,114,128,0.5)] hover:shadow-none hover:translate-y-1 font-bold text-sm uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"/><path d="M9 18c-4.5 1.6-5-2-7-2"/></svg>
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/abhijeet-dashy"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 border-2 border-gray-600 dark:border-gray-500 hover:bg-[#f5f5f5] hover:text-black hover:border-[#f5f5f5] dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all shadow-[4px_4px_0_0_rgba(107,114,128,0.5)] hover:shadow-none hover:translate-y-1 font-bold text-sm uppercase tracking-widest"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              LinkedIn
            </a>
            <a
              href="https://abhijeet-dash.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 px-5 py-3 border-2 border-gray-600 dark:border-gray-500 hover:bg-[#f5f5f5] hover:text-black hover:border-[#f5f5f5] dark:hover:bg-white dark:hover:text-black dark:hover:border-white transition-all shadow-[4px_4px_0_0_rgba(107,114,128,0.5)] hover:shadow-none hover:translate-y-1 font-bold text-sm uppercase tracking-widest"
            >
              <Globe size={18} strokeWidth={2.5} />
              Portfolio
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-20 pt-8 border-t-4 border-gray-800 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center gap-6 relative z-10 transition-colors">
        <p className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          © 2026 Brainly Architectural Systems.
        </p>
        <div className="flex gap-8 text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#f5f5f5] dark:bg-white animate-pulse"></span>{" "}
            Systems Operational
          </span>
          <span>v2.0.4-edge</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
