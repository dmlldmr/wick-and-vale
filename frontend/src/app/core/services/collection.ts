import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Collection, CreateCollectionRequest, UpdateCollectionRequest} from '../models/collection.model';

@Injectable({ providedIn: 'root'})
export class CollectionService {
  private apiUrl = environment.apiUrl + '/collections';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Collection[]> {
    return this.http.get<Collection[]>(this.apiUrl);
  }

  getById(id: number): Observable<Collection> {
    return this.http.get<Collection>(`${this.apiUrl}/${id}`);
  }

  create(req: CreateCollectionRequest): Observable<Collection> {
    return this.http.post<Collection>(this.apiUrl, req);
  }

  update(id: number, req: UpdateCollectionRequest): Observable<Collection> {
    return this.http.put<Collection>(`${this.apiUrl}/${id}`, req);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
