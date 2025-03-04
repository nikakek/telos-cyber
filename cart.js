let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(product) {
    const existingProduct = cart.find(item => item.name === product.name);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.querySelector('.items-div');
    cartItemsContainer.innerHTML = `<div class="title">Shopping Cart</div>`;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML += `<p>Your cart is empty</p>`;
        updateTotalCost();
        return;
    }

    cart.forEach(product => {
        console.log("Rendering product:", product); // Debugging
        const cartItem = document.createElement('div');
        cartItem.classList.add('item');

        // Ensure price is defined and correctly multiplied by quantity
        const itemPrice = product.price ? (product.price * product.quantity).toFixed(2) : "0.00";

        cartItem.innerHTML = `
            <img src="${product.image || '/default.png'}" alt="${product.name}" class="product-img" />
            <div class="name-div">
                <div>${product.name}</div>
                <div>ID: ${product.id || 'No ID'}</div>
            </div>
            <div class="counter-div">
                <div>
                    <img src="/icons/minus.svg" alt="minus" class="minus-btn" data-product="${product.name}" />
                    <span>${product.quantity}</span>
                    <img src="/icons/plus.svg" alt="plus" class="plus-btn" data-product="${product.name}" />
                </div>
                <div>$${itemPrice}</div>
                <img src="/icons/Close.svg" alt="close" class="close-button" data-product="${product.name}" />
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    attachEventListeners();
    updateTotalCost();
}



function attachEventListeners() {
    document.querySelectorAll('.plus-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const product = cart.find(item => item.name === productName);
            if (product) {
                product.quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartUI();
            }
        });
    });

    document.querySelectorAll('.minus-btn').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            const product = cart.find(item => item.name === productName);
            if (product && product.quantity > 1) {
                product.quantity -= 1;
            } else {
                cart = cart.filter(item => item.name !== productName);
            }
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        });
    });

    document.querySelectorAll('.close-button').forEach(button => {
        button.addEventListener('click', function() {
            const productName = this.getAttribute('data-product');
            cart = cart.filter(item => item.name !== productName);
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI();
        });
    });
}

function updateTotalCost() {
    let subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelectorAll('.total-cost span:last-child').forEach(el => el.textContent = `$${subtotal}`);
}

// Example product to add (remove this in actual usage, just for testing)
document.querySelectorAll('.buy-now-btn')?.forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.buy-card-div');
        const product = {
            id: "#25139526913984",
            name: "Apple iPhone 14 Pro Max 128Gb Deep Purple",
            image: "/images/card-iphone.svg",
            price: 1399
        };
        addToCart(product);
    });
});

window.addEventListener('load', updateCartUI);



document.querySelectorAll('.buy-now-btn')?.forEach(button => {
    button.addEventListener('click', function() {
        const card = this.closest('.buy-card-div');
        const product = {
            id: "#25139526913984",
            name: "Apple iPhone 14 Pro Max 128Gb Deep Purple",
            image: "/images/card-iphone.svg",
            price: 1399
        };
        addToCart(product);
        updateCartUI(); // 💡 This updates the cart live
    });
});