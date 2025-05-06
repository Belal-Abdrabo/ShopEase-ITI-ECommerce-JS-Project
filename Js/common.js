// Check if user is logged in or not
const url = "http://localhost:3000/";
const isAuthenticated = function () {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
        const userData = JSON.parse(user);
        return userData;
    } else {
        return false;
    }
}

const adminCheckAuthentication = function () {
    const user = isAuthenticated();  //return user data if user is logged in or flase if not logged in
    if(user)
    {
        if(user.role == "seller"|| user.role == "customer")
        {
            window.location.href = "../access-denied.html";
        }
    }
    else
    {
        window.location.href = "../access-denied.html";
    }

}

// Check if user role has access to the page or not
const isHasAccess = function (page, role) {
    if (role == 'admin') {
        if (page.includes('admin')) {
            return true;
        }
    } else if (role == 'seller') {
        if (page.includes('seller')) {
            return true;
        }
    }
    return false;
}

//#region user methods 
const getLoggedInUser = function () {
    const loggedUser = localStorage.getItem("loggedInUser");
    if (loggedUser) {
        return JSON.parse(loggedUser);
    } else {
        return null;
    }
}

// Get all users
const getAllUsers = function () {
    const url = 'http://localhost:3000/users';

    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}
//GET url/posts?_page=1&_per_page=25
const getUserByPagination = function(pageNum, countPerPage)
{
    return fetch(url + 'users?_page=' + pageNum + '&_limit=' + countPerPage)
            .then(res => res.json())
            .catch(err =>{
                console.error('Error:', err);
                return [];
            });
}

// Get specific user by email
const getUserByEmail = function (email) {
    const url = 'http://localhost:3000/users?email=' + email;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

// Get specific user by role
const getUserByRole = function (role) {
    const url = 'http://localhost:3000/users?role=' + role;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Get specific user by ID
const getUserById = function (id) {
    const url = 'http://localhost:3000/users/' + id;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}
//#endregion user methods


//#region product methods

// Get all products
const getAllProducts = function () {
    const url = 'http://localhost:3000/products';
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Get specific product by ID
const getProductById = function (id) {
    const url = 'http://localhost:3000/products/' + id;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

//#endregion

//#region categories methods

// Get all categories
const getAllCategories = function () {
    const url = 'http://localhost:3000/categories';
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Get specific category by ID
const getCategoryById = function (id) {
    const url = 'http://localhost:3000/categories/' + id;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

//#endregion

//#region orders methods

// Get all orders
const getAllOrders = function () {
    const url = 'http://localhost:3000/orders';
    return fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log("Fetched orders:", data);
            return data;
        })
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Get specific order by ID
const getOrderById = function (id) {
    const url = 'http://localhost:3000/orders/' + id;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

//#endregion

//#region cart methods

// Get all cart items
const getAllCartItems = function () {
    const url = 'http://localhost:3000/cart';
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Get specific cart item by ID
const getCartItemById = function (id) {
    const url = 'http://localhost:3000/cart/' + id;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return null;
        });
}

// Get cart items by customer ID
const getCartItemByUserId = function (customerId) {
    const url = 'http://localhost:3000/cart?customerId=' + customerId;
    return fetch(url)
        .then(response => response.json())
        .catch(error => {
            console.error('Error:', error);
            return [];
        });
}

// Post a cart using customer ID (create only if it doesn't exist)
const postCartUsingCustomerId = function (customerId) {
    return fetch(`http://localhost:3000/cart?customerId=${customerId}`)
        .then(res => res.json())
        .then(carts => {
            if (carts.length > 0) {
                console.log("Cart already exists:", carts[0]);
                return carts[0];
            } else {
                return fetch('http://localhost:3000/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        customerId: customerId,
                        items: []
                    })
                })
                    .then(res => res.json())
                    .then(newCart => {
                        console.log("Created new cart:", newCart);
                        return newCart;
                    });
            }
        })
        .catch(error => {
            console.error("Error:", error);
            return null;
        });
}

//#endregion

const handleAddToCart = async function(productId, sellerId) {
    const currentUser = isAuthenticated();
    const cartUrl = "http://localhost:3000/cart";
    const productUrl = `http://localhost:3000/products/${productId}`;

    try {
        // Get product capacity
        const productRes = await fetch(productUrl);
        const product = await productRes.json();
        const capacity = product.capacity;

        // Get user's cart
        const cartRes = await fetch(`${cartUrl}?customerId=${currentUser.id}`);
        const carts = await cartRes.json();

        let userCart;

        if (carts.length === 0) {
            // If cart doesn't exist, create one
            userCart = {
                id: crypto.randomUUID(),
                customerId: currentUser.id,
                status: "processing",
                items: []
            };

            await fetch(cartUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userCart)
            });
        } else {
            userCart = carts[0];
        }

        // Find product in cart
        const itemIndex = userCart.items.findIndex(item => item.productId == productId);

        if (itemIndex !== -1) {
            const currentQty = userCart.items[itemIndex].quantity;
            if (currentQty < capacity) {
                userCart.items[itemIndex].quantity += 1;
            } else {
                alert("You reached the product capacity limit!");
                return;
            }
        } else {
            userCart.items.push({
                productId: productId,
                quantity: 1,
                status: "processing",
                sellerId: sellerId
            });
        }

        // Update the cart
        await fetch(`${cartUrl}/${userCart.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userCart)
        });

        console.log("Cart updated successfully.");

    } catch (err) {
        console.error("Error updating cart:", err);
    }
};


// const handleAddToCart = function(productId,sellerId) {
//     const currentUser = isAuthenticated();
//     const cartUrl = "http://localhost:3000/cart";

//     fetch(`${cartUrl}?customerId=${currentUser.id}`)
//         .then(res => res.json())
//         .then(carts => {
//             const userCart = carts[0];
//             const itemIndex = userCart.items.findIndex(item => String(item.productId) === String(productId));


//             if (itemIndex !== -1) {
//                 userCart.items[itemIndex].quantity += 1;
//             } else {
//                 userCart.items.push({
//                     productId: productId,
//                     quantity: 1,
//                     sellerId: sellerId
//                 });
//             }

//             return fetch(`${cartUrl}/${userCart.id}`, {
//                 method: 'PUT',
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//                 body: JSON.stringify(userCart)
//             });
//         })
//         .then(res => res.json())
//         .then(updatedCart => {
//             console.log("Cart updated:", updatedCart);
//         })
//         .catch(err => console.error("Error updating cart:", err));
// }


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