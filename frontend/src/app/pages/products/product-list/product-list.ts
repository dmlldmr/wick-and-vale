import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {Product} from '../../../core/models/product.model';
import {Collection} from '../../../core/models/collection.model';
import {ProductService} from '../../../core/services/product';
import {CollectionService} from '../../../core/services/collection';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  collections: Collection[] = [];

  selectedCollection: string | null = null;
  selectedTheme: string | null = null;
  searchQuery = '';

  page = 0;
  totalPages = 0;
  totalElements = 0;
  readonly pageSize = 12;

  loading = true;
  error = false;

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

  readonly themes = ['SOFT', 'OLD', 'VINTAGE'];
  readonly collectionTypes = ['BODUL', 'SUTUN', 'KUTU'];

  constructor(
    private productService: ProductService,
    private collectionService: CollectionService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.collectionService.getAll().subscribe({
      next: (cols) => (this.collections = cols),
      error: () => {}
    });

    const params = this.route.snapshot.queryParams;
    this.selectedCollection = params['collection'] ?? null;
    this.selectedTheme = params['theme'] ?? null;
    this.searchQuery = params['q'] ?? '';

    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = false;

    let req$;

    if (this.searchQuery) {
      req$ = this.productService.search(this.searchQuery, this.page, this.pageSize);
    } else if (this.selectedTheme && this.selectedCollection) {
      req$ = this.productService.getByThemeAndCollection(this.selectedTheme, this.selectedCollection, this.page, this.pageSize);
    } else if (this.selectedCollection) {
      req$ = this.productService.getByCollection(this.selectedCollection, this.page, this.pageSize);
    } else if (this.selectedTheme) {
      req$ = this.productService.getByTheme(this.selectedTheme, this.page, this.pageSize);
    } else {
      req$ = this.productService.getAll(this.page, this.pageSize);
    }

    req$.subscribe({
      next: (res) => {
        this.products = res.content;
        this.totalPages = res.totalPages;
        this.totalElements = res.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  updateUrl(): void {
    this.router.navigate([], {
      queryParams: {
        collection: this.selectedCollection,
        theme: this.selectedTheme,
        q: this.searchQuery || null
      },
      replaceUrl: true
    });
  }

  selectCollection(type: string): void {
    this.selectedCollection = this.selectedCollection === type ? null : type;
    this.page = 0;
    this.updateUrl();
    this.loadProducts();
  }

  selectTheme(type: string): void {
    this.selectedTheme = this.selectedTheme === type ? null : type;
    this.page = 0;
    this.updateUrl();
    this.loadProducts();
  }

  onSearch(): void {
    this.selectedCollection = null;
    this.selectedTheme = null;
    this.page = 0;
    this.updateUrl();
    this.loadProducts();
  }

  clearFilters(): void {
    this.selectedCollection = null;
    this.selectedTheme = null;
    this.searchQuery = '';
    this.page = 0;
    this.updateUrl();
    this.loadProducts();
  }

  goToPage(p: number): void {
    this.page = p;
    this.loadProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  collectionLabel(type: string): string {
    return this.collectionLabels[type] ?? type;
  }

  variantLabel(type: string): string {
    return this.variantLabels[type] ?? type;
  }

  themeLabel(type: string): string {
    return this.themeLabels[type] ?? type;
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

  get hasActiveFilter(): boolean {
    return !!(this.selectedCollection || this.selectedTheme || this.searchQuery);
  }
}
