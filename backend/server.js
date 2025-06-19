const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const planesRouter = require('./routes/planes');
const usuariosRouter = require('./routes/usuarios');
const finanzasRouter = require('./routes/finanzas');
const planesCrudRouter = require('./routes/planesCrud');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/usuarios', usuariosRouter);
app.use('/api/planes', planesRouter);
app.use('/api/finanzas', finanzasRouter);
app.use('/api/planescrud', planesCrudRouter);

// Conexión a MongoDB Atlas
const mongoURI = 'mongodb+srv://Mtacuri03:paula2012TRR@asoesfot2.yebpp0c.mongodb.net/asoesfot?retryWrites=true&w=majority&appName=asoesfot2';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ Conectado a MongoDB Atlas'))
  .catch(err => console.error('❌ Error en la conexión:', err));

// Servir frontend (React)
app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor corriendo en http://localhost:${PORT}`);
});
