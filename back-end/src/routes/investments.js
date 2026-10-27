import { Router } from 'express';
const router = Router();
// Explicitly labelled demo fixtures: not live market data and not financial advice.
const portfolio = {
  totalValue: 984320.11,
  holdings: [
    { symbol:'RELIANCE',name:'Reliance Industries',value:137800.30,units:45.4,change:6.30 },
    { symbol:'TCS',name:'Tata Consultancy Services',value:172130.30,units:38,change:0.70 },
    { symbol:'HDFCBANK',name:'HDFC Bank Ltd.',value:137200.30,units:84.1,change:4.89 },
    { symbol:'INFY',name:'Infosys Ltd.',value:211020.20,units:106,change:2.13 },
    { symbol:'TATAMOTORS',name:'Tata Motors Ltd.',value:98040,units:155.5,change:-3.21 }
  ],
  performance: [
    {month:'Jan',value:780000},{month:'Feb',value:812500},{month:'Mar',value:798200},
    {month:'Apr',value:845900},{month:'May',value:891200},{month:'Jun',value:872500},
    {month:'Jul',value:918800},{month:'Aug',value:984320},{month:'Sep',value:961000},
    {month:'Oct',value:1002500},{month:'Nov',value:1038900},{month:'Dec',value:1061200}
  ]
};
router.get('/', (_req,res) => res.json({portfolio, disclaimer:'Sample coursework data only. Not live holdings or investment advice.'}));
export default router;
