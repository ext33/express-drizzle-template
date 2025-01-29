import express, { Application, json } from 'express';
import cors from 'cors';
import logger from './logger';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { ALLOW_CORS, SERVER_PORT } from './constants';

import apiV1Controller from './api/api.controller';

const port: number = SERVER_PORT;

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'WStories API',
      version: '1.0.0',
      description: 'API documentation',
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: [`${__dirname}/api/**/*.controller.*`],
};

const app: Application = express();
const swaggerDocs = swaggerJsDoc(swaggerOptions);

app.use(json());
app.use(
  cors({
    origin: ALLOW_CORS,
  })
);

app.use('/swagger/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiV1Controller);

app.listen(port, () => {
  logger.info(`Server started. Running on http://localhost:${port}`);
});

process.on('uncaughtException', function (err) {
  logger.error('Unhandled error:', err);
});
