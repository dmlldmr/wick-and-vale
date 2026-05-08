import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  CreateProductRequest,
  PageResponse,
  Product,
  UpdateProductRequest
} from '../models/product.model';

@Injectable({ providedIn: 'root'})
export class ProductService {
  private apiUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) {}

  getAll(page: number = 0, size: number = 20): Observable<PageResponse<Product>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Product>>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}${id}`);
  }

  create(data: CreateProductRequest): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, data);
  }

  update(id: number, data: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}${id}`);
  }


}
