import { create } from 'zustand';
import api from '@/lib/axios';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetchNotifications: async () => {
    try {
      const res = await api.get('/notifications');
      const payload = res.data?.data || res.data;
      const list = payload.notifications || payload || [];
      set({
        notifications: list,
        unreadCount: list.filter((n) => !n.isRead).length,
      });
    } catch {
      // silently fail
    }
  },

  markAsRead: async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // silently fail
    }
  },

  markAllRead: async () => {
    try {
      await api.put('/notifications/read-all');
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // silently fail
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await api.get('/notifications/unread-count');
      const payload = res.data?.data || res.data;
      set({ unreadCount: payload.count ?? 0 });
    } catch {
      // silently fail
    }
  },
}));

export default useNotificationStore;
