import { randomUUID } from 'node:crypto';
export const id = (prefix) => `${prefix}_${randomUUID()}`;
export const today = () => new Date().toISOString().slice(0, 10);
export function publicUser(user) {
  return { id: user.id, username: user.username, name: user.name, email: user.email, mobile: user.mobile ?? '' };
}
export function asyncRoute(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}
