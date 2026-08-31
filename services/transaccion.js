const sequelize = require('../config/db');
const { Usuario, Pedido } = require('../models/Pedido');

async function crearUsuarioConPedido(nombre, email, producto, total) {
    const t = await sequelize.transaction();

    try {
        const nuevoUsuario = await Usuario.create({ nombre, email }, { transaction: t });
        
        const nuevoPedido = await Pedido.create({ 
            producto, 
            total, 
            usuarioId: nuevoUsuario.id 
        }, { transaction: t });

        await t.commit();
        return { nuevoUsuario, nuevoPedido };
    } catch (error) {
        await t.rollback();
        throw error;
    }
}

module.exports = { crearUsuarioConPedido };