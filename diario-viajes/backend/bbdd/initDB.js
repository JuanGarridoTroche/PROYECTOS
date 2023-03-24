require('dotenv').config();

// Importamos la función que retorna una conexión libre con la BBDD.
const getConnection = require('./getConnection');

const bcrypt = require('bcrypt');

const main = async () => {
    let connection;

    try {
        // Intentamos obtener una conexión de las 10 conexiones libres que tenemos.
        connection = await getConnection();

        console.log('Borrando tablas...');

        await connection.query('DROP TABLE IF EXISTS entryVotes');
        await connection.query('DROP TABLE IF EXISTS entryPhotos');
        await connection.query('DROP TABLE IF EXISTS entries');
        await connection.query('DROP TABLE IF EXISTS users');

        console.log('Creando tablas...');

        await connection.query(`
            CREATE TABLE IF NOT EXISTS users (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                username VARCHAR(30) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password VARCHAR(100) NOT NULL,
                avatar VARCHAR(100),
                role ENUM('admin', 'normal') DEFAULT 'normal',
                registrationCode VARCHAR(100),
                recoverPassCode VARCHAR(20),
                active BOOLEAN DEFAULT false,
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS entries (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                title VARCHAR(30) NOT NULL,
                place VARCHAR(30) NOT NULL,
                description TEXT NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                createdAt TIMESTAMP NOT NULL
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS entryPhotos (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                name VARCHAR(100) NOT NULL,
                idEntry INT UNSIGNED NOT NULL,
                FOREIGN KEY (idEntry) REFERENCES entries(id),
                createdAt TIMESTAMP NOT NULL,
                modifiedAt TIMESTAMP
            )
        `);

        await connection.query(`
            CREATE TABLE IF NOT EXISTS entryVotes (
                id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
                value TINYINT UNSIGNED NOT NULL,
                idUser INT UNSIGNED NOT NULL,
                FOREIGN KEY (idUser) REFERENCES users(id),
                idEntry INT UNSIGNED NOT NULL,
                FOREIGN KEY (idEntry) REFERENCES entries(id),
                createdAt TIMESTAMP NOT NULL
            )
        `);

        console.log('¡Tablas creadas!');

        // Encriptamos la contraseña contraseña del admin.
        const adminPass = await bcrypt.hash(process.env.ADMIN_PASS, 10);

        // Insertamos el usuario administrador.
        await connection.query(
            `
                INSERT INTO users (username, email, password, role, active, createdAt)
                VALUES ('admin', 'admin@admin.com', ?, 'admin', true, ?)
            `,
            [adminPass, new Date()]
        );

        console.log('¡Usuario administrador creado!');
    } catch (err) {
        console.error(err);
    } finally {
        if (connection) connection.release();

        // Cerramos el proceso.
        process.exit();
    }
};

// Ejecutamos la función main.
main();
