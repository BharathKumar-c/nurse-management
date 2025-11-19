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

const router = express.Router();

router.get('/', getAllNurses);
router.get('/:id', getNurseById);
router.post('/', createNurse);
router.put('/:id', updateNurse);
router.delete('/:id', deleteNurse);
router.get('/export/csv', exportCSV);
router.get('/export/xlsx', exportXLSX);

export default router;

