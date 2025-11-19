const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const extractErrorMessage = (payload) => {
  if (!payload || typeof payload !== 'object') return null;
  if (typeof payload.error === 'string') return payload.error;
  if (typeof payload.message === 'string') return payload.message;
  if (Array.isArray(payload.errors) && payload.errors[0]?.msg) {
    return payload.errors[0].msg;
  }
  return null;
};

const handleJSONResponse = async (response, fallbackMessage) => {
  const contentType = response.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const data = isJSON ? await response.json() : null;

  if (!response.ok) {
    const message = extractErrorMessage(data) || fallbackMessage;
    throw new Error(message);
  }

  return data;
};

const buildQueryString = (params = {}) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const api = {
  async getNurses(params = {}) {
    const queryString = buildQueryString(params);
    const url = queryString ? `${API_BASE_URL}/nurses?${queryString}` : `${API_BASE_URL}/nurses`;
    const response = await fetch(url);
    return handleJSONResponse(response, 'Failed to fetch nurses');
  },

  async getNurseById(id) {
    const response = await fetch(`${API_BASE_URL}/nurses/${id}`);
    return handleJSONResponse(response, 'Failed to fetch nurse');
  },

  async createNurse(nurseData) {
    const response = await fetch(`${API_BASE_URL}/nurses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nurseData)
    });
    return handleJSONResponse(response, 'Failed to create nurse');
  },

  async updateNurse(id, nurseData) {
    const response = await fetch(`${API_BASE_URL}/nurses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nurseData)
    });
    return handleJSONResponse(response, 'Failed to update nurse');
  },

  async deleteNurse(id) {
    const response = await fetch(`${API_BASE_URL}/nurses/${id}`, {
      method: 'DELETE'
    });
    return handleJSONResponse(response, 'Failed to delete nurse');
  },

  async downloadCSV() {
    const response = await fetch(`${API_BASE_URL}/nurses/export/csv`);
    if (!response.ok) throw new Error('Failed to download CSV');
    return response.blob();
  },

  async downloadXLSX() {
    const response = await fetch(`${API_BASE_URL}/nurses/export/xlsx`);
    if (!response.ok) throw new Error('Failed to download XLSX');
    return response.blob();
  }
};

