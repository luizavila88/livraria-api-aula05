const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/authRoutes');
const livroRoutes = require('./routes/livroRoutes');
const autorRoutes = require('./routes/autorRoutes');
const errorHandler = require('./middlewares/errorMiddleware');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});
app.get('/docs/api.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/livros', livroRoutes);
app.use('/api/v1/autores', autorRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Livraria API rodando em http://localhost:${PORT}`);
  console.log(`Documentação Swagger disponível em http://localhost:${PORT}/docs`);
  console.log(`Especificação OpenAPI JSON disponível em http://localhost:${PORT}/api-docs.json`);
});