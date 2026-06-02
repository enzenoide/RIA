import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from './product.model';
import { ProductService } from './services/product.service';
import { ProductListComponent } from './product-list.component';
import { ProductDetailComponent } from './product-detail.component';
import { ProductCreateComponent } from './product-create.component';
import { ProductEditComponent } from './product-edit.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ProductListComponent, ProductDetailComponent, ProductCreateComponent, ProductEditComponent],
  template: `
    <product-list
      [products]="products()"
      [selectedSize]="selectedSize()"
      (selectedSizeChange)="selectedSize.set($event)"
      (newProduct)="openCreate()"
      (viewDetail)="openDetail($event)"
      (editProduct)="openEdit($event)"
      (deleteProduct)="deleteProduct($event)"
    ></product-list>

    <product-detail
      [visible]="showDetail()"
      [product]="selectedProduct()"
      (close)="closeDetail()"
    ></product-detail>

    <product-create
      [visible]="showCreate()"
      (create)="createProduct($event)"
      (cancel)="closeCreate()"
    ></product-create>

    <product-edit
      [visible]="showEdit()"
      [product]="selectedProduct()"
      (save)="saveEditedProduct($event)"
      (cancel)="closeEdit()"
    ></product-edit>
  `
})
export class App {
  private productService = inject(ProductService);

  products = this.productService.products; 

  selectedSize = signal<'small' | 'large' | undefined>(undefined);

  showDetail = signal(false);
  showCreate = signal(false);
  showEdit = signal(false);

  selectedProduct = signal<Product | null>(null);


  openCreate() {
    this.selectedProduct.set(null);
    this.showCreate.set(true);
  }

  openDetail(product: Product) {
    this.selectedProduct.set(product);
    this.showDetail.set(true);
  }

  openEdit(product: Product) {
    this.selectedProduct.set(product);
    this.showEdit.set(true);
  }

  closeDetail() {
    this.showDetail.set(false);
    this.selectedProduct.set(null);
  }

  closeCreate() {
    this.showCreate.set(false);
  }

  closeEdit() {
    this.showEdit.set(false);
    this.selectedProduct.set(null);
  }

  createProduct(product: Product) {
    this.productService.create(product);
    this.closeCreate();
  }

  saveEditedProduct(product: Product) {
    this.productService.update(product);
    this.closeEdit();
  }

  deleteProduct(product: Product) {
    this.productService.delete(product.code);
  }
}