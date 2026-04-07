import { extrairPares } from './pares';

test('extrairPares retorna apenas os números pares do array', () => {
  expect(extrairPares([1, 2, 3, 4, 5, 6])).toEqual([2, 4, 6]);
});
