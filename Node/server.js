require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const { PORT } = process.env;

//Todo Middlewares



//Todo Controladores entradas


//Todo Controladores usuarios



//logger
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