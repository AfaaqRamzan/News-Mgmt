import express from 'express';
import "dotenv/config"

import apiRoutes from "./routes/api.js";

import swaggerUi from "swagger-ui-express";
import { createRequire } from "module";
import fileUpload from "express-fileupload";

// Initialize require to safely load the JSON schema file
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 8000;

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

// * Health Check
app.get("/", (req, res) => {
  /*  #swagger.tags = ['Health Check']
            #swagger.summary = 'Get Health Check' 
            #swagger.description = 'Returns the health status of the server.'
            #swagger.responses[200] = {
                description: 'Health check successful',
                schema: {
                    status: 200,
                    message: 'Health check successful'
                }
            }
            #swagger.responses[500] = {
                description: 'Internal server error'
            }
            */
  res.status(200).json({
    status: 200,
    message: "Server is running successfully!!!!",
  });
});

// * Routes
app.use("/api", apiRoutes);

// * Serve the interactive Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Server link : http://localhost:${port}`);
  console.log(`Swagger Docs link : http://localhost:${port}/api-docs`);
});