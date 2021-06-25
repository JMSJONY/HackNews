const getDB = require('../../ddbb/db');
const { generateRandomString, sendMail } = require('../../helpers');

const recoverUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        const { email } = req.body;
        
        if(!email) {
            const error = new Error('Faltan campos');
            error.httpStatus = 400;
            throw error;
        };

        // Comprobamos que existe el email en la bbdd
        const [user] = await connection.query(`
            SELECT id FROM users WHERE email = ?
        `, [email]);

        if(user.length < 1) {
            const error = new Error('NO hay ningun usuario con ese email')
            error.httpStatus = 404;
            throw error;
        };

        // generamos un codigo de recuperacion, por que suponemos que existe
        const recoverCode = generateRandomString(20);

        // Creamos el body con el mensaje
        const emailBody = `
            Se solicito un cambio de contraseña para el usuario registrado con este email.

            El código de recuperación es: ${recoverCode}.
        `;

        // Enviamos el email.
        await sendMail({
            to: email, 
            subject: 'Códgio de recuperación',
            body: emailBody,
        });

        // Agregamos el codigo de recuperación
        await connection.query(`
            UPDATE users SET recoverCode = ? WHERE email = ?
        `, [recoverCode, email])

        res.send({
            status: 'ok',
            message: 'Email enviado'
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = recoverUser;