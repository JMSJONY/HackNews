const getDB = require('../../ddbb/db');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email, password } = req.body;

        if(!email || !password) {
            const error = new Error('Falta el usuario o la contraseña.');
            error.httpStatus = 400;
            throw error;
        };
        
        const [user] = await connection.query(`
            SELECT id, role, active FROM users WHERE email = ? AND password = SHA2(?, 512) 
        `, [email, password]);

        if(user.length < 0) {
            const error = new Error('Email o contraseña incorrecto');
            error.httpStatus = 401;
            throw error;
        };

        if(!user[0].active) {
            const error = new Error('Usuario pendiente de activación');
            error.httpStatus = 401;
            throw error; 
        };

        const tokenInfo = {
            idUser: user[0].id,
            role: user[0].role
        };

        const token = jwt.sign(tokenInfo, process.env.SECRET, {
            expiresIn: '15d'
        }) ;

        res.send({
            status: 'ok',
            data: {
                token,
            }
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = loginUser;