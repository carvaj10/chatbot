const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

const { createTable, createUsersTable } = require('./config/database');
const authRoutes = require('./routes/auth');
const eventsRoutes = require('./routes/events');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware de seguridad
app.use(helmet());

// Middleware de logging
app.use(morgan('combined'));

// Middleware de CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

// Middleware para parsear JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({
        message: 'Servidor funcionando correctamente',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Ruta raíz
app.get('/', (req, res) => {
    res.json({
        message: 'API de Gestión de Eventos de Calendario',
        version: '1.0.0',
        endpoints: {
            auth: '/api/auth',
            events: '/api/events',
            health: '/api/health'
        }
    });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Middleware para rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Ruta no encontrada' });
});

// Inicializar base de datos y servidor
const startServer = async () => {
    try {
        // Crear tablas
        await createTable();
        await createUsersTable();

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`📊 API disponible en http://localhost:${PORT}`);
            console.log(`🔐 Endpoints de autenticación: http://localhost:${PORT}/api/auth`);
            console.log(`📅 Endpoints de eventos: http://localhost:${PORT}/api/events`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar el servidor:', error);
        process.exit(1);
    }
};

startServer(); 