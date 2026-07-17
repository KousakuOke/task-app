import { create } from "zustand";

const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    userId: localStorage.getItem('userId') || null,
    username: localStorage.getItem('username') || null,

    login: (token,userId,username) => {
        localStorage.setItem('token',token);
        localStorage.setItem('userId', userId);
        localStorage.setItem('username', username);
        set({token,userId,username})
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        set({token: null, userId: null, username: null})
    },
}))

export default useAuthStore;