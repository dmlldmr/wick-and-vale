import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Order} from '../../../../core/models/order.model';
import {OrderService} from '../../../../core/services/order';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.scss'
})
export class OrderList implements OnInit {
  orders: Order[] = [];
  loading = true;
  error = '';
  currentPage = 0;
  totalPages = 0;

  constructor(private orderService: OrderService, private router: Router) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.orderService.getAll(this.currentPage).subscribe({
      next: (page) => {
        this.orders = page.content;
        this.totalPages = page.totalPages;
        this.loading = false;
      },
      error: () => { this.error = 'Siparişler yüklenemedi.'; this.loading = false}
    });
  }

  goToDetail(id: number) {
    this.router.navigate(['/admin/orders', id]);
  }

  prevPage() {
    if (this.currentPage > 0) { this.currentPage--; this.load(); }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.load(); }
  }

  getOrderStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Bekliyor',
      PROCESSING: 'Hazırlanıyor',
      SHIPPED: 'Kargoda',
      DELIVERED: 'Teslim Edildi',
      CANCELLED: 'İptal Edildi'
    };
    return labels[status] || status;
  }

  getPaymentStatusLabel(status: string): string {
    const labels: Record<string, string> = {
      PENDING: 'Bekliyor',
      PAID: 'Ödendi',
      FAILED: 'Başarısız',
      REFUNDED: 'İade Edildi'
    };
    return labels[status] || status;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR', { minimumFractionDigits: 2}) + ' ₺';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleString('tr-TR');
  }
}
