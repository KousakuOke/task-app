import { create } from "zustand";

const useAuthStore = create((set) => ({
    token: localStorage.getItem('token') || null,
    userId: null,
    username: null,

    login: (token,userId,username) => {
        localStorage.setItem('token',token);
        set({token,userId,username})
    },

    logout: () => {
        localStorage.removeItem('token');
        set({token: null, userId: null, username: null})
    },
}))

export default useAuthStore;