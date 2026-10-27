import dotenv from 'dotenv';
dotenv.config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 24) {
  console.error('JWT_SECRET must be set in .env and contain at least 24 characters.');
  process.exit(1);
}
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { requireAuth } from './middleware/auth.js';
import authRoutes from './routes/auth.js';
import accountRoutes from './routes/accounts.js';
import transactionRoutes from './routes/transactions.js';
import paymentRoutes from './routes/payments.js';
import cardRoutes from './routes/cards.js';
import settingRoutes from './routes/settings.js';
import investmentRoutes from './routes/investments.js';
import './db.js';

const app=express();
app.disable('x-powered-by');
app.use(helmet());
app.use(cors({origin:(process.env.CLIENT_ORIGIN||'http://localhost:5173').split(',').map(s=>s.trim()),credentials:false}));
app.use(express.json({limit:'100kb'}));
app.get('/api/health',(_req,res)=>res.json({status:'ok',service:'aurevia-bank-api'}));
app.use('/api/auth',rateLimit({windowMs:15*60*1000,limit:100,standardHeaders:true,legacyHeaders:false}),authRoutes);
app.use('/api/auth',requireAuth);
app.use('/api/accounts',requireAuth,accountRoutes);
app.use('/api/transactions',requireAuth,transactionRoutes);
app.use('/api/payments',requireAuth,paymentRoutes);
app.use('/api/cards',requireAuth,cardRoutes);
app.use('/api/settings',requireAuth,settingRoutes);
app.use('/api/investments',requireAuth,investmentRoutes);
app.use((_req,res)=>res.status(404).json({error:'Route not found.'}));
app.use((err,_req,res,_next)=>{
  if(err instanceof z.ZodError) return res.status(400).json({error:'Validation failed.',details:err.issues.map(i=>({field:i.path.join('.'),message:i.message}))});
  if(err?.code==='SQLITE_CONSTRAINT_UNIQUE' || /UNIQUE constraint failed/i.test(err?.message || '')) return res.status(409).json({error:'Username or email is already registered.'});
  const status=err.status||500;
  if(status>=500) console.error(err);
  res.status(status).json({error:status>=500?'Internal server error.':err.message});
});
const port=Number(process.env.PORT||4000);
app.listen(port,()=>console.log(`Aurevia API listening on http://localhost:${port}`));
