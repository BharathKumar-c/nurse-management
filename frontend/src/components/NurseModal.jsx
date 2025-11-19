import React, { useEffect, useState } from 'react';
import { calculateAge } from '../utils/helpers.js';

const initialFormState = {
  name: '',
  license_number: '',
  date_of_birth: '',
  age: '',
};

const fieldClasses =
  'w-full rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-700 focus:border-indigo-500 focus:outline-none';

const NurseModal = ({ isOpen, onClose, nurse, onSave, isSubmitting }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (nurse) {
      setFormData({
        name: nurse.name || '',
        license_number: nurse.license_number || '',
        date_of_birth: nurse.date_of_birth ? nurse.date_of_birth.split('T')[0] : '',
        age: nurse.age || '',
      });
    } else {
      setFormData(initialFormState);
    }
    setErrors({});
  }, [nurse, isOpen]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'date_of_birth' && value
        ? { age: calculateAge(value) }
        : {}),
    }));
  };

  const validateForm = () => {
    const validationErrors = {};
    if (!formData.name.trim()) validationErrors.name = 'Name is required';
    if (!formData.license_number.trim()) validationErrors.license_number = 'License number is required';
    if (!formData.date_of_birth) validationErrors.date_of_birth = 'Date of birth is required';
    if (!formData.age && formData.age !== 0) validationErrors.age = 'Age is required';

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">
              {nurse ? 'Edit Nurse' : 'Add Nurse'}
            </h3>
            <p className="text-sm text-gray-500">Fields marked * are required</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldClasses}
              placeholder="e.g. Daniel"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              License Number *
            </label>
            <input
              name="license_number"
              value={formData.license_number}
              onChange={handleChange}
              className={fieldClasses}
              placeholder="e.g. 2147483647"
            />
            {errors.license_number && <p className="mt-1 text-xs text-red-500">{errors.license_number}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Date of Birth *
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
                className={fieldClasses}
              />
              {errors.date_of_birth && <p className="mt-1 text-xs text-red-500">{errors.date_of_birth}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className={fieldClasses}
                min="0"
              />
              {errors.age && <p className="mt-1 text-xs text-red-500">{errors.age}</p>}
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? 'Saving...' : nurse ? 'Update Nurse' : 'Add Nurse'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NurseModal;

