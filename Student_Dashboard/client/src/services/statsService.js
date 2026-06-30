import api from './api';

export const fetchStats = async () => {
  const { data } = await api.get('/stats');
  return data;
};
