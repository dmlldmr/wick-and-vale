import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {inject, PLATFORM_ID} from '@angular/core';
import {Store} from '@ngxs/store';
import {ErrorMapperService} from '../error/error.mapper.service';
import {ErrorLoggerService} from '../error/error.logger.service';
import {catchError, throwError} from 'rxjs';
import {isPlatformBrowser} from '@angular/common';
import {ToastrAction} from '../state/actions/toastr.actions';
import {ErrorType} from '../error/error.type.enum';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const store = inject(Store);
  const errorMapper = inject(ErrorMapperService);
  const errorLogger = inject(ErrorLoggerService);
  const platformId = inject(PLATFORM_ID);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 429) return throwError(() => error);
      if (shouldIgnoreHttpError(req.url, req.method)) return throwError(() => error);

      const classified = errorMapper.classifyError(error, { url: req.url, method: req.method });
      errorLogger.logError(classified);

      if (isPlatformBrowser(platformId) && classified.shouldShowToUser) {
        const needsTitle = classified.type === ErrorType.NETWORK
          || classified.type === ErrorType.SERVER
          || classified.type === ErrorType.AUTHENTICATION
          || classified.type === ErrorType.TIMEOUT;

        store.dispatch(new ToastrAction({
          type: 'danger',
          message: classified.userMessage,
          title: needsTitle ? errorMapper.getErrorTitle(classified.type) : undefined,
        }));
      }

      return throwError(() => error);
    })
  );
};

function shouldIgnoreHttpError(url: string, method: string): boolean {
  const silentGetUrls = ['/api/orders'];
  if(method === 'GET' && silentGetUrls.some(u => url.includes(u))) return true;

  const silentAllUrls = ['/api/users/login'];
  return silentAllUrls.some(u => url.includes(u));
}
