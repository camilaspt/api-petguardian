const { calcularPromedioPuntuacion } = require('../services/usuarioService');
const Resenia = require('../models/Resenia');

jest.mock('../models/Resenia');

describe('calcularPromedioPuntuacion', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('debería calcular el promedio cuando no existen reseñas', async () => {
    Resenia.find.mockResolvedValue([]);
    const promedio = await calcularPromedioPuntuacion('cuidadorId', 5);
    expect(promedio).toBe(5);
  });

  it('debería calcular el promedio cuando existen reseñas', async () => {
    Resenia.find.mockResolvedValue([
      { puntuacion: 4 },
      { puntuacion: 3 },
      { puntuacion: 5 },
    ]);
    const promedio = await calcularPromedioPuntuacion('cuidadorId', 3);
    expect(promedio).toBe(3.75);
  });

  it('debería poder manejar errores', async () => {
    Resenia.find.mockRejectedValue(new Error('Error Base de Datos'));
    await expect(calcularPromedioPuntuacion('cuidadorId', 5)).rejects.toThrow('No se pudo calcular el promedio de puntuaciones');
  });
});