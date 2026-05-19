import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Collection, CreateCollectionRequest, UpdateCollectionRequest } from '../models/collection.model';

@Injectable({ providedIn: 'root' })
export class CollectionService {
  private apiUrl = environment.apiUrl + '/collections';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.apiUrl);
  }

  getById(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/${id}`);
  }

  /**
   * Yeni koleksiyon oluşturur
   * @param request - CreateCollectionRequest (collectionType, description)
   * @param file - Yüklenecek görsel dosyası
   */
  create(request: CreateCollectionRequest, file: File): Observable<Collection> {
    const formData = new FormData();

    // DTO'yu JSON olarak 'data' key'i ile ekle
    const dataBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('data', dataBlob);

    // Dosyayı 'file' key'i ile ekle
    formData.append('file', file);

    return this.http.post<Collection>(this.apiUrl, formData);
  }

  /**
   * Koleksiyonu günceller
   * @param id - Koleksiyon ID
   * @param request - UpdateCollectionRequest (collectionType, description)
   * @param file - (Opsiyonel) Yeni görsel dosyası
   */
  update(id: number, request: UpdateCollectionRequest, file?: File): Observable<Collection> {
    const formData = new FormData();

    // DTO'yu JSON olarak 'data' key'i ile ekle
    const dataBlob = new Blob([JSON.stringify(request)], { type: 'application/json' });
    formData.append('data', dataBlob);

    // Dosya varsa ekle
    if (file) {
      formData.append('file', file);
    }

    return this.http.put<Collection>(`${this.apiUrl}/${id}`, formData);
  }

  /**
   * Koleksiyonu siler
   * @param id - Koleksiyon ID
   */
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
