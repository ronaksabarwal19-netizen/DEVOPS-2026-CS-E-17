// Mock data used to seed localStorage on first app load

export const mockUsers = [
  { id: 'user1', password: 'password123', name: 'Ronak Sharma', email: 'ronak.sharma@example.com' },
  { id: 'user2', password: 'password123', name: 'Priya Verma', email: 'priya.verma@example.com' },
  { id: 'user3', password: 'password123', name: 'Aditya Rao', email: 'aditya.rao@example.com' },
];

export const mockAccounts = [
  {
    id: 'acc1',
    name: 'Ronak Bank Savings',
    type: 'Savings',
    balance: 245800.50,
    lastDigits: '4158',
    cardType: 'Visa',
  },
  {
    id: 'acc2',
    name: 'Ronak Bank Current',
    type: 'Current',
    balance: 118420.75,
    lastDigits: '7930',
    cardType: 'Mastercard',
  },
  {
    id: 'acc3',
    name: 'Ronak Bank Salary',
    type: 'Salary',
    balance: 0.00,
    lastDigits: '2210',
    cardType: 'RuPay',
  },
];

export const mockTransactions = [
  { id: 't1', name: 'Spotify Premium', amount: -119.00, date: '2026-08-15', type: 'expense', icon: 'music' },
  { id: 't2', name: 'Amazon India', amount: -2499.00, date: '2026-08-15', type: 'expense', icon: 'shopping-cart' },
  { id: 't3', name: 'Salary Credit', amount: 68000.00, date: '2026-08-14', type: 'income', icon: 'landmark' },
  { id: 't4', name: 'BigBasket', amount: -1840.50, date: '2026-08-13', type: 'expense', icon: 'shopping-basket' },
  { id: 't5', name: 'Chai Point', amount: -120.00, date: '2026-08-13', type: 'expense', icon: 'coffee' },
  { id: 't6', name: 'Freelance Payment', amount: 15200.00, date: '2026-08-11', type: 'income', icon: 'briefcase' },
  { id: 't7', name: 'Electricity Bill - BESCOM', amount: -1740.30, date: '2026-08-10', type: 'expense', icon: 'zap' },
  { id: 't8', name: 'Netflix', amount: -649.00, date: '2026-08-09', type: 'expense', icon: 'tv' },
  { id: 't9', name: 'Cult Fit Membership', amount: -1999.00, date: '2026-08-08', type: 'expense', icon: 'dumbbell' },
  { id: 't10', name: 'Refund - Myntra', amount: 899.00, date: '2026-08-07', type: 'income', icon: 'shopping-bag' },
];

export const mockPayees = [
  { id: 'p1', name: 'Rahul Gupta', accountId: 'RG88213@upi' },
  { id: 'p2', name: 'Ananya Iyer', accountId: 'AI40217@upi' },
  { id: 'p3', name: 'Karan Malhotra', accountId: 'KM90112@upi' },
];

export const mockInvestments = {
  totalValue: 984320.11,
  holdings: [
    { symbol: 'RELIANCE', name: 'Reliance Industries', value: 137800.30, units: 45.4, change: 6.30 },
    { symbol: 'TCS', name: 'Tata Consultancy Services', value: 172130.30, units: 38, change: 0.70 },
    { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd.', value: 137200.30, units: 84.1, change: 4.89 },
    { symbol: 'INFY', name: 'Infosys Ltd.', value: 211020.20, units: 106, change: 2.13 },
    { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd.', value: 98040.00, units: 155.5, change: -3.21 },
  ],
  performance: [
    { month: 'Jan', value: 780000 },
    { month: 'Feb', value: 812500 },
    { month: 'Mar', value: 798200 },
    { month: 'Apr', value: 845900 },
    { month: 'May', value: 891200 },
    { month: 'Jun', value: 872500 },
    { month: 'Jul', value: 918800 },
    { month: 'Aug', value: 984320 },
    { month: 'Sep', value: 961000 },
    { month: 'Oct', value: 1002500 },
    { month: 'Nov', value: 1038900 },
    { month: 'Dec', value: 1061200 },
  ],
};

export const spendingWeekData = [
  { day: 'Mon', amount: 1420 },
  { day: 'Tue', amount: 2650 },
  { day: 'Wed', amount: 1380 },
  { day: 'Thu', amount: 4990 },
  { day: 'Fri', amount: 6200 },
  { day: 'Sat', amount: 3750 },
  { day: 'Sun', amount: 2150 },
];
