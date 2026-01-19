import express from 'express';
import { getHabits, createHabit, deleteHabit, toggleHabit, toggleSubtask } from '../controllers/habitController';
import auth from '../middleware/auth';

const router = express.Router();

router.get('/', auth, getHabits);
router.post('/', auth, createHabit);
router.delete('/:id', auth, deleteHabit);
router.patch('/:id/toggle', auth, toggleHabit);
router.patch('/:id/subtask/:subId', auth, toggleSubtask);

export default router;
