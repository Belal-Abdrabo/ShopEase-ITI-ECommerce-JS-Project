adminCheckAuthentication();
window.addEventListener('load', function() {
    // Get the productId from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('productId');

    // Get form elements by their IDs
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productDescriptionInput = document.getElementById('product-description');
    const productCategoryInput = document.getElementById('product-category');
    const productStatusInput = document.getElementById('product-status');
    const productPriceInput = document.getElementById('product-price');
    const productCapacityInput = document.getElementById('product-capacity');
    const productImageInput = document.getElementById('product-image');
    const productSellerInput = document.getElementById('product-seller');

    // Error message elements
    const productNameError = document.getElementById('product-name-error');
    const productDescriptionError = document.getElementById('product-description-error');
    const productCategoryError = document.getElementById('product-category-error');
    const productPriceError = document.getElementById('product-price-error');
    const productCapacityError = document.getElementById('product-capacity-error');
    console.log("product ID: "+productId);
    
    // Fetch product data by productId
    fetch(`http://localhost:3000/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            // Pre-fill the form with the product data
            productIdInput.value = product.id;
            productNameInput.value = product.name;
            productDescriptionInput.value = product.productDescription;
            getAllCategories()
            .then(data => {
                productCategoryInput.innerHTML='';
                data.forEach(c => {
                    productCategoryInput.innerHTML += `<option value="${c.id}">${c.name}</option>`
                })
            productCategoryInput.value = product.categoryId;
            productStatusInput.value = product.status;
            productPriceInput.value = product.price;
            productCapacityInput.value = product.capacity;
            productImageInput.value = product.image || '';  // Handle optional image field
            productSellerInput.value = product.sellerId;  // Pre-fill the seller ID (disabled)
            })
    .catch(err => console.error(err))
            
        })
        .catch(error => {
            console.error('Error fetching product:', error);
        });

    // Validate form fields
    function validateForm() {
        let isValid = true;

        // Validate Product Name
        if (productNameInput.value.trim() === '') {
            productNameError.textContent = 'Product name is required';
            productNameInput.classList.add('error');
            isValid = false;
        } else {
            productNameError.textContent = '';
            productNameInput.classList.remove('error');
        }

        // Validate Product Description
        if (productDescriptionInput.value.trim() === '') {
            productDescriptionError.textContent = 'Product description is required';
            productDescriptionInput.classList.add('error');
            isValid = false;
        } else {
            productDescriptionError.textContent = '';
            productDescriptionInput.classList.remove('error');
        }

        // Validate Product Category
        if (productCategoryInput.value.trim() === '') {
            productCategoryError.textContent = 'Product category is required';
            productCategoryInput.classList.add('error');
            isValid = false;
        } else {
            productCategoryError.textContent = '';
            productCategoryInput.classList.remove('error');
        }

        // Validate Price
        if (productPriceInput.value.trim() === '' || productPriceInput.value <= 0) {
            productPriceError.textContent = 'Valid price is required';
            productPriceInput.classList.add('error');
            isValid = false;
        } else {
            productPriceError.textContent = '';
            productPriceInput.classList.remove('error');
        }

        // Validate Stock Quantity
        if (productCapacityInput.value.trim() === '' || productCapacityInput.value <= 0) {
            productCapacityError.textContent = 'Stock quantity is required';
            productCapacityInput.classList.add('error');
            isValid = false;
        } else {
            productCapacityError.textContent = '';
            productCapacityInput.classList.remove('error');
        }

        return isValid;
    }

    // Handle form submission
    document.getElementById('product-edit-form').addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate form before submitting
        if (!validateForm()) {
            return; // Stop the submission if validation fails
        }

        // Prepare the updated product data
        const updatedProduct = {
            name: productNameInput.value.trim(),
            price: parseFloat(productPriceInput.value.trim()),
            capacity: parseInt(productCapacityInput.value.trim()),
            image: productImageInput.value.trim(),
            categoryId: productCategoryInput.value.trim(),
            sellerId: productSellerInput.value.trim(), // Adding sellerId as part of the product update
            productDescription: productDescriptionInput.value.trim(),
            status: productStatusInput.value.trim(),
        };

        // Send the updated product data to the server using a PUT request
        fetch(`http://localhost:3000/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
            .then(response => response.json())
            .then(data => {
                alert('Product updated successfully');
                window.location.href = 'admin-products.html'; // Redirect back to products page after success
            })
            .catch(error => {
                console.error('Error updating product:', error);
                alert('Error updating product. Please try again.');
            });
    });
});
