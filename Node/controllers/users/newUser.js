const getDB = require('../../ddbb/db');
const { validate, generateRandomString, sendMail, formatDate } = require('../../helpers');
const { newUserSchema } = require('../../schemas')

const newUser = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();

        // Validamos los datos
        await validate(newUserSchema, req.body);

        const { email, password } = req.body;

        // Comprobamos si existe el email en la BBDD
        const [user] = await connection.query(`
            SELECT id FROM users WHERE email = ?
        `, [email]);

        if(user.length > 0) {
            const error = new Error('Ya existe este email')
            error.httpStatus = 400;
            throw error;
        };

        // Creamos un codigo de registro (de un solo uso)
        const registrationCode = generateRandomString(40);

        // Mensaje que le enviaremos al usuario
        const emailBody = `
            Te acabas de registrar en HackNews.
            Pulsa en el link para verificar tu cuenta: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
        `;

        // Enviamos el mensaje
        await sendMail({
            to: email,
            subject: 'Activa tu cuenta',
            body: emailBody,
        });

        await connection.query(`
            INSERT INTO users (email, password, registrationCode, createdAt) VALUES (?, SHA2(?, 512), ?, ?)
        `, [email, password, registrationCode, formatDate(new Date())]);

        res.send({
            status: 'ok',
            data: 'Usuario registrado, comprueba tu bandeja para activarlo.'
        });

    } catch (error) {
        next(error);
    } finally {
        if(connection) connection.release();
    }
};

module.exports = newUser;