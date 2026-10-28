import { create } from 'zustand';
import api from '@/lib/axios';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  isLoading: true,

  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const payload = res.data?.data || res.data;
    const token = payload.accessToken || payload.token;
    const refreshToken = payload.refreshToken;
    const user = payload.user;

    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ user, token, isAuthenticated: !!token });
    return payload;
  },

  register: async (formData) => {
    const res = await api.post('/auth/register', formData);
    const payload = res.data?.data || res.data;
    const token = payload.accessToken || payload.token;
    const refreshToken = payload.refreshToken;
    const user = payload.user;

    if (token) {
      localStorage.setItem('token', token);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    set({ user, token, isAuthenticated: !!token });
    return payload;
  },

  logout: () => {
    try {
      api.post('/auth/logout').catch(() => {});
    } catch {}
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    set({ user: null, token: null, isAuthenticated: false });
  },

  fetchUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        set({ isLoading: false, isAuthenticated: false });
        return;
      }
      const res = await api.get('/auth/me');
      const payload = res.data?.data || res.data;
      const user = payload.user || payload;
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      set({ user: null, token: null, isAuthenticated: false, isLoading: false });
    }
  },

  setUser: (user) => set({ user }),

  updateProfile: async (profileData) => {
    const res = await api.put('/users/profile', profileData);
    const payload = res.data?.data || res.data;
    const user = payload.user || payload;
    set({ user });
    return user;
  },
}));

export default useAuthStore;
