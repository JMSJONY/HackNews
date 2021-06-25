require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const { PORT } = process.env;

//Todo Middlewares
const authUser = require('./middlewares/authUser');
const usersExists = require('./middlewares/usersExists');


//Todo Controladores entradas


//Todo Controladores usuarios
const { 
    getUser,
    newUser,
    validateUsers,
    loginUser,
    editPassword,
    recoverUser,
    recoverPass,
    deleteUser
} = require('./controllers/users');


 /* endPoints Usuarios */
// Creamos un nuevo usuario
app.post('/users', newUser);

// Validamos un usuario nuevo.
app.get('/users/validate/:registrationCode', validateUsers);

// Logueamos a un usuario
app.post('/users/login', loginUser);

 // Cogemos informacion de un usuario
app.get('/users/:idUser',authUser, usersExists, getUser);

// Editamos la contraseña de un usuario.
app.put('/users/:idUser/password',authUser, usersExists, editPassword);

// Enviamos un codigo de recuperación de cuenta
app.put('/users/password/recover', recoverUser);

// Cambiamos contraseña despues de recibir el email de recuperación
app.put('/users/password/reset', recoverPass);

// Borramos un usuario.
app.delete('/users/:idUser', authUser, usersExists, deleteUser)




/* logger */
app.use(morgan('dev'));

//traduce el body y lo transforma en un objeto JS
app.use(express.json());

//leer body con formato form data
app.use(fileUpload());


//Todo peticiones


//middleware de error 
app.use((error, req, res, next) => {
    console.error(error);
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

//y not found
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not Found'
    });
});



app.listen(PORT, () => console.log(`Server listening at http://localhost:${PORT}`));