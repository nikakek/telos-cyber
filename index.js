document.addEventListener("DOMContentLoaded", () => {
  const buyCardsContainer = document.querySelector(".buy-cards");
  const cartItemsContainer = document.querySelector(".items-div");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartUI() {
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((product) => {
      const cartItemHTML = `
        <div class="item">
          <img src="${product.image}" alt="${
        product.name
      }" class="product-img" />
          <div class="name-div">
            <div>${product.name}</div>
            <div>#${product.id}</div>
          </div>
          <div class="counter-div">
            <div>
              <img src="/icons/minus.svg" alt="minus" class="minus-btn" data-product-name="${
                product.name
              }" />
              <span>${product.quantity}</span>
              <img src="/icons/plus.svg" alt="plus" class="plus-btn" data-product-name="${
                product.name
              }" />
            </div>
            <div>$${product.price * product.quantity}</div>
            <img src="/icons/Close.svg" alt="close" class="close-button" data-product-name="${
              product.name
            }" />
          </div>
        </div>
      `;
      cartItemsContainer.innerHTML += cartItemHTML;
      total += product.price * product.quantity;
    });

    const totalCostElement = document.querySelector(".total-cost span");
    if (totalCostElement) {
      totalCostElement.innerHTML = total.toFixed(2);
    }
  }

  function addToCart(product) {
    const existingProduct = cart.find((item) => item.name === product.name);
    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      product.quantity = 1;
      cart.push(product);
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  fetch("products.json")
    .then((response) => response.json())
    .then((values) => {
      for (let i = 0; i < 8; i++) {
        const product = values[i % values.length];
        const cardHTML = `
          <div class="buy-card-div">
            <img src="/icons/heart-icon.svg" alt="heart">
            <img src="${product.image}" alt="${product.name}" class="item-image">
            <div class="buy-card-div-text">
              <div class="item-name">${product.name}</div>
              <h4 class="item-price">${product.price}</h4>
              <div class="buy-now-black">
                <button class="buy-now-btn" data-product-id="${i}">Buy Now</button>
              </div>
            </div>
          </div>
        `;
        buyCardsContainer.innerHTML += cardHTML;
      }

      document.querySelectorAll(".buy-now-btn").forEach((button) => {
        button.addEventListener("click", function () {
          const productId = this.getAttribute("data-product-id");
          const productToAdd = values[productId];
          addToCart(productToAdd);
          alert(`${productToAdd.name} added to cart!`);
        });
      });
    })
    .catch((error) => console.error("Error loading products:", error));

  fetch("discounts.json")
    .then((response) => response.json())
    .then((discounts) => {
      const discountCardsContainer = document.querySelector(".discount-cards");
      discountCardsContainer.innerHTML = "";

      discounts.forEach((discount, index) => {
        const discountCardHTML = `
          <div class="buy-card-div">
            <img src="/icons/heart-icon.svg" alt="heart">
            <img src="${discount.image}" alt="${discount.name}" class="item-image">
            <div class="buy-card-div-text">
              <div class="item-name">${discount.name}</div>
              <h4 class="item-price">${discount.price}</h4>
              <div class="buy-now-black">
                <button class="buy-now-btn" data-product-id="${index}">Buy Now</button>
              </div>
            </div>
          </div>
        `;
        discountCardsContainer.innerHTML += discountCardHTML;
      });

      document
        .querySelectorAll(".discount-cards .buy-now-btn")
        .forEach((button) => {
          button.addEventListener("click", function () {
            const productId = this.getAttribute("data-product-id");
            const productToAdd = discounts[productId];
            addToCart(productToAdd);
            alert(`${productToAdd.name} added to cart!`);
          });
        });
    })
    .catch((error) => console.error("Error loading discounts:", error));

  updateCartUI();
});
