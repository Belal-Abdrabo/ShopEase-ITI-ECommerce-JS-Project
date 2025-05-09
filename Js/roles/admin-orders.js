window.addEventListener('load', function () {
    const orderTableBody = document.querySelector('#admin-orders-table');
    const url = "http://localhost:3000/cartcheckout";
    let currentPage = 1;
    let pageCount = 0;
    let productCount = 0;
    let countPerPage = 10; // Number of products per page
    const paginationDiv = document.querySelector('.pagination');
    const nextButton = document.querySelector('#next');
    const previousButton = document.querySelector('#previous');
    // Fetch orders from the cartcheckout endpoint
    fetch(url)
        .then(response => response.json())
        .then(data => {
            orderTableBody.innerHTML='';
            displayOrders(data);
        })
        .catch(error => console.error('Error fetching orders:', error));

    // Display orders in the table
    function displayOrders(orders) {
        orders.forEach(order => {
            const tr = document.createElement('tr');
            const statusBadge = getStatusBadge(order.status);
            getUserById('b817')
            .then((customer) => {
                tr.innerHTML = `
                <td>${order.id}</td>
                <td>${customer.userName}</td>
                <td>2025/3/1</td>
                <td>${order.items.length}</td>
                <td>$${order.amount}</td>
                <td>cash</td>
                <td>${statusBadge}</td>
                <td>
                    <div class="action-buttons">
                        <a href="admin-order-details.html?id=${order.id}" class="btn btn-sm btn-primary" title="View">
                            <i class="fas fa-eye"></i>
                        </a>
                        <button class="btn btn-sm btn-secondary" title="Print Invoice">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" title="Cancel Order">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            `;
            orderTableBody.appendChild(tr);
                
            }).catch((err) => {
                
            });
        });
    }

    // Get status badge based on order status
    function getStatusBadge(status) {
        switch (status) {
            case 'processing':
                return '<span class="status-badge processing">Processing</span>';
            case 'shipped':
                return '<span class="status-badge shipped">Shipped</span>';
            case 'pending':
                return '<span class="status-badge pending">Pending</span>';
            case 'delivered':
                return '<span class="status-badge delivered">Delivered</span>';
            case 'cancelled':
                return '<span class="status-badge cancelled">Cancelled</span>';
            default:
                return '<span class="status-badge unknown">Unknown</span>';
        }
    }
});
