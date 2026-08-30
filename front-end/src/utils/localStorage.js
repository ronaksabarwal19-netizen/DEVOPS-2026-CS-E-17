// Helper functions for reading/writing our "database" (localStorage)
import { mockUsers, mockAccounts, mockTransactions, mockInvestments, mockPayees } from '../data/mockData';

const KEYS = {
  USERS: 'bd_users',
  ACCOUNTS: 'bd_accounts',
  TRANSACTIONS: 'bd_transactions',
  INVESTMENTS: 'bd_investments',
  PAYEES: 'bd_payees',
  CURRENT_USER: 'bd_current_user',
  CARDS_FROZEN: 'bd_cards_frozen',
  SETTINGS: 'bd_settings',
};

export function getItem(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Seed mock data into localStorage on first load if it isn't there yet
export function seedData() {
  if (!localStorage.getItem(KEYS.USERS)) setItem(KEYS.USERS, mockUsers);
  if (!localStorage.getItem(KEYS.ACCOUNTS)) setItem(KEYS.ACCOUNTS, mockAccounts);
  if (!localStorage.getItem(KEYS.TRANSACTIONS)) setItem(KEYS.TRANSACTIONS, mockTransactions);
  if (!localStorage.getItem(KEYS.INVESTMENTS)) setItem(KEYS.INVESTMENTS, mockInvestments);
  if (!localStorage.getItem(KEYS.PAYEES)) setItem(KEYS.PAYEES, mockPayees);
  if (!localStorage.getItem(KEYS.SETTINGS)) {
    setItem(KEYS.SETTINGS, { email: true, sms: false, push: true });
  }
}

export { KEYS };
