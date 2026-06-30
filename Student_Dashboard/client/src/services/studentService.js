import api from './api';

export const fetchStudents = async (params = {}) => {
  const { data } = await api.get('/students', { params });
  return data;
};

export const createStudent = async (payload) => {
  const { data } = await api.post('/students', payload);
  return data;
};

export const updateStudent = async (id, payload) => {
  const { data } = await api.put(`/students/${id}`, payload);
  return data;
};

export const deleteStudent = async (id) => {
  const { data } = await api.delete(`/students/${id}`);
  return data;
};

export const resetPassword = async (id, newPassword) => {
  const { data } = await api.patch(`/students/${id}/reset-password`, { newPassword });
  return data;
};
