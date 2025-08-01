const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Crear la tabla calendar_events si no existe
const createTable = async () => {
    try {
        const createTableQuery = `
          CREATE TABLE IF NOT EXISTS calendar_events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            start_datetime TIMESTAMP NOT NULL,
            end_datetime TIMESTAMP NOT NULL,
            location VARCHAR(300),
            category VARCHAR(50) DEFAULT 'general',
            is_all_day BOOLEAN DEFAULT false,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `;

        await pool.query(createTableQuery);
        console.log('✅ Tabla calendar_events creada o verificada correctamente');

        // Insertar algunos datos de ejemplo
        const checkData = await pool.query('SELECT COUNT(*) FROM calendar_events');
        if (parseInt(checkData.rows[0].count) === 0) {
            const insertSampleData = `
        INSERT INTO calendar_events (title, description, start_datetime, end_datetime, location, category, is_all_day) VALUES
        ('Reunión con Cliente A', 'Discutir propuesta de proyecto', '2024-01-15 10:00:00', '2024-01-15 11:00:00', 'Oficina Principal', 'reunión', false),
        ('Presentación de Ventas', 'Presentar nuevos productos al equipo', '2024-01-16 14:00:00', '2024-01-16 15:30:00', 'Sala de Conferencias', 'presentación', false),
        ('Entrevista de Trabajo', 'Entrevista para posición de desarrollador', '2024-01-17 09:00:00', '2024-01-17 10:00:00', 'Oficina de RRHH', 'entrevista', false),
        ('Día Completo de Capacitación', 'Capacitación del equipo en nuevas tecnologías', '2024-01-18 00:00:00', '2024-01-18 23:59:59', 'Centro de Capacitación', 'capacitación', true),
        ('Consulta de Seguimiento', 'Revisión de proyecto en curso', '2024-01-19 16:00:00', '2024-01-19 17:00:00', 'Sala de Juntas', 'consulta', false);
      `;
            await pool.query(insertSampleData);
            console.log('✅ Datos de ejemplo insertados correctamente');
        }
    } catch (error) {
        console.error('❌ Error al crear la tabla:', error);
    }
};

// Crear tabla de usuarios si no existe
const createUsersTable = async () => {
    try {
        const createUsersTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

        await pool.query(createUsersTableQuery);
        console.log('✅ Tabla users creada o verificada correctamente');
    } catch (error) {
        console.error('❌ Error al crear la tabla users:', error);
    }
};

module.exports = {
    pool,
    createTable,
    createUsersTable
}; 