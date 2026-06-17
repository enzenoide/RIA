import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Product } from './product.model';

@Component({
  selector: 'product-list',
  standalone: true,
  imports: [FormsModule, TableModule, SelectButtonModule, ButtonModule, TagModule, CurrencyPipe],
  template: `
    <div class="card max-w-6xl mx-auto mt-8">
      <div class="flex justify-between items-center mb-4">
        <p-selectbutton
          [options]="sizes"
          [ngModel]="selectedSize()"
          (ngModelChange)="selectedSizeChange.emit($event)"
          optionLabel="name"
          optionValue="value"
        />

        <p-button label="Novo Produto" icon="pi pi-plus" (onClick)="newProduct.emit()" />
      </div>

      <p-table [value]="products()" [size]="selectedSize()">
        <ng-template pTemplate="header">
          <tr>
            <th>Código</th>
            <th>Descrição</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Status</th>
            <th style="width: 10rem">Ações</th>
          </tr>
        </ng-template>

        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.code }}</td>
            <td>{{ product.descricao }}</td>
            <td>{{ product.quantidade }}</td>
            <td>{{ product.preco | currency:'BRL' }}</td>
            <td>
              @if (product.promocao) {
                <p-tag value="OFERTA" severity="success" icon="pi pi-percentage"></p-tag>
              } @else {
                <p-tag value="Normal" severity="secondary"></p-tag>
              }
            </td>
            <td>
              <div class="flex gap-2">
                <p-button icon="pi pi-search" [rounded]="true" [text]="true" (onClick)="viewDetail.emit(product)"></p-button>
                <p-button icon="pi pi-pencil" [rounded]="true" [text]="true" (onClick)="editProduct.emit(product)"></p-button>
                <p-button icon="pi pi-trash" [rounded]="true" [text]="true" severity="danger" (onClick)="deleteProduct.emit(product)"></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `
})
export class ProductListComponent {
  products = input<Product[]>([]);
  selectedSize = input<'small' | 'large' | undefined>(undefined);

  selectedSizeChange = output<'small' | 'large' | undefined>();
  newProduct = output<void>();
  viewDetail = output<Product>();
  editProduct = output<Product>();
  deleteProduct = output<Product>();

  sizes = [
    { name: 'Small', value: 'small' },
    { name: 'Normal', value: undefined },
    { name: 'Large', value: 'large' }
  ];
}