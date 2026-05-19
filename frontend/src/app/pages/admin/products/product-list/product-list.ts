import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {Product} from '../../../../core/models/product.model';
import {ProductService} from '../../../../core/services/product';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-list.html',
  styleUrls: ['./product-list.scss']
})
export class ProductList implements OnInit {
  products: Product[] = [];
  loading = true;
  searchTerm = '';
  error = '';

  currentPage = 0;
  pageSize = 10;
  totalPages = 0;
  totalElements = 0;

  constructor(
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';
    console.log('1 - loadProducts çağrıldı');

    this.productService.getAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        this.products = [...response.content];
        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ürünler yüklenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }


  onSearch(): void {
    if (this.searchTerm.trim()) {
      this.loading = true;
      this.productService.getAll(this.currentPage, this.pageSize).subscribe({
        next: (response) => {
          this.products = [...response.content.filter(p =>
            p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
          )];
          this.loading = false;
          this.cdr.detectChanges();
        }
      });
    } else {
      this.loadProducts();
    }
  }

  changePage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadProducts();
    }
  }

  editProduct(id: number) {
    this.router.navigate(['/admin/products/edit', id]);
  }

  // 🔥 Yeni metodlar - Doğrudan product'tan gelen değerleri label'a çevir
  getCollectionLabel(collectionType: string): string {
    const labels: Record<string, string> = {
      BODUL: 'Bodul Mum',
      SUTUN: 'Sütun Mum',
      KUTU: 'Kutu Mum'
    };
    return labels[collectionType] || collectionType;
  }

  getVariantLabel(variantType: string): string {
    const labels: Record<string, string> = {
      SADE: 'Sade',
      DESENLI: 'Desenli',
      INCE: 'İnce',
      KALIN: 'Kalın',
      KAGIT: 'Kağıt',
      TENEKE: 'Teneke'
    };
    return labels[variantType] || variantType;
  }

  getThemeLabel(themeType: string): string {
    const labels: Record<string, string> = {
      SOFT: 'Soft',
      OLD: 'Old',
      VINTAGE: 'Vintage'
    };
    return labels[themeType] || themeType;
  }

  deleteProduct(id: number): void {
    if (confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      this.productService.delete(id).subscribe({
        next: () => {
          this.loadProducts();
        },
        error: (err) => {
          console.error('Ürün silinemedi:', err);
          alert('Ürün silinirken bir hata oluştu.');
        }
      });
    }
  }
}
