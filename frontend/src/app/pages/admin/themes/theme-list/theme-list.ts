import { Component, NgZone, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Theme, ThemeService } from '../../../../core/services/theme';

@Component({
  selector: 'app-theme-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './theme-list.html',
  styleUrl: './theme-list.scss'
})
export class ThemeList implements OnInit {
  themes = signal<Theme[]>([]);
  loading = signal(true);
  error = signal('');
  imageError = signal('');

  showCreateForm = false;
  createType = '';
  createDesc = '';
  createImageFile: File | null = null;
  createImageName = signal('');
  createImagePreview = signal<string | null>(null);
  creating = false;

  editingId: number | null = null;
  editType = '';
  editDesc = '';
  editImageFile: File | null = null;
  editImagePreview = signal<string | null>(null);
  saving = false;

  confirmDeleteId: number | null = null;

  private readonly allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/avif'];

  constructor(private themeService: ThemeService, private ngZone: NgZone) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.loading.set(true);
    this.themeService.getAll().subscribe({
      next: (data) => this.ngZone.run(() => {
        this.themes.set(data);
        this.loading.set(false);
      }),
      error: () => this.ngZone.run(() => {
        this.error.set('Temalar yüklenemedi.');
        this.loading.set(false);
      })
    });
  }

  onCreateImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.type && !this.allowedTypes.includes(file.type)) {
      this.imageError.set('Desteklenen formatlar: JPG, PNG, WebP, AVIF');
      return;
    }
    this.imageError.set('');
    this.createImageFile = file;
    this.createImageName.set(file.name);
    const reader = new FileReader();
    reader.onload = (e) => this.ngZone.run(() => {
      this.createImagePreview.set(e.target?.result as string);
    });
    reader.readAsDataURL(file);
  }

  create(): void {
    if (!this.createType.trim() || this.creating) return;
    this.creating = true;
    this.themeService.create({ themeType: this.createType.trim(), description: this.createDesc }).subscribe({
      next: (theme) => {
        if (this.createImageFile) {
          this.themeService.uploadImage(theme.id, this.createImageFile).subscribe({
            next: () => this.ngZone.run(() => this.resetCreateForm()),
            error: () => this.ngZone.run(() => {
              this.creating = false;
              this.imageError.set('Görsel yüklenemedi. Tema oluşturuldu, görseli düzenle bölümünden ekleyebilirsin.');
              this.load();
            })
          });
        } else {
          this.ngZone.run(() => this.resetCreateForm());
        }
      },
      error: () => this.ngZone.run(() => { this.creating = false; })
    });
  }

  private resetCreateForm(): void {
    this.creating = false;
    this.showCreateForm = false;
    this.createType = '';
    this.createDesc = '';
    this.createImageFile = null;
    this.createImageName.set('');
    this.createImagePreview.set(null);
    this.load();
  }

  isTypeTakenByOther(type: string, currentThemeId: number): boolean {
    return this.themes().some(t => t.id !== currentThemeId && t.themeType === type);
  }

  startEdit(theme: Theme): void {
    this.editingId = theme.id;
    this.editType = theme.themeType;
    this.editDesc = theme.description ?? '';
    this.editImagePreview.set(theme.coverImage ?? null);
    this.editImageFile = null;
    this.imageError.set('');
    setTimeout(() => {
      const el = document.getElementById('edit-form');
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 32;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    }, 0);
  }

  cancelEdit(): void {
    this.editingId = null;
    this.editType = '';
    this.editDesc = '';
    this.editImageFile = null;
    this.editImagePreview.set(null);
  }

  onEditImageSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (file.type && !this.allowedTypes.includes(file.type)) {
      this.imageError.set('Desteklenen formatlar: JPG, PNG, WebP, AVIF');
      return;
    }
    this.imageError.set('');
    this.editImageFile = file;
    const reader = new FileReader();
    reader.onload = (e) => this.ngZone.run(() => {
      this.editImagePreview.set(e.target?.result as string);
    });
    reader.readAsDataURL(file);
  }

  saveEdit(id: number): void {
    if (this.saving) return;
    this.saving = true;

    this.themeService.update(id, { themeType: this.editType, description: this.editDesc }).subscribe({
      next: (updated) => {
        if (this.editImageFile) {
          this.themeService.uploadImage(id, this.editImageFile).subscribe({
            next: (withImage) => this.ngZone.run(() => {
              this.themes.update(list => list.map(t => t.id === id ? withImage : t));
              this.saving = false;
              this.editingId = null;
              this.editImageFile = null;
              this.editImagePreview.set(null);
            }),
            error: () => this.ngZone.run(() => { this.saving = false; })
          });
        } else {
          this.ngZone.run(() => {
            this.themes.update(list => list.map(t => t.id === id ? updated : t));
            this.saving = false;
            this.editingId = null;
            this.editImageFile = null;
            this.editImagePreview.set(null);
          });
        }
      },
      error: () => this.ngZone.run(() => { this.saving = false; })
    });
  }

  requestDelete(id: number): void { this.confirmDeleteId = id; }
  cancelDelete(): void { this.confirmDeleteId = null; }

  delete(id: number): void {
    this.confirmDeleteId = null;
    this.themeService.delete(id).subscribe({
      next: () => this.ngZone.run(() => this.load()),
      error: () => {}
    });
  }
}