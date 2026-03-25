const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./models');   // Importamos la conexión
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Rutas del CRUD
app.use('/api/users', require('./routes/users'));

// Sincronizar base de datos (crea tablas automáticamente)
sequelize.sync({ alter: true })
  .then(() => console.log('✅ Base de datos PostgreSQL sincronizada'))
  .catch(err => console.error('❌ Error al sincronizar DB:', err));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
