const getDB = require('../ddbb/db.js');
const jwt = require('jsonwebtoken');

const authUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const {authorization} = req.headers;

        if(!authorization) {
            const error = new Error('Falta la cabecera de autorización')
            error.httpStatus = 401;
            throw error;
        };

        // Variable que almacenará la info del token
        let tokenInfo;

        try {
            tokenInfo = jwt.verify(authorization, process.env.SECRET);
        } catch (error) {
            const err = new Error('El token no es valido');
            err.httpStatus = 401;
            throw err;
        };

        // Inyectamos en la request la información del token (idUser, role)
        req.userAuth = tokenInfo;

        next()

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = authUser;