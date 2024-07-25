document.addEventListener('DOMContentLoaded', () => {
  // Fetch products from the backend and update item cards
  fetch('/api/products') // Adjust the endpoint as needed
    .then(response => response.json())
    .then(products => {
      const itemsContainer = document.querySelector('.items');
      itemsContainer.innerHTML = ''; // Clear existing items
      
      products.forEach(product => {
        const itemCard = document.createElement('div');
        itemCard.classList.add('item-card');
        
        itemCard.innerHTML = `
          <img src="${product.image}" alt="${product.name}">
          <div class="item-details">
            <h4>${product.name}</h4>
            <h5>${product.itemCode}</h5>
            <p style="font-weight: 500;">Categories:  ${product.category}</p>
            <p class="description">${product.description}</p>
            <div class="buttons">
              <p class="price">$<span style="color: black;">${product.retailPrice.toFixed(2)}</span></p>
              <button class="add" data-item-id="${product._id}">+</button>
              <p class="qtty" data-item-id="${product._id}">0</p>
              <button class="minus" data-item-id="${product._id}">-</button>
            </div>
          </div>
        `;
        
        itemsContainer.appendChild(itemCard);
      });

      // Attach event listeners to dynamically created buttons
      document.querySelectorAll('.add').forEach(button => {
        button.addEventListener('click', (e) => {
          const itemId = e.target.getAttribute('data-item-id');
          updateQuantity(itemId, 1);
        });
      });

      document.querySelectorAll('.minus').forEach(button => {
        button.addEventListener('click', (e) => {
          const itemId = e.target.getAttribute('data-item-id');
          updateQuantity(itemId, -1);
        });
      });
    })
    .catch(error => console.error('Error fetching products:', error));

  function updateQuantity(itemId, change) {
    const quantityElement = document.querySelector(`.qtty[data-item-id="${itemId}"]`);
    let quantity = parseInt(quantityElement.textContent);
    quantity = Math.max(quantity + change, 0); // Prevent negative quantity
    quantityElement.textContent = quantity;
    updateCartCount();
  }

  function updateCartCount() {
    const cartCount = Array.from(document.querySelectorAll('.qtty')).reduce((total, qtyElem) => {
      return total + parseInt(qtyElem.textContent);
    }, 0);
    document.querySelector('.cart-count').textContent = cartCount;
  }

  // Event listener for checkout popup
  document.querySelector('#checkoutButton').addEventListener('click', () => {
    const items = Array.from(document.querySelectorAll('.item-card'));
    let totalAmount = 0;

    items.forEach(item => {
      const quantity = parseInt(item.querySelector('.qtty').textContent);
      const price = parseFloat(item.querySelector('.price span').textContent);
      totalAmount += quantity * price;
    });

    document.querySelector('#totalAmount').value = totalAmount.toFixed(2);
    document.querySelector('#checkoutPopup').classList.remove('hidden');
  });

  document.querySelector('#confirmPayment').addEventListener('click', () => {
    const totalAmount = parseFloat(document.querySelector('#totalAmount').value);
    const amountPaid = parseFloat(document.querySelector('#amountPaid').value);

    if (amountPaid < totalAmount) {
      alert('Amount paid is less than total amount!');
      return;
    }

    const changeToReturn = amountPaid - totalAmount;
    document.querySelector('#changeToReturn').value = changeToReturn.toFixed(2);

    // Logic to save the sale in the sales history can be added here

    // Close the popup
    document.querySelector('#checkoutPopup').classList.add('hidden');
    resetCart();
  });

  // Event listener for close button in checkout popup
  document.querySelector('#closePopup').addEventListener('click', () => {
    document.querySelector('#checkoutPopup').classList.add('hidden');
  });

  function resetCart() {
    document.querySelectorAll('.qtty').forEach(qtyElem => {
      qtyElem.textContent = '0';
    });
    updateCartCount();
  }
});
