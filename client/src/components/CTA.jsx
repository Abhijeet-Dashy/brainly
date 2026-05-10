import React from "react";
import { useNavigate } from "react-router-dom";

const CTA = () => {
  const navigate = useNavigate();

  return (
    <section className="mt-40 mb-20 text-center relative border-4 border-black dark:border-white bg-[#E5E5E5] dark:bg-[#1a1a1a] p-8 sm:p-12 md:p-24 shadow-[12px_12px_0_0_rgba(0,0,0,1)] dark:shadow-[12px_12px_0_0_rgba(255,255,255,1)] overflow-hidden transition-colors">
      {/* Background Accent */}
      <div className="absolute inset-0 halftone-bg opacity-20 dark:opacity-10 pointer-events-none transition-opacity"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-black dark:text-white uppercase mb-6 leading-[0.9] transition-colors">
          Commit To The Archives.
        </h2>
        <p className="text-gray-600 dark:text-gray-400 font-bold text-xl mb-12 transition-colors">
          Join 50k+ developers who have moved their technical brain to Brainly.
          The professional standard for technical organization.
        </p>

          <button
            onClick={() => navigate("/register")}
            className="bg-black dark:bg-[#1a1a1a] text-[#f5f5f5] dark:text-white px-6 py-4 sm:px-8 sm:py-5 font-black uppercase tracking-widest border-t-2 sm:border-t-0 sm:border-l-2 border-black dark:border-white hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
          >
            Get Started for Free
          </button>
      </div>
    </section>
  );
};

export default CTA;
