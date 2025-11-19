import { createObjectCsvStringifier } from 'csv-writer';
import XLSX from 'xlsx';

const exportHeaders = [
  { id: 'id', title: 'Id' },
  { id: 'name', title: 'Name' },
  { id: 'license_number', title: 'License Number' },
  { id: 'date_of_birth', title: 'Date of Birth' },
  { id: 'age', title: 'Age' },
  { id: 'created_at', title: 'Created At' },
  { id: 'updated_at', title: 'Updated At' }
];

export const generateCSVBuffer = async (data) =>
  new Promise((resolve, reject) => {
    try {
      const csvStringifier = createObjectCsvStringifier({ header: exportHeaders });
      const header = csvStringifier.getHeaderString();
      const records = csvStringifier.stringifyRecords(data);
      resolve(Buffer.from(`${header}${records}`, 'utf-8'));
    } catch (error) {
      reject(error);
    }
  });

export const generateXLSXBuffer = async (data) =>
  new Promise((resolve, reject) => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Nurses');
      const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      resolve(buffer);
    } catch (error) {
      reject(error);
    }
  });

