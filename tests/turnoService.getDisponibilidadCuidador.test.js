const { getDisponibilidadCuidador } = require('../services/turnoService');
const Disponibilidad = require('../models/DisponibilidadCuidador');
const Turno = require('../models/Turno');
const { getReservasCuidadorEnRango } = require('../services/reservaService');

jest.mock('../models/DisponibilidadCuidador');
jest.mock('../models/Turno');
jest.mock('../services/reservaService');

describe('getDisponibilidadCuidador', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debería devolver disponibilidad para una entrada válida', async () => {
    const cuidadorId = 'cuidador123';
    const fechaInicio = '2023-10-01T00:00:00Z';
    const fechaFin = '2023-10-02T23:59:59Z';

    Disponibilidad.findOne.mockResolvedValueOnce({
      horas: ['8', '9', '10']
    }).mockResolvedValueOnce({
      horas: ['8', '9', '10']
    });

    getReservasCuidadorEnRango.mockResolvedValue([]);
    Turno.find.mockResolvedValue([]);

    const result = await getDisponibilidadCuidador(cuidadorId, fechaInicio, fechaFin);

    expect(result).toEqual([8, 9, 10]);
  });

  it('debería devolver un mensaje si no hay disponibilidad', async () => {
    const cuidadorId = 'cuidador123';
    const fechaInicio = '2023-10-01T00:00:00Z';
    const fechaFin = '2023-10-02T23:59:59Z';

    Disponibilidad.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);

    getReservasCuidadorEnRango.mockResolvedValue([]);
    Turno.find.mockResolvedValue([]);

    const result = await getDisponibilidadCuidador(cuidadorId, fechaInicio, fechaFin);

    expect(result).toEqual({ message: 'El cuidador no tiene disponibilidad para esos días' });
  });

  it('debería arrojar un error por rango de fechas no válido', async () => {
    const cuidadorId = 'cuidador123';
    const fechaInicio = '2023-10-02T00:00:00Z';
    const fechaFin = '2023-10-01T23:59:59Z';

    const result = await getDisponibilidadCuidador(cuidadorId, fechaInicio, fechaFin);

    expect(result).toEqual({ message: 'Error al obtener la disponibilidad del cuidador: La fecha de inicio debe ser anterior a la fecha de fin' });
  });

  it('debería poder manejar errores', async () => {
    const cuidadorId = 'cuidador123';
    const fechaInicio = '2023-10-01T00:00:00Z';
    const fechaFin = '2023-10-02T23:59:59Z';

    Disponibilidad.findOne.mockRejectedValue(new Error('cuidador123'));

    const result = await getDisponibilidadCuidador(cuidadorId, fechaInicio, fechaFin);

    expect(result).toEqual({ message: 'Error al obtener la disponibilidad del cuidador: cuidador123' });
  });
});