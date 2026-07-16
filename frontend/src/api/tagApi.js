import axiosInstance from "./axiosInstance";

export const getTags = () => axiosInstance.get('/api/tags');
export const createTag = (data) => axiosInstance.post('/api/tags',data);
export const deleteTag = (id) => axiosInstance.delete(`/api/tags/${id}`);