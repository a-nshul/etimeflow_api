// const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

// // Swagger configuration options
// const swaggerOptions = {
//     swaggerDefinition: {
//         openapi: '3.0.0',
//         info: {
//             title: 'User API',
//             version: '1.0.0',
//             description: 'API for managing users (CRUD operations)',
//         },
//         servers: [
//             {
//                 url: 'https://etimeflow-api-uinf.vercel.app', // Vercel URL
//             },
//         ],
//         security: [
//             {
//                 bearerAuth: [] // Enable Bearer token authentication
//             }
//         ],
//         components: {
//             securitySchemes: {
//                 bearerAuth: {
//                     type: 'http',
//                     scheme: 'bearer',
//                     bearerFormat: 'JWT'
//                 }
//             }
//         }
//     },
//     apis: ['./routes/*.js'], // Path to your API route files
// };

// const swaggerDocs = swaggerJsDoc(swaggerOptions);

// function swaggerSetup(app) {
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
// }

// module.exports = swaggerSetup;
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
                url: 'https://etimeflow-api-uinf.vercel.app', // Vercel URL
            },
        ],
        security: [
            {
                bearerAuth: [], // Enable Bearer token authentication
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./routes/*.js'], // Path to your API route files
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Define the swaggerSetup function to integrate Swagger UI with the app
function swaggerSetup(app) {
    if (!app) {
        console.error('App instance is not provided');
        return;
    }

    // Use Swagger UI at the /api-docs endpoint
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    console.log("Swagger docs are served at /api-docs");
}

// Export the swaggerSetup function to be used in app.js
console.log('Swagger setup module loaded.');  // Debugging log
module.exports = swaggerSetup;
