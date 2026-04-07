import { ordenarDecrescente } from './sorting';

test('ordenarDecrescente ordena o array em ordem decrescente', () => {
  const entrada = ['banana', 'abacate', 'uva'];
  const resultado = ordenarDecrescente(entrada);
  expect(resultado).toEqual(['uva', 'banana', 'abacate']);
});
