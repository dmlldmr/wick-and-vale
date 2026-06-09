import {Component, NgZone, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Order} from '../../../core/models/order.model';
import {OrderService} from '../../../core/services/order';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.html',
  styleUrl: './orders.scss'
})
export class Orders implements OnInit {
  orders = signal<Order[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  readonly statusLabels: Record<string, string> = {
    PENDING: 'Beklemede',
    PROCESSING: 'Hazırlanıyor',
    SHIPPED: 'Kargoya Verildi',
    DELIVERED: 'Teslim Edildi',
    CANCELLED: 'İptal Edildi'
  };

  readonly paymentLabels: Record<string, string> = {
    PENDING: 'Ödeme Bekleniyor',
    PAID: 'Ödendi',
    FAILED: 'Ödeme Başarısız'
  };

  constructor(
    private orderService: OrderService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.orderService.getMyOrders().subscribe({
      next: (page) => this.ngZone.run(() => {
        this.orders.set(page.content);
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set('Siparişler yüklenemedi.');
        this.loading.set(false);
      })
    });
  }

}
