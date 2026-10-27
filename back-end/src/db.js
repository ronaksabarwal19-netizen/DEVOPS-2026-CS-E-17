import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import initSqlJs from 'sql.js';
import dotenv from 'dotenv';
dotenv.config();

// sql.js is SQLite compiled to WebAssembly, so it does not need native C++ build tools.
const dbFile = process.env.DATABASE_FILE || './data/aurevia.sqlite';
const resolvedDbFile = dbFile === ':memory:' ? null : path.resolve(dbFile);
if (resolvedDbFile) fs.mkdirSync(path.dirname(resolvedDbFile), { recursive: true });
const require = createRequire(import.meta.url);
const wasmPath = require.resolve('sql.js/dist/sql-wasm.wasm');
const SQL = await initSqlJs({ locateFile: () => wasmPath });
const initialData = resolvedDbFile && fs.existsSync(resolvedDbFile)
  ? new Uint8Array(fs.readFileSync(resolvedDbFile))
  : undefined;
const sqlite = initialData ? new SQL.Database(initialData) : new SQL.Database();
let transactionDepth = 0;

function persist() {
  if (resolvedDbFile && transactionDepth === 0) {
    fs.writeFileSync(resolvedDbFile, Buffer.from(sqlite.export()));
  }
}

function normalizeParams(params) {
  if (params.length === 1 && Array.isArray(params[0])) return params[0];
  return params;
}

export const db = {
  exec(sql) {
    sqlite.exec(sql);
    persist();
  },
  prepare(sql) {
    return {
      get(...args) {
        const stmt = sqlite.prepare(sql);
        try {
          stmt.bind(normalizeParams(args));
          return stmt.step() ? stmt.getAsObject() : undefined;
        } finally { stmt.free(); }
      },
      all(...args) {
        const stmt = sqlite.prepare(sql);
        const rows = [];
        try {
          stmt.bind(normalizeParams(args));
          while (stmt.step()) rows.push(stmt.getAsObject());
          return rows;
        } finally { stmt.free(); }
      },
      run(...args) {
        sqlite.run(sql, normalizeParams(args));
        const result = {
          changes: sqlite.getRowsModified(),
          lastInsertRowid: sqlite.exec('SELECT last_insert_rowid() AS id')[0]?.values?.[0]?.[0] ?? 0
        };
        persist();
        return result;
      }
    };
  },
  transaction(callback) {
    return (...args) => {
      sqlite.run('BEGIN');
      transactionDepth++;
      try {
        const result = callback(...args);
        sqlite.run('COMMIT');
        transactionDepth--;
        persist();
        return result;
      } catch (error) {
        try { sqlite.run('ROLLBACK'); } catch {}
        transactionDepth--;
        throw error;
      }
    };
  }
};

// Enable foreign-key enforcement for this connection.
sqlite.run('PRAGMA foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, username TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL, mobile TEXT, password_hash TEXT NOT NULL,
  bank_name TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, type TEXT NOT NULL, balance REAL NOT NULL DEFAULT 0,
  last_digits TEXT NOT NULL DEFAULT '0000', card_type TEXT NOT NULL DEFAULT 'Visa',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transactions (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT REFERENCES accounts(id) ON DELETE SET NULL, name TEXT NOT NULL,
  amount REAL NOT NULL, date TEXT NOT NULL, type TEXT NOT NULL, icon TEXT DEFAULT 'landmark',
  note TEXT, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payees (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL, account_id TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS card_states (
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  frozen INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY(user_id, account_id)
);
CREATE TABLE IF NOT EXISTS settings (
  user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  email INTEGER NOT NULL DEFAULT 1, sms INTEGER NOT NULL DEFAULT 0, push INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS payment_requests (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'submitted', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`);
