export interface Area{
    calcularArea():number;
}
export class Quadrado implements Area{
    lado:number;
    
    constructor(lado:number){
        this.lado = lado;
    }
    calcularArea():number{
        return this.lado * this.lado;
    }
}
export class Circulo implements Area{
    raio:number;
    constructor(raio:number){
        this.raio = raio;
    }
    calcularArea():number{
        return Math.PI * (this.raio * this.raio) 
    }
}