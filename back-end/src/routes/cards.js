import { Router } from 'express';
import { db } from '../db.js';
import { id } from '../utils.js';
const router = Router();
router.get('/', (req,res) => {
  const cards = db.prepare(`SELECT a.id,a.name,a.last_digits AS lastDigits,a.card_type AS cardType,COALESCE(c.frozen,0) AS frozen
    FROM accounts a LEFT JOIN card_states c ON c.account_id=a.id AND c.user_id=a.user_id
    WHERE a.user_id=? ORDER BY a.created_at`).all(req.userId);
  res.json({cards:cards.map(c=>({...c,frozen:Boolean(c.frozen)}))});
});
router.patch('/:accountId/freeze', (req,res) => {
  const account=db.prepare('SELECT id FROM accounts WHERE id=? AND user_id=?').get(req.params.accountId,req.userId);
  if(!account) return res.status(404).json({error:'Card/account not found.'});
  const current=db.prepare('SELECT frozen FROM card_states WHERE user_id=? AND account_id=?').get(req.userId,account.id);
  const frozen = req.body.frozen === undefined ? !(current?.frozen) : Boolean(req.body.frozen);
  db.prepare(`INSERT INTO card_states (user_id,account_id,frozen) VALUES (?,?,?)
    ON CONFLICT(user_id,account_id) DO UPDATE SET frozen=excluded.frozen`).run(req.userId,account.id,frozen?1:0);
  res.json({accountId:account.id,frozen});
});
router.post('/request', (req,res) => {
  const requestId=id('cardreq');
  db.prepare('INSERT INTO payment_requests (id,user_id,status) VALUES (?,?,?)').run(requestId,req.userId,'submitted');
  res.status(201).json({request:{id:requestId,status:'submitted'},message:'Virtual card request recorded for this demo.'});
});
export default router;
