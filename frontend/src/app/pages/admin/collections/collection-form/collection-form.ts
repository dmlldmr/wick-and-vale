import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CollectionService } from '../../../../core/services/collection';
import { CreateCollectionRequest, UpdateCollectionRequest } from '../../../../core/models/collection.model';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './collection-form.html',
  styleUrls: ['./collection-form.scss']
})
export class CollectionForm implements OnInit {
  isEditMode = false;
  collectionId: number | null = null;
  loading = false;
  error = '';
  success = '';

  collectionType = 'BODUL';
  description = '';
  coverImagePreview: string | null = null;
  selectedFile: File | null = null;  // 🔥 Base64 yerine File
  private isImageChanged = false;

  collectionTypes = [
    { value: 'BODUL', label: 'Bodul (Şişe Mum)' },
    { value: 'SUTUN', label: 'Sütun (Klasik Mum)' },
    { value: 'KUTU', label: 'Kutu (Hediye Kutusu)' }
  ];

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.collectionId = +id;
      this.loadCollection();
    }
  }

  private loadCollection(): void {
    this.loading = true;
    this.collectionService.getById(this.collectionId!).subscribe({
      next: (collection) => {
        this.collectionType = collection.collectionType;
        this.description = collection.description || '';
        this.coverImagePreview = collection.coverImage || null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.error = 'Koleksiyon yüklenemedi.';
        this.loading = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) return;

    // Validasyonlar
    if (!file.type.startsWith('image/')) {
      this.error = 'Lütfen geçerli bir resim dosyası seçin.';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      this.error = 'Resim boyutu 2MB\'dan küçük olmalıdır.';
      return;
    }

    this.error = '';
    this.isImageChanged = true;
    this.selectedFile = file;  // 🔥 File'ı direkt kaydet

    // Sadece önizleme için Base64'e çevir
    const reader = new FileReader();
    reader.onload = (e) => {
      this.coverImagePreview = e.target?.result as string;
      this.cdr.detectChanges();
    };
    reader.onerror = () => {
      this.error = 'Resim okunamadı, lütfen tekrar deneyin.';
    };
    reader.readAsDataURL(file);
  }

  removeImage(): void {
    this.coverImagePreview = null;
    this.selectedFile = null;
    this.isImageChanged = true;

    // File input'u temizle
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  onSubmit(): void {
    // Validasyonlar
    if (!this.collectionType) {
      this.error = 'Lütfen koleksiyon tipini seçin.';
      return;
    }

    if (!this.isEditMode && !this.selectedFile) {
      this.error = 'Lütfen bir kapak görseli yükleyin.';
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = '';

    if (this.isEditMode) {
      this.updateCollection();
    } else {
      this.createCollection();
    }
  }

  private createCollection(): void {
    // 🔥 Sadece collectionType ve description gönder (coverImage yok)
    const request: CreateCollectionRequest = {
      collectionType: this.collectionType
    };

    if (this.description) {
      request.description = this.description;
    }

    // 🔥 File ile birlikte gönder
    this.collectionService.create(request, this.selectedFile!).subscribe({
      next: () => {
        this.success = 'Koleksiyon başarıyla oluşturuldu!';
        setTimeout(() => {
          this.router.navigate(['/admin/collections']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Koleksiyon oluşturulurken bir hata oluştu.';
        this.loading = false;
      }
    });
  }

  private updateCollection(): void {
    // 🔥 Sadece collectionType ve description gönder (coverImage yok)
    const request: UpdateCollectionRequest = {
      collectionType: this.collectionType
    };

    if (this.description) {
      request.description = this.description;
    }

    // 🔥 File varsa gönder, yoksa undefined
    this.collectionService.update(
      this.collectionId!,
      request,
      this.isImageChanged ? this.selectedFile || undefined : undefined
    ).subscribe({
      next: () => {
        this.success = 'Koleksiyon başarıyla güncellendi!';
        setTimeout(() => {
          this.router.navigate(['/admin/collections']);
        }, 1500);
      },
      error: (err) => {
        this.error = err.error?.message || 'Koleksiyon güncellenirken bir hata oluştu.';
        this.loading = false;
      }
    });
  }
}
