const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PlantSaathi API',
      version: '1.0.0',
      description: 'API documentation for PlantSaathi backend',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

/**
 * @swagger
 * components:
 *   schemas:
 *     Plant:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         common_name:
 *           type: string
 *         scientific_name:
 *           type: string
 *         uses:
 *           type: string
 *         benefits:
 *           type: string
 *         where_it_grows:
 *           type: string
 *         how_to_grow:
 *           type: string
 *         image_url:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     Favorite:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         user_id:
 *           type: string
 *         plant_id:
 *           type: string
 *         text:
 *           type: string
 *         type:
 *           type: string
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 */

module.exports = swaggerSpec;
