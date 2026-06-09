import {Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {WishlistItem} from '../models/wishlist.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private apiUrl = environment.apiUrl + '/wishlist';

  wishlistIds = signal<Set<number>>(new Set());

  constructor(private http: HttpClient) {}

  load(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl).pipe(
      tap(items => this.wishlistIds.set(new Set(items.map(i => i.productId))))
    );
  }

  getAll(): Observable<WishlistItem[]> {
    return this.http.get<WishlistItem[]>(this.apiUrl);
  }

  add(productId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${productId}`, {}).pipe(
      tap(() => this.wishlistIds.update(set => new Set([...set, productId])))
    );
  }

  remove(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${productId}`).pipe(
      tap(() => this.wishlistIds.update(set => { const next = new Set(set); next.delete(productId); return next; }))
    );
  }

  isInWishlist(productId: number): boolean {
    return this.wishlistIds().has(productId);
  }
}
