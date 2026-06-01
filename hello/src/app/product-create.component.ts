import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductFormComponent } from './product-form.component';
import { Product } from './product.model';

@Component({
  selector: 'product-create',
  standalone: true,
  imports: [CommonModule, ProductFormComponent],
  template: `
    <product-form
      title="Incluir Produto"
      [visible]="visible()"
      [product]="null"
      (saved)="create.emit($event)"
      (cancel)="cancel.emit()"
    ></product-form>
  `
})
export class ProductCreateComponent {
  visible = input(false);
  create = output<Product>();
  cancel = output<void>();
}
