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
              itemCard.dataset.itemId = product._id; // Corrected to dataset.itemId
              itemCard.dataset.itemName = product.name.toLowerCase();
              itemCard.dataset.itemCode = product.itemCode.toLowerCase();
              itemCard.dataset.category = product.category.toLowerCase(); // Added category

              itemCard.innerHTML = `
                  <img src="${product.image}" alt="${product.name}" loading="lazy">
                  <div class="item-details loading="lazy"">
                      <h4>${product.name}</h4>
                      <h5>${product.itemCode}</h5>
                      <p style="font-weight: 500;">Categories: ${product.category}</p>
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

  const resizeBtn = document.querySelector("[data-resize-btn]");
  resizeBtn.addEventListener("click", function (e) {
      e.preventDefault();
      document.body.classList.toggle("sb-expanded");
  });

  const categories = document.querySelectorAll('.category');
  categories.forEach((category, index) => {
      setTimeout(() => {
          category.classList.add('show');
      }, index * 100); // Adjust the delay (100ms) as needed
  });

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

  // Event listener for search input
  document.querySelector('.search-bar input').addEventListener('input', (e) => {
      const searchTerm = e.target.value.toLowerCase();
      const itemsContainer = document.querySelector('.items');
      const itemCards = Array.from(document.querySelectorAll('.item-card'));

      itemCards.forEach(card => {
          const itemName = card.dataset.itemName;
          const itemCode = card.dataset.itemCode;

          if (itemName.includes(searchTerm) || itemCode.includes(searchTerm)) {
              card.classList.remove('hidden');
              // Move the matching card to the top
              itemsContainer.prepend(card);
          } else {
              card.classList.add('hidden');
          }
      });
  });

  // Event listener for category filter
  document.querySelectorAll('.category').forEach(category => {
      category.addEventListener('click', (e) => {
          const selectedCategory = e.currentTarget.dataset.category.toLowerCase();
          const itemsContainer = document.querySelector('.items');
          const itemCards = Array.from(document.querySelectorAll('.item-card'));

          if (selectedCategory === 'all') {
              itemCards.forEach(card => {
                  card.classList.remove('hidden');
              });
              document.querySelector('#categoryTitle').textContent = 'All Items'; // Assuming you have an element with this id
          } else {
              itemCards.forEach(card => {
                  if (card.dataset.category === selectedCategory) {
                      card.classList.remove('hidden');
                      itemsContainer.prepend(card); // Move to the top
                  } else {
                      card.classList.add('hidden');
                  }
              });
              document.querySelector('#categoryTitle').textContent = `${e.currentTarget.textContent} Items`; // Update title
          }
      });
  });

  function openCheckoutPopup() {
      const items = Array.from(document.querySelectorAll('.item-card'));
      const itemsListContainer = document.querySelector('#itemsList');
      itemsListContainer.innerHTML = ''; // Clear previous items list
      let totalAmount = 0;

      items.forEach(item => {
          const quantity = parseInt(item.querySelector('.qtty').textContent);
          if (quantity > 0) {
              const itemName = item.querySelector('h4').textContent;
              const itemCode = item.querySelector('h5').textContent;
              const price = parseFloat(item.querySelector('.price span').textContent);
              const itemTotalPrice = quantity * price;
              totalAmount += itemTotalPrice;

              const row = document.createElement('tr');
              row.innerHTML = `
                  <td>${itemCode}</td>
                  <td>${itemName}</td>
                  <td>${quantity}</td>
                  <td>$${price.toFixed(2)}</td>
                  <td>$${itemTotalPrice.toFixed(2)}</td>
              `;
              itemsListContainer.appendChild(row);
          }
      });

      document.querySelector('#totalAmount').value = totalAmount.toFixed(2);
      document.querySelector('#checkoutPopup').classList.remove('hidden');

      // Add event listener for amount paid input
      document.querySelector('#amountPaid').addEventListener('input', (e) => {
          const amountPaid = parseFloat(e.target.value) || 0;
          const changeToReturn = amountPaid - totalAmount;
          document.querySelector('#changeToReturn').value = changeToReturn.toFixed(2);
      });
  }

  function closeCheckoutPopup() {
      document.querySelector('#checkoutPopup').classList.add('hidden');
  }

  function confirmPayment() {
      const totalAmount = parseFloat(document.querySelector('#totalAmount').value);
      const amountPaid = parseFloat(document.querySelector('#amountPaid').value);
      const customerName = document.querySelector('#customerName').value;
      const customerNumber = document.querySelector('#customerNumber').value;

      if (amountPaid < totalAmount) {
          alert('Amount paid is less than total amount!');
          return;
      }

      const changeToReturn = amountPaid - totalAmount;
      document.querySelector('#changeToReturn').value = changeToReturn.toFixed(2);

      // Gather items for the sale
      const saleItems = Array.from(document.querySelectorAll('.item-card')).map(item => {
          const quantity = parseInt(item.querySelector('.qtty').textContent);
          if (quantity > 0) {
              return {
                  name: item.querySelector('h4').textContent,
                  code: item.querySelector('h5').textContent,
                  price: parseFloat(item.querySelector('.price span').textContent),
                  quantity
              };
          }
      }).filter(item => item); // Remove undefined values

      // Post sale to the backend
      fetch('/api/sales', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              items: saleItems,
              totalPrice: totalAmount,
              amountPaid,
              change: changeToReturn,
              customerName,
              customerNumber,
              timestamp: new Date()
          })
      })
      .then(response => response.json())
      .then(data => {
          if (data.message === 'Sale recorded successfully') {
              alert('Sale recorded successfully!');
              closeCheckoutPopup();
              resetCart();
          } else {
              alert('Error recording sale! Details: ' + (data.message || 'Unknown error'));
          }
      })
      .catch(error => {
          console.error('Error:', error);
          alert('Error recording sale! Details: ' + error.message);
      });
  }

  function resetCart() {
      document.querySelectorAll('.qtty').forEach(qtyElem => {
          qtyElem.textContent = '0';
      });
      updateCartCount();
  }

  // Attach checkout function to 'Add to Cart' button
  document.querySelector('.add-to-cart-btn').addEventListener('click', openCheckoutPopup);

  // Attach event listeners for checkout popup buttons
  document.querySelector('#closePopup').addEventListener('click', closeCheckoutPopup);
  document.querySelector('#confirmPayment').addEventListener('click', confirmPayment);
});
