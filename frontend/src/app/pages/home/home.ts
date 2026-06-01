import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product';
import { Product } from '../../core/models/product.model';
import { CollectionService } from '../../core/services/collection';
import {Collection} from '../../core/models/collection.model';
import {forkJoin} from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {
  products: Product[] = [];
  collections: Collection[] = [];
  loading = true;
  error = false;

  private readonly collectionLabels: Record<string, string> = {
    BODUL: 'Bodul Mum',
    SUTUN: 'Sütun Mum',
    KUTU: 'Kutu Mum'
  };

  private readonly variantLabels: Record<string, string> = {
    SADE: 'Sade',
    DESENLI: 'Desenli',
    INCE: 'İnce',
    KALIN: 'Kalın',
    KAGIT: 'Kağıt Kutulu',
    TENEKE: 'Teneke Kutulu'
  };

  constructor(
    private productService: ProductService,
    private collectionService: CollectionService
  ) {}

  ngOnInit(): void {
    forkJoin({
      products: this.productService.getAll(0, 6),
      collections: this.collectionService.getAll()
    }).subscribe({
      next: ({ products, collections }) => {
        this.products = products.content;
        this.collections = collections;
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  collectionLabel(type: string): string {
    return this.collectionLabels[type] ?? type;
  }

  variantLabel(type: string): string {
    return this.variantLabels[type] ?? type;
  }


}
