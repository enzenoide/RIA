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
          <label class="font-bold block mb-2">Descrição do Produto <span class="text-red-500">*</span></label>
          <input
            type="text"
            pInputText
            [ngModel]="formDescricao()"
            (ngModelChange)="formDescricao.set($event)"
            placeholder="Ex: Teclado Mecânico"
          />
          @if (!isDescricaoValid() && formDescricao().trim().length > 0) {
            <small class="text-red-500 block mt-1">A descrição deve ter pelo menos 3 caracteres.</small>
          }
        </div>

        <div class="field mb-4">
          <label class="font-bold block mb-2">Quantidade em Estoque <span class="text-red-500">*</span></label>
          <p-inputnumber
            [ngModel]="formQuantidade()"
            (ngModelChange)="formQuantidade.set($event)"
            [showButtons]="true"
            [min]="0"
          ></p-inputnumber>
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

  formDescricao = signal('');
  formQuantidade = signal<number | null>(null);
  formPreco = signal<number | null>(null);
  formPromocao = signal(false);

  isDescricaoValid = computed(() => this.formDescricao().trim().length >= 3);
  isQuantidadeValid = computed(() => (this.formQuantidade() ?? 0) > 0);
  isPrecoValid = computed(() => (this.formPreco() ?? 0) > 0);
  isFormValid = computed(() => this.isDescricaoValid() && this.isQuantidadeValid() && this.isPrecoValid());

  constructor() {
    effect(() => {
      if (this.visible()) {
        this.resetForm(this.product());
      }
    });
  }

  onVisibilityChange(visible: boolean) {
    if (!visible) this.cancel.emit();
  }

  saveProduct() {
    if (!this.isFormValid()) return;

    const productToSave: Product = {
      ...this.product(), // Mantém o ID original se for edição
      code: this.product()?.code ?? 'PROD-' + Math.floor(Math.random() * 1000),
      descricao: this.formDescricao().trim(),
      quantidade: this.formQuantidade() ?? 0,
      preco: this.formPreco() ?? 0,
      promocao: this.formPromocao()
    };

    this.saved.emit(productToSave);
  }

  private resetForm(product: Product | null) {
    if (product) {
      this.formDescricao.set(product.descricao);
      this.formQuantidade.set(product.quantidade);
      this.formPreco.set(product.preco);
      this.formPromocao.set(product.promocao);
    } else {
      this.formDescricao.set('');
      this.formQuantidade.set(null);
      this.formPreco.set(null);
      this.formPromocao.set(false);
    }
  }
}