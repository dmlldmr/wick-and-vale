import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import {CollectionService} from '../../../../core/services/collection';
import {CreateCollectionRequest, UpdateCollectionRequest} from '../../../../core/models/collection.model';

@Component({
  selector: 'app-collection-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './collection-form.html',
  styleUrl: './collection-form.scss'
})
export class CollectionForm implements OnInit {
  isEditMode = false;
  collectionId: number | null = null;
  loading = false;
  error = '';

  collectionType = 'BODUL';
  description = '';
  coverImage = '';

  collectionTypes = [
    {value: 'BODUL', label: 'Bodul'},
    {value: 'SUTUN', label: 'Sütun'},
    {value: 'KUTU', label: 'Kutu'}
  ];

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.collectionId = +id;
      this.collectionService.getById(this.collectionId).subscribe({
        next: (col) => {
          this.collectionType = col.collectionType;
          this.description = col.description || '';
          this.coverImage = col.coverImage || '';
        },
        error: () => this.error = 'Koleksiyon yüklenemedi.'
      });
    }
  }

  onSubmit() {
    this.loading = true;
    this.error = '';

    if (this.isEditMode) {
      const req: UpdateCollectionRequest = {
        description: this.description,
        coverImage: this.coverImage
      };
      this.collectionService.update(this.collectionId!, req).subscribe({
        next: () => this.router.navigate(['/admin/collections']),
        error: (err) => {
          this.error = err.error?.message || 'Bir hata oluştu, tekrar dene.';
          this.loading = false;
        }
      });
    } else {
      const req: CreateCollectionRequest = {
        collectionType: this.collectionType,
        description: this.description,
        coverImage: this.coverImage
      };
      this.collectionService.create(req).subscribe({
        next: () => this.router.navigate(['/admin/collections']),
        error: () => {
          this.error = 'Bir hata oluştu, tekrar dene.';
          this.loading = false;
        }
      });
    }
  }
}



