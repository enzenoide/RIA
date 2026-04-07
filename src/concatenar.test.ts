import { concatenar } from './concatenar';

test('concatenar une as strings com espaço', () => {
  const resultado = concatenar(['olá', 'mundo']);
  expect(resultado).toBe('olá mundo');
});
