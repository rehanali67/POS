document.addEventListener('DOMContentLoaded', () => {
    const addItemButton = document.getElementById('add-item');
    const removeItemButton = document.getElementById('remove-item');
    const billingTableBody = document.getElementById('billing-table').getElementsByTagName('tbody')[0];
    const discountInput = document.getElementById('discount');
    const totalPriceDiv = document.getElementById('total-price');
    const productSearchInput = document.getElementById('product-search');
    const editButton = document.getElementById('edit-button');
    const productOptionsList = document.getElementById('product-options');
    const amountPaidInput = document.getElementById('amount-paid');

    let editMode = false;

    const products = [
        { name: 'Product 1', price: 10000.00 },
        { name: 'Product 2', price: 20000.00 },
        { name: 'Product 4', price: 10000.00 },
        { name: 'Product 5', price: 20000.00 },
        { name: 'Product 6', price: 10000.00 },
        { name: 'Product 7', price: 20000.00 },
        { name: 'Product 8', price: 10000.00 },
        { name: 'Product 9', price: 20000.00 },
        { name: 'Product 10', price: 10000.00 },
        { name: 'Product 11', price: 20000.00 },
        { name: 'Product 3', price: 300000.00 }
    ];

    // Function to filter products based on search input
    function filterProducts(searchTerm) {
        return products.filter(product =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    // Function to update the datalist with filtered options
    function updateProductOptions(searchTerm) {
        const isReturn = searchTerm.startsWith('/r');
        const filteredProducts = filterProducts(isReturn ? searchTerm.slice(2) : searchTerm);
        productOptionsList.innerHTML = '';
        filteredProducts.forEach(product => {
            const option = document.createElement('option');
            option.value = isReturn ? `/r ${product.name}` : product.name;
            productOptionsList.appendChild(option);
        });
    }

    // Event listener for input changes in the search bar
    productSearchInput.addEventListener('input', () => {
        updateProductOptions(productSearchInput.value);
    });

    // Event listener for selecting a product from datalist
    productSearchInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const selectedProductName = productSearchInput.value;
            const isReturnItem = selectedProductName.startsWith('/r');
            const productName = isReturnItem ? selectedProductName.slice(3) : selectedProductName;

            const selectedProduct = products.find(product => product.name === productName);
            if (selectedProduct) {
                addProductToBilling(selectedProduct, isReturnItem);
                productSearchInput.value = '';
                productOptionsList.innerHTML = '';
            }
        }
    });

    function addProductToBilling(product, isReturnItem) {
        let existingRow = null;
        for (let row of billingTableBody.rows) {
            if (row.cells[0].textContent === product.name) {
                existingRow = row;
                break;
            }
        }

        if (existingRow) {
            const quantityCell = existingRow.cells[1];
            const totalCell = existingRow.cells[3];
            let quantity = parseInt(quantityCell.querySelector('.quantity-value').textContent);
            quantity = isReturnItem ? quantity - 1 : quantity + 1;
            quantityCell.querySelector('.quantity-value').textContent = quantity;
            totalCell.textContent = (quantity * product.price).toFixed(2);
        } else {
            const newRow = billingTableBody.insertRow();
            const itemCell = newRow.insertCell(0);
            const quantityCell = newRow.insertCell(1);
            const priceCell = newRow.insertCell(2);
            const totalCell = newRow.insertCell(3);
            const actionCell = newRow.insertCell(4);

            itemCell.textContent = product.name;

            const quantityValue = document.createElement('span');
            quantityValue.className = 'quantity-value';
            quantityValue.textContent = isReturnItem ? '-1' : '1';

            const decreaseButton = document.createElement('span');
            decreaseButton.className = 'quantity-decrease-button';
            decreaseButton.textContent = '-';
            decreaseButton.style.display = editMode ? 'inline-block' : 'none';
            decreaseButton.addEventListener('click', () => {
                changeProductQuantity(newRow, -1);
            });

            const increaseButton = document.createElement('span');
            increaseButton.className = 'quantity-increase-button';
            increaseButton.textContent = '+';
            increaseButton.style.display = editMode ? 'inline-block' : 'none';
            increaseButton.addEventListener('click', () => {
                changeProductQuantity(newRow, 1);
            });

            quantityCell.appendChild(decreaseButton);
            quantityCell.appendChild(quantityValue);
            quantityCell.appendChild(increaseButton);

            priceCell.textContent = product.price.toFixed(2);
            totalCell.textContent = (parseInt(quantityValue.textContent) * product.price).toFixed(2);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.className = 'remove-button';
            removeButton.style.display = editMode ? 'block' : 'none';
            actionCell.appendChild(removeButton);

            removeButton.addEventListener('click', () => {
                billingTableBody.deleteRow(newRow.rowIndex - 1);
                updateTotalPrice();
            });
        }

        updateTotalPrice();
    }

    function changeProductQuantity(row, change) {
        const quantityCell = row.cells[1];
        const totalCell = row.cells[3];
        let quantity = parseInt(quantityCell.querySelector('.quantity-value').textContent);

        quantity += change;

        if (quantity < 1 && !editMode) {
            billingTableBody.deleteRow(row.rowIndex - 1);
        } else {
            quantityCell.querySelector('.quantity-value').textContent = quantity;
            const price = parseFloat(row.cells[2].textContent);
            totalCell.textContent = (quantity * price).toFixed(2);
        }

        updateTotalPrice();
    }

    editButton.addEventListener('click', () => {
        editMode = !editMode;
        const removeButtons = document.querySelectorAll('.remove-button');
        const decreaseButtons = document.querySelectorAll('.quantity-decrease-button');
        const increaseButtons = document.querySelectorAll('.quantity-increase-button');

        removeButtons.forEach(button => {
            button.style.display = editMode ? 'block' : 'none';
        });

        decreaseButtons.forEach(button => {
            button.style.display = editMode ? 'inline-block' : 'none';
        });

        increaseButtons.forEach(button => {
            button.style.display = editMode ? 'inline-block' : 'none';
        });
    });

    addItemButton.addEventListener('click', () => {
        const newRow = billingTableBody.insertRow();
        const itemCell = newRow.insertCell(0);
        const quantityCell = newRow.insertCell(1);
        const priceCell = newRow.insertCell(2);
        const totalCell = newRow.insertCell(3);

        itemCell.textContent = 'New Item';

        const quantityValue = document.createElement('span');
        quantityValue.className = 'quantity-value';
        quantityValue.textContent = '1';

        const decreaseButton = document.createElement('span');
        decreaseButton.className = 'quantity-decrease-button';
        decreaseButton.textContent = '-';
        decreaseButton.style.display = editMode ? 'inline-block' : 'none';
        decreaseButton.addEventListener('click', () => {
            changeProductQuantity(newRow, -1);
        });

        const increaseButton = document.createElement('span');
        increaseButton.className = 'quantity-increase-button';
        increaseButton.textContent = '+';
        increaseButton.style.display = editMode ? 'inline-block' : 'none';
        increaseButton.addEventListener('click', () => {
            changeProductQuantity(newRow, 1);
        });

        quantityCell.appendChild(decreaseButton);
        quantityCell.appendChild(quantityValue);
        quantityCell.appendChild(increaseButton);

        priceCell.textContent = '10.00';
        totalCell.textContent = '10.00';

        updateTotalPrice();
    });

    removeItemButton.addEventListener('click', () => {
        if (billingTableBody.rows.length > 0) {
            billingTableBody.deleteRow(-1);
            updateTotalPrice();
        }
    });

    discountInput.addEventListener('input', updateTotalPrice);

    // Event listener for amount paid input
    amountPaidInput.addEventListener('input', () => {
        const amountPaid = parseFloat(amountPaidInput.value);
        if (!isNaN(amountPaid)) {
            const totalPrice = parseFloat(totalPriceDiv.textContent.replace('Total Price: $', ''));
            const changeDue = amountPaid - totalPrice;
            totalPriceDiv.textContent = `Total Paid: $${amountPaid.toFixed(2)}`;

            // Show popup with change due
            const popup = document.createElement('div');
            popup.className = 'popup';
            popup.innerHTML = `
                <p>Amount Paid: $${amountPaid.toFixed(2)}</p>
                <p>Change Due: $${changeDue.toFixed(2)}</p>
            `;
            document.body.appendChild(popup);

            // Clear billing table for next sale
            billingTableBody.innerHTML = '';
            updateTotalPrice();
        }
    });

    function updateTotalPrice() {
        let total = 0;
        for (let row of billingTableBody.rows) {
            const quantity = parseFloat(row.cells[1].querySelector('.quantity-value').textContent);
            const price = parseFloat(row.cells[2].textContent);
            total += quantity * price;
        }
        const discount = parseFloat(discountInput.value) / 100;
        const discountedTotal = total - (total * discount);
        totalPriceDiv.textContent = `Total Price: $${discountedTotal.toFixed(2)}`;
    }
});
