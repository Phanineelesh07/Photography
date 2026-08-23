import fetchWithAuth from './api';

const approveUser = async (id) => {
  return await fetchWithAuth(`/admin/users/${id}/approve`, {
    method: 'PUT',
  });
};

const adminService = {
  // Fetch all participants
  getAllParticipants: async () => {
    return await fetchWithAuth('/admin/participants');
  },
  
  // Delete a user
  deleteUser: async (id) => {
    return await fetchWithAuth(`/admin/users/${id}`, {
      method: 'DELETE'
    });
  },
  
  // Update a user
  updateUser: async (id, data) => {
    return await fetchWithAuth(`/admin/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
  },

  approveUser
};

export default adminService;
