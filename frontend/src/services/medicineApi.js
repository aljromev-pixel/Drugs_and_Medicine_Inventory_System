const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data?.message || 'Request failed.');
    error.errors = data?.errors || {};
    throw error;
  }

  return data;
}

export const medicineApi = {
  getMedicines: async () => {
    return request(`${API_URL}/medicines`);
  },

  getMedicineById: async (id) => {
    return request(`${API_URL}/medicines/${id}`);
  },

  createMedicine: async (payload) => {
    return request(`${API_URL}/medicines`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  },
};
