const express = require('express');
const { body, validationResult } = require('express-validator');
const { pool } = require('../config/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Obtener todos los eventos
router.get('/', auth, async (req, res) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const offset = (page - 1) * limit;

        let query = 'SELECT * FROM calendar_events';
        let countQuery = 'SELECT COUNT(*) FROM calendar_events';
        let queryParams = [];
        let whereConditions = [];

        // Filtros
        if (req.query.category) {
            whereConditions.push(`category = $${queryParams.length + 1}`);
            queryParams.push(req.query.category);
        }

        if (search) {
            whereConditions.push(`(title ILIKE $${queryParams.length + 1} OR description ILIKE $${queryParams.length + 1} OR location ILIKE $${queryParams.length + 1} OR category ILIKE $${queryParams.length + 1})`);
            queryParams.push(`%${search}%`);
        }

        if (whereConditions.length > 0) {
            const whereClause = ' WHERE ' + whereConditions.join(' AND ');
            query += whereClause;
            countQuery += whereClause;
        }

        // Ordenar por fecha de inicio
        query += ' ORDER BY start_datetime DESC';

        // Paginación
        query += ` LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}`;
        queryParams.push(limit, offset);

        const [eventsResult, countResult] = await Promise.all([
            pool.query(query, queryParams),
            pool.query(countQuery, queryParams.slice(0, -2))
        ]);

        const totalEvents = parseInt(countResult.rows[0].count);
        const totalPages = Math.ceil(totalEvents / limit);

        res.json({
            events: eventsResult.rows,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                totalEvents,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });

    } catch (error) {
        console.error('Error al obtener eventos:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener un evento específico
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query('SELECT * FROM calendar_events WHERE id = $1', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error('Error al obtener evento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Crear nuevo evento
router.post('/', auth, [
    body('title').notEmpty().withMessage('El título es requerido'),
    body('start_datetime').isISO8601().withMessage('Fecha de inicio inválida'),
    body('end_datetime').isISO8601().withMessage('Fecha de fin inválida'),
    body('location').optional().isString().withMessage('La ubicación debe ser texto'),
    body('category').optional().isString().withMessage('La categoría debe ser texto'),
    body('is_all_day').optional().isBoolean().withMessage('is_all_day debe ser booleano')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const {
            title,
            description,
            start_datetime,
            end_datetime,
            location,
            category = 'general',
            is_all_day = false
        } = req.body;

        // Verificar que la fecha de fin sea posterior a la de inicio
        if (new Date(end_datetime) <= new Date(start_datetime)) {
            return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio' });
        }

        const result = await pool.query(
            `INSERT INTO calendar_events 
       (title, description, start_datetime, end_datetime, location, category, is_all_day) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
            [title, description, start_datetime, end_datetime, location, category, is_all_day]
        );

        res.status(201).json({
            message: 'Evento creado exitosamente',
            event: result.rows[0]
        });

    } catch (error) {
        console.error('Error al crear evento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Actualizar evento
router.put('/:id', auth, [
    body('title').optional().notEmpty().withMessage('El título no puede estar vacío'),
    body('start_datetime').optional().isISO8601().withMessage('Fecha de inicio inválida'),
    body('end_datetime').optional().isISO8601().withMessage('Fecha de fin inválida'),
    body('location').optional().isString().withMessage('La ubicación debe ser texto'),
    body('category').optional().isString().withMessage('La categoría debe ser texto'),
    body('is_all_day').optional().isBoolean().withMessage('is_all_day debe ser booleano')
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;
        const updateFields = req.body;

        // Verificar que el evento existe
        const existingEvent = await pool.query('SELECT * FROM calendar_events WHERE id = $1', [id]);
        if (existingEvent.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        // Verificar fechas si se están actualizando
        if (updateFields.start_datetime && updateFields.end_datetime) {
            if (new Date(updateFields.end_datetime) <= new Date(updateFields.start_datetime)) {
                return res.status(400).json({ message: 'La fecha de fin debe ser posterior a la fecha de inicio' });
            }
        }

        // Construir query de actualización dinámicamente
        const setClause = [];
        const values = [];
        let paramCount = 1;

        Object.keys(updateFields).forEach(key => {
            if (updateFields[key] !== undefined) {
                setClause.push(`${key} = $${paramCount}`);
                values.push(updateFields[key]);
                paramCount++;
            }
        });

        if (setClause.length === 0) {
            return res.status(400).json({ message: 'No hay campos para actualizar' });
        }

        setClause.push(`updated_at = CURRENT_TIMESTAMP`);
        values.push(id);

        const query = `
      UPDATE calendar_events 
      SET ${setClause.join(', ')} 
      WHERE id = $${paramCount} 
      RETURNING *
    `;

        const result = await pool.query(query, values);

        res.json({
            message: 'Evento actualizado exitosamente',
            event: result.rows[0]
        });

    } catch (error) {
        console.error('Error al actualizar evento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Eliminar evento
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query('DELETE FROM calendar_events WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Evento no encontrado' });
        }

        res.json({ message: 'Evento eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar evento:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

// Obtener estadísticas de eventos
router.get('/stats/summary', auth, async (req, res) => {
    try {
        const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_events,
        COUNT(CASE WHEN start_datetime >= CURRENT_DATE THEN 1 END) as upcoming_events,
        COUNT(CASE WHEN start_datetime < CURRENT_DATE THEN 1 END) as past_events,
        COUNT(CASE WHEN is_all_day = true THEN 1 END) as all_day_events,
        COUNT(CASE WHEN is_all_day = false THEN 1 END) as timed_events
      FROM calendar_events
    `);

        res.json(stats.rows[0]);

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router; 