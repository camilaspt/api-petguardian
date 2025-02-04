const { crearDisponibilidad } = require('../services/disponibilidadCuidadorService.js');
const DisponibilidadCuidador = require('../models/DisponibilidadCuidador.js');

jest.mock('../models/DisponibilidadCuidador');

describe('crearDisponibilidad', () => {
  it('deberia crear disponibilidad con exito', async () => {
    const fecha = '2023-10-10';
    const horarios = [{ horaInicio: '10:00' }, { horaInicio: '12:00' }];
    const idCuidador = 'cuidador123';

    const mockResult = { _id: 'disponibilidad123', fecha, horas: ['10:00', '12:00'], cuidador: idCuidador };
    DisponibilidadCuidador.create.mockResolvedValue(mockResult);

    const result = await crearDisponibilidad(fecha, horarios, idCuidador);

    expect(result).toEqual(mockResult);
    expect(DisponibilidadCuidador.create).toHaveBeenCalledWith({
      fecha,
      horas: ['10:00', '12:00'],
      cuidador: idCuidador
    });
  });

  it('debería arrojar un error cuando falla la creación', async () => {
    const fecha = '2023-10-10';
    const horarios = [{ horaInicio: '10:00' }, { horaInicio: '12:00' }];
    const idCuidador = 'cuidador123';

    const mockError = new Error('Creacion fallida');
    DisponibilidadCuidador.create.mockRejectedValue(mockError);

    await expect(crearDisponibilidad(fecha, horarios, idCuidador)).rejects.toThrow('Creacion fallida');
    expect(DisponibilidadCuidador.create).toHaveBeenCalledWith({
      fecha,
      horas: ['10:00', '12:00'],
      cuidador: idCuidador
    });
  });
});