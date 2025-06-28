// stores/authStore.js
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: null,
    user: null,
    isAuthenticated: false,
  }),

  getters: {
    getToken: (state) => state.token,
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && state.token !== null,
  },

  actions: {
    // Set token
    setToken(token) {
      this.token = token;
      this.isAuthenticated = !!token;

      // Simpan ke sessionStorage
      if (token) {
        sessionStorage.setItem("token", token);
      } else {
        sessionStorage.removeItem("token");
      }
    },

    // Load token dari sessionStorage
    loadToken() {
      const token = sessionStorage.getItem("token");
      if (token) {
        this.setToken(token);
      }
    },

    // Set user data
    setUser(userData) {
      this.user = userData;
    },

    // Logout
    logout() {
      this.token = null;
      this.user = null;
      this.isAuthenticated = false;
      sessionStorage.removeItem("token");
    },

    // Initialize auth state
    initializeAuth() {
      this.loadToken();
    },
  },

  persist: {
    enabled: true,
    strategies: [
      {
        key: "auth",
        storage: sessionStorage,
        paths: ["token", "user", "isAuthenticated"],
      },
    ],
  },
});
