const getDB = require('../ddbb/db.js');



const userExists = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        
        const {idUser} = req.params;
        const [user] = await connection.query(`
            SELECT id FROM users WHERE id = ?
        `, [idUser]);

        if (user.length < 1) {
            const error = new Error('Usuario no encontrado')
            error.httpStatus = 404;
            throw error;
        };
        
        next()
    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
}

module.exports = userExists;