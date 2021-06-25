const getDB = require('../../ddbb/db');

const { deletePhoto, generateRandomString, formatDate } = require('../../helpers');

const deleteUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { idUser } = req.params;

        // Comprobamos que idUser no sea 1(el administrador)
        if(Number(idUser) === 1) {
            const error = new Error('Este usuario no se puede eliminar')
            error.httpStatus = 403;
            throw error;
        };

        // Comprobamos que es el usuario mismo que se quiere eliminar y no es admin
        if(req.userAuth.idUser !== Number(idUser) && req.userAuth.role !== 'admin') {
            const error = new Error('No tienes permisos para eliminar este usuario');
            error.httpStatus = 401;
            throw error;
        };

        // Obtenemos el nombre del avatar para eliminarlo.
        const [user] = await connection.query(`
            SELECT avatar FROM users WHERE id = ?
        `, [idUser]);

        if(user[0].avatar) {
            await deletePhoto(user[0].avatar);
        };
        
        // Hacemos un update en la tabla de usuarios.
        await connection.query(`
            UPDATE users SET password = NULL, name ="[deleted]", avatar = NULL, active = 0, deleted = 1, modifiedAt = ? 
            WHERE id = ?  
        `, [generateRandomString(40), formatDate(new Date()), idUser]);

        res.send({
            status: 'ok',
            message: 'Usuario eliminado',
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    };
};

module.exports = deleteUser;