import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
const router = Router();
router.get('/', (req,res) => {
  const s=db.prepare('SELECT email,sms,push FROM settings WHERE user_id=?').get(req.userId);
  res.json({settings:{email:Boolean(s?.email ?? 1),sms:Boolean(s?.sms ?? 0),push:Boolean(s?.push ?? 1)}});
});
router.put('/', (req,res,next) => {
  try {
    const s=z.object({email:z.boolean(),sms:z.boolean(),push:z.boolean()}).parse(req.body);
    db.prepare(`INSERT INTO settings(user_id,email,sms,push) VALUES(?,?,?,?)
      ON CONFLICT(user_id) DO UPDATE SET email=excluded.email,sms=excluded.sms,push=excluded.push`)
      .run(req.userId,+s.email,+s.sms,+s.push);
    res.json({settings:s});
  } catch(err){next(err);}
});
export default router;
