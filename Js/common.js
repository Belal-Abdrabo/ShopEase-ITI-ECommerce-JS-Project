//check if user is logged in or not
const isAuthenticated = function()   
{
    const user = localStorage.getItem("loggedInUser");
    if(user)
    {
        const userData = JSON.parse(user);
        return userData;
    }
    else
    {
        return false;
    }
}
//check if user role has access to the page or not
const isHasAccess = function(page, role)
{
    if(role == 'admin')
    {
        if(page.includes('admin'))
        {
            return true;
        }
    }
    else if(role == 'seller')
    {
        if(page.includes('seller'))
        {
            return true;
        }
    }
    return false;
    
}
//#region user methods 
//get all users
const getAllUsers = function()
{
    const url = 'http://localhost:3000/users';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//get specific user with email
const getUserByEmail = function(email)
{
    const url = 'http://localhost:3000/users?email='+email;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//get specific user with role
const getUserByRole = function(role)
{
    const url = 'http://localhost:3000/users?role='+role;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//get specific user with id
const getUserById = function(id)
{
    const url = 'http://localhost:3000/users/'+id;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//#endregion user methods

//#region product methods
//get all products
const getAllProducts = function()
{
    const url = 'http://localhost:3000/products';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//get specific product with id
const getProductById = function(id)
{
    const url = 'http://localhost:3000/products/'+id;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//#endregion product methods

//#region categories methods
//get all categories
const getAllCategories = function()
{
    const url = 'http://localhost:3000/categories';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//get specific category with id    
const getCategoryById = function(id)
{
    const url = 'http://localhost:3000/categories/'+id;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//#endregion categories methods

//#region orders methods
//get all orders
const getAllOrders = function()
{
    const url = 'http://localhost:3000/orders';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}

//get specific order with id
const getOrderById = function(id)
{
    const url = 'http://localhost:3000/orders/'+id;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//#endregion orders methods

//#region cart methods
//get all cart items
const getAllCartItems = function()
{
    const url = 'http://localhost:3000/cart';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//get specific cart item with id
const getCartItemById = function(id)
{
    const url = 'http://localhost:3000/cart/'+id;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//post cart using customerId
const postCartUsingCustomerId = function(customerId) {
    //Check if a cart already exists for the customer
    fetch(`http://localhost:3000/cart?customerId=${customerId}`)
        .then(res => res.json())
        .then(carts => {
            if (carts.length > 0) {
                console.log("Cart already exists:", carts[0]);
                return;
            } else {
                // No cart exists => create one
                return fetch('http://localhost:3000/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customerId: customerId,
                        items: [] // start with empty cart
                    })
                })
                .then(res => res.json())
                .then(newCart => {
                    console.log("Created new cart:", newCart);
                });
            }
        })
        .catch(error => console.error("Error:", error));
};

//get specific cart item with customerId
const getCartItemByUserId = function(customerId)
{
    const url = 'http://localhost:3000/cart?customerId='+customerId;
    fetch(url)
    .then(response => response.json())
    .then(data => {
        return data;
    })
    .catch(error => console.error('Error:', error));
}
//#endregion cart methods


//logout method
// const logOut = function()
// {
//     localStorage.removeItem("loggedInUser");
//     window.location.href = "http://127.0.0.1:5500/index.html";
// }
// const isValidEmail = function (_emailValue, _errorMessageElement){
//     if(_emailValue === '')
//     {
//         _errorMessageElement.style.display = "block";
//         _errorMessageElement.textContent = "Please fill Email field"
//     }
// }
// window.addEventListener("load", function() {
//     const logout = document.querySelector("#logout");
//     logout.addEventListener("click", function(){
//         logOut();
//     });
// });