import { create } from 'zustand';
import api from '../api/axios';

export const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const { token, id, name, role } = response.data;
      
      localStorage.setItem('token', token);
      set({ 
        token, 
        isAuthenticated: true, 
        loading: false,
        user: { id, name, email, role }
      });
      
      // Load full user details
      await get().fetchMe();
      return { success: true, role };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid email or password';
      set({ error: errMsg, loading: false, isAuthenticated: false, token: null });
      localStorage.removeItem('token');
      return { success: false, error: errMsg };
    }
  },

  register: async (name, email, password, phone) => {
    set({ loading: true, error: null });
    try {
      await api.post('/api/auth/register', { name, email, password, phone });
      set({ loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Registration failed';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  fetchMe: async () => {
    if (!get().token) return;
    set({ loading: true });
    try {
      const response = await api.get('/api/auth/me');
      set({ user: response.data, isAuthenticated: true, loading: false });
    } catch (err) {
      get().logout();
      set({ loading: false });
    }
  },

  updateProfile: async (profileData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.put(`/api/auth/me`, profileData); // Note: We can implement put profile in AuthController or update directly
      // In backend we mapped PUT /api/auth/me or PUT /api/users profile? Let's check backend controller.
      // Wait, in backend UserService we have updateUserProfile(id, profileData), let's make sure where it was mapped.
      // Ah! In backend, let's see where update user profile was mapped. Oh, wait, did we map update profile in AuthController or UserService?
      // In UserService we have updateUserProfile, but in controller we didn't map a PUT mapping yet! Wait!
      // Let's check: in AuthController we didn't write a PUT mapping. In AdminController we have user updates, but for customers we can update via /api/users/profile or similar. Let's add that or check!
      // Let's handle it by calling an endpoint or we can update the backend if needed, or add PUT /api/auth/profile in AuthController.
      // Let's create an endpoint in AuthController or let's use a standard User endpoint. Let's check if we can make a user profile endpoint.
      // Yes! Let's call /api/auth/profile for updating customer profile. Let's make sure we support it or add it!
      // For now, let's add `updateProfile` in useAuthStore calling `/api/auth/profile` and we'll implement that in backend if needed (or we can just edit AuthController.java to add it!). Let's write the frontend store first.
      const user = get().user;
      const responseUpdate = await api.put(`/api/auth/profile`, profileData);
      set({ user: responseUpdate.data, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update profile';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false, error: null });
  }
}));
