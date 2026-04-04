export interface AuthUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface AdminUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  disabledAt: string | null;
}
