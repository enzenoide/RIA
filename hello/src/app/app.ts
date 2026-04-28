import { Component, signal, computed } from '@angular/core'; // Adicionado computed
import { SelectButtonModule } from 'primeng/selectbutton'; // ajustar tamanho da tablea, small,large
import { Table, TableModule } from 'primeng/table'; // criar a tabela
import { FormsModule } from '@angular/forms';
import { NgModel } from '@angular/forms';
import { ButtonModule } from 'primeng/button'; // botões
import { DialogModule } from 'primeng/dialog'; // o modal de inserir e editar
import { InputNumberModule } from 'primeng/inputnumber'; 
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag'; // o status do produto, se em promocao ou nao
import { ToggleSwitchModule } from 'primeng/toggleswitch'; // o switch de promocao ou nao
import { CurrencyPipe } from '@angular/common'; // pra poder mostrar o preco na tabela
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [SelectButtonModule,TableModule,FormsModule,ButtonModule,DialogModule,InputNumberModule,InputTextModule,TagModule,ToggleSwitchModule,CurrencyPipe], // NgClass adicionado aqui
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
                    <th>Status</th> <th style="width: 8rem">Ações</th>
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
                    <label class="font-bold block mb-2">Nome do Produto</label>
                    <input type="text" pInputText [(ngModel)]="product.name" />
                </div>
              
                <div class="field mb-4">
                    <label class="font-bold block mb-2">Quantidade em Estoque</label>
                    <p-inputnumber [(ngModel)]="product.quantity" />
                </div>

                <div class="field mb-4">
                    <label class="font-bold block mb-2">Preço</label>
                    <p-inputnumber [(ngModel)]=product.preco mode = "currency" locale="pt-br" currency="BRL"/>
                </div>
                <div class="field flex items-center gap-3">
                    <label class="font-bold">Colocar em Promoção?</label>
                    <p-toggleswitch [(ngModel)]="product.promocao" />
                </div>
                
            </ng-template>

            <ng-template #footer>
                <p-button label="Cancelar" icon="pi pi-times" [text]="true" (onClick)="hideDialog()" />
                <p-button label="Salvar" icon="pi pi-check" (onClick)="saveProduct()" />
            </ng-template>
        </p-dialog>
    </div>
      `
})
export class App {
//usando signal pra deixar responsivo, semrpe q a lista mudar, a tela atualiza
  products = signal<any[]>([]);
  product : any = {};

  displayModal = signal(false);
  selectedSize = signal<any>(null);

  sizes = [
    {name: 'Small', value: 'small'},
    {name: 'Normal', value:'undefined'},
    {name: 'Large', value: 'large'}
  ];

  saveProduct(){
    const currentProduct = this.product;
    // chama o metodo update que retorna o array de produtos
    // usa o map pra percorrer o array item por item, ele cria um novo array baseado nas regras q vc der
    // ternario: o codigo desse item atual é igual ao codigo do produto que eu editei?
    // se sim, inves de manter o velho eu atualizo
    // se nao, mantem no lugar
    if(currentProduct.code){
      this.products.update(list => list.map(p => p.code === currentProduct.code ? currentProduct : p));
    }
    else{
      // gera um code aleatorio pro produto
      currentProduct.code = 'P' + Math.floor(Math.random() * 1000);
      //salva o produto, cria um novo array e adicionar o produto no final
      currentProduct.promocao = !!currentProduct.promocao;
      //pega a lisa velha e adiciona o produto novo no final
      this.products.update(list => [...list,currentProduct]);
    }
    this.hideDialog();
  }
  deleteProduct(produto:any){
    // usando o filter, basicamente ele manda percorrer a lista e manter 
    // os itens que o code seja diferente do passado por parametro
    // o filter entrega uma lista nova sem o item desejado
    // pega a lista velha, filtra e devolve a lista sem o item
    this.products.update(list => list.filter(item => item.code !== produto.code));
  }
  editProduct(produto:any){
    //cria uma copia do produto e avisa o signal q mudou
    this.product = {...produto};
    this.displayModal.set(true);
  }
  // çimpa a variável do produto atual
  // isso garante que o formulário do modal abra em branco, e não com os dados do último produto 
  openNew(){
    this.product = {};
    this.displayModal.set(true);
  }
  hideDialog(){
    this.displayModal.set(false);
  }
}