const express = require('express');

const app = express();

app.use(express.json());

// Arreglo de productos
let productos = [
    {
        id: 1,
        nombre: "Café Americano",
        precio: 45
    },
    {
        id: 2,
        nombre: "Frappé de Chocolate",
        precio: 65
    },
    {
        id: 3,
        nombre: "Pastel de Chocolate",
        precio: 55
    }
];

const PORT = 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.send('Servidor API funcionando correctamente');
});

// GET - Obtener todos los productos
app.get('/api/productos', (req, res) => {
    res.json(productos);
});

// GET - Obtener un producto por ID
app.get('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    res.json(producto);
});

// POST - Crear un producto
app.post('/api/productos', (req, res) => {
    const nuevoProducto = {
        id: productos.length + 1,
        nombre: req.body.nombre,
        precio: req.body.precio
    };

    productos.push(nuevoProducto);

    res.status(201).json(nuevoProducto);
});

// PUT - Actualizar un producto
app.put('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    producto.nombre = req.body.nombre;
    producto.precio = req.body.precio;

    res.json(producto);
});

app.delete('/api/productos/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const indice = productos.findIndex(p => p.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: "Producto no encontrado"
        });
    }

    const productoEliminado = productos.splice(indice, 1)[0];

    res.json({
        mensaje: "Producto eliminado correctamente",
        producto: productoEliminado
    });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});