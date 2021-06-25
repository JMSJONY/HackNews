require('dotenv').config;
const faker = require('faker/locale/es');
const getDB = require('./db');

const { formatDate, getRandomValue } = require('../helpers');

let connection;


const main = async() => {
    try {

        connection = await getDB();

        //eliminamos tablas
        await connection.query('DROP TABLE IF EXISTS users');
        await connection.query('DROP TABLE IF EXISTS entries');
        await connection.query('DROP TABLE IF EXISTS entries_photos');
        await connection.query('DROP TABLE IF EXISTS entries_ratings');
        await connection.query('DROP TABLE IF EXISTS entries_thems');
        await connection.query('DROP TABLE IF EXISTS entries_coments');
        await connection.query('DROP TABLE IF EXISTS entries_reports');

        console.log('Tablas eliminadas');

        //creacion tabla usuarios
        await connection.query(`
            CREATE TABLE users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(50) NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(512) NOT NULL,
                biografia TEXT,
                avatar VARCHAR(50),
                active BOOLEAN DEFAULT false,
                deleted BOOLEAN DEFAULT false,
                role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
                registrationCode VARCHAR(100),
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME,
                recoverCode VARCHAR(100)
            );
        `);


        //creacion tabla noticias
        await connection.query(`
            CREATE TABLE entries (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                place VARCHAR(100) NOT NULL,
                title VARCHAR(30) NOT NULL,
                lead VARCHAR(50),
                description TEXT,
                views SMALLINT,
                idUser INT NOT NULL,
                createdAt DATETIME NOT NULL,
                modifiedAt DATETIME
                -- id_user INT UNSIGNED NOT NULL
                -- FOREIGN KEY (id_entry) REFERENCES entries (id)
            );
        `);

        //tabla de fotos
        await connection.query(`
             CREATE TABLE entries_photos (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                photo VARCHAR(50) NOT NULL,
                idEntry INT NOT NULL,
                createdAt DATETIME NOT NULL
             );
        `);

        //Tablas temas
        await connection.query(`
            CREATE TABLE entries_thems (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                thems VARCHAR(20)
            );
        `);
        //-- id_entry INT UNSIGNED NOT NULL
        //-- FOREIGN KEY (id_entry) REFERENCES entries (id) 

        //Tabla comentarios
        await connection.query(`
            CREATE TABLE entries_coments (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                coment TEXT
            );
        `);

        /* -- id_entry INT UNSIGNED
        -- FOREIGN KEY (id_entry) REFERENCES entries(id),
        -- id_user INT UNSIGNED
        -- FOREIGN KEY (id_user) REFERENCES users(id) */

        //Tabla valoraciones
        await connection.query(`
            CREATE TABLE entries_ratings (
                 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                vote BOOLEAN DEFAULT TRUE
            );
        `);
        /* -- id_entry INT UNSIGNED
        -- FOREIGN KEY (id_entry) REFERENCES entries(id),
        -- id_user INT UNSIGNED
        -- FOREIGN KEY (id_user) REFERENCES users(id) */


        //Tabla reportes
        await connection.query(`
            CREATE TABLE entries_reports (
                 id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                report TEXT NOT NULL
            );
        `);
        /* -- id_entry INT UNSIGNED
                -- FOREIGN KEY (id_entry) REFERENCES entries(id),
                -- id_user INT UNSIGNED
                -- FOREIGN KEY (id_user) REFERENCES users(id)
 */
        console.log('Tablas creadas');

        //insertamos los dato del user admin
        await connection.query(`
                INSERT INTO users(createdAt, email, password, name, active, role)
                VALUES (
                    "${formatDate(new Date())}",
                     "jmsjonathan92@gmail.com", 
                     SHA2("${process.env.ADMIN_PASSWORD}", 512), 
                     "JONY", 
                     true,
                     "admin"
                )
        `);


        console.log('Usuarios administradores creados');

        // Nº de usuarios que vamos a introducir
        const users = 10;

        // Insertamos los usuarios
        for (let i = 0; i < users; i++) {

            //fecha de creacion.
            const now = formatDate(new Date());

            //Datos de faker
            const email = faker.internet.email();
            const password = faker.internet.password();
            const name = faker.name.findName();


            // guardamos los datos en al base de datos
            await connection.query(`
                INSERT INTO users(createdAt, email, password, name, active)
                VALUES ("${now}", "${email}", SHA2("${password}", 512), "${name}", true) 
            `);

        }
        console.log('Usuarios insertados');

        //Insertamos entradas
        const entries = 100;

        for (let i = 0; i < entries; i++) {
            const now = formatDate(new Date());

            //datos faker
            const place = faker.address.city();
            const title = faker.lorem.words(4);
            const lead = faker.lorem.lines(3);
            const description = faker.lorem.paragraph();
            const idUser = getRandomValue(3, users + 1);


            await connection.query(`
                INSERT INTO entries(createdAt, place,title, lead, description, idUser)
                VALUES ("${now}", "${place}", "${title}", "${lead}", "${description}", ${idUser});
            `);
        }

        console.log('Entradas creadas');


    } catch (error) {

    } finally {
        if (connection) connection.release();
        process.exit(0);
    }
}
main();