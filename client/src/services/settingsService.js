import fetchWithAuth from './api';

// Get current settings
const getSettings = async () => {
  return await fetchWithAuth('/settings');
};

// Toggle upload setting (admin only)
const toggleUpload = async () => {
  return await fetchWithAuth('/settings/upload', {
    method: 'PUT'
  });
};

const uploadQr = async (formData) => {
  return await fetchWithAuth('/settings/qr', {
    method: 'PUT',
    body: formData
  });
};

const deleteQr = async () => {
  return await fetchWithAuth('/settings/qr', {
    method: 'DELETE'
  });
};

const settingsService = {
  getSettings,
  toggleUpload,
  uploadQr,
  deleteQr
};

export default settingsService;
