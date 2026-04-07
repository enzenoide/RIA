import { describe, it, expect } from 'vitest';
import { Quadrado, Circulo } from './classes';

describe('Classes Area', () => {
  it('Quadrado - calcularArea', () => {
    const quad = new Quadrado(4);
    expect(quad.calcularArea()).toBe(16);

    quad.lado = 5;
    expect(quad.calcularArea()).toBe(25);
  });

  it('Circulo - calcularArea', () => {
    const circ = new Circulo(3);
    expect(circ.calcularArea()).toBeCloseTo(Math.PI * 9);

    circ.raio = 4;
    expect(circ.calcularArea()).toBeCloseTo(Math.PI * 16);
  });
});