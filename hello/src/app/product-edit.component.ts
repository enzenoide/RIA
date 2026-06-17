import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { Product } from './product.model';
import { ProductService } from './services/product.service';

@Component({
  selector: 'product-edit',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  template: `
    <product-form
      title="Alterar Produto"
      [visible]="visible()"
      [product]="product()"
      (saved)="onUpdate($event)"
      (cancel)="cancel.emit()"
    ></product-form>
  `
})
export class ProductEditComponent {
  private productService = inject(ProductService);

  visible = input(false);
  product = input<Product | null>(null);

  save = output<Product>();
  cancel = output<void>();

  onUpdate(product: Product): void {
    if (product.id) {
      this.productService.update(product.id, product).subscribe({
        next: (updatedProduct) => {
          this.save.emit(updatedProduct);
        }
      });
    }
  }
}