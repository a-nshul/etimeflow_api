const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

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
                url: 'https://etimeflow-api-uinf.vercel.app', // Your Vercel URL
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
                    bearerFormat: 'JWT'
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
