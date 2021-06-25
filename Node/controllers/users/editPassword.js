const getDB = require('../../ddbb/db');
const { formatDate } = require('../../helpers');

const editPassword = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;
        const { oldPassword, newPassword } = req.body;

        // Comprobamos si somos el usuario logueado
        if(req.userAuth.idUser !== Number(idUser)) {
            const error = new Error('No tienes permisos para editar este usuario');
            error.httpStatus = 403;
            throw error;
        };

        // Comprobamos que la contraseña tenga 8 caracteres al menos
        if(newPassword.length < 8) {
            const error = new Error('Debe tener al menos 8 caracteres.');
            error.httpStatus = 400;
            throw error;
        }

        // Comprobamos si la contraseña antigua es correcta
        const [user] = await connection.query(`
            SELECT id FROM users WHERE id = ? AND password = SHA2(?, 512)
        `, [idUser, oldPassword]);

        if(user.length < 1) {
            const error = new Error('La contraseña no es correcta');
            error.httpStatus = 401;
            throw error;
        };

        // Si está todo bien guardamos la nueva contraseña
        await connection.query(`
            UPDATE users SET password = SHA2(?, 512), modifiedAt = ? WHERE id = ?
        `, [newPassword, formatDate(new Date()), idUser])

        res.send({
            status: 'ok',
            message: 'Contraseña modificada.'
        })
    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = editPassword;