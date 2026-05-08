import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Order, UpdateOrderStatusRequest} from '../../../../core/models/order.model';
import {OrderService} from '../../../../core/services/order';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.scss'
})
export class OrderDetail implements OnInit {
  order: Order | null = null;
  loading = true;
  error = '';
  saving = false;
  saveError = '';
  saveSuccess = false;

  statusForm: UpdateOrderStatusRequest = {
    orderStatus: '',
    paymentStatus: '',
    cargoTrackNumber: ''
  };

  orderStatuses = [
    { value: 'PENDING', label: 'Bekliyor' },
    { value: 'PROCESSING', label: 'Hazırlanıyor' },
    { value: 'SHIPPED', label: 'Kargoda' },
    { value: 'DELIVERED', label: 'Teslim Edildi' },
    { value: 'CANCELLED', label: 'İptal Edildi' }
  ];

  paymentStatuses = [
    { value: 'PENDING', label: 'Bekliyor' },
    { value: 'PAID', label: 'Ödendi' },
    { value: 'FAILED', label: 'Başarısız' },
    { value: 'REFUNDED', label: 'İade Edildi' }
  ];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.orderService.getById(+id).subscribe({
        next: (order) => {
          this.order = order;
          this.statusForm = {
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            cargoTrackNumber: order.cargoTrackNumber || ''
          };
          this.loading = false;
        },
        error: () => { this.error = 'Sipariş yüklenemedi.'; this.loading = false; }
      });
    }
  }

  updateStatus() {
    if(!this.order) return;
    this.saving = true;
    this.saveError = '';
    this.saveSuccess = false;

    this.orderService.updateStatus(this.order.id, this.statusForm).subscribe({
      next: (updated) => {
        this.order = updated;
        this.saving = false;
        this.saveSuccess = true;
        setTimeout(() => this.saveSuccess = false, 3000);
      },
      error: () => { this.saveError = 'üncelleme başarısız.'; this.saving = false; }
    });
  }

  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR', { minimumFractionDigits: 2 }) + ' ₺';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('tr-TR');
  }
}
