// ============================================
// TechConnect - Axios API Service
// ============================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('techconnect-token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle errors & refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: any) => void;
  reject: (reason: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Don't retry auth endpoints except refresh
    if (originalRequest.url?.includes('/auth/login') ||
        originalRequest.url?.includes('/auth/register')) {
      return Promise.reject(error);
    }

    // Handle 401 - try refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          '/api/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newToken = data.accessToken;
        localStorage.setItem('techconnect-token', newToken);

        if (api.defaults.headers) {
          api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        }

        processQueue(null, newToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('techconnect-token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Handle other errors
    const message =
      (error.response?.data as any)?.error?.message ||
      error.message ||
      'An unexpected error occurred';

    if (error.response?.status !== 401) {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export default api;

// ============================================
// API HELPERS
// ============================================

export const authApi = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  me: () => api.get('/auth/me'),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data: any) => api.post('/auth/reset-password', data),
  changePassword: (data: any) => api.put('/auth/change-password', data),
};

export const userApi = {
  getProfile: (username: string) => api.get(`/users/${username}`),
  getFollowers: (username: string, page = 1) =>
    api.get(`/users/${username}/followers?page=${page}`),
  getFollowing: (username: string, page = 1) =>
    api.get(`/users/${username}/following?page=${page}`),
  updateProfile: (data: any) => api.put('/users/profile', data),
  uploadAvatar: (file: FormData) =>
    api.post('/users/avatar', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  uploadBanner: (file: FormData) =>
    api.post('/users/banner', file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  toggleFollow: (username: string) => api.post(`/users/${username}/follow`),
};

export const postApi = {
  create: (data: any) => api.post('/posts', data),
  getAll: (page = 1, type?: string) =>
    api.get(`/posts?page=${page}${type ? `&type=${type}` : ''}`),
  getFeed: (page = 1) => api.get(`/posts/feed?page=${page}`),
  getByUser: (username: string, page = 1) =>
    api.get(`/posts/user/${username}?page=${page}`),
  getById: (id: string) => api.get(`/posts/${id}`),
  like: (id: string) => api.post(`/posts/${id}/like`),
  comment: (id: string, data: any) => api.post(`/posts/${id}/comments`, data),
  getComments: (id: string, page = 1) =>
    api.get(`/posts/${id}/comments?page=${page}`),
  delete: (id: string) => api.delete(`/posts/${id}`),
  update: (id: string, data: any) => api.put(`/posts/${id}`, data),
  uploadMedia: (formData: FormData) =>
    api.post('/posts/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

export const communityApi = {
  create: (data: any) => api.post('/communities', data),
  getAll: (page = 1) => api.get(`/communities?page=${page}`),
  getBySlug: (slug: string) => api.get(`/communities/${slug}`),
  join: (slug: string) => api.post(`/communities/${slug}/join`),
  leave: (slug: string) => api.post(`/communities/${slug}/leave`),
  getMembers: (slug: string, page = 1) => api.get(`/communities/${slug}/members?page=${page}`),
  update: (slug: string, data: any) => api.put(`/communities/${slug}`, data),
  removeMember: (slug: string, userId: string) => api.delete(`/communities/${slug}/members/${userId}`),
  updateMemberRole: (slug: string, userId: string, role: string) => api.put(`/communities/${slug}/members/${userId}/role`, { role }),
  getPosts: (slug: string, page = 1) => api.get(`/communities/${slug}/posts?page=${page}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUserGrowth: (days = 30) => api.get(`/admin/users/growth?days=${days}`),
  getPostActivity: (days = 30) => api.get(`/admin/activity/posts?days=${days}`),
  getReports: (status = 'PENDING') => api.get(`/admin/reports?status=${status}`),
  resolveReport: (id: string, status: string) => api.put(`/admin/reports/${id}`, { status }),
  banUser: (id: string) => api.put(`/admin/users/${id}/ban`),
  unbanUser: (id: string) => api.put(`/admin/users/${id}/unban`),
  silenceUser: (id: string) => api.put(`/admin/users/${id}/silence`),
};

export const searchApi = {
  search: (query: string, type?: string) =>
    api.get(`/search?q=${query}${type ? `&type=${type}` : ''}`),
};

export const notificationApi = {
  getAll: (page = 1) => api.get(`/notifications?page=${page}`),
  markRead: (id: string) => api.put(`/notifications/${id}/read`),
  markAllRead: () => api.put('/notifications/read-all'),
  getUnreadCount: () => api.get('/notifications/unread'),
};

export const messageApi = {
  getConversations: () => api.get('/messages/conversations'),
  getOrCreateConversation: (participantId: string, initialMessage?: string) =>
    api.post('/messages/conversations', { participantId, initialMessage }),
  getMessages: (conversationId: string, page = 1) =>
    api.get(`/messages/conversations/${conversationId}/messages?page=${page}`),
  sendMessage: (conversationId: string, content: string, type = 'TEXT') =>
    api.post('/messages/messages', { conversationId, content, type }),
  markAsRead: (conversationId: string) =>
    api.post('/messages/read', { conversationId }),
  getUnreadCount: () => api.get('/messages/unread'),
};

export const updateApi = {
  updatePost: (id: string, data: any) => api.put(`/posts/${id}`, data),
};
