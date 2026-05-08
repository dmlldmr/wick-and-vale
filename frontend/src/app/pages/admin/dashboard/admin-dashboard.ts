import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Product} from '../../../core/models/product.model';
import {ProductService} from '../../../core/services/product';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboard implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';
  currentPage = 0;
  totalPages = 0;

  constructor(
    private productService: ProductService,
    private router: Router,
    private cdr: ChangeDetectorRef
) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getAll(this.currentPage).subscribe({
      next: (page) => { this.products = page.content; this.totalPages = page.totalPages; this.loading = false; this.cdr.detectChanges();},
      error: () => { this.error = 'Ürünler yükklenemedi.'; this.loading = false; this.cdr.detectChanges(); }
    });
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products', id, 'edit']);
  }

  deleteProduct(id: number) {
    if(!confirm('Bu ürünü silmek istediğine emin misin?')) return;
    this.productService.delete(id).subscribe({
      next: () => this.loadProducts(),
      error: () => alert('Ürün silinemedi.')
    });
  }

  prevPage() {
    if (this.currentPage > 0) { this.currentPage--; this.loadProducts(); }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) { this.currentPage++; this.loadProducts(); }
  }

  getThemeLabel(type: string): string {
    const labels: Record<string, string> = { SOFT: 'Soft', OLD: 'Old', VINTAGE: 'Vintage' };
    return labels[type] || type;
  }

  getCollectionLabel(type: string): string {
    const labels: Record<string, string> = { BODUL: 'Bodul', SUTUN: 'Sütun', KUTU: 'Kutu' };
    return labels[type] || type;
  }

  getVariantLabel(type: string): string {
    const labels: Record<string, string>  = {
      SADE: 'Sade', DESENLI: 'Desenli',
      INCE: 'İnce', KALIN: 'Kalın',
      KAGIT: 'Kağıt', TENEKE: 'Teneke'
    };
    return labels[type] || type;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR', { minimumFractionDigits: 2}) + ' ₺';
  }
}
