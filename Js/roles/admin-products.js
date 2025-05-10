adminCheckAuthentication();
window.addEventListener('load', function () {
    let currentUser = isAuthenticated();
    if(currentUser)
    {

    }
    else
    {
        window.location.href = '../login.html';
    }
    let currentPage = 1;
    let pageCount = 0;
    let productCount = 0;
    let countPerPage = 10; // Number of products per page
    const paginationDiv = document.querySelector('.pagination');
    const nextButton = document.querySelector('#next');
    const previousButton = document.querySelector('#previous');
    const searchInput = document.querySelector('#searchInput');
    const productsTableBody = document.querySelector('#admin-products-table');
    const url = "http://localhost:3000/";
    const rejectButton = document.querySelector('#reject');
    console.log(rejectButton);
    
    const approvebutton = document.querySelector('#approve');
    let products = [];
    let clonedProducts = [];
    let pageProducts = [];
    let filteredProducts = [];
    let categories= [];
    let sellers = [];
    // Fetch products from the server
    fetch(url+`products`)
        .then(response => response.json())
        .then(data => {
            products = data;
            fetch("http://localhost:3000/categories")
            .then(response => response.json())
            .then(data =>{
                categories = data;
                fetch("http://localhost:3000/users?role=seller")
                .then(response => response.json())
                .then(data => {
                    sellers = data;
                    console.log(sellers);
                    clonedProducts = [...products]; // Clone products array
                    productCount = clonedProducts.length;
                    pageCount = Math.ceil(productCount / countPerPage);
                    updatePagination();
                    updateTable(clonedProducts);
                })
            })
            .catch((err) => {
                console.error(err);
                
            });
            
        })
        .catch(error => console.error('Error fetching products:', error));

    // Pagination event
    paginationDiv.addEventListener('click', function (event) {
        console.log("pagination event: "+event.target.id);
        
        if (event.target.id === 'next') {
            currentPage++;
            if (currentPage >= pageCount) {
                currentPage = pageCount;
            }
            updatePagination();
            updateTable(clonedProducts);
        } 
        else if (event.target.id === 'previous')
        {
            currentPage--;
            if (currentPage <= 1) {
                currentPage = 1;
            }
            updatePagination();
            updateTable(clonedProducts);
        }
    });

    // Search event
    searchInput.addEventListener('keyup', function (event) {
        const searchValue = event.target.value.toLowerCase();
        clonedProducts = products.filter(product => {
            return product.name.toLowerCase().includes(searchValue) || 
                   product.categoryId.toString().includes(searchValue) ||
                   product.status.toLowerCase().includes(searchValue);
        });

        productCount = clonedProducts.length;
        pageCount = Math.ceil(productCount / countPerPage);
        currentPage = 1; // Reset to first page
        updatePagination();
        updateTable(clonedProducts);
    });

   // Handle reject and approve product using event delegation
    productsTableBody.addEventListener('click', function (event) {
        if (event.target.closest('.delete-btn')) {
            console.log("delete event invoked");
            
            const productId = event.target.closest('.delete-btn').dataset.productId;
            console.log("product id from event: "+productId);
            
            const confirmed = confirm(`Are you sure you want to delete product with ID ${productId}?`);
            if (!confirmed) return;

            fetch(`${url}products/${productId}`, {
                method: 'DELETE',
            })
                .then(response => response.json())
                .then(() => {
                    alert('Product deleted successfully!');
                    products = products.filter(product => product.id !== productId);
                    clonedProducts = [...products]; // Re-clone the array after deletion
                    productCount = clonedProducts.length;
                    pageCount = Math.ceil(productCount / countPerPage);
                    updatePagination();
                    updateTable(clonedProducts);
                })
                .catch(error => {
                    console.error('Error deleting product:', error);
                    alert('Error deleting product. Please try again.');
                });
        }
    // Handle reject button click
    if (event.target.closest('#reject')) {
        const productId = event.target.closest('#reject').dataset.productId;
        console.log("Reject event for product ID: ", productId);

        fetch(url + `products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "rejected" })
        }).then((result) => {
            if (result.ok) {
                // updatePagination();
                // updateTable(clonedProducts);
                location.reload();
            }
        }).catch((err) => {
            console.error("Error rejecting product:", err);
        });
    }

    // Handle approve button click
    if (event.target.closest('#approve')) {
        const productId = event.target.closest('#approve').dataset.productId;
        console.log("Approve event for product ID: ", productId);

        fetch(url + `products/${productId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: "available" })
        }).then((result) => {
            if (result.ok) {
                updatePagination();
                updateTable(clonedProducts);
            }
        }).catch((err) => {
            console.error("Error approving product:", err);
        });
    }
});

    // // Delete product event
    // productsTableBody.addEventListener('click', function (event) {
       
    // });

    // Update product table with paginated products
    function updateTable(_filteredProducts) {
        const start = (currentPage - 1) * countPerPage;
        const end = start + countPerPage;
        pageProducts = _filteredProducts.slice(start, end);
        productsTableBody.innerHTML = ''; // Clear existing table data
        pageProducts.forEach(product => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="user-info">
                        <img src=${product.image} alt="Smart Watch">
                        <div>
                            <strong>${product.name}</strong>
                            <div class="product-sales">Seller: ${sellers.filter(s => String(s.id) === String(product.sellerId))[0]?.userName || "seller Not Found"}</div>
                        </div>
                    </div>
                </td>
                <td>${product.id}</td>
                <td>${categories.filter(c => String(c.id) === String(product.categoryId))[0]?.name || "Category Not Found"}</td>
                <td>$${product.price}</td>
                <td>${product.capacity}</td>
            `;
            if(product.status=="pending")
                {
                    tr.innerHTML += `<td><span class="status-badge pending">Pending Approval</span></td>
                    <td>
                        <div class="action-buttons">
                            <a href="admin-product-edit.html?productId=${product.id}" class="btn btn-sm btn-secondary" title="Edit">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button class="btn btn-sm btn-success" data-product-id="${product.id}" id="approve"  title="Approve">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-sm btn-danger" title="Reject" data-product-id="${product.id}" id="reject">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </td>`
                    
                }
            else 
                {
                    if(product.status=="out of stock" || product.status == 'rejected')
                    {
                        tr.innerHTML += `<td><span class="status-badge suspended">${product.status}</span></td>`
                    }
                    else{
                        tr.innerHTML += `<td><span class="status-badge active">${product.status}</span></td>`

                    }
                    tr.innerHTML += `<td>
                    <div class="action-buttons">
                        <a href="admin-product-edit.html?productId=${product.id}" class="btn btn-sm btn-secondary" title="Edit">
                            <i class="fas fa-edit"></i>
                        </a>
                        <button class="btn btn-sm btn-danger delete-btn"  data-product-id="${product.id}" title="Delete">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>`;
                }
            productsTableBody.appendChild(tr);
        });
    }

    // Update pagination UI
    function updatePagination() {
        const pageNumberElement = document.querySelector('.pagination-ellipsis');
        pageNumberElement.innerHTML = `${currentPage} of ${pageCount}`;
        nextButton.disabled = currentPage === pageCount;
        previousButton.disabled = currentPage === 1;
    }
});
