import fetchWithAuth from './api';

export const getDashboardData = async () => {
  return await fetchWithAuth('/participant/dashboard');
};
