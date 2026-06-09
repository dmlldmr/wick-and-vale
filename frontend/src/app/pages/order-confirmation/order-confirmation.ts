import {Component, NgZone, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {Order} from '../../core/models/order.model';
import {OrderService} from '../../core/services/order';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-confirmation.html',
  styleUrl: './order-confirmation.scss'
})
export class OrderConfirmation implements OnInit {
  order = signal<Order | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getById(id).subscribe({
      next: (order) => this.ngZone.run(() => {
        this.order.set(order);
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set('Sipariş bulunamadı');
        this.loading.set(false);
      })
    });
  }
}


