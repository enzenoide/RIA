import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { Product } from './product.model';

@Component({
  selector: 'product-edit',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  template: `
    <product-form
      title="Alterar Produto"
      [visible]="visible()"
      [product]="product()"
      (saved)="save.emit($event)"
      (cancel)="cancel.emit()"
    ></product-form>
  `
})
export class ProductEditComponent {
  visible = input(false);
  product = input<Product | null>(null);

  save = output<Product>();
  cancel = output<void>();
}
