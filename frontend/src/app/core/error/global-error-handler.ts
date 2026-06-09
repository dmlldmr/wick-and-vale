import {ErrorHandler, Injectable, Injector, PLATFORM_ID} from '@angular/core';
import { Store } from '@ngxs/store';
import {ErrorMapperService} from './error.mapper.service';
import {HttpErrorResponse} from '@angular/common/http';
import {isPlatformBrowser} from '@angular/common';
import {ToastrAction} from '../state/actions/toastr.actions';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private store!: Store;
  private errorMapper!: ErrorMapperService;
  private platformId!: Object;
  private initialized = false;

  constructor(private injector: Injector) {}

  handleError(error: any): void {
    this.init();
    if (this.shouldIgnore(error)) return;
    if (error instanceof HttpErrorResponse) return;

    if (this.isChunkLoadError(error) && isPlatformBrowser(this.platformId)) {
      const lastReload = sessionStorage.getItem('chunk_reload');
      if (!lastReload || Date.now() - +lastReload > 10000) {
        sessionStorage.setItem('chunk_reload', Date.now().toString());
        window.location.reload();
      }
      return;
    }

    const classified = this.errorMapper.classifyError(error);
    if (classified.shouldShowToUser && isPlatformBrowser(this.platformId)) {
      this.store.dispatch(new ToastrAction({ type: 'danger', message: classified.userMessage }));
    }
    console.error('[GlobalErrorHandler]', error);
  }

  private shouldIgnore(error: any): boolean {
    const msg = error?.message || String(error);
    return ['ResizeObserver loop', 'Non-Error promise rejection', 'Script error', 'hydration', 'NG0']
      .some(p => msg.toLowerCase().includes(p.toLowerCase()));
  }

  private isChunkLoadError(error: any): boolean {
    const msg = error?.message || '';
    return msg.includes('ChunkLoadError') || msg.includes('Loading chunk') || msg.includes('Failed to fetch dynamically imported module');
  }

  private init(): void {
    if (this.initialized) return;
    this.store       = this.injector.get(Store);
    this.errorMapper = this.injector.get(ErrorMapperService);
    this.platformId  = this.injector.get(PLATFORM_ID);
    this.initialized = true;
  }
}
