const botonesAgregar = document.querySelectorAll(".añadir-tarjeta");

const cartBtn = document.querySelector(".cart-btn");

const cartDropdown = document.getElementById("cart-dropdown");

const cartContent = document.getElementById("cart-content");

const cartNumber = document.querySelector(".cart-num");

const cartItemsOutput = document.getElementById("cart-items-output");

const cartTotalDisplay = document.getElementById("cart-total-display");

let carrito = [];

cartBtn.addEventListener("click", () => {

    cartDropdown.classList.toggle("active");

});

botonesAgregar.forEach((boton) => {

    boton.addEventListener("click", () => {

        const card = boton.closest(".producto-card");

        const nombre =
            card.querySelector("h3").textContent;

        const precioTexto =
            card.querySelector(".precio").textContent;

        const precio = parseInt(
            precioTexto.replace(/[^0-9]/g, "")
        );

        carrito.push({
            nombre,
            precio
        });

        actualizarCarrito();

    });

});

function actualizarCarrito(){

    cartNumber.textContent = carrito.length;

    cartItemsOutput.innerHTML = "";

    cartContent.innerHTML = "";

    if(carrito.length === 0){

        cartContent.innerHTML = `
            <p class="empty-cart">
                Tu carrito está vacío
            </p>

            <a href="#productos" class="go-shopping">
                Ir a comprar
            </a>
        `;

        cartTotalDisplay.textContent = "$0";

        return;
    }

    let total = 0;

    carrito.forEach((producto) => {

        total += producto.precio;

        cartContent.innerHTML += `
            <div class="cart-item">

                <span>
                    ${producto.nombre}
                </span>

                <span>
                    $${producto.precio}
                </span>

            </div>
        `;

        cartItemsOutput.innerHTML += `
            <li>
                ${producto.nombre} - $${producto.precio}
            </li>
        `;

    });

    cartTotalDisplay.textContent = `$${total}`;

}

actualizarCarrito();
