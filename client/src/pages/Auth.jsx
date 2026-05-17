import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function AuthPage() {
  const [loading, setLoading] = useState(false);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const codeHandled = useRef(false);

  // Handle the redirect callback — Google sends ?code=... back to this page
  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !codeHandled.current) {
      codeHandled.current = true;
      (async () => {
        setLoading(true);
        const redirect_uri = window.location.origin + '/login';
        const res = await loginWithGoogle(code, redirect_uri);
        if (res.success) {
          toast.success("Welcome!");
          navigate("/dashboard", { replace: true });
        } else {
          toast.error(res.error || "Google login failed");
          // Clean the URL
          window.history.replaceState({}, "", "/login");
        }
        setLoading(false);
      })();
    }
  }, [searchParams]);

  const handleGoogleLogin = useGoogleLogin({
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/drive.file',
    ux_mode: 'redirect',
    redirect_uri: window.location.origin + '/login',
  });

  return (
    <main className="flex min-h-screen font-inter bg-[#f5f5f5] dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      <section className="hidden lg:flex w-[45%] sticky top-0 h-screen flex-col justify-between p-12 border-r-[3px] border-black dark:border-white relative bg-[#e0e0e0] dark:bg-[#111111] transition-colors">
        <div className="absolute inset-0 halftone-bg opacity-40 dark:opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 grain-overlay opacity-[0.04] dark:opacity-[0.06] pointer-events-none"></div>

        <div className="z-10 relative">
          <div className="flex items-center gap-3">
            <button
              className="text-2xl font-black tracking-tighter uppercase border-[3px] border-black dark:border-white px-3 py-1 bg-[#f5f5f5] dark:bg-[#0a0a0a] shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-colors cursor-pointer"
              onClick={() => navigate("/")}
            >
              Brainly
            </button>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-7xl font-black leading-[0.9] tracking-tighter mb-8 uppercase text-black dark:text-white transition-colors">
            The
            <br />
            Architects
            <br />
            Of Code.
          </h1>
          <p className="text-lg font-bold max-w-sm text-gray-600 dark:text-gray-300 border-l-[4px] border-black dark:border-white pl-4 transition-colors">
            Curate your technical identity. Build your library. Shape your
            legacy.
          </p>
        </div>

        <div className="z-10 relative flex items-center justify-between border-t-[3px] border-black dark:border-white pt-6 transition-colors">
          <span className="text-sm font-black uppercase tracking-widest text-black dark:text-white transition-colors">
            EST. 2026
          </span>
          <span className="text-sm font-black uppercase tracking-widest text-black dark:text-white transition-colors">
            EDITION 01
          </span>
        </div>

        {/* Decorative Grid Accent */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-32 border-y-[3px] border-l-[3px] border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a] flex flex-col transition-colors">
          <div className="flex-1 border-b-[3px] border-black dark:border-white"></div>
          <div className="flex-1 border-b-[3px] border-black dark:border-white"></div>
          <div className="flex-1"></div>
        </div>
      </section>

      {/* Right Panel: Form Area (55%) */}
      <section className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        <div className="absolute inset-0 grain-overlay opacity-[0.02] dark:opacity-[0.04] pointer-events-none"></div>

        {/* Mobile Header elements if needed */}
        <div className="absolute top-8 left-8 lg:hidden z-20">
          <span className="text-2xl font-black tracking-tighter uppercase px-2 py-1 bg-[#f5f5f5] dark:bg-[#0a0a0a] border-2 border-black dark:border-white shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-colors">
            Brainly
          </span>
        </div>

        <div className="w-full max-w-md relative z-10 mt-16 lg:mt-0">
          <div className="mb-12">
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight uppercase mb-4 text-black dark:text-white transition-colors">
              Access Granted.
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-lg transition-colors">
              Sync your technical library directly to Google Drive.
            </p>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center">
            <button 
              onClick={() => handleGoogleLogin()} 
              disabled={loading}
              className="w-full bg-black dark:bg-[#1a1a1a] text-[#f5f5f5] dark:text-white font-black uppercase tracking-widest py-5 border-[3px] border-black dark:border-white shadow-[8px_8px_0_0_rgba(107,114,128,0.5)] dark:shadow-[8px_8px_0_0_rgba(107,114,128,0.5)] hover:shadow-[12px_12px_0_0_rgba(107,114,128,0.8)] dark:hover:shadow-[12px_12px_0_0_rgba(150,150,150,0.8)] hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-[8px_8px_0_0_rgba(107,114,128,0.5)] active:translate-y-1 active:shadow-none flex justify-center items-center gap-3"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-[3px] border-transparent border-t-[#f5f5f5] dark:border-t-white rounded-full animate-spin"></div>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 bg-white rounded-full" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    <path fill="none" d="M1 1h22v22H1z" />
                  </svg>
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Footer links */}
          <div className="mt-16 flex gap-6 text-xs font-black tracking-widest uppercase text-gray-500 dark:text-gray-500 justify-center lg:justify-start">
            <a
              className="hover:text-black dark:hover:text-white transition-colors"
              href="#"
            >
              Privacy
            </a>
            <a
              className="hover:text-black dark:hover:text-white transition-colors"
              href="#"
            >
              Terms
            </a>
            <a
              className="hover:text-black dark:hover:text-white transition-colors"
              href="#"
            >
              Security
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
