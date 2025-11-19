import pool from '../config/database.js';

export const getAllNurses = async (req, res) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM nurses ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getNurseById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.execute('SELECT * FROM nurses WHERE id = ?', [id]);
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
    const { name, license_number, date_of_birth, age } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO nurses (name, license_number, date_of_birth, age) VALUES (?, ?, ?, ?)',
      [name, license_number, date_of_birth, age]
    );
    res.status(201).json({ id: result.insertId, message: 'Nurse created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateNurse = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, license_number, date_of_birth, age } = req.body;
    const [result] = await pool.execute(
      'UPDATE nurses SET name = ?, license_number = ?, date_of_birth = ?, age = ? WHERE id = ?',
      [name, license_number, date_of_birth, age, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Nurse not found' });
    }
    res.json({ message: 'Nurse updated successfully' });
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

export const exportCSV = async (req, res) => {
  try {
    res.status(200).json({ message: 'CSV export endpoint - to be implemented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const exportXLSX = async (req, res) => {
  try {
    res.status(200).json({ message: 'XLSX export endpoint - to be implemented' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

