import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {Navbar} from '../../shared/components/navbar/navbar';
import {Product} from '../../core/models/product.model';
import {ProductService} from '../../core/services/product';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  products: Product[] = [];
  loading = true;
  error = '';

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getAll().subscribe({
      next: (page) => { this.products = page.content; this.loading = false; },
      error: () => { this.error = 'Ürünler yüklenirken bir hata oluştu.'; this.loading = false; }
    });
  }

  getCollectionLabel(type: string): string {
    const labels: Record<string, string> = { BODUL: 'Bodul', SUTUN: 'Sütun', KUTU: 'Kutu' };
    return labels[type] || type;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('tr-TR', { minimumFractionDigits: 2}) + ' ₺';
  }
}
