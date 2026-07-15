import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'Automated Node.js API (ESM)',
    description: 'API documentation generated automatically by swagger-autogen',
    version: '1.0.0',
  },
  host: 'localhost:3000',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const routes = ['./server.js']; // Points to your new ESM server file

swaggerAutogen()(outputFile, routes, doc);
