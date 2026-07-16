import express from 'express';
import "dotenv/config"

import apiRoutes from "./routes/api.js";

import swaggerUi from 'swagger-ui-express';
import { createRequire } from 'module';

// Initialize require to safely load the JSON schema file
const require = createRequire(import.meta.url);
const swaggerDocument = require('./swagger-output.json');

const app = express();
const port = process.env.PORT || 8000;

// * Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.get('/', (req, res) => {
  res.send('Hello World!, Heroku!');
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