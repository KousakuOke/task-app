import axiosInstance from "./axiosInstance";

export const getTasks = (sort = 'createdAt') => axiosInstance.get(`/api/tasks?sort=${sort}`)
export const getTodayTasks = () => axiosInstance.get('/api/tasks/today');
export const getUpcomingTasks = () => axiosInstance.get('/api/tasks/upcoming');

export const createTask = (data) => axiosInstance.post('/api/tasks',data);
export const updateTask = (id,data) => axiosInstance.put(`/api/tasks/${id}`,data);
export const deleteTask = (id) => axiosInstance.delete(`/api/tasks/${id}`);
