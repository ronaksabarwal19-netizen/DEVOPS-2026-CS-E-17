import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { id } from '../utils.js';
const router = Router();
router.get('/', (req,res) => res.json({ accounts: db.prepare('SELECT id,name,type,balance,last_digits AS lastDigits,card_type AS cardType,created_at AS createdAt FROM accounts WHERE user_id=? ORDER BY created_at').all(req.userId) }));
router.post('/', (req,res,next) => {
  try {
    const data = z.object({ name:z.string().trim().min(2).max(100), type:z.string().trim().min(2).max(40), balance:z.number().finite().min(0).max(1e12), lastDigits:z.string().regex(/^\d{4}$/).optional().default('0000'), cardType:z.enum(['Visa','Mastercard','RuPay','Amex']).optional().default('Visa') }).parse(req.body);
    const accountId=id('acc');
    db.prepare('INSERT INTO accounts (id,user_id,name,type,balance,last_digits,card_type) VALUES (?,?,?,?,?,?,?)').run(accountId,req.userId,data.name,data.type,data.balance,data.lastDigits,data.cardType);
    res.status(201).json({ account: { id:accountId,...data,lastDigits:data.lastDigits,cardType:data.cardType } });
  } catch(err){next(err);}
});
router.get('/:id', (req,res) => {
  const account=db.prepare('SELECT id,name,type,balance,last_digits AS lastDigits,card_type AS cardType FROM accounts WHERE id=? AND user_id=?').get(req.params.id,req.userId);
  if(!account) return res.status(404).json({error:'Account not found.'});
  res.json({account});
});
export default router;
