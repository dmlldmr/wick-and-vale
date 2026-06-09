import {HttpErrorResponse, HttpInterceptorFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {Auth} from '../services/auth';
import {catchError, switchMap, throwError} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  const token = authService.getToken();

  const addToken = (request: HttpRequest<unknown>, accessToken: string) =>
    request.clone({setHeaders: {Authorization: `Bearer ${accessToken}`}});

  const authorizedReq = token ? addToken(req, token) : req;

  return next(authorizedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      const isRefreshEndpoint = req.url.includes('/auth/refresh')
        || req.url.includes('/auth/logout')
        || req.url.includes('/users/login');

      if (error.status === 401 && !isRefreshEndpoint && authService.getRefreshToken()) {
        return authService.refreshAccessToken().pipe(
          switchMap(response => next(addToken(req, response.accessToken))),
          catchError(refreshError => {
            authService.logout();
            return throwError(() => refreshError);
          })
        );
      }
      return throwError(() => error);
    })
  );
};

