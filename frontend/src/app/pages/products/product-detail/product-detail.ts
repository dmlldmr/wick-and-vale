import {signal, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {Product} from '../../../core/models/product.model';
import {ProductService} from '../../../core/services/product';
import {CartService} from '../../../core/services/cart';
import {Auth} from '../../../core/services/auth';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.html',
  styleUrls: ['./product-detail.scss']
})
export class ProductDetail implements OnInit {
  product = signal<Product | null>(null);
  loading = signal(true);
  error = signal(false);
  quantity = signal(1);
  adding = signal(false);
  added = signal(false);

  readonly collectionLabels: Record<string, string> = {
    BODUL: 'Bodul Mum',
    SUTUN: 'Sütun Mum',
    KUTU: 'Kutu Mum'
  };

  readonly variantLabels: Record<string, string> = {
    SADE: 'Sade',
    DESENLI: 'Desenli',
    INCE: 'İnce',
    KALIN: 'Kalın',
    KAGIT: 'Kağıt Kutulu',
    TENEKE: 'Teneke Kutulu'
  };

  readonly themeLabels: Record<string, string> = {
    SOFT: 'Soft',
    OLD: 'Old',
    VINTAGE: 'Vintage'
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: Auth
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productService.getById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.loading.set(false);
      }
    });
  }

  changeQuantity(delta: number) {
    const next = this.quantity() + delta;
    const max = this.product()?.stock ?? 1;
    if (next >= 1 && next <= max) {
      this.quantity.set(next);
    }
  }

  addToCart() {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    const p = this.product();
    if (!p || this.adding()) return;

    this.adding.set(true);
    this.cartService.addItem(p.id, this.quantity()).subscribe({
      next: () => {
        this.adding.set(false);
        this.added.set(true);
        setTimeout(() => this.added.set(false), 2000);
      },
      error: () => {
        this.adding.set(false);
      }
    });
  }

  collectionLabel(type: string): string { return this.collectionLabels[type] ?? type; }
  variantLabel(type: string): string { return this.variantLabels[type] ?? type; }
  themeLabel(type: string): string { return this.themeLabels[type] ?? type; }

  get inStock(): boolean { return (this.product()?.stock ?? 0) > 0; }
}
