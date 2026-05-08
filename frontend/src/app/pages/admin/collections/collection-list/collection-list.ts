import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterModule} from '@angular/router';
import {Collection} from '../../../../core/models/collection.model';
import {CollectionService} from '../../../../core/services/collection';

@Component({
  selector: 'app-collection-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './collection-list.html',
  styleUrl: './collection-list.scss'
})
export class CollectionList implements OnInit {
  collections: Collection[] = [];
  loading = true;
  error = '';

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;
    this.collectionService.getAll().subscribe({
      next: (data) => {
        this.collections = data;
        this.loading = false;
        this.cdr.detectChanges();
        },
      error: () => {
        this.error = 'Koleksiyonlar yüklenemedi.';
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  edit(id: number) {
    this.router.navigate(['/admin/collections', id, 'edit']);
  }

  delete(id: number) {
    if(!confirm('Bu koleksiyonu silmek istediğine emin misin?')) return;
    this.collectionService.delete(id).subscribe({
      next: () => this.load(),
      error: () => alert('Koleksiyon silinemedi.')
    });
  }

  getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      BODUL: 'Bodul',
      SUTUN: 'Sütun',
      KUTU: 'Kutu'
    };
    return labels[type] || type;
  }
}

