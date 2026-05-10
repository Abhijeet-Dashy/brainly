import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { GoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";

export default function AuthPage() {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");

  useEffect(() => {
    setIsLogin(location.pathname !== "/register");
  }, [location.pathname]);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const loginWithGoogle = useAuthStore((state) => state.loginWithGoogle);
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    const res = await loginWithGoogle(credentialResponse.credential);
    if (res.success) {
      toast.success("Welcome!");
      navigate("/dashboard");
    } else {
      toast.error(res.error || "Google login failed");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) {
        toast.success("Welcome back!");
        navigate("/dashboard");
      } else {
        toast.error(res.error || "Login failed");
      }
    } else {
      const res = await register(email, password, username);
      if (res.success) {
        setIsLogin(true); // Switch to login after successful register
        toast.success("Registration successful! Please login.");
      } else {
        toast.error(res.error || "Registration failed");
      }
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen font-inter bg-[#f5f5f5] dark:bg-[#0a0a0a] text-black dark:text-white selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black transition-colors duration-300">
      {/* Left Panel: Editorial Visual (45%) */}
      <section className="hidden lg:flex w-[45%] sticky top-0 h-screen flex-col justify-between p-12 border-r-[3px] border-black dark:border-white relative bg-[#e0e0e0] dark:bg-[#111111] transition-colors">
        {/* Halftone & Grain Background */}
        <div className="absolute inset-0 halftone-bg opacity-40 dark:opacity-20 pointer-events-none"></div>
        <div className="absolute inset-0 grain-overlay opacity-[0.04] dark:opacity-[0.06] pointer-events-none"></div>

        <div className="z-10 relative">
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black tracking-tighter uppercase border-[3px] border-black dark:border-white px-3 py-1 bg-[#f5f5f5] dark:bg-[#0a0a0a] shadow-[4px_4px_0_0_rgba(0,0,0,1)] dark:shadow-[4px_4px_0_0_rgba(255,255,255,1)] transition-colors">
              Brainly
            </span>
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
              {isLogin ? "Welcome Back" : "Join Us"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 font-bold text-lg transition-colors">
              {isLogin
                ? "Continue the documentation."
                : "Initialize your structural vault."}
            </p>
          </div>

          {/* Toggle Button */}
          <div className="flex border-[3px] border-black dark:border-white bg-[#f5f5f5] dark:bg-[#0a0a0a] mb-10 shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] overflow-hidden transition-colors">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${
                isLogin
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Sign In
            </button>
            <div className="w-[3px] bg-black dark:bg-white transition-colors"></div>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-4 text-sm font-black uppercase tracking-widest transition-all ${
                !isLogin
                  ? "bg-black dark:bg-white text-white dark:text-black"
                  : "bg-transparent text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white"
              }`}
            >
              Register
            </button>
          </div>

          {/* Auth Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-sm font-black tracking-widest uppercase text-black dark:text-white block transition-colors">
                  Username
                </label>
                <div className="relative">
                  <input
                    className="w-full bg-[#f5f5f5] dark:bg-[#0a0a0a] border-[3px] border-black dark:border-white py-4 px-4 text-black dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all"
                    placeholder="Enter your username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-black tracking-widest uppercase text-black dark:text-white block transition-colors">
                Email Address
              </label>
              <div className="relative">
                <input
                  className="w-full bg-[#f5f5f5] dark:bg-[#0a0a0a] border-[3px] border-black dark:border-white py-4 px-4 text-black dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all"
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-black tracking-widest uppercase text-black dark:text-white block transition-colors">
                  Password
                </label>
                {isLogin && (
                  <a
                    className="text-xs font-black uppercase text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white underline decoration-2 underline-offset-4 transition-colors"
                    href="#"
                  >
                    Forgot?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  className="w-full bg-[#f5f5f5] dark:bg-[#0a0a0a] border-[3px] border-black dark:border-white py-4 pl-4 pr-12 text-black dark:text-white font-medium placeholder:text-gray-400 dark:placeholder:text-gray-600 focus:outline-none focus:ring-0 focus:shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:focus:shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-2xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3 py-4">
              <input
                className="w-6 h-6 border-[3px] border-black dark:border-white appearance-none checked:bg-black dark:checked:bg-white checked:after:content-['✓'] checked:after:text-white dark:checked:after:text-black checked:after:font-bold checked:after:block checked:after:text-center checked:after:select-none cursor-pointer transition-colors"
                id="remember"
                type="checkbox"
              />
              <label
                className="text-sm font-bold text-gray-600 dark:text-gray-400 scale-y-95 cursor-pointer transition-colors"
                htmlFor="remember"
              >
                {isLogin
                  ? "Stay signed in for 30 days"
                  : "I agree to the Terms & Privacy Policy"}
              </label>
            </div>

            <button
              disabled={loading}
              className="w-full bg-black dark:bg-[#1a1a1a] text-[#f5f5f5] dark:text-white font-black uppercase tracking-widest py-5 border-[3px] border-black dark:border-white shadow-[8px_8px_0_0_rgba(107,114,128,0.5)] dark:shadow-[8px_8px_0_0_rgba(107,114,128,0.5)] hover:shadow-[12px_12px_0_0_rgba(107,114,128,0.8)] dark:hover:shadow-[12px_12px_0_0_rgba(150,150,150,0.8)] hover:-translate-y-1 transition-all duration-200 disabled:opacity-70 disabled:hover:-translate-y-0 disabled:hover:shadow-[8px_8px_0_0_rgba(107,114,128,0.5)] active:translate-y-1 active:shadow-none"
              type="submit"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-5 h-5 border-[3px] border-transparent border-t-[#f5f5f5] dark:border-t-white rounded-full animate-spin"></div>
                  <span>Waiting...</span>
                </div>
              ) : isLogin ? (
                "Authenticate"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-[3px] bg-black dark:bg-white transition-colors"></div>
            <span className="text-sm font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Or</span>
            <div className="flex-1 h-[3px] bg-black dark:bg-white transition-colors"></div>
          </div>

          {/* Google Login */}
          <div className="w-full flex justify-center border-[3px] border-black dark:border-white bg-white dark:bg-[#1a1a1a] shadow-[6px_6px_0_0_rgba(0,0,0,1)] dark:shadow-[6px_6px_0_0_rgba(255,255,255,1)] hover:-translate-y-1 transition-all p-1">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error("Google login failed")}
              size="large"
              width="100%"
              text="continue_with"
              shape="rectangular"
            />
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
