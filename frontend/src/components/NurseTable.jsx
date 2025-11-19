import React from 'react';
import { formatDate } from '../utils/helpers.js';

const headers = [
  { key: 'id', label: 'Id' },
  { key: 'name', label: 'Name' },
  { key: 'license_number', label: 'License Number' },
  { key: 'date_of_birth', label: 'Date of Birth' },
  { key: 'age', label: 'Age' },
];

const NurseTable = ({
  nurses,
  sortConfig,
  onSort,
  onEdit,
  onDelete,
  onAddClick,
  isLoading,
}) => {
  const renderSortIcon = (field) => {
    if (sortConfig.field !== field) return '↕';
    return sortConfig.order === 'asc' ? '↑' : '↓';
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] table-auto">
          <thead className="bg-gray-50 text-left text-sm font-semibold text-gray-600">
            <tr>
              {headers.map((header) => (
                <th
                  key={header.key}
                  scope="col"
                  className="px-6 py-4 cursor-pointer select-none"
                  onClick={() => onSort(header.key)}
                >
                  <div className="flex items-center gap-2">
                    {header.label}
                    <span className="text-xs text-gray-400">{renderSortIcon(header.key)}</span>
                  </div>
                </th>
              ))}
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {isLoading && (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-10 text-center text-gray-400">
                  Loading nurse records...
                </td>
              </tr>
            )}
            {!isLoading && nurses.length === 0 && (
              <tr>
                <td colSpan={headers.length + 1} className="px-6 py-10 text-center text-gray-400">
                  No nurse records yet. Click "Add Row" to create one.
                </td>
              </tr>
            )}
            {!isLoading &&
              nurses.map((nurse, index) => (
                <tr
                  key={nurse.id}
                  className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50/80'}
                >
                  <td className="px-6 py-4 font-medium text-gray-900">{nurse.id}</td>
                  <td className="px-6 py-4">{nurse.name}</td>
                  <td className="px-6 py-4">{nurse.license_number}</td>
                  <td className="px-6 py-4">{formatDate(nurse.date_of_birth)}</td>
                  <td className="px-6 py-4">{nurse.age}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <button
                        className="text-sm font-semibold text-indigo-600 hover:text-indigo-500"
                        onClick={() => onEdit(nurse)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-sm font-semibold text-red-500 hover:text-red-400"
                        onClick={() => onDelete(nurse)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            <tr>
              <td colSpan={headers.length + 1} className="px-6 py-4 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Need to add a nurse?</p>
                    <p className="text-xs text-gray-500">Click the button to open the add form.</p>
                  </div>
                  <button
                    type="button"
                    onClick={onAddClick}
                    className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                  >
                    Add Row
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NurseTable;

