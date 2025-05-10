adminCheckAuthentication();
window.addEventListener('load', function() {
    const url = "http://localhost:3000/cartcheckout"; // Base URL for fetching data
    const orderTableBody = document.querySelector('#admin-orders-table');
    
    // Get orderId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('orderId');

    if (!orderId) {
        console.error('No orderId found in URL');
        return;
    }

    // Fetch order details based on orderId
    fetch(`${url}/${orderId}`)
        .then(response => response.json())
        .then(order => {
            if (order) {
                // Populate the order details on the page
                displayOrderDetails(order);
                // Fetch and display customer details
                getUserById(order.customerId)
                    .then(customer => displayCustomerDetails(customer))
                    .catch(err => console.error('Error fetching customer details:', err));
            } else {
                alert('Order not found!');
            }
        })
        .catch(error => console.error('Error fetching order:', error));

    // Display Order Details
    function displayOrderDetails(order) {
        // Fill in the order details
        document.querySelector('.order-id').textContent = `Order #${order.id}`;
        document.querySelector('.order-date').textContent = `Placed on ${order.orderdate}`;
        
        const statusBadge = document.querySelector('.order-status-large');
        statusBadge.textContent = order.status.charAt(0).toUpperCase() + order.status.slice(1);
        statusBadge.classList.add(`status-${order.status}`);

        // Populate order items
        const itemsContainer = document.querySelector('.order-items');
        const orderSummary = document.querySelector('.order-summary');
        itemsContainer.innerHTML = '';
        console.log(order.items);
        
        order.items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('order-item');
            getProductById(item.productId).then((product) => {
                itemDiv.innerHTML = `
                <img src="${product.image}" alt="Product ID: 3" class="item-image">
                <div class="item-details">
                    <div class="item-name">Product ID: ${item.productId}</div>
                    <div class="item-name">Product Name: ${product.name}</div>
                    <div class="item-sku">Seller ID: ${item.sellerId} | Qty: ${item.quantity} | Status: ${item.status}</div>
                </div>
                <div class="item-price">$${product.price * item.quantity}</div>
            `;
            itemsContainer.appendChild(itemDiv);
                
            }).catch((err) => {
                
            });//end of get product
            
        });
        orderSummary.innerHTML = ` 
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>$${order.amount}</span>
                        </div>`;
        // Update the order status selection dropdown
        const statusSelect = document.querySelector('select');
        statusSelect.value = order.status;
        const updateStatus = document.querySelector('#update');
        // Handle status change
        updateStatus.addEventListener('click', function(event) {
            const newStatus = statusSelect.value;
            statusBadge.classList.remove('status-processing', 'status-shipped', 'status-pending', 'status-delivered');
            statusBadge.classList.add(`status-${newStatus}`);
            statusBadge.textContent = newStatus;

            // Update the status in the backend
            fetch(`${url}/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })
            .then(response => response.json())
            .then(data => {
                alert('Order status updated successfully!');
            })
            .catch(error => {
                console.error('Error updating order status:', error);
                alert('Failed to update status.');
            });
        });
    }


    // Display Customer Details
    function displayCustomerDetails(customer) {
        document.querySelector('.info-card .info-list').innerHTML = `
            <li><span class="info-label">Customer ID:</span><span class="info-value">${customer.id}</span></li>
            <li><span class="info-label">Customer Name:</span><span class="info-value">${customer.userName}</span></li>
            <li><span class="info-label">Email:</span><span class="info-value">${customer.email}</span></li>
            <li><span class="info-label">Phone:</span><span class="info-value">${customer.phone || 'N/A'}</span></li>
            <li><span class="info-label">Customer Since:</span><span class="info-value">${customer.registrationDate}</span></li>
        `;
    }

    // Handle delete order action
    const deleteButton = document.querySelector('#delete');
    deleteButton.addEventListener('click', function() {
        const confirmed = confirm('Are you sure you want to delete this order?');
        if (confirmed) {
            fetch(`${url}/${orderId}`, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        alert('Order deleted successfully.');
                        window.location.href = 'admin-orders.html';  // Redirect to orders list page
                    } else {
                        alert('Failed to delete the order.');
                    }
                })
                .catch(error => {
                    console.error('Error deleting order:', error);
                    alert('Error deleting order. Please try again.');
                });
        }
    });
});
