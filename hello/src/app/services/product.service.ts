import { Injectable, signal } from '@angular/core';
import { Product } from '../product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSignal = signal<Product[]>([]);

  
  products = this.productsSignal.asReadonly();

  
  getAll(): Product[] {
    return this.productsSignal();
  }

  
  getById(code: string): Product | undefined {
    return this.productsSignal().find(p => p.code === code);
  }

 
  create(product: Product): void {
    this.productsSignal.update((list: Product[]) => [...list, product]);
  }

  update(product: Product): void {
    this.productsSignal.update((list: Product[]) =>
      list.map((item: Product) => (item.code === product.code ? product : item))
    );
  }


  delete(code: string): void {
    this.productsSignal.update((list: Product[]) =>
      list.filter((item: Product) => item.code !== code)
    );
  }

  clear(): void {
    this.productsSignal.set([]);
  }
}
