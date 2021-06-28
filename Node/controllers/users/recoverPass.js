const getDB = require('../../BBDD/database');
const { formatDate } = require('../../helpers');

const recoverPass = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { recoverCode, newPassword } = req.body;

        if(!recoverCode || !newPassword) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        };

        // Confirmamos que el usuario tenga el codigo de recuperación
        const [user] = await connection.query(`
            SELECT id FROM users WHERE recoverCode = ?
        `, [recoverCode]);

        if(user.length < 1) {
            const error = new Error('Codigo de recuperación incorrecto');
            error.httpStatus = 404;
            throw error;
        };

        // Actualizamos la contraseña del usuario
        await connection.query(`
            UPDATE users SET password = SHA2(?, 512), recoverCode = NULL, modifiedAt = ? WHERE id = ?
        `, [newPassword, formatDate(new Date()), user[0].id]);

        res.send({
            status: 'ok',
            message: 'Contraseña actualizada.'
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = recoverPass;