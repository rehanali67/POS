document.addEventListener("DOMContentLoaded", () => {
    const uploadButton = document.getElementById('uploadButton');
    const imageInput = document.getElementById('imageInput');
    const imageElement = document.getElementById('imageElement');
    const imageText = document.getElementById('imageText');
    const categoryInput = document.getElementById('categoryInput');
    const categoryDropdown = document.getElementById('categoryDropdown');
    const productForm = document.getElementById('productForm');

    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Beverages', 'Desserts', 'Side Dish', 'Appetizers', 'Soup'];

    // Populate category dropdown
    categories.forEach(category => {
        const option = document.createElement('div');
        option.className = 'dropdown-item';
        option.textContent = category;
        option.addEventListener('click', () => {
            categoryInput.value = category;
            categoryDropdown.style.display = 'none';
        });
        categoryDropdown.appendChild(option);
    });

    // Show file selector when upload button is clicked
    uploadButton.addEventListener('click', () => {
        imageInput.click();
    });

    // Image preview
    imageInput.addEventListener('change', () => {
        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            imageElement.style.display = "block";
            imageText.style.display = "none";

            reader.addEventListener('load', () => {
                imageElement.setAttribute('src', reader.result);
            });

            reader.readAsDataURL(file);
        } else {
            imageElement.style.display = "none";
            imageText.style.display = "block";
            imageElement.setAttribute('src', '');
        }
    });

    // Show dropdown when input is focused
    categoryInput.addEventListener('focus', () => {
        categoryDropdown.style.display = 'block';
    });

    // Hide dropdown if clicked outside
    categoryInput.addEventListener('blur', () => {
        setTimeout(() => {
            categoryDropdown.style.display = 'none';
        }, 100);
    });

    // Form submission
    productForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const formData = new FormData(productForm);

        fetch('/api/products', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then(data => {
            console.log('Response data:', data);  // Added log
            if (data.success) {
                alert('Product added successfully');
                productForm.reset();
                imageElement.style.display = 'none';
                imageText.style.display = 'block';
            } else {
                alert('Error adding product: ' + data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    const resizeBtn = document.querySelector("[data-resize-btn]");
    resizeBtn.addEventListener("click", function (e) {
        e.preventDefault();
        document.body.classList.toggle("sb-expanded");
    });
});
