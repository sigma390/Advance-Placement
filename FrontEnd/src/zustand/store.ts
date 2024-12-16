// src/store/useUserStore.ts
import { create } from 'zustand';

interface UserStore {
  userId: string | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userId: string, token: string) => void;
  logout: () => void;
  Signup: (userId: string, token: string) => void; // New function for signup in the store. It will also update isAuthenticated state to true.
}

export const useUserStore = create<UserStore>((set: any) => ({
  userId: localStorage.getItem('user_id'), // Initial value from localStorage
  token: localStorage.getItem('jwtToken'), // Initial value from localStorage
  isAuthenticated: Boolean(localStorage.getItem('jwtToken')), // Check if token exists
  login: (userId: string, token: string) => {
    localStorage.setItem('user_id', userId); // Save userId in localStorage
    localStorage.setItem('jwtToken', token); // Save token in localStorage
    set({ userId, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('jwtToken');
    set({ userId: null, token: null, isAuthenticated: false });
  },
  Signup: (userId: string, token: string) => {
    localStorage.setItem('user_id', userId); // Save userId in localStorage
    localStorage.setItem('jwtToken', token); // Save token in localStorage
    set({ userId, token, isAuthenticated: true });
  },
}));
