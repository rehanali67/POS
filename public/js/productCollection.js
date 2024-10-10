document.addEventListener('DOMContentLoaded', () => {
    const productTableBody = document.getElementById('productTableBody');

    // Function to fetch and render products
    const fetchAndRenderProducts = () => {
        fetch('pos-production-8da1.up.railway.app/api/products')
            .then(response => response.json())
            .then(data => {
                productTableBody.innerHTML = ''; // Clear existing rows
                data.forEach(product => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td><img src="${product.image}" alt="${product.name}"></td>
                        <td data-field="name">${product.name}</td>
                        <td data-field="itemCode">${product.itemCode}</td>
                        <td data-field="description">${product.description}</td>
                        <td data-field="retailPrice">${product.retailPrice}</td>
                        <td data-field="category">${product.category}</td>
                        <td data-field="wholesalePrice">${product.wholesalePrice}</td>
                        <td data-field="quantity">${product.quantity}</td>
                        <td>
                            <div class="action-menu">
                                <button class="action-button"><i class="bx bx-dots-horizontal-rounded"></i></button>
                                <div class="action-dropdown">
                                    <a href="#" class="edit-product" data-id="${product._id}">Edit</a>
                                    <a href="#" class="save-product" data-id="${product._id}" style="display:none;">Save</a>
                                    <a href="#" class="delete-product" data-id="${product._id}">Delete</a>
                                </div>
                            </div>
                        </td>
                    `;
                    productTableBody.appendChild(row);
                });

                // Add event listeners for action buttons
                document.querySelectorAll('.action-button').forEach(button => {
                    button.addEventListener('click', (e) => {
                        const dropdown = e.currentTarget.nextElementSibling;
                        dropdown.classList.toggle('show');
                    });
                });

                // Add event listeners for delete, edit, and save actions
                document.querySelectorAll('.delete-product').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const productId = e.currentTarget.getAttribute('data-id');
                        console.log(`Deleting product with ID: ${productId}`);

                        const row = e.currentTarget.closest('tr');
                        if (row) {
                            row.classList.add('slide-right');
                            setTimeout(() => {
                                fetch(`pos-production-8da1.up.railway.app/api/products/${productId}`, {
                                    method: 'DELETE'
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error('Network response was not ok');
                                        }
                                        return response.json();
                                    })
                                    .then(result => {
                                        console.log(result);
                                        if (result.success) {
                                            row.remove();
                                            fetchAndRenderProducts(); // Refresh the table data
                                        } else {
                                            console.error(`Failed to delete product with ID: ${productId}`);
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error:', error);
                                    });
                            }, 500); // Wait for the animation to complete
                        } else {
                            console.error('Row not found');
                        }
                    });
                });

                document.querySelectorAll('.edit-product').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const row = e.currentTarget.closest('tr');
                        if (row) {
                            row.querySelectorAll('td[data-field]').forEach(cell => {
                                cell.setAttribute('contenteditable', 'true');
                            });
                            row.querySelector('.save-product').style.display = 'inline';
                            e.currentTarget.style.display = 'none';
                        } else {
                            console.error('Row not found for editing');
                        }
                    });
                });

                document.querySelectorAll('.save-product').forEach(button => {
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        const productId = e.currentTarget.getAttribute('data-id');
                        const row = e.currentTarget.closest('tr');
                        if (row) {
                            const updatedData = {};
                            row.querySelectorAll('td[data-field]').forEach(cell => {
                                const field = cell.getAttribute('data-field');
                                updatedData[field] = cell.textContent;
                            });
                            // Call update API
                            fetch(`pos-production-8da1.up.railway.app/api/products/${productId}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(updatedData)
                            })
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error('Network response was not ok');
                                    }
                                    return response.json();
                                })
                                .then(result => {
                                    console.log(result);
                                    if (result.success) {
                                        alert('Product updated successfully');
                                        row.querySelectorAll('td[data-field]').forEach(cell => {
                                            cell.setAttribute('contenteditable', 'false');
                                        });
                                        row.querySelector('.edit-product').style.display = 'inline';
                                        e.currentTarget.style.display = 'none';
                                    } else {
                                        console.error(`Failed to update product with ID: ${productId}`);
                                    }
                                })
                                .catch(error => {
                                    console.error('Error:', error);
                                });
                        } else {
                            console.error('Row not found for saving');
                        }
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    // Initial fetch and render
    fetchAndRenderProducts();
});
