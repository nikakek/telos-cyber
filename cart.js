// Load cart from localStorage, with a fallback to reset if malformed
let cart;
try {
  cart = JSON.parse(localStorage.getItem("cart")) || [];
  // Ensure every item in cart has an id
  cart = cart.map((item) => ({
    ...item,
    id: item.id || generateUniqueId(),
  }));
} catch (e) {
  console.error("Error parsing cart from localStorage, resetting cart:", e);
  cart = [];
}
localStorage.setItem("cart", JSON.stringify(cart));

function generateUniqueId() {
  return "#" + Math.random().toString(36).substr(2, 9);
}

function addToCart(product) {
  if (!product.id) {
    product.id = generateUniqueId();
  }
  console.log("Adding product to cart:", product);
  const existingProduct = cart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    product.quantity = 1;
    cart.push(product);
  }
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartItemsContainer = document.querySelector(".items-div");
  if (!cartItemsContainer) {
    console.error("Cart items container not found");
    return;
  }
  cartItemsContainer.innerHTML = `<div class="title">Shopping Cart</div>`;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML += `<p>Your cart is empty</p>`;
    updateTotalCost();
    return;
  }

  cart.forEach((product) => {
    console.log("Rendering product:", product);
    const cartItem = document.createElement("div");
    cartItem.classList.add("item");
    const itemPrice = product.price
      ? (parseFloat(product.price.replace("$", "")) * product.quantity).toFixed(
          2
        )
      : "0.00";

    cartItem.innerHTML = `
            <img src="${product.image || "/default.png"}" alt="${
      product.name
    }" class="product-img" />
            <div class="name-div">
                <div>${product.name}</div>
                <div>${product.id || "No ID"}</div>
            </div>
            <div class="counter-div">
                <div>
                    <img src="/icons/minus.svg" alt="minus" class="minus-btn" data-product="${
                      product.id
                    }" />
                    <span>${product.quantity}</span>
                    <img src="/icons/plus.svg" alt="plus" class="plus-btn" data-product="${
                      product.id
                    }" />
                </div>
                <div>$${itemPrice}</div>
                <img src="/icons/Close.svg" alt="close" class="close-button" data-product="${
                  product.id
                }" />
            </div>
        `;
    cartItemsContainer.appendChild(cartItem);
  });

  attachEventListeners();
  updateTotalCost();
}

function attachEventListeners() {
  document.querySelectorAll(".plus-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      console.log("Increasing quantity for ID:", productId);
      const product = cart.find((item) => item.id === productId);
      if (product) {
        product.quantity += 1;
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
      }
    });
  });

  document.querySelectorAll(".minus-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      console.log("Decreasing quantity for ID:", productId);
      const product = cart.find((item) => item.id === productId);
      if (product) {
        if (product.quantity > 1) {
          product.quantity -= 1;
        } else {
          cart = cart.filter((item) => item.id !== productId);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
      }
    });
  });

  document.querySelectorAll(".close-button").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product");
      console.log("Removing product with ID:", productId);
      cart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartUI();
    });
  });
}

function updateTotalCost() {
  let subtotal = cart.reduce(
    (sum, item) =>
      sum + parseFloat(item.price.replace("$", "")) * item.quantity,
    0
  );
  document
    .querySelectorAll(".total-cost span:last-child")
    .forEach((el) => (el.textContent = `$${subtotal.toFixed(2)}`));
}

window.addEventListener("load", updateCartUI);
