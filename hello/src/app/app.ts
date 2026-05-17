import { Component, signal, computed } from '@angular/core';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber'; 
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectButtonModule, TableModule, FormsModule, ButtonModule, DialogModule, InputNumberModule, InputTextModule, TagModule, ToggleSwitchModule, CurrencyPipe],
  template: `
      <div class="card max-w-6xl mx-auto mt-8">
        <div class="flex justify-between items-center mb-4">
            <p-selectbutton [options]="sizes" [(ngModel)]="selectedSize" optionLabel="name" optionValue="value" />
            <p-button label="Novo Produto" icon="pi pi-plus" (onClick)="openNew()" />
        </div>

        <p-table [value]="products()" [size]="selectedSize()">
            <ng-template #header>
                <tr>
                    <th>Código</th>
                    <th>Nome</th>
                    <th>Quantidade</th>
                    <th>Preço</th>
                    <th>Status</th> 
                    <th style="width: 8rem">Ações</th>
                </tr>
            </ng-template>
            <ng-template #body let-product>
                <tr>
                    <td>{{ product.code }}</td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.quantity }}</td>
                    <td>{{ product.preco | currency:'BRL' }}</td>
                    <td>
                        @if (product.promocao) {
                            <p-tag value="OFERTA" severity="success" icon="pi pi-percentage" />
                        } @else {
                            <p-tag value="Normal" severity="secondary" />
                        }
                    </td>
                    <td>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" (onClick)="editProduct(product)" />
                            <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="deleteProduct(product)" />
                        </div>
                    </td>
                </tr>
            </ng-template>
        </p-table>

        <p-dialog [(visible)]="displayModal" [style]="{ width: '450px' }" header="Detalhes do Produto" [modal]="true" styleClass="p-fluid">
            <ng-template #content>
                <div class="field mb-4">
                    <label class="font-bold block mb-2">Nome do Produto <span class="text-red-500">*</span></label>
                    <input type="text" pInputText [(ngModel)]="formName" placeholder="Ex: Teclado Mecânico" />
                    @if (!isNameValid() && formName().length > 0) {
                        <small class="text-red-500 block mt-1">O nome deve ter pelo menos 3 caracteres.</small>
                    }
                </div>
              
                <div class="field mb-4">
                    <label class="font-bold block mb-2">Quantidade em Estoque <span class="text-red-500">*</span></label>
                    <p-inputnumber [(ngModel)]="formQuantity" [showButtons]="true" [min]="0" />
                    @if (!isQuantityValid() && formQuantity() !== null) {
                        <small class="text-red-500 block mt-1">A quantidade deve ser maior que zero.</small>
                    }
                </div>

                <div class="field mb-4">
                    <label class="font-bold block mb-2">Preço <span class="text-red-500">*</span></label>
                    <p-inputnumber [(ngModel)]="formPreco" mode="currency" locale="pt-br" currency="BRL" [min]="0" />
                    @if (!isPrecoValid() && formPreco() !== null) {
                        <small class="text-red-500 block mt-1">O preço deve ser maior que zero.</small>
                    }
                </div>

                <div class="field flex items-center gap-3">
                    <label class="font-bold">Colocar em Promoção?</label>
                    <p-toggleswitch [(ngModel)]="formPromocao" />
                </div>
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideDialog()" />
                <p-button label="Salvar" icon="pi pi-check" (onClick)="saveProduct()" [disabled]="!isFormValid()" />
            </ng-template>
        </p-dialog>
    </div>
  `
})
export class App {
  // Lista de produtos
  products = signal<any[]>([]);

  // SIGNAL FORMS: Estado do Formulário
  formCode = signal<string | null>(null);
  formName = signal<string>('');
  formQuantity = signal<number | null>(null);
  formPreco = signal<number | null>(null);
  formPromocao = signal<boolean>(false);

  // VALIDAÇÕES: Computeds reativos
  
  isNameValid = computed(() => this.formName().trim().length >= 3);
  isQuantityValid = computed(() => this.formQuantity() !== null && this.formQuantity()! > 0);
  isPrecoValid = computed(() => this.formPreco() !== null && this.formPreco()! > 0);
  
  // Valida se o formulário inteiro está preenchido corretamente
  isFormValid = computed(() => this.isNameValid() && this.isQuantityValid() && this.isPrecoValid());

  // Estado da UI
  displayModal = signal(false);
  selectedSize = signal<any>(null);
  sizes = [
    {name: 'Small', value: 'small'},
    {name: 'Normal', value:'undefined'},
    {name: 'Large', value: 'large'}
  ];

  saveProduct() {
    // Barreira de segurança extra caso o botão seja acionado de forma indevida
    if (!this.isFormValid()) return;

    // Monta o objeto final lendo o valor dos Signals
    const productToSave = {
      code: this.formCode(),
      name: this.formName().trim(),
      quantity: this.formQuantity(),
      preco: this.formPreco(),
      promocao: this.formPromocao()
    };

    if (productToSave.code) {
      // Atualiza produto existente
      this.products.update(list => 
        list.map(p => p.code === productToSave.code ? productToSave : p)
      );
    } else {
      // Cria novo produto
      productToSave.code = 'P' + Math.floor(Math.random() * 1000);
      this.products.update(list => [...list, productToSave]);
    }
    
    this.hideDialog();
  }

  deleteProduct(produto: any) {
    this.products.update(list => list.filter(item => item.code !== produto.code));
  }

  editProduct(produto: any) {
    // Alimenta os Signals com os dados do produto que o usuário quer editar
    this.formCode.set(produto.code);
    this.formName.set(produto.name);
    this.formQuantity.set(produto.quantity);
    this.formPreco.set(produto.preco);
    this.formPromocao.set(!!produto.promocao);
    
    this.displayModal.set(true);
  }

  openNew() {
    //Limpa os Signals para abrir um formulário em branco e zerar as validações
    this.formCode.set(null);
    this.formName.set('');
    this.formQuantity.set(null);
    this.formPreco.set(null);
    this.formPromocao.set(false);
    
    this.displayModal.set(true);
  }

  hideDialog() {
    this.displayModal.set(false);
  }
}