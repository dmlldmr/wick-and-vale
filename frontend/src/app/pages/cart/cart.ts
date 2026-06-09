import {Component, NgZone, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Cart, CartItem} from '../../core/models/cart.model';
import {CartService} from '../../core/services/cart';
import {Store} from '@ngxs/store';
import {ToastrAction} from '../../core/state/actions/toastr.actions';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.html',
  styleUrls: ['./cart.scss']
})
export class CartPage implements OnInit {
  cart = signal<Cart | null>(null);
  loading = signal(true);
  error = signal('');

  constructor(
    private cartService: CartService,
    private store: Store,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.loadCart();
  }

  loadCart() {
    this.loading.set(true);
    this.cartService.getCart().subscribe({
      next: cart => this.ngZone.run(() => {
        this.cart.set(cart);
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set('Sepet yüklenemedi.');
        this.loading.set(false);
      })
    });
  }

  updateQuantity(item: CartItem, quantity: number) {
    if (quantity < 1) return;
    this.cartService.updateItem(item.productId, quantity).subscribe({
      next: cart => this.ngZone.run(() => this.cart.set(cart)),
    });
  }

  removeItem(item: CartItem) {
    this.cartService.removeItem(item.productId).subscribe({
      next: () => this.ngZone.run(() => this.loadCart())
    });
  }

  clearCart() {
    this.cartService.clearCart().subscribe({
      next: () => this.ngZone.run(() => {
        this.loadCart();
        this.store.dispatch(new ToastrAction({ type: 'success', message: 'Sepet temizlendi.' }));
      })
    });
  }
}
