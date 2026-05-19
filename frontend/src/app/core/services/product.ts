import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateProductRequest,
  PageResponse,
  Product,
  UpdateProductRequest
} from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 20): Observable<PageResponse<Product>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size);
    return this.http.get<PageResponse<Product>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  /**
   * Yeni ürün oluşturur
   * @param request - CreateProductRequest (name, description, price, stock, themeId, variantId)
   * @param image - Yüklenecek görsel dosyası (opsiyonel)
   */
  create(request: CreateProductRequest, image?: File): Observable<Product> {
    const formData = new FormData();

    // DTO'yu JSON olarak 'data' key'i ile ekle
    const dataBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('data', dataBlob);

    // Dosya varsa ekle
    if (image) {
      formData.append('image', image);
    }

    return this.http.post<Product>(this.apiUrl, formData);
  }

  /**
   * Ürünü günceller
   * @param id - Ürün ID
   * @param request - UpdateProductRequest
   * @param image - (Opsiyonel) Yeni görsel dosyası
   */
  update(id: number, request: UpdateProductRequest, image?: File): Observable<Product> {
    const formData = new FormData();

    // DTO'yu JSON olarak 'data' key'i ile ekle
    const dataBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('data', dataBlob);

    // Dosya varsa ekle
    if (image) {
      formData.append('image', image);
    }

    return this.http.put<Product>(`${this.apiUrl}/${id}`, formData);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
