import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models/product.model';
import { CollectionService } from '../../core/services/collection';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  products: Product[] = [];
  loading = true;
  private collections: any[] = [];

  constructor(
    private productService: ProductService,
    private collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  private loadProducts(): void {
    Promise.all([
      this.collectionService.getAll().toPromise(),
      this.productService.getAll(0, 12).toPromise()
    ]).then(([collections, products]) => {
      this.collections = collections || [];
      this.products = products?.content || [];
      this.loading = false;
    }).catch(error => {
      console.error('Ürünler yüklenirken hata:', error);
      this.loading = false;
    });
  }

  getCollectionAndVariantLabel(variantId: number): string {
    for (const collection of this.collections) {
      const variant = collection.variants?.find((v: any) => v.id === variantId);
      if (variant) {
        const collectionLabels: Record<string, string> = {
          BODUL: 'Bodul',
          SUTUN: 'Sütun',
          KUTU: 'Kutu'
        };
        const variantLabels: Record<string, string> = {
          SADE: 'Sade',
          DESENLI: 'Desenli',
          INCE: 'İnce',
          KALIN: 'Kalın',
          KAGIT: 'Kağıt',
          TENEKE: 'Teneke'
        };
        return `${collectionLabels[collection.collectionType]} / ${variantLabels[variant.variantType]}`;
      }
    }
    return 'Mum';
  }
}
