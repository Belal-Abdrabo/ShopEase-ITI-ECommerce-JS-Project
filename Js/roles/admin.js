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
window.addEventListener("load", function() {
    const cards = document.querySelectorAll(".stat-number");
    const url = 'http://localhost:3000/';
    let usersCount;
    let productsCount;
    let categoriesCount
    let ordersCount;
    let ordersTableBody = document.querySelector("#table-body");

    //update userCount card
    fetch(url+'users')
    .then(response => response.json())
    .then(data =>
    {
        usersCount = data.length;
        cards[0].textContent = usersCount;
    }
    ).catch(error => console.error('Error:', error));

    //update productsCount card
    fetch(url+'products')
    .then(response => response.json())
    .then(data =>
    {
        productsCount = data.length;
        cards[1].textContent = productsCount;
    }
    ).catch(error => console.error('Error:', error));
    
    //update categoriesCount card
    fetch(url+'categories')
    .then(response => response.json())
    .then(data =>
    {
        categoriesCount = data.length;
        cards[2].textContent = categoriesCount;
    }
    ).catch(error => console.error('Error:', error));

    //update ordersCount card
    fetch(url+'orders')
    .then(response => response.json())
    .then(data =>
    {
        ordersCount = data.length;
        cards[3].textContent = ordersCount;
    }
    ).catch(error => console.error('Error:', error));

    //update orders table
    let customer = null;
    let product = null;
    ordersTableBody.innerHTML = ""; //clear table body
    getAllOrders().then(orders => {
        orders.forEach(order =>{
            let row = document.createElement('tr');
            getUserById(order.customerId)
            .then(data => {
                console.log(`customer: ${data.userName}`);
                customer = data
                row.innerHTML = `
                <td>${order.id}</td>
                <td>${customer.userName}</td>
                <td>${order.date}</td>
                <td>${order.total}</td>
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
    
    
});//load end

{/* <tr>
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
</tr> */}