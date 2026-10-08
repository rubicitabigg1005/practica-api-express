const express = require('express');
const db = require('./config/db');
require('dotenv').config();

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor API funcionando correctamente');
});

// GET - Obtener todos los productos
app.get('/api/productos', async (req, res) => {
    try {
        const [productos] = await db.query('SELECT * FROM productos');
        res.json(productos);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener los productos'
        });
    }
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const [productos] = await db.query(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );

        if (productos.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(productos[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al obtener el producto'
        });
    }
});

// POST - Crear un producto
app.post('/api/productos', async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;

        const [resultado] = await db.query(
            'INSERT INTO productos (nombre, precio, descripcion) VALUES (?, ?, ?)',
            [nombre, precio, descripcion]
        );

        const [producto] = await db.query(
            'SELECT * FROM productos WHERE id = ?',
            [resultado.insertId]
        );

        res.status(201).json(producto[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al crear el producto'
        });
    }
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const { nombre, precio, descripcion } = req.body;

        const [resultado] = await db.query(
            'UPDATE productos SET nombre = ?, precio = ?, descripcion = ? WHERE id = ?',
            [nombre, precio, descripcion, id]
        );

        if (resultado.affectedRows === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        const [producto] = await db.query(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );

        res.json(producto[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al actualizar el producto'
        });
    }
});

// DELETE - Eliminar un producto
app.delete('/api/productos/:id', async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const [productos] = await db.query(
            'SELECT * FROM productos WHERE id = ?',
            [id]
        );

        if (productos.length === 0) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        await db.query(
            'DELETE FROM productos WHERE id = ?',
            [id]
        );

        res.json({
            mensaje: 'Producto eliminado correctamente',
            producto: productos[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            mensaje: 'Error al eliminar el producto'
        });
    }
});

// Iniciar servidor
app.listen(PORT, async () => {
    try {
        const connection = await db.getConnection();
        console.log('Conectado exitosamente a la base de datos');
        connection.release();

        console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    } catch (error) {
        console.error('Error de conexión a la base de datos:', error.message);
    }
});