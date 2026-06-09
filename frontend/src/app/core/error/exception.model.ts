export interface ExceptionModel {
  timestamp?: string;
  message?: string;
  status?: number;
  errors?: string[] | null;
}

export enum ExceptionDetailKeysEnum {
  INVALID_CREDENTIALS = 'Invalid credentials',
  EMAIL_ALREADY_EXISTS = 'Email already exists',
}
