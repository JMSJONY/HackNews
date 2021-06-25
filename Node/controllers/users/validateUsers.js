const getDB = require('../../ddbb/db.js');

const validateUsers = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { registrationCode } = req.params;

        const[user] = await connection.query(`
            SELECT id FROM users WHERE registrationCode = ?
        `, [registrationCode]);

        if(user.length < 1) {
            const error = new Error('No hay usuarios pendientes de validar con este codigo');
            error.httpStatus = 400;
            throw error;
        };

        await connection.query(`
            UPDATE users SET active = true, registrationCode = NULL WHERE registrationCode = ?
        `, [registrationCode]);

        res.send({
            status: 'ok',
            message: 'Usuario verificado.'
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = validateUsers;