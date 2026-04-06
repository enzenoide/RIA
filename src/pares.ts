export function extrairPares(array:number[]):number[]{
    return array.filter(num => num % 2 == 0);
}