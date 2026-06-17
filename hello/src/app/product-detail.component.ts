import { Component, input, output, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Product } from './product.model';

@Component({
  selector: 'product-detail',
  standalone: true,
  imports: [DialogModule, ButtonModule, TagModule, CurrencyPipe],
  template: `
    <p-dialog
      [visible]="visible()"
      [modal]="true"
      [style]="{ width: '450px' }"
      header="Detalhes do Produto"
      (visibleChange)="onVisibleChange($event)"
    >
      <ng-template pTemplate="content">
        @if (product(); as p) {
          <div class="field mb-3">
            <h3 class="font-bold mb-2">{{ p.descricao }}</h3>
            <p class="mb-1"><strong>ID:</strong> {{ p.id }}</p>
            <p class="mb-1"><strong>Código:</strong> {{ p.code }}</p>
            <p class="mb-1"><strong>Quantidade:</strong> {{ p.quantidade }}</p>
            <p class="mb-1"><strong>Preço:</strong> {{ p.preco | currency:'BRL' }}</p>
            <p class="mb-1">
              <strong>Status:</strong>
              
              @if (p.promocao) {
                <p-tag value="OFERTA" severity="success" icon="pi pi-percentage"></p-tag>
              } @else {
                <p-tag value="Normal" severity="secondary"></p-tag>
              }
            </p>
          </div>
        } @else {
          <p>Carregando detalhes do produto...</p>
        }
      </ng-template>

      <ng-template pTemplate="footer">
        <p-button label="Fechar" icon="pi pi-times" [text]="true" (onClick)="close.emit()" />
      </ng-template>
    </p-dialog>
  `
})
export class ProductDetailComponent {
  visible = input(false);
  product = input<Product | null>(null);

  close = output<void>();

  onVisibleChange(value: boolean) {
    if (!value) {
      this.close.emit();
    }
  }
}