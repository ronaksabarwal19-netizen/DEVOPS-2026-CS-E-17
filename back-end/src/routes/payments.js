import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { id, today } from '../utils.js';
const router = Router();
router.get('/payees', (req,res) => res.json({payees:db.prepare('SELECT id,name,account_id AS accountId FROM payees WHERE user_id=? ORDER BY name').all(req.userId)}));
router.post('/send', (req,res,next) => {
  try {
    const { recipient, amount, note='' } = z.object({
      recipient:z.string().trim().min(1).max(120),
      amount:z.number().finite().positive().max(1e9),
      note:z.string().max(250).optional().default('')
    }).parse(req.body);
    const result = db.transaction(() => {
      const account = db.prepare('SELECT * FROM accounts WHERE user_id=? ORDER BY created_at LIMIT 1').get(req.userId);
      if (!account) throw Object.assign(new Error('No account available for this user.'),{status:400});
      if (account.balance < amount) throw Object.assign(new Error('Insufficient balance in primary account.'),{status:400});
      db.prepare('UPDATE accounts SET balance=balance-? WHERE id=? AND user_id=?').run(amount,account.id,req.userId);
      const transactionId=id('txn');
      db.prepare('INSERT INTO transactions (id,user_id,account_id,name,amount,date,type,icon,note) VALUES (?,?,?,?,?,?,?,?,?)')
        .run(transactionId,req.userId,account.id,`Payment to ${recipient}`,-amount,today(),'payment','send',note);
      return {id:transactionId,name:`Payment to ${recipient}`,amount:-amount,date:today(),type:'payment',icon:'send',note,accountId:account.id,balance:account.balance-amount};
    })();
    res.status(201).json({message:`Payment recorded for ${recipient}. This is a simulation; no real money was transferred.`,transaction:result});
  } catch(err){next(err);}
});
export default router;
