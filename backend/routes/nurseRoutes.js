import express from 'express';
import {
  getAllNurses,
  getNurseById,
  createNurse,
  updateNurse,
  deleteNurse,
  exportCSV,
  exportXLSX
} from '../controllers/nurseController.js';
import { validateNurse } from '../middleware/validation.js';

const router = express.Router();

router.get('/', getAllNurses);
router.get('/export/csv', exportCSV);
router.get('/export/xlsx', exportXLSX);
router.get('/:id', getNurseById);
router.post('/', validateNurse, createNurse);
router.put('/:id', validateNurse, updateNurse);
router.delete('/:id', deleteNurse);

export default router;

