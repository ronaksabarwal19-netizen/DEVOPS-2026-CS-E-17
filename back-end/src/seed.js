import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
dotenv.config();
const users = [
  {id:'user1',username:'user1',name:'Ronak Sharma',email:'ronak.sharma@example.com'},
  {id:'user2',username:'user2',name:'Priya Verma',email:'priya.verma@example.com'},
  {id:'user3',username:'user3',name:'Aditya Rao',email:'aditya.rao@example.com'}
];
const addUser=db.prepare('INSERT OR IGNORE INTO users (id,username,name,email,password_hash) VALUES (?,?,?,?,?)');
const addSettings=db.prepare('INSERT OR IGNORE INTO settings(user_id) VALUES (?)');
const addAccount=db.prepare('INSERT OR IGNORE INTO accounts (id,user_id,name,type,balance,last_digits,card_type) VALUES (?,?,?,?,?,?,?)');
const addPayee=db.prepare('INSERT OR IGNORE INTO payees(id,user_id,name,account_id) VALUES(?,?,?,?)');
const addTransaction=db.prepare('INSERT OR IGNORE INTO transactions(id,user_id,account_id,name,amount,date,type,icon) VALUES(?,?,?,?,?,?,?,?)');
const tx=db.transaction(()=>{
  for(const u of users){
    addUser.run(u.id,u.username,u.name,u.email,bcrypt.hashSync('password123',12));
    addSettings.run(u.id);
    const accounts=[
      [`${u.id}_acc1`,'Aurevia Bank Savings','Savings',245800.50,'4158','Visa'],
      [`${u.id}_acc2`,'Aurevia Bank Current','Current',118420.75,'7930','Mastercard'],
      [`${u.id}_acc3`,'Aurevia Bank Salary','Salary',0,'2210','RuPay']
    ];
    accounts.forEach(a=>addAccount.run(a[0],u.id,...a.slice(1)));
    [['Rahul Gupta','RG88213@upi'],['Ananya Iyer','AI40217@upi'],['Karan Malhotra','KM90112@upi']]
      .forEach((p,i)=>addPayee.run(`${u.id}_payee${i}`,u.id,...p));
    const samples = [
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
    samples.forEach((t,i)=>addTransaction.run(`${u.id}_tx${i}`,u.id,`${u.id}_acc1`,...t.slice(0,4),t[4]));
  }
});
tx();
console.log('Seed complete. Demo login: user1 / password123 (also user2 and user3).');
