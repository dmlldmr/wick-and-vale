import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { CreateProductRequest, UpdateProductRequest } from '../../../../core/models/product.model';
import { ProductService } from '../../../../core/services/product';
import { ThemeService } from '../../../../core/services/theme';
import { CollectionService } from '../../../../core/services/collection';
import { Collection, VariantInfo } from '../../../../core/models/collection.model';

interface VariantOption {
  id: number;
  label: string;
  collectionType: string;
  variantType: string;
}

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductsForm implements OnInit {
  isEditMode = false;
  productId: number | null = null;
  loading = false;
  loadingOptions = true;
  error = '';
  success = '';

  // Form fields
  name = '';
  description = '';
  price: number | null = null;
  stock: number | null = null;
  themeId: number | null = null;
  variantId: number | null = null;

  // Image handling
  imagePreview: string | null = null;
  selectedFile: File | null = null;  // 🔥 Base64 yerine File
  private isImageChanged = false;

  // Data
  themes: any[] = [];
  variantOptions: VariantOption[] = [];

  // Labels for display
  collectionLabels: Record<string, string> = {
    BODUL: 'Bodul (Şişe Mum)',
    SUTUN: 'Sütun (Klasik Mum)',
    KUTU: 'Kutu (Hediye Kutusu)'
  };

  variantLabels: Record<string, string> = {
    SADE: 'Sade',
    DESENLI: 'Desenli',
    INCE: 'İnce',
    KALIN: 'Kalın',
    KAGIT: 'Kağıt',
    TENEKE: 'Teneke'
  };

  themeLabels: Record<string, string> = {
    SOFT: 'Soft (Yumuşak)',
    OLD: 'Old (Eski Tarz)',
    VINTAGE: 'Vintage (Antika)'
  };

  constructor(
    private productService: ProductService,
    private themeService: ThemeService,
    private collectionService: CollectionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    forkJoin({
      themes: this.themeService.getAll(),
      collections: this.collectionService.getAll()
    }).subscribe({
      next: ({ themes, collections }) => {
        this.themes = themes;
        this.buildVariantOptions(collections);

        if (id) {
          this.isEditMode = true;
          this.productId = +id;
          this.loadProductData();
        } else {
          this.loadingOptions = false;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        this.error = 'Seçenekler yüklenemedi: ' + (err.error?.message || 'Bilinmeyen hata');
        this.loadingOptions = false;
        this.cdr.detectChanges();
      }
    });
  }

  private buildVariantOptions(collections: Collection[]): void {
    this.variantOptions = [];

    collections.forEach(collection => {
      if (collection.variants && collection.variants.length > 0) {
        collection.variants.forEach((variant: VariantInfo) => {
          this.variantOptions.push({
            id: variant.id,
            label: `${this.collectionLabels[collection.collectionType] || collection.collectionType} — ${this.variantLabels[variant.variantType] || variant.variantType}`,
            collectionType: collection.collectionType,
            variantType: variant.variantType
          });
        });
      }
    });

    if (this.variantOptions.length === 0) {
      console.warn('Hiç varyant bulunamadı! Koleksiyonlara varyant ekleyin.');
    }
  }

  private loadProductData(): void {
    this.productService.getById(this.productId!).subscribe({
      next: (product) => {
        this.name = product.name;
        this.description = product.description || '';
        this.price = product.price;
        this.stock = product.stock;
        this.themeId = product.themeId;
        this.variantId = product.variantId;
        this.imagePreview = product.imageUrl || null;
        this.loadingOptions = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Ürün yüklenemedi: ' + (err.error?.message || 'Bilinmeyen hata');
        this.loadingOptions = false;
        this.cdr.detectChanges();
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validations
    if (!file.type.startsWith('image/')) {
      this.error = 'Lütfen geçerli bir resim dosyası seçin (JPEG, PNG, GIF).';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.error = 'Resim boyutu 2MB\'dan küçük olmalıdır.';
      return;
    }

    this.error = '';
    this.isImageChanged = true;
    this.selectedFile = file;

    // Sadece önizleme için Base64'e çevir
    const reader = new FileReader();
    reader.onload = (e) => {
      this.imagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.onerror = () => {
      this.error = 'Resim okunamadı, lütfen tekrar deneyin.';
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.imagePreview = null;
    this.selectedFile = null;
    this.isImageChanged = true;

    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    // Validations
    if (!this.name?.trim()) {
      this.error = 'Ürün adı zorunludur.';
      return;
    }

    if (!this.price || this.price <= 0) {
      this.error = 'Geçerli bir fiyat giriniz.';
      return;
    }

    if (this.stock === null || this.stock === undefined || this.stock < 0) {
      this.error = 'Geçerli bir stok adedi giriniz.';
      return;
    }

    if (!this.themeId) {
      this.error = 'Lütfen bir tema seçin.';
      return;
    }

    if (!this.variantId) {
      this.error = 'Lütfen bir koleksiyon/varyant seçin.';
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      this.error = 'Lütfen bir ürün görseli yükleyin.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.isEditMode) {
      this.updateProduct();
    } else {
      this.createProduct();
    }
  }

  private createProduct(): void {
    const request: CreateProductRequest = {
      name: this.name.trim(),
      price: this.price!,
      stock: this.stock!,
      themeId: this.themeId!,
      variantId: this.variantId!
    };

    if (this.description?.trim()) {
      request.description = this.description.trim();
    }

    this.productService.create(request, this.selectedFile!).subscribe({
      next: () => {
        this.success = 'Ürün başarıyla oluşturuldu!';
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Ürün oluşturulurken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  private updateProduct(): void {
    const request: UpdateProductRequest = {
      name: this.name.trim(),
      description: this.description.trim() || undefined,
      price: this.price!,
      stock: this.stock!,
      themeId: this.themeId!,
      variantId: this.variantId!
    };

    this.productService.update(
      this.productId!,
      request,
      this.isImageChanged ? this.selectedFile || undefined : undefined
    ).subscribe({
      next: () => {
        this.success = 'Ürün başarıyla güncellendi!';
        setTimeout(() => {
          this.router.navigate(['/admin/products']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Ürün güncellenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  getThemeLabel(themeType: string): string {
    return this.themeLabels[themeType] || themeType;
  }
}
