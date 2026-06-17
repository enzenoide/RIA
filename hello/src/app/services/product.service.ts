import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../product.model';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/produtos';

  private productsSignal = signal<Product[]>([]);
  products = this.productsSignal.asReadonly();

  // 1. LISTAR
  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl).pipe(
      tap((produtosVindosDoBanco) => this.productsSignal.set(produtosVindosDoBanco))
    );
  }

  // 2. DETALHAR (Por ID)
  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`);
  }

  // 3. INSERIR
  create(product: Product): Observable<Product> {
    return this.http.post<Product>(this.apiUrl, product).pipe(
      tap((newProduct) => this.productsSignal.update((list) => [...list, newProduct]))
    );
  }

  // 4. ATUALIZAR (Por ID)
  update(id: number, product: Product): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/${id}`, product).pipe(
      tap((updatedProduct) => this.productsSignal.update((list) =>
        list.map((item) => (item.id === id ? updatedProduct : item))
      ))
    );
  }

  // 5. REMOVER (Por ID)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.productsSignal.update((list) =>
        list.filter((item) => item.id !== id)
      ))
    );
  }

  clear(): void {
    this.productsSignal.set([]);
  }
}