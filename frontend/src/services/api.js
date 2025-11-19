const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = {
  async getNurses() {
    const response = await fetch(`${API_BASE_URL}/nurses`);
    if (!response.ok) throw new Error('Failed to fetch nurses');
    return response.json();
  },

  async getNurseById(id) {
    const response = await fetch(`${API_BASE_URL}/nurses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch nurse');
    return response.json();
  },

  async createNurse(nurseData) {
    const response = await fetch(`${API_BASE_URL}/nurses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nurseData)
    });
    if (!response.ok) throw new Error('Failed to create nurse');
    return response.json();
  },

  async updateNurse(id, nurseData) {
    const response = await fetch(`${API_BASE_URL}/nurses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nurseData)
    });
    if (!response.ok) throw new Error('Failed to update nurse');
    return response.json();
  },

  async deleteNurse(id) {
    const response = await fetch(`${API_BASE_URL}/nurses/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete nurse');
    return response.json();
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

