import {Component, NgZone, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {OrderService} from '../../../core/services/order';
import {Order} from '../../../core/models/order.model';
import {Store} from '@ngxs/store';
import {ToastrAction} from '../../../core/state/actions/toastr.actions';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);
  cancelling = signal(false);
  showCancelConfirm = signal(false);

  cancelRequest(): void {
    this.showCancelConfirm.set(true);
  }

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
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private ngZone: NgZone,
    private store: Store
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getById(id).subscribe({
      next: (order) => this.ngZone.run(() => {
        this.order.set(order);
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set('Sipariş bulunamadı.');
        this.loading.set(false);
      })
    });
  }

  cancelConfirm(): void {
    const id = this.order()?.id;
    if (!id) return;
    this.showCancelConfirm.set(false);
    this.cancelling.set(true);
    this.orderService.cancel(id).subscribe({
      next: () => this.ngZone.run(() => {
        this.order.update(o => o ? { ...o, orderStatus: 'CANCELLED', paymentStatus: 'FAILED' } : o);
        this.cancelling.set(false);
        this.store.dispatch(new ToastrAction({ type: 'success', message: 'Siparişiniz iptal edildi.', delay: 3000 }));
      }),
      error: () => this.ngZone.run(() => {
        this.cancelling.set(false);
        this.store.dispatch(new ToastrAction({ type: 'danger', message: 'İptal işlemi başarısız oldu.', delay: 3000 }));
      })
    });
  }

  cancelDismiss(): void {
    this.showCancelConfirm.set(false);
  }

  get canCancel(): boolean {
    return this.order()?.orderStatus === 'PENDING';
  }
}
