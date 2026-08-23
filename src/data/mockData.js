// Mock data used to seed localStorage on first app load

export const mockUsers = [
  { id: 'user1', password: 'password123', name: 'Sophia Anderson', email: 'sophia@example.com' },
  { id: 'user2', password: 'password123', name: 'Rahul Mehta', email: 'rahul@example.com' },
  { id: 'user3', password: 'password123', name: 'Nadia Rachel', email: 'nadia@example.com' },
];

export const mockAccounts = [
  {
    id: 'acc1',
    name: 'Aura Infinite',
    type: 'Checking',
    balance: 32450.25,
    lastDigits: '4158',
    cardType: 'Visa',
  },
  {
    id: 'acc2',
    name: 'Aura Savings',
    type: 'Savings',
    balance: 14440.50,
    lastDigits: '7930',
    cardType: 'Mastercard',
  },
  {
    id: 'acc3',
    name: 'Aura Travel Card',
    type: 'Prepaid',
    balance: 0.00,
    lastDigits: '2210',
    cardType: 'Visa',
  },
];

export const mockTransactions = [
  { id: 't1', name: 'Spotify Premium', amount: -10.99, date: '2026-08-15', type: 'expense', icon: 'music' },
  { id: 't2', name: 'Amazon Prime', amount: -149.00, date: '2026-08-15', type: 'expense', icon: 'shopping-cart' },
  { id: 't3', name: 'Salary Deposit', amount: 3450.00, date: '2026-08-14', type: 'income', icon: 'landmark' },
  { id: 't4', name: 'Whole Foods', amount: -89.50, date: '2026-08-13', type: 'expense', icon: 'shopping-basket' },
  { id: 't5', name: 'Starbucks', amount: -6.25, date: '2026-08-13', type: 'expense', icon: 'coffee' },
  { id: 't6', name: 'Freelance Payment', amount: 620.00, date: '2026-08-11', type: 'income', icon: 'briefcase' },
  { id: 't7', name: 'Electricity Bill', amount: -74.30, date: '2026-08-10', type: 'expense', icon: 'zap' },
  { id: 't8', name: 'Netflix', amount: -15.99, date: '2026-08-09', type: 'expense', icon: 'tv' },
  { id: 't9', name: 'Gym Membership', amount: -40.00, date: '2026-08-08', type: 'expense', icon: 'dumbbell' },
  { id: 't10', name: 'Refund - Zara', amount: 32.99, date: '2026-08-07', type: 'income', icon: 'shopping-bag' },
];

export const mockPayees = [
  { id: 'p1', name: 'John Carter', accountId: 'JC-88213' },
  { id: 'p2', name: 'Emily Watson', accountId: 'EW-40217' },
  { id: 'p3', name: 'Daniel Kim', accountId: 'DK-90112' },
];

export const mockInvestments = {
  totalValue: 12304.11,
  holdings: [
    { symbol: 'AAPL', name: 'Apple Inc.', value: 1721.30, units: 10.4, change: 6.30 },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', value: 1721.30, units: 12, change: 0.70 },
    { symbol: 'MSFT', name: 'Microsoft Corp.', value: 1721.30, units: 4.1, change: 4.89 },
    { symbol: 'NVDA', name: 'NVIDIA Corp.', value: 2110.20, units: 16, change: 2.13 },
    { symbol: 'TSLA', name: 'Tesla Inc.', value: 980.40, units: 5.5, change: -3.21 },
  ],
  performance: [
    { month: 'Jan', value: 9800 },
    { month: 'Feb', value: 10450 },
    { month: 'Mar', value: 10120 },
    { month: 'Apr', value: 10890 },
    { month: 'May', value: 11500 },
    { month: 'Jun', value: 11200 },
    { month: 'Jul', value: 11850 },
    { month: 'Aug', value: 12304 },
    { month: 'Sep', value: 12010 },
    { month: 'Oct', value: 12550 },
    { month: 'Nov', value: 12890 },
    { month: 'Dec', value: 13100 },
  ],
};

export const spendingWeekData = [
  { day: 'Mon', amount: 42 },
  { day: 'Tue', amount: 65 },
  { day: 'Wed', amount: 38 },
  { day: 'Thu', amount: 90 },
  { day: 'Fri', amount: 120 },
  { day: 'Sat', amount: 75 },
  { day: 'Sun', amount: 55 },
];
