import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "News Management System",
    description: "API documentation generated automatically by swagger-autogen",
    version: "2.0.0",
  },
  host: "localhost:3000",
  securityDefinitions: {
    bearerAuth: {
      type: "apiKey",
      name: "Authorization",
      in: "header",
    },
  },
};

const outputFile = "./swagger-output.json";
const routes = ["./server.js"]; // Points to your new ESM server file

swaggerAutogen()(outputFile, routes, doc);
