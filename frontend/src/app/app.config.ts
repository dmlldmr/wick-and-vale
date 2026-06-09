import {ApplicationConfig, ErrorHandler, importProvidersFrom, provideBrowserGlobalErrorListeners} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import {authInterceptor} from './core/interceptors/auth-interceptor';
import {provideAnimations} from '@angular/platform-browser/animations';
import {errorInterceptor} from './core/interceptors/error.interceptor';
import {GlobalErrorHandler} from './core/error/global-error-handler';
import {NgxsModule} from '@ngxs/store';
import {ToasterState} from './core/state/toaster.state';
import {ToastrModule} from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    importProvidersFrom(
      NgxsModule.forRoot([ToasterState]),
      ToastrModule.forRoot(),
    ),
  ]
};
