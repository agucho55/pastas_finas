const botonesAgregar = document.querySelectorAll(".añadir-tarjeta");

const cartBtn = document.querySelector(".cart-btn");

const cartDropdown = document.getElementById("cart-dropdown");

const cartContent = document.getElementById("cart-content");

const cartNumber = document.querySelector(".cart-num");

const cartItemsOutput = document.getElementById("cart-items-output");

const cartTotalDisplay = document.getElementById("cart-total-display");

// Intentamos recuperar el carrito del localStorage. 
// Como se guarda como texto, usamos JSON.parse para volver a convertirlo en un arreglo de JavaScript.
let carrito = JSON.parse(localStorage.getItem("mi_carrito")) || [];

cartBtn.addEventListener("click", () => {

    cartDropdown.classList.toggle("active");

});

botonesAgregar.forEach((boton) => {
    boton.addEventListener("click", () => {
        const card = boton.closest(".producto-card");
        const nombre = card.querySelector("h3").textContent;
        const precioTexto = card.querySelector(".precio").textContent;
        const precio = parseInt(precioTexto.replace(/[^0-9]/g, ""));

        carrito.push({ nombre, precio });

        // --- NUEVO: Guardamos el carrito actualizado en el almacenamiento local ---
        // (localStorage solo acepta texto plano, por eso usamos JSON.stringify)
        localStorage.setItem("mi_carrito", JSON.stringify(carrito));

        actualizarCarrito();
    });
});

function actualizarCarrito(){

    cartNumber.textContent = carrito.length;
    cartContent.innerHTML = "";

    // 1. Validamos si el contenedor del output del formulario existe en la página actual
    if (cartItemsOutput) {
        cartItemsOutput.innerHTML = "";
    }

    if(carrito.length === 0){

        cartContent.innerHTML = `
            <p class="empty-cart">
                Tu carrito está vacío
            </p>
            <!-- CORRECCIÓN: Ahora apunta al archivo de inicio y a su sección de productos -->
            <a href="i.html#productos" class="go-shopping">
                Ir a comprar
            </a>
        `;

        if (cartTotalDisplay) {
            cartTotalDisplay.textContent = "$0";
        }

        return;
    }

    let total = 0;

    carrito.forEach((producto) => {
        total += producto.precio;

        cartContent.innerHTML += `
            <div class="cart-item">
                <span>${producto.nombre}</span>
                <span>$${producto.precio}</span>
            </div>
        `;

        // 3. Solo agregamos elementos a la lista del resumen si estamos en ventas.html
        if (cartItemsOutput) {
            cartItemsOutput.innerHTML += `
                <li>
                    ${producto.nombre} - $${producto.precio}
                </li>
            `;
        }
    });

    // 4. Solo actualiza el costo total si el elemento existe en la pantalla
    if (cartTotalDisplay) {
        cartTotalDisplay.textContent = `$${total}`;
    }
}

// Buscamos el formulario de la compra
// Buscamos el formulario de la compra en ventas.html
const formularioCompra = document.querySelector("#compra form");

if (formularioCompra) {
    formularioCompra.addEventListener("submit", (e) => {
        // 1. Evitamos que la página se recargue automáticamente
        e.preventDefault(); 

        // 2. Capturamos los datos que el cliente escribió en los inputs
        const nombreClient = document.getElementById("customer-name").value;
        const telefonoClient = document.getElementById("customer-phone").value;
        const direccionClient = document.getElementById("customer-address").value;
        const notasClient = document.getElementById("customer-notes").value || "Ninguna";

        // 3. Empezamos a armar el texto del mensaje
        let mensaje = `*NUEVO PEDIDO - DELICIAS CASERAS*\n\n`;
        mensaje += `*Datos de Entrega:*\n`;
        mensaje += `👤 *Nombre:* ${nombreClient}\n`;
        mensaje += `📞 *Teléfono:* ${telefonoClient}\n`;
        mensaje += `📍 *Dirección:* ${direccionClient}\n`;
        mensaje += `📝 *Notas:* ${notasClient}\n\n`;
        mensaje += `----------------------------------\n`;
        mensaje += `🛒 *Detalle del Pedido:*\n`;

        // 4. Recorremos el arreglo del carrito para listar los productos
        let total = 0;
        carrito.forEach((producto) => {
            mensaje += `• ${producto.nombre} - $${producto.precio}\n`;
            total += producto.precio;
        });

        mensaje += `----------------------------------\n`;
        mensaje += `💰 *TOTAL GENERAL:* $${total}\n\n`;
        mensaje += `¡Muchas gracias! Espero mi pedido.`;

        // 5. Tu número de teléfono (Usá código de país sin el +, ej: 549 para Argentina + tu celular con el 3)
        // Ejemplo: 5493863xxxxxx
        const numeroTelefono = "5493863564018"; 

        // 6. Codificamos el texto para la URL y armamos el enlace final
        const mensajeCodificado = encodeURIComponent(mensaje);
        const urlWhatsApp = `https://wa.me/${numeroTelefono}?text=${mensajeCodificado}`;

        // 7. Vaciamos el carrito (memoria y almacenamiento local) ya que el pedido se envió
        carrito = [];
        localStorage.removeItem("mi_carrito");

        // 8. Redirigimos al usuario a WhatsApp (abre la app o la web)
        window.open(urlWhatsApp, "_blank");

        // Opcional: devolvemos al usuario al inicio de forma limpia
        window.location.href = "i.html";
    });
}


// Buscamos el botón de cancelar compra por su ID
const botonCancelar = document.getElementById("btn-cancelar");

// Si el botón existe en la página actual (ventas.html), le asignamos la función
if (botonCancelar) {
    botonCancelar.addEventListener("click", () => {
        // 1. Vaciamos el arreglo en la memoria de JavaScript
        carrito = [];
        
        // 2. Eliminamos por completo el carrito guardado en el navegador
        localStorage.removeItem("mi_carrito");
        
        // Opcional: Podés dejar un pequeño aviso antes de que redirija
        alert("Compra cancelada. El carrito se ha vaciado.");
    });
}

actualizarCarrito();
