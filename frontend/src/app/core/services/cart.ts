import {Injectable, signal} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import {Cart} from '../models/cart.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private apiUrl = environment.apiUrl + '/cart';
  cartCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => this.cartCount.set(cart.totalItems))
    );
  }

  addItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.post<Cart>(`${this.apiUrl}/items`, { productId, quantity }).pipe(
      tap(cart => this.cartCount.set(cart.totalItems))
    );
  }

  updateItem(productId: number, quantity: number): Observable<Cart> {
    return this.http.patch<Cart>(`${this.apiUrl}/items/${productId}`, { quantity }).pipe(
      tap(cart => this.cartCount.set(cart.totalItems))
    );
  }

  removeItem(productId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/items/${productId}`);
  }

  clearCart(): Observable<void> {
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => this.cartCount.set(0))
    );
  }


}
