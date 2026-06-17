import { Component, inject, signal, OnInit } from '@angular/core';
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
export class App implements OnInit {
  private productService = inject(ProductService);

  products = this.productService.products; 

  selectedSize = signal<'small' | 'large' | undefined>(undefined);

  showDetail = signal(false);
  showCreate = signal(false);
  showEdit = signal(false);

  selectedProduct = signal<Product | null>(null);

  ngOnInit(): void {
    this.productService.getAll().subscribe();
  }

  openCreate() {
    this.selectedProduct.set(null);
    this.showCreate.set(true);
  }

  openDetail(product: Product) {
    if (product.id) {
      this.productService.getById(product.id).subscribe({
        next: (fullProduct) => {
          this.selectedProduct.set(fullProduct);
          this.showDetail.set(true);
        }
      });
    }
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
    this.closeCreate();
    this.productService.getAll().subscribe();
  }

  saveEditedProduct(product: Product) {
    this.closeEdit();
    this.productService.getAll().subscribe();
  }

  deleteProduct(product: Product) {
    if (product.id) {
      this.productService.delete(product.id).subscribe();
    }
  }
}