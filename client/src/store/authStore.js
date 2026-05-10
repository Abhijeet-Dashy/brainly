import { create } from 'zustand';

const BASE_URL = import.meta.env.VITE_API_URL || '';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: true,

  initialize: () => {
    const token = get().token;
    if (token) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          set({ user: JSON.parse(storedUser) });
        } catch (e) {
          console.error("Failed to parse stored user", e);
        }
      }
    }
    set({ loading: false });
  },


  loginWithGoogle: async (code) => {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (data.success) {
        set({ token: data.data.accessToken, user: data.data.user });
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        return { success: true };
      } else {
        return { success: false, error: data.message || "Google login failed" };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return { success: false, error: "Network error" };
    }
  },

  logout: (navigate) => {
    set({ token: null, user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (navigate) {
      navigate('/login');
    } else {
      window.location.href = '/login';
    }
  },

  authFetch: async (url, options = {}) => {
    const { token, logout } = get();
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const fullUrl = url.startsWith('http') ? url : `${BASE_URL}${url}`;
    const response = await fetch(fullUrl, { ...options, headers });
    if (response.status === 401) {
      logout();
    }
    return response;
  }
}));
