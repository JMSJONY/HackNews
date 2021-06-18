const path = require('path');
const uuid = require('uuid');
const sharp = require('sharp');
const crypto = require('crypto');
//const sgMail = require('@sendgrid/mail');
const { format } = require('date-fns');
const { ensureDir, unlink } = require('fs-extra');

const { UPLOADS_DIRECTORY } = process.env;
const uploadsDir = path.join(__dirname, UPLOADS_DIRECTORY);

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);


//Formatear fecha
function formatDate(date) {
    return format(date, 'yyyy-MM-dd HH:mm:ss');
}


//Valor aleatorio
function getRandomValue(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}


//Guardar imagen
async function savePhoto(imageData) {

    await ensureDir(uploadsDir);

    const image = sharp(imageData.data);

    const imageInfo = await image.metadata();

    const IMAGE_MAX_WIDTH = 500;

    if (imageInfo.width > IMAGE_MAX_WIDTH) {
        image.resize(IMAGE_MAX_WIDTH);
    }

    const savedImageName = `${uuid.v4()}.jpg`;

    const imagePath = path.join(uploadsDir, savedImageName);

    await image.toFile(imagePath);

    return savedImageName;
}


//Borrar imagen
async function deletePhoto(photoName) {
    const photoPath = path.join(uploadsDir, photoName);
    await unlink(photoPath);
}


//Generador Random String
function generateRandomString(length) {
    return crypto.randomBytes(length).toString('hex');
}


//Enviar email
/* async function sendMail({ to, subject, body }) {
    try {
        const msg = {
            to,
            from: process.env.SENDGRID_FROM,
            subject,
            text: body,
            html: `
                <div>
                    <h1>${subject}</h1>
                    <p>${body}</p>
                </div>`,
        };
        await sgMail.send(msg);
    } catch (error) {
        throw new Error('Error enviando email');
    }
} */


//Validar esquema
async function validate(schema, data) {
    try {
        await schema.validateAsync(data);
    } catch (error) {
        error.httpStatus = 400;
        throw error;
    }
}


module.exports = {
    formatDate,
    getRandomValue,
    savePhoto,
    deletePhoto,
    generateRandomString,
    validate,
};