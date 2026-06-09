import {Component, NgZone, OnInit, signal} from '@angular/core';
import {AsyncPipe, CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Observable} from 'rxjs';
import {WishlistItem} from '../../core/models/wishlist.model';
import {WishlistService} from '../../core/services/wishlist';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wishlist.html',
  styleUrls: ['./wishlist.scss']
})
export class WishlistPage implements OnInit {
  items = signal<WishlistItem[]>([]);
  loading = signal(true);
  removingIds = signal<Set<number>>(new Set());

  readonly collectionLabels: Record<string, string> = {
    BODUL: 'Bodul Mum', SUTUN: 'Sütun Mum', KUTU: 'Kutu Mum'
  };
  readonly variantLabels: Record<string, string> = {
    SADE: 'Sade', DESENLI: 'Desenli', INCE: 'İnce',
    KALIN: 'Kalın', KAGIT: 'Kağıt Kutulu', TENEKE: 'Teneke Kutulu'
  };

  constructor(
    private wishlistService: WishlistService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.wishlistService.getAll().subscribe({
      next: (data) => this.ngZone.run(() => {
        this.items.set(data);
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => this.loading.set(false))
    });
  }

  remove(productId: number): void {
    this.removingIds.update(s => new Set([...s, productId]));
    this.wishlistService.remove(productId).subscribe({
      next: () => this.ngZone.run(() => {
        this.items.update(list => list.filter(i => i.productId !== productId));
        this.removingIds.update(s => { const n = new Set(s); n.delete(productId); return n; });
      }),
      error: () => this.ngZone.run(() => {
        this.removingIds.update(s => { const n = new Set(s); n.delete(productId); return n; });
      })
    });
  }

  collectionLabel(type: string): string { return this.collectionLabels[type] ?? type; }
  variantLabel(type: string): string { return this.variantLabels[type] ?? type; }
}
