import pool from '../config/database.js';
import { generateCSVBuffer, generateXLSXBuffer } from '../services/exportService.js';
import { calculateAgeFromDOB, buildSortingClause } from '../utils/nurseUtils.js';

const checkLicenseNumberAvailability = async (licenseNumber, excludeId = null) => {
  const query = excludeId
    ? 'SELECT id FROM nurses WHERE license_number = ? AND id <> ?'
    : 'SELECT id FROM nurses WHERE license_number = ?';
  const params = excludeId ? [licenseNumber, excludeId] : [licenseNumber];
  const [rows] = await pool.execute(query, params);
  return rows.length === 0;
};

export const getAllNurses = async (req, res) => {
  try {
    const { search = '', sortField = 'id', sortOrder = 'desc' } = req.query;
    const filters = [];
    const params = [];

    if (search) {
      filters.push('(name LIKE ? OR license_number LIKE ?)');
      params.push(`%${search}%`, `%${search}%`);
    }

    const whereClause = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    const query = `
      SELECT id, name, license_number, date_of_birth, age, created_at, updated_at
      FROM nurses
      ${whereClause}
      ${buildSortingClause(sortField, sortOrder)}
    `;

    const [rows] = await pool.execute(query, params);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNurseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute(
      'SELECT id, name, license_number, date_of_birth, age, created_at, updated_at FROM nurses WHERE id = ?',
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Nurse not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createNurse = async (req, res) => {
  try {
    const { name, license_number, date_of_birth } = req.body;
    const licenseAvailable = await checkLicenseNumberAvailability(license_number);

    if (!licenseAvailable) {
      return res.status(409).json({ error: 'License number already exists' });
    }

    const age = calculateAgeFromDOB(date_of_birth);
    const [result] = await pool.execute(
      'INSERT INTO nurses (name, license_number, date_of_birth, age) VALUES (?, ?, ?, ?)',
      [name, license_number, date_of_birth, age]
    );

    res.status(201).json({
      id: result.insertId,
      message: 'Nurse created successfully',
      nurse: { id: result.insertId, name, license_number, date_of_birth, age }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNurse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_number, date_of_birth } = req.body;
    const licenseAvailable = await checkLicenseNumberAvailability(license_number, id);

    if (!licenseAvailable) {
      return res.status(409).json({ error: 'License number already exists' });
    }

    const age = calculateAgeFromDOB(date_of_birth);
    const [result] = await pool.execute(
      'UPDATE nurses SET name = ?, license_number = ?, date_of_birth = ?, age = ? WHERE id = ?',
      [name, license_number, date_of_birth, age, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nurse not found' });
    }

    res.json({ message: 'Nurse updated successfully', nurse: { id, name, license_number, date_of_birth, age } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteNurse = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.execute('DELETE FROM nurses WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nurse not found' });
    }
    res.json({ message: 'Nurse deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchNurseDataset = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, license_number, DATE_FORMAT(date_of_birth, '%Y-%m-%d') as date_of_birth, age, created_at, updated_at
     FROM nurses
     ORDER BY id DESC`
  );
  return rows;
};

export const exportCSV = async (req, res) => {
  try {
    const nurses = await fetchNurseDataset();
    const csvBuffer = await generateCSVBuffer(nurses);
    const timestamp = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=nurses-${timestamp}.csv`);
    res.send(csvBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportXLSX = async (req, res) => {
  try {
    const nurses = await fetchNurseDataset();
    const xlsxBuffer = await generateXLSXBuffer(nurses);
    const timestamp = new Date().toISOString().split('T')[0];

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader('Content-Disposition', `attachment; filename=nurses-${timestamp}.xlsx`);
    res.send(xlsxBuffer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

