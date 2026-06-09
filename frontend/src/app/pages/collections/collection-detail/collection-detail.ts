import {Component, NgZone, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {Collection} from '../../../core/models/collection.model';
import {Product} from '../../../core/models/product.model';
import { CollectionService } from '../../../core/services/collection';
import {ProductService} from '../../../core/services/product';

@Component({
  selector: 'app-collection-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-detail.html',
  styleUrl: './collection-detail.scss'
})
export class CollectionDetail implements OnInit {
  collection = signal<Collection | null>(null);
  products = signal<Product[]>([]);
  loading = signal(true);
  error = signal(false);

  page = 0;
  totalPages = 0;
  totalElements = 0;
  readonly pageSize = 12;

  readonly collectionLabels: Record<string, string> = {
    BODUL: 'Bodul Mum', SUTUN: 'Sütun Mum', KUTU: 'Kutu Mum'
  };
  readonly variantLabels: Record<string, string> = {
    SADE: 'Sade', DESENLI: 'Desenli', INCE: 'İnce',
    KALIN: 'Kalın', KAGIT: 'Kağıt Kutulu', TENEKE: 'Teneke Kutulu'
  };

  constructor(
    private route: ActivatedRoute,
    private collectionService: CollectionService,
    private productService: ProductService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.collectionService.getById(id).subscribe({
      next: (col) => this.ngZone.run(() => {
        this.collection.set(col);
        this.loadProducts(col.collectionType);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set(true);
        this.loading.set(false);
      })
    });
  }

  loadProducts(collectionType: string): void {
    this.loading.set(true);
    this.productService.getByCollection(collectionType, this.page, this.pageSize).subscribe({
      next: (res) => this.ngZone.run(() => {
        this.products.set(res.content);
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set(true);
        this.loading.set(false);
      })
    });
  }

  goToPage(p: number): void {
    this.page = p;
    const col = this.collection();
    if (col) this.loadProducts(col.collectionType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  collectionLabel(type: string): string { return this.collectionLabels[type] ?? type; }
  variantLabel(type: string): string { return this.variantLabels[type] ?? type; }
}
