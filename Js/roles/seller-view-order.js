// Wait for the page to load
window.addEventListener('load', function() {
    let currentUser = isAuthenticated();
    if(currentUser)
    {

    }
    else{
        window.location.href = '../login.html';
    }

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
            if(String(item.sellerId) === String(currentUser.id))
            {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('order-item');
                getProductById(item.productId).then((product) => {
                    itemDiv.innerHTML = `
                    <img src="${product.image}" alt="Product ID: 3" class="item-image">
                    <div class="item-details">
                        <div class="item-name">Product ID: ${item.productId}</div>
                        <div class="item-name">Product Name: ${product.name}</div>
                        <select style="border:none" class="status-select status-badge ${item.status}" data-product-id=${item.productId}>
                        <option value="processing">processing</option>
                        <option value="shipped">shipped</option>
                        <option value="pending">pending</option>
                        <option value="delivered">delivered</option>
                        </select>
                        <div class="item-sku">Seller ID: ${item.sellerId} | Qty: ${item.quantity}</div>
                    </div>
                    <div class="item-price">$${product.price * item.quantity}</div>
                `;
                const selectElement = itemDiv.querySelector('.status-select');
                selectElement.value = item.status
                itemsContainer.appendChild(itemDiv);
                // Use the tr to scope the query
                if (selectElement) {
                    //add event to change order status
                        selectElement.addEventListener('change', function(event) {
                            console.log('status event');
                            
                            // Get the selected status and order ID
                            const newStatus = event.target.value;
                            const productId = event.target.dataset.productId;
                            order.items.forEach(item => {
                                if(item.productId == productId)
                                {
                                    console.log('product id at status event: '+item.productId+' '+newStatus);
                                    
                                    item.status = newStatus;
                                }
                            })
                            
                            // update order status
                            fetch(`${url}/${orderId}`, {
                                method: 'PATCH',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(order)
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data) {
                                    console.log('Order status updated successfully');
                                    selectElement.classList.add(data.status);
                                } else {
                                    console.error('Failed to update order status');
                                }
                            })
                            .catch(error => {
                                console.error('Error updating status:', error);
                            });
                        });
                }
                    
                }).catch((err) => {
                    
                });//end of get product
                
            }//end of filteration if condition
        });//end of foreach
        orderSummary.innerHTML = ` 
                        <div class="summary-row total">
                            <span>Total:</span>
                            <span>$${order.amount}</span>
                        </div>`;
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

});
