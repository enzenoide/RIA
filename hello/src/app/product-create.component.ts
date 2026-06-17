import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { Product } from './product.model';
import { ProductService } from './services/product.service';

@Component({
  selector: 'product-create',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  template: `
    <product-form
      title="Incluir Produto"
      [visible]="visible()"
      [product]="null"
      (saved)="onSave($event)"
      (cancel)="cancel.emit()"
    ></product-form>
  `
})
export class ProductCreateComponent {
  private productService = inject(ProductService);

  visible = input(false);
  create = output<Product>();
  cancel = output<void>();

  onSave(product: Product): void {
    this.productService.create(product).subscribe({
      next: (savedProduct) => {
        this.create.emit(savedProduct);
      }
    });
  }
}