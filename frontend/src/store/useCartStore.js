import { create } from 'zustand';
import api from '../api/axios';

export const useCartStore = create((set, get) => ({
  cart: null,
  loading: false,
  error: null,
  coupon: null,
  discount: 0,

  fetchCart: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get('/api/cart');
      set({ cart: response.data, loading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to fetch cart', loading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/cart', { productId, quantity });
      set({ cart: response.data, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to add item to cart';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      return get().removeItem(productId);
    }
    set({ loading: true, error: null });
    try {
      const response = await api.put('/api/cart', { productId, quantity });
      set({ cart: response.data, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to update quantity';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  removeItem: async (productId) => {
    set({ loading: true, error: null });
    try {
      const response = await api.delete(`/api/cart/${productId}`);
      set({ cart: response.data, loading: false });
      return { success: true };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Failed to remove item';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  },

  clearCart: async () => {
    set({ loading: true, error: null });
    try {
      await api.delete('/api/cart/clear');
      set({ cart: { items: [] }, coupon: null, discount: 0, loading: false });
      return { success: true };
    } catch (err) {
      set({ error: err.response?.data?.message || 'Failed to clear cart', loading: false });
      return { success: false };
    }
  },

  applyCoupon: async (code) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get(`/api/coupons/validate?code=${code}`);
      const coupon = response.data;
      set({ coupon, loading: false });
      return { success: true, coupon };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Invalid coupon code';
      set({ error: errMsg, loading: false, coupon: null });
      return { success: false, error: errMsg };
    }
  },

  removeCoupon: () => {
    set({ coupon: null, discount: 0 });
  },

  checkout: async (deliveryAddress, phone, paymentMethod) => {
    set({ loading: true, error: null });
    const couponCode = get().coupon?.code || null;
    try {
      const response = await api.post('/api/orders', {
        deliveryAddress,
        phone,
        paymentMethod,
        couponCode
      });
      set({ cart: { items: [] }, coupon: null, discount: 0, loading: false });
      return { success: true, order: response.data };
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Checkout failed';
      set({ error: errMsg, loading: false });
      return { success: false, error: errMsg };
    }
  }
}));
