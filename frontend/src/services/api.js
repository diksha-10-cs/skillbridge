const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Helper for making authenticated requests
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('skillbridge_token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  })

  let data
  try {
    data = await response.json()
  } catch {
    throw new Error('Failed to parse server response.')
  }

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the request.')
  }

  return data
}

export const api = {
  // Auth API
  auth: {
    login: (credentials) =>
      request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),

    register: (userData) =>
      request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      }),

    getProfile: () => request('/auth/me'),

    updateProfile: (profileData) =>
      request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      }),
  },

  // Internships API
  internships: {
    getAll: () => request('/internships'),

    getStats: () => request('/internships/stats'),

    create: (internshipData) =>
      request('/internships', {
        method: 'POST',
        body: JSON.stringify(internshipData),
      }),

    update: (id, internshipData) =>
      request(`/internships/${id}`, {
        method: 'PUT',
        body: JSON.stringify(internshipData),
      }),

    delete: (id) =>
      request(`/internships/${id}`, {
        method: 'DELETE',
      }),
  },
}

export default api
