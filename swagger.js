const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger configuration options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'User API',
            version: '1.0.0',
            description: 'API for managing users (CRUD operations)',
        },
        servers: [
            {
                url: 'http://localhost:3001', // Use localhost for local testing
            },
        ],
        security: [
            {
                bearerAuth: [] // Enable Bearer token authentication
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT' // Specify the format of the token (optional)
                }
            }
        }
    },
    apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = function(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
