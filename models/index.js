const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false   // Necesario para Render
    }
  }
});

const User = sequelize.define('User', {
  nombre: { type: Sequelize.STRING, allowNull: false },
  email: { type: Sequelize.STRING, allowNull: false, unique: true },
  edad: { type: Sequelize.INTEGER, allowNull: false },
  telefono: { type: Sequelize.STRING }
}, {
  timestamps: true
});

module.exports = { sequelize, User };
