/* ==========================================================================
   LÓGICA DE CONTROL DEL ABM - DELICIAS CASERAS (admin.js)
   ========================================================================== */

// PROCEDIMIENTO 1: Inicialización de la "Base de Datos" temporal
// Si el administrador entra por primera vez, cargamos el menú por defecto.
const productosPredeterminados = [
    { id: 1, nombre: "Fideos Caseros", precio: 5000, unidad: "kg", stock: 15, foto: "img/Fideos.jpg" },
    { id: 2, nombre: "Ravioles Artesanales", precio: 6500, unidad: "plancha", stock: 10, foto: "img/Ravioles.jpg" },
    { id: 3, nombre: "Sorrentinos artesanales", precio: 7500, unidad: "plancha", stock: 8, foto: "img/Sorrentinos.jpg" }
];

// Intentamos leer datos previos del localStorage; si no existen, usamos el array de arriba.
let listaProductos = JSON.parse(localStorage.getItem('productos')) || productosPredeterminados;


// PROCEDIMIENTO 2: Mapeo de elementos HTML (Nodos del DOM)
const tbody = document.getElementById('tabla-productos-body');
const form = document.getElementById('form-producto');
const inputId = document.getElementById('prod-id');
const inputNombre = document.getElementById('prod-nombre');
const inputPrecio = document.getElementById('prod-precio');
const inputUnidad = document.getElementById('prod-unidad');
const inputStock = document.getElementById('prod-stock');
const inputFoto = document.getElementById('prod-foto');


// PROCEDIMIENTO 3: Renderizado Automático (Lectura y Mapeo Visual)
// Borra la tabla vieja y vuelve a dibujar fila por fila basándose en los datos actuales.
function renderizarTabla() {
    // Vaciamos el cuerpo de la tabla para no duplicar filas antiguas
    tbody.innerHTML = "";

    // Recorremos el array de pastas activas
    listaProductos.forEach(prod => {
        const fila = document.createElement('tr');
        
        // Estructuramos las celdas usando interpolación de cadenas (${})
        fila.innerHTML = `
            <td><img src="${prod.foto || 'placeholder.jpg'}" class="img-preview" alt="${prod.nombre}"></td>
            <td><strong>${prod.nombre}</strong><br><small style="color:#777">Por ${prod.unidad}</small></td>
            <td>$${prod.precio.toLocaleString()}</td>
            <td>${prod.stock} unidades</td>
            <td>
                <!-- Vinculamos las acciones pasando directamente el ID único del producto -->
                <button class="btn-action btn-edit" onclick="prepararEdicion(${prod.id})">Editar</button>
                <button class="btn-action btn-delete" onclick="eliminarProducto(${prod.id})">Borrar</button>
            </td>
        `;
        // Agregamos de manera física la nueva fila al HTML
        tbody.appendChild(fila);
    });

    // CRUCIAL: Guardamos la lista actualizada en LocalStorage para que los cambios persistan al recargar
    localStorage.setItem('productos', JSON.stringify(listaProductos));
}


// PROCEDIMIENTO 4: Procesar el Formulario (Manejo de ALTAS y MODIFICACIONES)
form.addEventListener('submit', function(event) {
    // Detiene el comportamiento por defecto (que la página se recargue y pierda la memoria)
    event.preventDefault();

    const idExistente = inputId.value;

    // Estructuramos el nuevo formato de producto recolectando los inputs del encargado
    const datosProducto = {
        // Si ya hay un ID lo mantiene (Modificación), si no, genera uno con la fecha exacta en milisegundos (Alta)
        id: idExistente ? parseInt(idExistente) : Date.now(), 
        nombre: inputNombre.value,
        precio: parseInt(inputPrecio.value),
        unidad: inputUnidad.value,
        stock: parseInt(inputStock.value),
        foto: inputFoto.value || "placeholder.jpg"
    };

    if (idExistente) {
        // [ACCION DE MODIFICACIÓN]: Intercambia el producto viejo por el editado buscando coincidencia de ID
        listaProductos = listaProductos.map(p => p.id === parseInt(idExistente) ? datosProducto : p);
    } else {
        // [ACCION DE ALTA]: Agrega el nuevo producto al final del listado general
        listaProductos.push(datosProducto);
    }

    // Refrescamos la pantalla para mostrar los cambios
    renderizarTabla();
    
    // Reseteamos por completo los campos del formulario
    form.reset();
    inputId.value = ""; 
});


// PROCEDIMIENTO 5: Eliminar del Registro (Manejo de BAJAS)
// Exponemos la función de manera global (window.) para que los botones dinámicos de la tabla puedan acceder a ella.
window.eliminarProducto = function(id) {
    // Alerta nativa de confirmación para evitar borrados accidentales
    if (confirm("¿Estás seguro de que deseas eliminar este producto del catálogo?")) {
        // Filtramos el array: nos quedamos con todos los productos MENOS el que coincide con el ID seleccionado
        listaProductos = listaProductos.filter(p => p.id !== id);
        
        // Actualizamos los cambios visibles en la tabla
        renderizarTabla();
    }
};


// PROCEDIMIENTO 6: Cargar datos en el formulario para Editar
window.prepararEdicion = function(id) {
    // Buscamos el ítem exacto que el usuario seleccionó para modificar
    const prod = listaProductos.find(p => p.id === id);
    
    if (prod) {
        // Trasladamos los datos actuales de la memoria a los inputs del formulario
        inputId.value = prod.id;
        inputNombre.value = prod.nombre;
        inputPrecio.value = prod.precio;
        inputUnidad.value = prod.unidad;
        inputStock.value = prod.stock;
        inputFoto.value = prod.foto;
        
        // Hacemos foco automático en el primer input para comodidad del usuario encargado
        inputNombre.focus();
    }
};


// INICIALIZACIÓN: Ejecutamos el renderizado por primera vez al cargar la interfaz
renderizarTabla();


// ¿Cómo sigue tu trabajo grupal ahora?
// Ya tienes tus archivos limpios. Lo genial de esta arquitectura es que tus compañeros encargados de maquetar la tienda pública solo tendrán que incorporar este pequeño bloque al inicio de su propio archivo JavaScript:

// // Así tus compañeros cargan en la tienda del cliente lo que tú guardaste en el panel de control
// let productosTienda = JSON.parse(localStorage.getItem('productos')) || [];