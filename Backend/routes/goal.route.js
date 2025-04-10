import express from 'express';
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from '../controllers/goal.controller.js';
import auth from '../Middleware/auth.js';

const router = express.Router();

router.get('/', auth, getGoals);
router.post('/', auth, createGoal);
router.put('/:id', auth, updateGoal);
router.delete('/:id', auth, deleteGoal);

export default router;