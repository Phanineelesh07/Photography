import fetchWithAuth from './api';

export const register = async (userData) => {
  return await fetchWithAuth('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const login = async (credentials) => {
  return await fetchWithAuth('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const sendOtp = async (email) => {
  return await fetchWithAuth('/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
};
