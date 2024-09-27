const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Your API Title',
            version: '1.0.0',
            description: 'API Documentation',
        },
        servers: [
            {
                url: 'https://your-api-url.vercel.app',
            },
        ],
    },
    apis: ['./routes/*.js'], // Path to your API routes
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = function(app) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
};
