import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product';
import { Product } from '../../../core/models/product.model';
import { ThemeService } from '../../../core/services/theme';
import { CollectionService } from '../../../core/services/collection';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  recentProducts: Product[] = [];
  loading = true;

  private themes: any[] = [];
  private collections: any[] = [];

  constructor(
    private productService: ProductService,
    private themeService: ThemeService,
    private collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    Promise.all([
      this.themeService.getAll().toPromise(),
      this.collectionService.getAll().toPromise(),
      this.productService.getAll(0, 5).toPromise()
    ]).then(([themes, collections, products]) => {
      this.themes = themes || [];
      this.collections = collections || [];
      this.recentProducts = products?.content || [];
      this.loading = false;
    }).catch(error => {
      console.error('Veri yüklenirken hata:', error);
      this.loading = false;
    });
  }

  getThemeLabel(themeId: number): string {
    const theme = this.themes.find(t => t.id === themeId);
    if (!theme) return 'Bilinmeyen Tema';

    const labels: Record<string, string> = {
      SOFT: 'Soft',
      OLD: 'Old',
      VINTAGE: 'Vintage'
    };
    return labels[theme.themeType] || theme.themeType;
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
        return `${collectionLabels[collection.collectionType]} - ${variantLabels[variant.variantType]}`;
      }
    }
    return 'Bilinmeyen';
  }
}
