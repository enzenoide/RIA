import { Component, computed, effect, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Product } from './product.model';

@Component({
  selector: 'product-form',
  standalone: true,
  imports: [FormsModule, DialogModule, ButtonModule, InputTextModule, InputNumberModule, ToggleSwitchModule],
  template: `
    <p-dialog
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '450px' }"
      [header]="title()"
      (visibleChange)="onVisibilityChange($event)"
    >
      <ng-template pTemplate="content">
        <div class="field mb-4">
          <label class="font-bold block mb-2">Nome do Produto <span class="text-red-500">*</span></label>
          <input
            type="text"
            pInputText
            [ngModel]="formName()"
            (ngModelChange)="formName.set($event)"
            placeholder="Ex: Teclado Mecânico"
          />
          @if (!isNameValid() && formName().trim().length > 0) {
            <small class="text-red-500 block mt-1">
              O nome deve ter pelo menos 3 caracteres.
            </small>
          }
        </div>

        <div class="field mb-4">
          <label class="font-bold block mb-2">Quantidade em Estoque <span class="text-red-500">*</span></label>
          <p-inputnumber
            [ngModel]="formQuantity()"
            (ngModelChange)="formQuantity.set($event)"
            [showButtons]="true"
            [min]="0"
          ></p-inputnumber>
          @if (!isQuantityValid() && formQuantity() !== null) {
            <small class="text-red-500 block mt-1">
              A quantidade deve ser maior que zero.
            </small>
          }
        </div>

        <div class="field mb-4">
          <label class="font-bold block mb-2">Preço <span class="text-red-500">*</span></label>
          <p-inputnumber
            [ngModel]="formPreco()"
            (ngModelChange)="formPreco.set($event)"
            mode="currency"
            locale="pt-br"
            currency="BRL"
            [min]="0"
          ></p-inputnumber>
          @if (!isPrecoValid() && formPreco() !== null) {
            <small class="text-red-500 block mt-1">
              O preço deve ser maior que zero.
            </small>
          }
        </div>

        <div class="field flex items-center gap-3">
          <label class="font-bold">Colocar em Promoção?</label>
          <p-toggleswitch
            [ngModel]="formPromocao()"
            (ngModelChange)="formPromocao.set($event)"
          />
        </div>
      </ng-template>

      <ng-template pTemplate="footer">
        <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="cancel.emit()" />
        <p-button label="Salvar" icon="pi pi-check" (onClick)="saveProduct()" [disabled]="!isFormValid()" />
      </ng-template>
    </p-dialog>
  `
})
export class ProductFormComponent {
  title = input('Produto');
  visible = input(false);
  product = input<Product | null>(null);

  saved = output<Product>();
  cancel = output<void>();

  formName = signal('');
  formQuantity = signal<number | null>(null);
  formPreco = signal<number | null>(null);
  formPromocao = signal(false);

  isNameValid = computed(() => this.formName().trim().length >= 3);
  isQuantityValid = computed(() => {
    const quantity = this.formQuantity();
    return quantity !== null && quantity > 0;
  });
  isPrecoValid = computed(() => {
    const preco = this.formPreco();
    return preco !== null && preco > 0;
  });
  isFormValid = computed(() => this.isNameValid() && this.isQuantityValid() && this.isPrecoValid());

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.resetForm(this.product());
      }
    });
  }

  onVisibilityChange(visible: boolean) {
    if (!visible) {
      this.cancel.emit();
    }
  }

  saveProduct() {
    if (!this.isFormValid()) {
      return;
    }

    const productToSave: Product = {
      code: this.product()?.code ?? 'P' + Math.floor(Math.random() * 1000),
      name: this.formName().trim(),
      quantity: this.formQuantity() ?? 0,
      preco: this.formPreco() ?? 0,
      promocao: this.formPromocao()
    };

    this.saved.emit(productToSave);
  }

  private resetForm(product: Product | null) {
    if (product) {
      this.formName.set(product.name);
      this.formQuantity.set(product.quantity);
      this.formPreco.set(product.preco);
      this.formPromocao.set(product.promocao);
    } else {
      this.formName.set('');
      this.formQuantity.set(null);
      this.formPreco.set(null);
      this.formPromocao.set(false);
    }
  }
}
