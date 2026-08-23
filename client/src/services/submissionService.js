import fetchWithAuth from './api';

export const uploadSubmission = async (formData) => {
  return await fetchWithAuth('/submissions', {
    method: 'POST',
    body: formData,
  });
};

export const getMySubmission = async () => {
  return await fetchWithAuth('/submissions/me', {
    method: 'GET'
  });
};

export const getSubmissionsByTheme = async (theme) => {
  return await fetchWithAuth(`/submissions/theme/${theme}`, {
    method: 'GET'
  });
};

export const voteForSubmission = async (submissionId) => {
  return await fetchWithAuth(`/submissions/${submissionId}/vote`, {
    method: 'POST'
  });
};

export const deleteSubmission = async (id) => {
  return await fetchWithAuth(`/submissions/${id}`, { method: 'DELETE' });
};

export const getLeaderboard = async () => {
  return await fetchWithAuth('/submissions/leaderboard', {
    method: 'GET'
  });
};
