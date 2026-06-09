import {Component, NgZone, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Cart} from '../../core/models/cart.model';
import {CartService} from '../../core/services/cart';
import {OrderService} from '../../core/services/order';
import {Auth} from '../../core/services/auth';
import {CreateOrderRequest} from '../../core/models/order.model';


@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.scss'
})
export class CheckoutComponent implements OnInit {
  cart = signal<Cart | null>(null);
  loading = signal(true);
  submitting = signal(false);
  error = signal<string | null>(null);

  form: FormGroup;

  constructor(
    private cartService: CartService,
    private orderService: OrderService,
    private authService: Auth,
    private router: Router,
    private ngZone: NgZone,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      address: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit() {
    this.cartService.getCart().subscribe({
      next: (cart) => this.ngZone.run(() => {
        this.cart.set(cart);
        this.loading.set(false);
        if(!cart || cart.items.length === 0) {
          this.router.navigate(['/cart']);
        }
      }),
      error: () => this.ngZone.run(() => {
        this.error.set('Sepet yüklenemedi.');
      })
    });
  }

  submit() {
    if (this.form.invalid || !this.cart() || this.submitting()) return;

    const userId = this.authService.getCurrentUser()?.id;
    const cart = this.cart()!;

    const request: CreateOrderRequest = {
      userId: userId,
      address: this.form.value.address.trim(),
      items: cart.items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }))
    };

    this.submitting.set(true);
    this.error.set(null);

    this.orderService.create(request).subscribe({
      next: (order) => this.ngZone.run(() => {
        this.cartService.clearCart().subscribe();
        this.router.navigate(['/order-confirmation', order.id]);
      }),
      error: (err) => this.ngZone.run(() => {
        const msg = err?.error?.message || 'Siparis oluşturlmadı. Lütden tekrar deneyin.';
        this.error.set(msg);
        this.submitting.set(false);
      })
    });
  }
}
