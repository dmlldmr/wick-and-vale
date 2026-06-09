import {Injectable} from '@angular/core';
import {ClassifiedError, ErrorMetadata, ErrorRecoveryStrategy, ErrorSeverity, ErrorType} from './error.type.enum';
import {HttpErrorResponse} from '@angular/common/http';
import {ExceptionModel} from './exception.model';

@Injectable({ providedIn: 'root' })
export class ErrorMapperService {

  // Backend'den gelebilecek exact match mesajlar → Türkçe çeviri
  private readonly errorMessageMap: Record<string, string> = {
    'Invalid credentials': 'Geçersiz e-posta veya şifre.',
    'Email already exists': 'Bu e-posta adresi zaten kullanılıyor.',
  };

  // Field adı → okunabilir isim
  private readonly fieldNameMap: Record<string, string> = {
    'email': 'E-posta',
    'password': 'Şifre',
    'name': 'Ad Soyad',
    'address': 'Adres',
    'quantity': 'Adet',
  };

  // Spring Validation mesajları → Türkçe
  private readonly errorTypeMap: Record<string, string> = {
    'must not be blank': 'boş bırakılamaz',
    'must not be null': 'boş bırakılamaz',
    'must be a valid email': 'geçerli bir e-posta olmalı',
    'size must be between': 'geçersiz uzunluk',
    'cannot-be-null': 'boş bırakılamaz',
    'cannot-be-empty': 'boş bırakılamaz',
    'is-required': 'zorunludur',
    'is-invalid': 'geçersiz',
    'already-exists': 'zaten mevcut',
  };

  classifyError(error: any, context?: Partial<ErrorMetadata>): ClassifiedError {
    if (error instanceof HttpErrorResponse) {
      return this.classifyHttpError(error, context);
    }
    return {
      type: ErrorType.UNKNOWN,
      severity: ErrorSeverity.MEDIUM,
      originalError: error,
      userMessage: 'Beklenmeyen bir hata oluştu.',
      technicalMessage: error?.message || 'Unknown error',
      shouldShowToUser: true,
      metadata: this.buildMetadata(context, error),
      isRecoverable: false,
    };
  }

  private classifyHttpError(error: HttpErrorResponse, context?: Partial<ErrorMetadata>): ClassifiedError {
    const status = error.status;
    const body = error.error as ExceptionModel;
    const metadata = this.buildMetadata(context, error);

    if (status === 0)
      return this.make(ErrorType.NETWORK, ErrorSeverity.HIGH, status, error,
        'İnternet bağlantınızı kontrol edin.', 'Network error',
        true, metadata, { shouldRetry: true, maxRetries: 3, retryDelay: 1000 }, true);

    if (status === 401)
      return this.make(ErrorType.AUTHENTICATION, ErrorSeverity.HIGH, status, error,
        'Oturumunuz sona erdi. Lütfen tekrar giriş yapın.', 'Unauthorized',
        true, metadata, undefined, false);

    if (status === 403)
      return this.make(ErrorType.AUTHORIZATION, ErrorSeverity.MEDIUM, status, error,
        'Bu işlem için yetkiniz yok.', 'Forbidden',
        false, metadata, undefined, false);

    if (status === 404)
      return this.make(ErrorType.NOT_FOUND, ErrorSeverity.LOW, status, error,
        'Aradığınız içerik bulunamadı.', 'Not found',
        true, metadata, undefined, false);

    if (status === 408 || status === 504)
      return this.make(ErrorType.TIMEOUT, ErrorSeverity.MEDIUM, status, error,
        'İstek zaman aşımına uğradı.', `Timeout ${status}`,
        true, metadata, { shouldRetry: true, maxRetries: 2, retryDelay: 2000 }, true);

    if (status === 429)
      return this.make(ErrorType.RATE_LIMIT, ErrorSeverity.MEDIUM, status, error,
        'Çok fazla istek. Lütfen bekleyin.', 'Rate limit',
        true, metadata, { shouldRetry: true, maxRetries: 1, retryDelay: 5000 }, true);

    if (status === 400) {
      // Backend errors[] formatı: ["fieldName: validation message"]
      const rawErrors = body?.errors;
      const backendMsg = body?.message;
      let userMessage: string;

      if (rawErrors?.length) {
        userMessage = rawErrors.map(e => {
          const colonIdx = e.indexOf(':');
          if (colonIdx > -1) {
            const field = e.substring(0, colonIdx).trim();
            const msg = e.substring(colonIdx + 1).trim();
            return `${this.translateField(field)}: ${this.translateErrorType(msg)}`;
          }
          return e;
        }).join('\n');
      } else if (backendMsg) {
        userMessage = this.errorMessageMap[backendMsg] ?? backendMsg;
      } else {
        userMessage = 'Girdiğiniz bilgileri kontrol edin.';
      }

      return this.make(ErrorType.VALIDATION, ErrorSeverity.LOW, status, error,
        userMessage, body?.message || 'Bad request',
        true, { ...metadata, fieldErrors: rawErrors }, undefined, true);
    }

    if (status >= 500)
      return this.make(ErrorType.SERVER, ErrorSeverity.CRITICAL, status, error,
        'Sunucu hatası oluştu. Lütfen tekrar deneyin.', `Server error ${status}`,
        true, metadata, { shouldRetry: true, maxRetries: 2, retryDelay: 3000 }, true);

    return this.make(ErrorType.CLIENT, ErrorSeverity.MEDIUM, status, error,
      'İşlem tamamlanamadı.', `Client error ${status}`,
      true, metadata, undefined, false);
  }

  getErrorTitle(type: ErrorType): string {
    const titles: Record<ErrorType, string> = {
      [ErrorType.NETWORK]:        'Bağlantı Hatası',
      [ErrorType.VALIDATION]:     'Geçersiz Veri',
      [ErrorType.AUTHENTICATION]: 'Oturum Hatası',
      [ErrorType.AUTHORIZATION]:  'Yetki Hatası',
      [ErrorType.NOT_FOUND]:      'Bulunamadı',
      [ErrorType.SERVER]:         'Sunucu Hatası',
      [ErrorType.CLIENT]:         'İstek Hatası',
      [ErrorType.TIMEOUT]:        'Zaman Aşımı',
      [ErrorType.RATE_LIMIT]:     'Çok Fazla İstek',
      [ErrorType.UNKNOWN]:        'Hata',
    };
    return titles[type] ?? 'Hata';
  }

  private make(
    type: ErrorType, severity: ErrorSeverity, statusCode: number, originalError: any,
    userMessage: string, technicalMessage: string, shouldShowToUser: boolean,
    metadata: ErrorMetadata, recovery: ErrorRecoveryStrategy | undefined,
    isRecoverable: boolean
  ): ClassifiedError {
    return { type, severity, statusCode, originalError, userMessage, technicalMessage, shouldShowToUser, metadata, recovery, isRecoverable };
  }

  private translateField(field: string): string {
    return this.fieldNameMap[field.toLowerCase()] ?? field;
  }

  private translateErrorType(msg: string): string {
    return this.errorTypeMap[msg] ?? msg;
  }

  private buildMetadata(context?: Partial<ErrorMetadata>, error?: any): ErrorMetadata {
    return {
      timestamp: new Date().toISOString(),
      url: error instanceof HttpErrorResponse ? error.url ?? undefined : undefined,
      stackTrace: error?.stack,
      ...context,
    };
  }
}
