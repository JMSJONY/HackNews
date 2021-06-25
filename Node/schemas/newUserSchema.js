const Joi = require('joi');

const newUserSchema = Joi.object({
    email: Joi.string()
        .required()
        .email()
        .error((errors) => {
            switch(errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere un email')

                default:
                    return new Error('El email no es valido')
            }
        }),
    password: Joi.string()
        .required()
        // .alphanum() Solo admite letras y números.
        .min(8)
        .max(100)
        .error((errors) => {
            switch(errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere una contraseña')

                default:
                    return new Error('La contraseña debe tener entre 8 y 100 caracteres')
            };
        })
});

module.exports = newUserSchema;