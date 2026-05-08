import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CreateProductRequest, UpdateProductRequest } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product';
import { ThemeService, Theme } from '../../../../core/services/theme';
import { CollectionService } from '../../../../core/services/collection';

interface VariantOption {
  id: number;
  label: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrl: './product-form.scss'
})
export class ProductsForm implements OnInit {
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  loadingOptions = true;
  error = '';

  name = '';
  description = '';
  price: number = 0;
  stock: number = 0;
  imageUrl = '';
  themeId: number | null = null;
  variantId: number | null = null;

  themes: Theme[] = [];
  variantOptions: VariantOption[] = [];

  collectionLabels: Record<string, string> = { BODUL: 'Bodul', SUTUN: 'Sütun', KUTU: 'Kutu' };
  variantLabels: Record<string, string> = {
    SADE: 'Sade', DESENLI: 'Desenli',
    INCE: 'İnce', KALIN: 'Kalın',
    KAGIT: 'Kağıt', TENEKE: 'Teneke'
  };
  themeLabels: Record<string, string> = { SOFT: 'Soft', OLD: 'Old', VINTAGE: 'Vintage' };

  constructor(
    private productService: ProductService,
    private themeService: ThemeService,
    private collectionService: CollectionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    forkJoin({
      themes: this.themeService.getAll(),
      collections: this.collectionService.getAll()
    }).subscribe({
      next: ({ themes, collections }) => {
        this.themes = themes;
        collections.forEach(col => {
          col.variants.forEach((v: any) => {
            this.variantOptions.push({
              id: v.id,
              label: `${this.collectionLabels[col.collectionType] || col.collectionType} — ${this.variantLabels[v.variantType] || v.variantType}`
            });
          });
        });

        if (id) {
          this.isEditMode = true;
          this.productId = +id;
          this.productService.getById(this.productId).subscribe({
            next: (product) => {
              this.name = product.name;
              this.description = product.description || '';
              this.price = product.price;
              this.stock = product.stock;
              this.imageUrl = product.imageUrl || '';
              this.themeId = product.themeId;
              this.variantId = product.variantId;
              this.loadingOptions = false;
              this.cdr.detectChanges();
            },
            error: () => {
              this.error = 'Ürün yüklenemedi.';
              this.loadingOptions = false;
              this.cdr.detectChanges();
            }
          });
        } else {
          this.loadingOptions = false;
          this.cdr.detectChanges();
        }
      },
      error: () => {
        this.error = 'Seçenekler yüklenemedi.';
        this.loadingOptions = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSubmit() {
    if (!this.themeId || !this.variantId) {
      this.error = 'Tema ve varyant seçimi zorunludur.';
      return;
    }

    this.loading = true;
    this.error = '';

    if (this.isEditMode) {
      const req: UpdateProductRequest = {
        name: this.name,
        description: this.description,
        price: this.price,
        stock: this.stock,
        imageUrl: this.imageUrl,
        themeId: this.themeId,
        variantId: this.variantId
      };
      this.productService.update(this.productId!, req).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: () => { this.error = 'Bir hata oluştu, tekrar dene.'; this.loading = false; }
      });
    } else {
      const req: CreateProductRequest = {
        name: this.name,
        description: this.description,
        price: this.price,
        stock: this.stock,
        imageUrl: this.imageUrl,
        themeId: this.themeId,
        variantId: this.variantId
      };
      this.productService.create(req).subscribe({
        next: () => this.router.navigate(['/admin/products']),
        error: (err) => { this.error = err.error?.message || 'Bir hata oluştu, tekrar dene.'; this.loading = false; }
      });
    }
  }
}
