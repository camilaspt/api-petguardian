const request = require('supertest');
const express = require('express');
const disponibilidadCuidadorController = require('../controllers/disponibilidadCuidadorController');
const Disponibilidad = require('../models/DisponibilidadCuidador');
const service = require('../services/disponibilidadCuidadorService');

jest.mock('../models/DisponibilidadCuidador');
jest.mock('../services/disponibilidadCuidadorService');

const app = express();
app.use(express.json());
app.get('/disponibilidades', disponibilidadCuidadorController.getDisponibilidadesPorCuidador);
app.post('/disponibilidades', disponibilidadCuidadorController.createDisponibilidad);
app.delete('/disponibilidades', disponibilidadCuidadorController.deleteDisponibilidad);
app.put('/disponibilidades/:id', disponibilidadCuidadorController.updateDisponibilidad);
app.post('/disponibilidades/update', disponibilidadCuidadorController.createOrUpdateDisponibilidad);

describe('DisponibilidadCuidador', () => {
  it('GET - getDisponibilidadesPorCuidador', async () => {
    const mockDisponibilidades = [{ fecha: '2023-10-01', horarios: ['10:00', '12:00'] }];
    service.obtenerDisponibilidadesPorCuidador.mockResolvedValue(mockDisponibilidades);
    const res = await request(app).get('/disponibilidades').set('cuidadorId', '1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(mockDisponibilidades);
  });

  it('POST - createDisponibilidad', async () => {
    const newDisponibilidad = { fecha: '2023-10-01', horarios: ['10:00', '12:00'] };
    service.crearDisponibilidad.mockResolvedValue(newDisponibilidad);
    const res = await request(app).post('/disponibilidades').send(newDisponibilidad).set('cuidadorId', '1');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(newDisponibilidad);
  });

  it('DELETE - deleteDisponibilidad', async () => {
    Disponibilidad.deleteOne.mockResolvedValue({ deletedCount: 1 });
    const res = await request(app).delete('/disponibilidades').send({ fecha: '2023-10-01' }).set('cuidadorId', '1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({ deletedCount: 1 });
  });

  it('PUT - updateDisponibilidad', async () => {
    const updatedDisponibilidad = { fecha: '2023-10-01', horarios: ['10:00', '12:00'] };
    Disponibilidad.findByIdAndUpdate.mockResolvedValue(updatedDisponibilidad);
    const res = await request(app).put('/disponibilidades/1').send({ horarios: ['10:00', '12:00'] });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual(updatedDisponibilidad);
  });

  it('POST - createOrUpdateDisponibilidad', async () => {
    const disponibilidad = { fecha: '2023-10-01', horarios: ['10:00', '12:00'] };
    service.crearOActualizarDisponibilidad.mockResolvedValue(disponibilidad);
    const res = await request(app).post('/disponibilidades/update').send(disponibilidad).set('cuidadorId', '1');
    expect(res.statusCode).toEqual(201);
    expect(res.body).toEqual(disponibilidad);
  });
});