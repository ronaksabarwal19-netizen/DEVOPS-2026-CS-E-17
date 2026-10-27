import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { db } from '../db.js';
import { id, publicUser } from '../utils.js';
import { requireAuth } from '../middleware/auth.js';
const router = Router();
const registerSchema = z.object({
  username: z.string().trim().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/),
  password: z.string().min(6).max(128),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(160),
  mobile: z.string().trim().max(30).optional().default(''),
  bankName: z.string().trim().max(100).optional().default('')
});
const loginSchema = z.object({ username: z.string().min(1), password: z.string().min(1) });
function issueToken(user) {
  return jwt.sign({}, process.env.JWT_SECRET, { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '2h' });
}
router.post('/register', (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);
    const userId = id('usr');
    const hash = bcrypt.hashSync(data.password, 12);
    const insert = db.transaction(() => {
      db.prepare('INSERT INTO users (id, username, name, email, mobile, password_hash, bank_name) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(userId, data.username, data.name, data.email.toLowerCase(), data.mobile, hash, data.bankName);
      db.prepare('INSERT INTO settings (user_id) VALUES (?)').run(userId);
      const accounts = [
        ['acc_savings', 'Aurevia Bank Savings', 'Savings', 245800.50, '4158', 'Visa'],
        ['acc_current', 'Aurevia Bank Current', 'Current', 118420.75, '7930', 'Mastercard'],
        ['acc_salary', 'Aurevia Bank Salary', 'Salary', 0, '2210', 'RuPay']
      ];
      const addAccount = db.prepare('INSERT INTO accounts (id,user_id,name,type,balance,last_digits,card_type) VALUES (?,?,?,?,?,?,?)');
      accounts.forEach((a, i) => addAccount.run(`${userId}_${a[0]}_${i}`, userId, ...a.slice(1)));
      const payee = db.prepare('INSERT INTO payees (id,user_id,name,account_id) VALUES (?,?,?,?)');
      [['Rahul Gupta','RG88213@upi'],['Ananya Iyer','AI40217@upi'],['Karan Malhotra','KM90112@upi']]
        .forEach((p,i) => payee.run(`${userId}_payee_${i}`, userId, ...p));
      const tx = db.prepare('INSERT INTO transactions (id,user_id,account_id,name,amount,date,type,icon) VALUES (?,?,?,?,?,?,?,?)');
      const seeded = [
        ['Spotify Premium',-119,'2026-08-15','expense','music'],
        ['Amazon India',-2499,'2026-08-15','expense','shopping-cart'],
        ['Salary Credit',68000,'2026-08-14','income','landmark'],
        ['BigBasket',-1840.5,'2026-08-13','expense','shopping-basket'],
        ['Chai Point',-120,'2026-08-13','expense','coffee'],
        ['Freelance Payment',15200,'2026-08-11','income','briefcase'],
        ['Electricity Bill - BESCOM',-1740.3,'2026-08-10','expense','zap'],
        ['Netflix',-649,'2026-08-09','expense','tv'],
        ['Cult Fit Membership',-1999,'2026-08-08','expense','dumbbell'],
        ['Refund - Myntra',899,'2026-08-07','income','shopping-bag']
      ];
      seeded.forEach((t,i) => tx.run(`${userId}_tx_${i}`,userId,`${userId}_acc_savings_0`,...t.slice(0,4),t[4]));
    });
    insert();
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(userId);
    res.status(201).json({ token: issueToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});
router.post('/login', (req, res, next) => {
  try {
    const { username, password } = loginSchema.parse(req.body);
    const user = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE').get(username);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid username or password.' });
    res.json({ token: issueToken(user), user: publicUser(user) });
  } catch (err) { next(err); }
});
router.use(requireAuth);
router.get('/me', (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.userId);
  if (!user) return res.status(404).json({ error: 'User not found.' });
  res.json({ user: publicUser(user) });
});
router.patch('/password', (req, res, next) => {
  try {
    const schema = z.object({ currentPassword: z.string().min(1), newPassword: z.string().min(6).max(128) });
    const { currentPassword, newPassword } = schema.parse(req.body);
    const user = db.prepare('SELECT * FROM users WHERE id=?').get(req.userId);
    if (!user || !bcrypt.compareSync(currentPassword, user.password_hash)) return res.status(400).json({ error: 'Current password is incorrect.' });
    db.prepare('UPDATE users SET password_hash=? WHERE id=?').run(bcrypt.hashSync(newPassword, 12), req.userId);
    res.json({ message: 'Password updated successfully.' });
  } catch (err) { next(err); }
});
export default router;
