export enum ErrorType {
  NETWORK = 'NETWORK',
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  SERVER = 'SERVER',
  CLIENT = 'CLIENT',
  UNKNOWN = 'UNKNOWN',
  TIMEOUT = 'TIMEOUT',
  RATE_LIMIT = 'RATE_LIMIT'
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export interface ErrorMetadata {
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  fieldErrors?: any;
  userId?: string;
  userAgent?: string;
  timestamp: string;
  stackTrace?: string;
  additionalData?: Record<string, any>;
}

export interface ErrorRecoveryStrategy {
  shouldRetry: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

export interface ClassifiedError {
  type: ErrorType;
  severity: ErrorSeverity;
  statusCode?: number;
  originalError: any;
  userMessage: string;
  technicalMessage: string;
  shouldShowToUser: boolean;
  metadata: ErrorMetadata;
  recovery?: ErrorRecoveryStrategy;
  isRecoverable: boolean;
}
