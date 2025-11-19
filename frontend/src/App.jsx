import React, { useCallback, useEffect, useMemo, useState } from 'react';
import NurseTable from './components/NurseTable.jsx';
import NurseModal from './components/NurseModal.jsx';
import SearchBar from './components/SearchBar.jsx';
import { api } from './services/api.js';
import { downloadFile } from './utils/helpers.js';

const defaultSort = { field: 'id', order: 'desc' };

const App = () => {
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState(defaultSort);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNurse, setSelectedNurse] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 3000);
  };

  const loadNurses = useCallback(
    async (overrides = {}) => {
      try {
        setLoading(true);
        const data = await api.getNurses({
          search: overrides.search ?? searchTerm,
          sortField: overrides.sortField ?? sortConfig.field,
          sortOrder: overrides.sortOrder ?? sortConfig.order,
        });
        setNurses(data);
      } catch (error) {
        showToast(error.message || 'Failed to load nurses', 'error');
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, sortConfig.field, sortConfig.order]
  );

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadNurses();
    }, 250);
    return () => clearTimeout(timeout);
  }, [searchTerm, sortConfig, loadNurses]);

  useEffect(() => {
    loadNurses();
  }, []);

  const handleSort = (field) => {
    setSortConfig((prev) => {
      const isSameField = prev.field === field;
      const nextOrder = isSameField && prev.order === 'asc' ? 'desc' : 'asc';
      return { field, order: nextOrder };
    });
  };

  const handleAddClick = () => {
    setSelectedNurse(null);
    setModalOpen(true);
  };

  const handleEdit = (nurse) => {
    setSelectedNurse(nurse);
    setModalOpen(true);
  };

  const handleDelete = async (nurse) => {
    const confirmed = window.confirm(`Remove ${nurse.name}?`);
    if (!confirmed) return;
    try {
      await api.deleteNurse(nurse.id);
      showToast('Nurse removed successfully');
      loadNurses();
    } catch (error) {
      showToast(error.message || 'Failed to delete nurse', 'error');
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSubmitting(true);
      if (selectedNurse) {
        await api.updateNurse(selectedNurse.id, formData);
        showToast('Nurse updated successfully');
      } else {
        await api.createNurse(formData);
        showToast('Nurse created successfully');
      }
      setModalOpen(false);
      setSelectedNurse(null);
      loadNurses();
    } catch (error) {
      showToast(error.message || 'Failed to save nurse', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = async (type) => {
    try {
      const blob = type === 'csv' ? await api.downloadCSV() : await api.downloadXLSX();
      downloadFile(blob, `nurses.${type === 'csv' ? 'csv' : 'xlsx'}`);
    } catch (error) {
      showToast(error.message || 'Download failed', 'error');
    }
  };

  const stats = useMemo(() => {
    const total = nurses.length;
    const averageAge = total
      ? Math.round(nurses.reduce((sum, nurse) => sum + Number(nurse.age || 0), 0) / total)
      : 0;
    return { total, averageAge };
  }, [nurses]);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 sm:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <header>
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500">Nurse Management</p>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">CRUD Operations Using Node.js With MySQL</h1>
              <p className="text-gray-500">Manage records, exports, and inline tasks efficiently.</p>
            </div>
            <div className="rounded-2xl bg-white px-6 py-3 shadow-sm">
              <p className="text-sm text-gray-500">Total Nurses</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </header>

        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <SearchBar value={searchTerm} onChange={setSearchTerm} onRefresh={() => loadNurses({})} />
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleDownload('csv')}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Download CSV
              </button>
              <button
                onClick={() => handleDownload('xlsx')}
                className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Download Excel
              </button>
              <button
                onClick={handleAddClick}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500"
              >
                Add Nurse
              </button>
            </div>
          </div>
        </div>

        <NurseTable
          nurses={nurses}
          sortConfig={sortConfig}
          onSort={handleSort}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAddClick={handleAddClick}
          isLoading={loading}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Average Age</p>
            <p className="text-2xl font-semibold text-gray-900">{stats.averageAge || '—'}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Last Refreshed</p>
            <p className="text-2xl font-semibold text-gray-900">{new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <NurseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        nurse={selectedNurse}
        onSave={handleSave}
        isSubmitting={isSubmitting}
      />

      {toast.visible && (
        <div
          className={`fixed bottom-6 right-6 rounded-lg px-4 py-3 text-sm font-medium shadow-lg ${
            toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default App;
