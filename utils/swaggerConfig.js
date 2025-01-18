const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API PetGuardian',
      version: '1.0.0',
      description: 'Documentacion de la API PetGuardian',
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
