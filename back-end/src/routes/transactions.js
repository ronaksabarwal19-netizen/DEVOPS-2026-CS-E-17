import { Router } from 'express';
import { db } from '../db.js';
const router = Router();
router.get('/', (req,res) => {
  const limit = Math.min(Math.max(Number.parseInt(req.query.limit || '100',10) || 100,1),500);
  const rows = db.prepare(`SELECT id,name,amount,date,type,icon,note,account_id AS accountId FROM transactions WHERE user_id=? ORDER BY date DESC, created_at DESC LIMIT ?`).all(req.userId,limit);
  res.json({transactions:rows});
});
export default router;
