export const ADMIN_EMAIL = 'admin@gmail.com';
export const ADMIN_PASSWORD = 'Admin123';

export function isAdminEmail(email: string): boolean {
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('isAdmin') === 'true';
}

export function setAdminStatus(status: boolean): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('isAdmin', status.toString());
  }
}

export function clearAdminStatus(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAdmin');
  }
}