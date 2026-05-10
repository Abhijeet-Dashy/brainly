import React from "react";
import { useNavigate } from "react-router-dom";
import CTA from "../components/CTA";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <main className="relative w-full pt-32 pb-20 px-6 overflow-x-hidden bg-[#f5f5f5] dark:bg-[#0a0a0a] font-inter transition-colors duration-300">
      {/* Background Textures */}
      <div className="absolute inset-0 halftone-bg opacity-30 dark:opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 grain-overlay opacity-[0.03] dark:opacity-[0.05] pointer-events-none"></div>

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex flex-col lg:flex-row items-center justify-center lg:justify-between max-w-7xl mx-auto mt-1 mb-24 z-10 gap-12 lg:gap-8">
        
        {/* LEFT COLUMN: TEXT & CTA */}
        <div className="flex-1 text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] mb-8 text-black dark:text-white uppercase transition-colors">
            YOUR
            <br />
            DEVELOPER
            <br />
            MEMORY.
          </h1>

          <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-10 transition-colors">
            Save snippets, documentation, and commands directly to your Google Drive. 
            A structural workspace built with precision and intent for modern engineering.
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start justify-center lg:justify-start gap-6">
            <button
              onClick={() => navigate("/register")}
              className="px-6 py-3 sm:px-8 sm:py-4 bg-black dark:bg-white text-[#f5f5f5] dark:text-black border-2 border-black dark:border-white font-black text-base sm:text-lg hover:bg-[#f5f5f5] hover:text-black dark:hover:bg-[#0a0a0a] dark:hover:text-white hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all active:translate-y-0 active:shadow-none flex items-center gap-2 group uppercase"
            >
              Get Started
              <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </button>
          </div>

          <div className="mt-10 flex flex-wrap justify-center lg:justify-start items-center gap-x-2 gap-y-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
            <span>Chrome Extension</span>
            <span>•</span>
            <span>Google Drive Sync</span>
            <span>•</span>
            <span>AI Search</span>
            <span>•</span>
            <span>Offline Access</span>
          </div>
        </div>

        {/* RIGHT COLUMN: GRAPHIC MOCKUP */}
        <div className="flex-1 w-full max-w-lg lg:max-w-xl mx-auto relative mt-12 lg:mt-0">
          {/* Halftone offset background for style */}
          <div className="absolute top-4 left-4 w-full h-full border-2 border-black dark:border-white halftone-bg z-0 hidden md:block"></div>

          <div className="relative z-10 bg-[#e5e5e5] dark:bg-[#1a1a1a] border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] transition-colors flex flex-col h-[400px]">
            {/* Mockup Header */}
            <div className="bg-white dark:bg-black border-b-2 border-black dark:border-white p-3 flex items-center gap-2 transition-colors">
              <div className="w-3 h-3 rounded-full border-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a]"></div>
              <div className="w-3 h-3 rounded-full border-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a]"></div>
              <div className="w-3 h-3 rounded-full border-2 border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a]"></div>
            </div>

            {/* Mockup Content */}
            <div className="p-6 flex flex-col gap-6 flex-1 overflow-hidden relative">
              
              {/* Box 1 */}
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-colors">
                <h4 className="font-bold text-black dark:text-white mb-2 font-mono text-sm">Snippet: Connect DB</h4>
                <code className="text-gray-600 dark:text-gray-400 text-xs bg-transparent p-0 block font-mono">
                  const db = new Database('url');
                </code>
              </div>

              {/* Box 2 */}
              <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-4 shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-colors">
                <h4 className="font-bold text-black dark:text-white mb-2 font-mono text-sm">Doc: Auth Flow</h4>
                <div className="text-gray-600 dark:text-gray-400 text-xs font-mono leading-relaxed">
                  1. Get Token<br/>
                  2. Verify...
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      {/* SECTION DIVIDER */}
      <div className="w-full h-8 border-y-2 border-black dark:border-white halftone-bg opacity-40 dark:opacity-20 my-20 transition-colors"></div>

      {/* FEATURES SECTION */}
      <section id="features" className="relative z-10 py-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase mb-4 transition-colors">
            Total Command.
          </h2>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg transition-colors">
            Built for the complexity of modern engineering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature 1 */}
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] flex flex-col items-center text-center transition-all hover:-translate-y-1">
            <span className="material-symbols-outlined text-black dark:text-white text-5xl mb-4 transition-colors">
              save
            </span>
            <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight mb-4 transition-colors">
              Save Links, Notes,
              <br />
              Code
            </h3>
            <div className="w-full h-0.5 bg-black dark:bg-white mb-6"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors">
              A universal clipboard for developers. Capture endpoints, snippets,
              and inspiration in one secure place.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] flex flex-col items-center text-center transition-all hover:-translate-y-1">
            <span className="material-symbols-outlined text-black dark:text-white text-5xl mb-4 transition-colors">
              folder_open
            </span>
            <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight mb-4 transition-colors">
              Organize Into
              <br />
              Folders
            </h3>
            <div className="w-full h-0.5 bg-black dark:bg-white mb-6"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors">
              Create a structured hierarchy. Group resources by project, tech
              stack, or team for effortless retrieval.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white dark:bg-black border-2 border-black dark:border-white p-8 shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] flex flex-col items-center text-center transition-all hover:-translate-y-1">
            <span className="material-symbols-outlined text-black dark:text-white text-5xl mb-4 transition-colors">
              sell
            </span>
            <h3 className="text-xl font-black text-black dark:text-white uppercase tracking-tight mb-4 transition-colors">
              Add Notes & Tags
            </h3>
            <div className="w-full h-0.5 bg-black dark:bg-white mb-6 mt-6"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-colors">
              Enrich your saved items with personal context. Tag extensively for
              lightning-fast semantic search.
            </p>
          </div>
        </div>
      </section>

      {/* RETRIEVE ANYTHING SECTION */}
      <section className="relative z-10 py-20">
        <div className="max-w-5xl mx-auto bg-[#e5e5e5] dark:bg-[#1a1a1a] border-2 border-black dark:border-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] dark:shadow-[12px_12px_0_0_rgba(255,255,255,1)] p-12 md:p-20 flex flex-col items-center text-center transition-colors">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter text-black dark:text-white uppercase mb-12 transition-colors">
            RETRIEVE ANYTHING.
          </h2>
          
          <div className="w-full max-w-3xl flex border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] bg-white dark:bg-black transition-colors">
            <div className="flex-1 px-4 sm:px-8 py-5 text-left text-gray-500 dark:text-gray-400 font-medium text-base sm:text-lg border-r-2 border-black dark:border-white truncate">
              Search for 'websocket retry snippet'...
            </div>
            <div className="bg-black dark:bg-white text-white dark:text-black px-6 sm:px-8 py-5 flex items-center justify-center transition-colors cursor-pointer hover:bg-gray-800 dark:hover:bg-gray-200">
              <span className="material-symbols-outlined text-3xl font-black">search</span>
            </div>
          </div>
        </div>
      </section>

      {/* DATA PRIVACY SECTION */}
      <section id="privacy" className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto bg-white dark:bg-[#0a0a0a] border-2 border-black dark:border-white shadow-[12px_12px_0_0_rgba(0,0,0,1)] dark:shadow-[12px_12px_0_0_rgba(255,255,255,1)] p-10 md:p-16 flex flex-col lg:flex-row items-center gap-16 transition-colors">
          
          {/* Left Side: Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-black dark:text-white uppercase mb-6 transition-colors">
              YOUR DATA STAYS
              <br />
              YOURS.
            </h2>
            <div className="w-16 h-1.5 bg-black dark:bg-white mb-6 mx-auto lg:mx-0"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg leading-relaxed mb-8 transition-colors">
              BRAINLY synchronizes directly with your existing Google Drive. We don't host your snippets on proprietary servers. Total control, offline capability, and inherent security.
            </p>
            <div className="flex justify-center lg:justify-start gap-4">
              <div className="w-12 h-12 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] flex items-center justify-center bg-white dark:bg-black transition-colors">
                <span className="material-symbols-outlined text-black dark:text-white font-bold">cloud_sync</span>
              </div>
              <div className="w-12 h-12 border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] flex items-center justify-center bg-white dark:bg-black transition-colors">
                <span className="material-symbols-outlined text-black dark:text-white font-bold">lock</span>
              </div>
            </div>
          </div>

          {/* Right Side: Terminal Mockup */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none">
            <div className="bg-black dark:bg-[#111] border-2 border-black dark:border-white shadow-[8px_8px_0_0_rgba(0,0,0,1)] dark:shadow-[8px_8px_0_0_rgba(255,255,255,1)] p-8 transition-colors">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-white font-black uppercase tracking-widest text-sm">SYNC STATUS</h4>
                <span className="material-symbols-outlined text-white">check_circle</span>
              </div>
              <div className="w-full h-0.5 bg-white mb-6"></div>
              <div className="font-mono text-sm leading-loose text-white dark:text-gray-300">
                <p>&gt; Connecting to Drive API... <span className="font-bold">OK</span></p>
                <p>&gt; Authenticating user... <span className="font-bold">OK</span></p>
                <p>&gt; Syncing 42 new items...</p>
                <p>&gt; Uploading structure...</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <div className="mb-20">
        <CTA />
      </div>
    </main>
  );
};

export default Hero;
