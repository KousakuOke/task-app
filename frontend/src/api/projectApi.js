import axiosInstance from "./axiosInstance";

export const getProjects = () => axiosInstance.get('/api/projects');
export const createProject = (data) => axiosInstance.post('/api/projects',data);
export const updateProject = (id,data) => axiosInstance.put(`/api/projects/${id}`,data);
export const deleteProject = (id) => axiosInstance.delete(`/api/projects/${id}`);