
const API_URL = 'http://localhost:3000/api/productos';

let miGrafica = null;

// Obtener los productos de la API
async function cargarProductos() {
    const tabla = document.getElementById('tabla-datos');
    const mensaje = document.getElementById('mensaje');

    try {
        mensaje.textContent = 'Cargando productos...';

        const respuesta = await fetch(API_URL);

        if (!respuesta.ok) {
            throw new Error('No se pudieron obtener los productos');
        }

        const productos = await respuesta.json();

        // Limpiar la tabla
        tabla.innerHTML = '';

        // Verificar si existen productos
        if (productos.length === 0) {
            mensaje.textContent = 'No hay productos registrados.';
            crearGrafica([], []);
            return;
        }

        mensaje.textContent =
            `Se encontraron ${productos.length} productos.`;

        // Arreglos para la gráfica
        const nombres = [];
        const precios = [];

        // Mostrar productos en la tabla
        productos.forEach(producto => {
            const fila = document.createElement('tr');

            const celdaId = document.createElement('td');
            celdaId.textContent = producto.id;

            const celdaNombre = document.createElement('td');
            celdaNombre.textContent = producto.nombre;

            const celdaPrecio = document.createElement('td');
            celdaPrecio.textContent =
                `$${Number(producto.precio).toFixed(2)}`;

            const celdaDescripcion = document.createElement('td');
            celdaDescripcion.textContent = producto.descripcion;

            fila.append(
                celdaId,
                celdaNombre,
                celdaPrecio,
                celdaDescripcion
            );

            tabla.appendChild(fila);

            nombres.push(producto.nombre);
            precios.push(Number(producto.precio));
        });

        // Crear la gráfica con los datos recibidos
        crearGrafica(nombres, precios);

    } catch (error) {
        console.error('Error:', error);

        mensaje.textContent =
            'No se pudieron cargar los productos. Verifica que la API esté funcionando.';
    }
}

// Crear gráfica de barras con Chart.js
function crearGrafica(nombres, precios) {
    const canvas = document.getElementById('miGrafica');

    if (miGrafica) {
        miGrafica.destroy();
    }

    miGrafica = new Chart(canvas, {
        type: 'bar',

        data: {
            labels: nombres,

            datasets: [{
                label: 'Precio de los productos ($)',
                data: precios,
                backgroundColor: [
                    '#8B5E3C',
                    '#C49A6C',
                    '#D8B89C',
                    '#A47148',
                    '#E6CCB2',
                    '#6F4E37'
                ],
                borderColor: '#5B3828',
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,

            plugins: {
                legend: {
                    display: true
                },
                title: {
                    display: true,
                    text: 'Comparación de precios'
                }
            },

            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Precio en pesos'
                    }
                },

                x: {
                    title: {
                        display: true,
                        text: 'Productos'
                    }
                }
            }
        }
    });
}

// Ejecutar al cargar la página
document.addEventListener('DOMContentLoaded', cargarProductos);
