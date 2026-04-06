import { squareFor, squareForEach } from './calculadora';

test('squareFor returns squared values using for...of', () => {
  expect(squareFor([2, 3, 4])).toEqual([4, 9, 16]);
});

test('squareForEach returns squared values using forEach', () => {
  expect(squareForEach([2, 3, 4])).toEqual([4, 9, 16]);
});