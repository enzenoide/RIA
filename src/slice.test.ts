import { pegarDoisPrimeiros } from './slice';

test('pegarDoisPrimeiros retorna os dois primeiros itens do array', () => {
  expect(pegarDoisPrimeiros([1, 2, 3, 4])).toEqual([1, 2]);
});
