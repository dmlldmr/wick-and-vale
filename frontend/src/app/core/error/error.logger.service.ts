import {Injectable} from '@angular/core';
import {ClassifiedError, ErrorSeverity} from './error.type.enum';

@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
  logError(error: ClassifiedError, source = 'ErrorInterceptor'): void {
    if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
      console.error(`[${source}]`, error.technicalMessage, error.metadata);
    } else {
      console.warn(`[${source}]`, error.technicalMessage);
    }
  }
}
