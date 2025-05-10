// Admin (45%) 
// Admins are responsible for managing the overall platform. Their tasks include 
// monitoring user activities, managing the product catalog, and ensuring compliance 
// with platform policies. 
// Key Features: 
// • User Management: 
    // o Add, edit, or remove users (Customers and Sellers). 
    // o Manage user roles and permissions. 
// • Product Management: 
    // o Approve or reject products submitted by Sellers. 
    // o Edit or delete existing products. 
// • Order Management: 
    // o View and manage all orders. 


   // adminCheckAuthentication();
window.addEventListener("load", function() {
    let currentUser = isAuthenticated();
    if(currentUser)
    {

    }
    else{
        window.location.href = '../login.html';
    }
    const cards = document.querySelectorAll(".stat-number");
    const url = 'http://localhost:3000/';
    let productsCount;
    let ordersCount;
    let ordersTableBody = document.querySelector("#table-body");
    let recentProductsTableBody = document.querySelector("#recent-products-table-body");
//#region update seller cards
    //update productsCount card
    fetch(url+'products')
    .then(response => response.json())
    .then(data =>
    {
        productsCount = data.filter(p => p.sellerId == currentUser.id).length;
        cards[0].textContent = productsCount;
    }
    ).catch(error => console.error('Error:', error));

    //update ordersCount card
    fetch(url+'cartcheckout')
    .then(response => response.json())
    .then(data =>
    {
        ordersCount = data.filter(order => order.items.some(item => item.sellerId == currentUser.id)).length;
        cards[1].textContent = ordersCount;
    }
    ).catch(error => console.error('Error:', error));
// #endregion

// #region update orders table
//update orders table
    let customer = null;
    let product = null;
    ordersTableBody.innerHTML = ""; //clear table body
    getAllOrders().then(orders => {
        let first6Orders  = orders.filter(order => order.items.some(item => item.sellerId == currentUser.id)).slice(0, 6); //get first 6 orders
        first6Orders.forEach(order =>{
            let row = document.createElement('tr');
            getUserById(order.customerId)
            .then(data => {
                console.log(`customer: ${data.userName}`);
                customer = data
                row.innerHTML = `
                <td>${order.id}</td>
                <td>${customer.userName}</td>
                <td>${order.orderdate}</td>
                <td>$${order.amount}</td>
                <td><span class="status-badge ${order.status}">${order.status}</span></td>
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon"><i class="fas fa-eye"></i></button>   
                        <a href="../editOrder.html?orderId=${order.id}"><button class="btn-icon"><i class="fas fa-edit"></i></button></a>
                    </div>
                </td>  
                `
                ordersTableBody.appendChild(row);
            });
        });
    })
    // #endregion
    
// #region update recent products table
    recentProductsTableBody.innerHTML = ""; //clear table body
    getAllProducts().then(products =>{
        let first6Products = products.filter(p => p.sellerId == currentUser.id).slice(0, 6); //get first 6 products
        first6Products.forEach(product =>{
            getCategoryById(product.categoryId).then(data =>{
                console.log(`category: ${data.name}`);
                product.category = data.name; //add category to product object
                let tr = document.createElement('tr');
                tr.innerHTML = `
                <td>
                    <div class="user-info">
                        <img src=${product.image} alt="Smart Watch">
                    </div>
                </td>
                <td>${product.id}</td>
                <td>${product.category || "Category Not Found"}</td>
                <td>$${product.price}</td>
                <td>${product.capacity}</td>
            `;
            if(product.status=="pending")
                {
                    tr.innerHTML += `<td><span class="status-badge pending">Pending Approval</span></td>`;
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
                }
                tr.innerHTML += `<td>
                    <div class="action-buttons">
                        <a href="seller-edit-product.html?productId=${product.id}" class="btn btn-sm btn-secondary" title="Edit">
                            <i class="fas fa-edit"></i>
                        </a>
                    </div>
                </td>`;
                recentProductsTableBody.appendChild(tr);
            })//end of getCategoryById
    }) //end of forEach

})
 //end of getallProducts

// #endregion

});//load end

/* <tr>
<td>#ORD-5289</td>
<td>John Smith</td>
<td>May 1, 2025</td>
<td>$125.99</td>
<td><span class="status-badge delivered">Delivered</span></td>
<td>
    <div class="action-buttons">
        <button class="btn-icon"><i class="fas fa-eye"></i></button>
        <button class="btn-icon"><i class="fas fa-edit"></i></button>
    </div>
</td>
</tr> */