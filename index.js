document.addEventListener('DOMContentLoaded', () => {
    fetch("products.json")
      .then(response => response.json())
      .then(values => {
        const buyCardsContainer = document.querySelector(".buy-cards");
        const cartItemsContainer = document.querySelector(".items-div");
        let cart = JSON.parse(localStorage.getItem('cart')) || []; // Get cart from localStorage (or initialize empty)
  
        // Function to update the cart UI
        function updateCartUI() {
          if (!cartItemsContainer) return; // Ensure the container is available
          cartItemsContainer.innerHTML = ""; // Clear current cart display
          let total = 0;
  
          // Loop through cart items and display them in the cart section
          cart.forEach(product => {
            const cartItemHTML = `
              <div class="item">
                <img src="${product.image}" alt="${product.name}" class="product-img" />
                <div class="name-div">
                  <div>${product.name}</div>
                  <div>#${product.id}</div>
                </div>
                <div class="counter-div">
                  <div>
                    <img src="/icons/minus.svg" alt="minus" class="minus-btn" data-product-name="${product.name}" />
                    <span>${product.quantity}</span>
                    <img src="/icons/plus.svg" alt="plus" class="plus-btn" data-product-name="${product.name}" />
                  </div>
                  <div>$${product.price * product.quantity}</div>
                  <img src="/icons/Close.svg" alt="close" class="close-button" data-product-name="${product.name}" />
                </div>
              </div>
            `;
            cartItemsContainer.innerHTML += cartItemHTML;
            total += product.price * product.quantity; // Add product total to cart total
          });
  
          // Update total cost in the cart section
          const totalCostElement = document.querySelector(".total-cost span");
          if (totalCostElement) {
            totalCostElement.innerHTML = total.toFixed(2);
          }
        }
  
        // Function to add product to cart
        function addToCart(product) {
          const existingProduct = cart.find(item => item.name === product.name);
          if (existingProduct) {
            existingProduct.quantity += 1; // Increase quantity if already in cart
          } else {
            product.quantity = 1; // Otherwise, set quantity to 1
            cart.push(product);
          }
          // Save updated cart to localStorage
          localStorage.setItem('cart', JSON.stringify(cart));
          updateCartUI(); // Update cart UI after adding
        }
  
        // Loop through products and create product cards dynamically
        for (let i = 0; i < 8; i++) {
          const product = values[i % values.length]; // Wrap around if less than 8 products
  
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
  
        // Add event listener for "Buy Now" buttons after dynamically added elements
        document.querySelectorAll(".buy-now-btn").forEach(button => {
          button.addEventListener('click', function () {
            const productId = this.getAttribute("data-product-id");
            const productToAdd = values[productId % values.length]; // Get product by ID
            addToCart(productToAdd); // Add product to cart
            alert(`${productToAdd.name} added to cart!`); // Alert after adding to cart
          });
        });
  
        // Event listener to handle "+" and "-" buttons in the cart
        document.querySelector(".items-div").addEventListener("click", function (event) {
          if (event.target.classList.contains("plus-btn") || event.target.classList.contains("minus-btn")) {
            const productName = event.target.getAttribute("data-product-name");
            const product = cart.find(item => item.name === productName);
  
            if (event.target.classList.contains("plus-btn")) {
              product.quantity += 1;
            } else if (event.target.classList.contains("minus-btn") && product.quantity > 1) {
              product.quantity -= 1;
            }
  
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI(); // Update cart UI after change
          }
  
          // Remove product from cart when "close" button is clicked
          if (event.target.classList.contains("close-button")) {
            const productName = event.target.getAttribute("data-product-name");
            const productIndex = cart.findIndex(item => item.name === productName);
            if (productIndex !== -1) {
              cart.splice(productIndex, 1); // Remove product from cart
            }
            // Save updated cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartUI(); // Update cart UI after removal
          }
        });
  
        // Initialize cart UI on page load
        updateCartUI();
      })
      .catch(error => {
        console.error("Error loading products:", error);
      });
  });
  
  