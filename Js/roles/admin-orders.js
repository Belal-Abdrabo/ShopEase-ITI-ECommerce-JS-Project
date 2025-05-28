adminCheckAuthentication();
window.addEventListener('load', function () {
    const orderTableBody = document.querySelector('#admin-orders-table');
    const url = "http://localhost:3000/cartcheckout";
    let currentPage = 1;
    let pageCount = 0;
    let orderCount = 0;
    let countPerPage = 6; // Number of products per page
    const paginationDiv = document.querySelector('.pagination');
    const nextButton = document.querySelector('#next');
    const previousButton = document.querySelector('#previous');
    const searchInput = document.querySelector('#searchInput');
    let orders = [];
    let clonedOrders = [];
    // Fetch orders from the cartcheckout endpoint
    fetch(url)
        .then(response => response.json())
        .then(data => {
            orderTableBody.innerHTML='';
            orders = data;
            clonedOrders = [...orders];
            orderCount = clonedOrders.length;
            pageCount = Math.ceil(orderCount / countPerPage);
            updatePagination();
            displayOrders(clonedOrders);
        })
        .catch(error => console.error('Error fetching orders:', error));
    
    // Pagination event
    paginationDiv.addEventListener('click', function (event) {
        console.log("pagination event: "+event.target.id);
        
        if (event.target.id === 'next') {
            currentPage++;
            if (currentPage >= pageCount) {
                currentPage = pageCount;
            }
            updatePagination();
            displayOrders(clonedOrders);
        } 
        else if (event.target.id === 'previous')
        {
            currentPage--;
            if (currentPage <= 1) {
                currentPage = 1;
            }
            updatePagination();
            displayOrders(clonedOrders);
        }
    });

     // Search event
     searchInput.addEventListener('keyup', function (event) {
        const searchValue = event.target.value.toLowerCase();
        clonedOrders = orders.filter(order => {
            return order.id.toLowerCase().includes(searchValue) || 
                   order.status.toString().includes(searchValue)
        });

        orderCount = clonedOrders.length;
        pageCount = Math.ceil(orderCount / countPerPage);
        currentPage = 1; // Reset to first page
        updatePagination();
        displayOrders(clonedOrders);
    });

    // Display orders in the table
    function displayOrders(_orders) {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        _orders = _orders.slice(start, end);
        orderTableBody.innerHTML = '';
        _orders.forEach(order => {
            const tr = document.createElement('tr');
            getUserById(order.customerId)
            .then((customer) => {
                tr.innerHTML = `
                <td>${order.id}</td>
                <td>${customer.userName}</td>
                <td>${order.orderdate}</td>
                <td>${order.items.length}</td>
                <td>$${order.amount}</td>
                <td>cash</td>
                <td>
                    <select style="border:none" class="status-select status-badge ${order.status}" data-order-id=${order.id}>
                    <option value="processing">processing</option>
                    <option value="shipped">shipped</option>
                    <option value="pending">pending</option>
                    <option value="delivered">delivered</option>
                    </select>
                </td>
                <td>
                    <div class="action-buttons">
                        <a href="admin-view-order.html?orderId=${order.id}" class="btn btn-sm btn-primary" title="View">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn btn-sm btn-danger delete-btn" data-order-id=${order.id} title="Cancel Order">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            `;
            orderTableBody.appendChild(tr);
            const selectElement = tr.querySelector('.status-select'); // Use the tr to scope the query
            if (selectElement) {
                selectElement.value = order.status; // Set the value to match the order's status
                //add event to change order status
                    selectElement.addEventListener('change', function(event) {
                        // Get the selected status and order ID
                        const newStatus = event.target.value;
                        const orderId = event.target.dataset.orderId;
                        
                        // update order status
                        fetch(`${url}/${orderId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: newStatus })
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
            //delete section
            const deleteElement = tr.querySelector(".delete-btn");
            deleteElement.addEventListener('click', function(event){
                let orderId = deleteElement.dataset.orderId
                const trElement = event.target.closest('tr');
                console.log(`tr: ${trElement}`);
                const isConfirmed = confirm(`Are you sure you want to delete this order (id: ${orderId})`);
                if(isConfirmed){
                    fetch(url+`/${orderId}`,{
                        method: 'DELETE'
                    }
                    ).then((result) => {
                        console.log('order deleted');
                        trElement.remove();
                    }).catch((err) => {
                        console.error("error deleting order:"+err);
                        
                    });//catch for delete order
                }
            });


            }).catch((err) => {
                console.error('Error fetching customers:',err);
                
            });
        }); //end of for each

    } //end of display orders

    // Update pagination UI
    function updatePagination() {
        const pageNumberElement = document.querySelector('.pagination-ellipsis');
        pageNumberElement.innerHTML = `${currentPage} of ${pageCount}`;
        nextButton.disabled = currentPage === pageCount;
        previousButton.disabled = currentPage === 1;
    }

});//end of load
