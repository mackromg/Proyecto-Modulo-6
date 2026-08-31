const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Usuario = require('./Usuario');

const Pedido = sequelize.define('Pedido', {
    producto: { 
        type: DataTypes.STRING, 
        allowNull: false 
    },
    total: { 
        type: DataTypes.FLOAT, 
        allowNull: false 
    }
});

Usuario.hasMany(Pedido, { foreignKey: 'usuarioId', onDelete: 'CASCADE' });
Pedido.belongsTo(Usuario, { foreignKey: 'usuarioId' });

module.exports = { Usuario, Pedido };