window.addEventListener('load', function (evernt) {
    const currentUser = isAuthenticated();
    if (!currentUser) {
        window.location.href = '../login.html';
    }
    //start from here
    let x = currentUser.id;

    let cartContainer = document.querySelector(".cart-items");
    let cartItem = document.querySelector(".cart-item");
    let suptotal = document.querySelector(".subtotal");
    let tax = document.querySelector(".tax");
    let total = document.querySelector(".totall");
    let checkout = document.querySelector(".checkout-btn");
    let totalp = 0;

    cartItem.remove();

    //saveing products data so i don`t fetch it every time
    let products = [];
    fetch("http://localhost:3000/products")
        .then(res => res.json())
        .then(data => {
            products = data;

        });


    this.fetch(`http://localhost:3000/cart?customerId=${x}`)
        .then(res => res.json()).then(carts => {
            if (carts.length > 0) {
                usercart = carts[0];
                let cost = 0;
                for (let index in usercart.items) {
                    let prod = products.find(pr => pr.id == usercart.items[index].productId);
                    let capacity = prod.capacity;
                    let newItem = cartItem.cloneNode(true); //to get fresh copy of the cart item layout
                    cost = prod.price * usercart.items[index].quantity;
                    usercart.items[index].sellerId = prod.sellerId;
                    usercart.status = "pending"; //
                    totalp += cost;
                    suptotal.innerHTML = ` `;       
                    tax.innerHTML = ` `;
                    total.innerHTML = ` `;
                    newItem.innerHTML = `
                        <div class="item-image">
                            <img src="${prod.image}" alt="${prod.name}">
                            <div class="item-details">
                                <h3>${prod.name}</h3>
                                <p class="item-color">Color: Black</p>
                            </div>
                        </div>
                        <div class="item-price">${prod.price} EGP</div>
                        <div class="item-quantity">
                            <button class="quantity-btn minus"><i class="fas fa-minus"></i></button>
                            <input type="text" disabled class='quantity-input' value="${usercart.items[index].quantity}">
                            <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                        </div>
                        <div class="item-total">${prod.price * usercart.items[index].quantity} EGP</div>
                        <button class="remove-item"><i class="fas fa-trash"></i></button>
                    `;
                    suptotal.innerHTML = ` <span>Subtotal</span>
                            <span>${totalp} EGP</span>`;
                    tax.innerHTML = `
                            <span>Tax (8%)</span>
                            <span>${totalp * 0.08} EGP</span>`
                    total.innerHTML = ` <span>Total</span>
                            <span=>${totalp * 0.08 + 10 + totalp} EGP</span> `;

                    const plusBtn = newItem.querySelector(".plus");
                    const minusBtn = newItem.querySelector(".minus");
                    const quantityInput = newItem.querySelector(".quantity-input");
                    const itemTotal = newItem.querySelector(".item-total");
                    const deletbtn = newItem.querySelector(".remove-item");

                    plusBtn.addEventListener("click", () => {
                        let quantity = parseInt(quantityInput.value);
                        if (quantity < capacity) {
                            quantity++;
                            quantityInput.value = quantity;
                            itemTotal.textContent = `${prod.price * quantity} EGP`;
                            usercart.items[index].quantity = quantity;
                            //Update the cart for plus  
                            fetch(`http://localhost:3000/cart/${usercart.id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(usercart)
                            });
                        }
                        else {
                            alert("You can not add more than the available capacity.");
                        }

                    });

                    minusBtn.addEventListener("click", () => {
                        let quantity = parseInt(quantityInput.value);
                        if (quantity > 1) {
                            quantity--;
                            quantityInput.value = quantity;
                            itemTotal.textContent = `${prod.price * quantity} EGP`;
                            usercart.items[index].quantity = quantity;


                            // Update the cart for minus
                            fetch(`http://localhost:3000/cart/${usercart.id}`, {
                                method: 'PUT',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(usercart)
                            });
                        }
                    });

                    deletbtn.addEventListener("click", () => {

                        usercart.items.splice(index, 1); // it delete from position index of array of items and 1 to delete only one item

                        // Update the cart for delet
                        fetch(`http://localhost:3000/cart/${usercart.id}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(usercart)
                        }).then(() => {
                            newItem.remove();
                        }).catch(err => console.error('Error updating cart:', err));
                    });
                    cartContainer.appendChild(newItem);
                }

            }

        })

    //checkout button adding to checkout in json server and deleteing the cart items





    //still can`t stop checkout button from working if the cart is empty
    //still can`t delet item from the cart if the cart is empty
    // checkout.addEventListener("click", () => {
    //    // console.log("checkout clicked");


    //     if(usercart.items.length>0) {

    //         fetch("http://localhost:3000/cartcheckout",{
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             },
    //             body: JSON.stringify({
    //                 customerId: x,
    //                 items: usercart.items, // Create a shallow copy of the items array
    //                 amount: totalp * 0.08 + 10 + totalp,
    //                 status: "processing",
    //             })
    //         })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log("Checkout successful:", data);
    //             // Clear the cart after checkout
    //             usercart.items = [];

    //              fetch(`http://localhost:3000/cart/${usercart.id}`, {
    //                 method: 'PUT',
    //                 headers: {  
    //                     'Content-Type': 'application/json'
    //                 },
    //                 body: JSON.stringify(usercart)
    //             });
    //         })
    //         .then(() => {
    //             newItem.remove();
    //             alert("Checkout successful! Your order has been placed.");
    //             window.location.href = '../index.html'; // Redirect to home page or order confirmation page
    //         })
    //         .catch(err => console.error('Error during checkout:', err));
    //     }
    //     else {
    //         alert("Your cart is empty. Please add items to your cart before checking out.");

    //     }   
    // })

   

    
    checkout.addEventListener("click", () => {
        if (usercart.items.length > 0) {
            const itemsToCheckout = [...usercart.items]; //taking copy of items 
            const today = new Date();
            fetch("http://localhost:3000/cartcheckout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    customerId: x,
                    items: itemsToCheckout,
                    amount: totalp * 0.08 + 10 + totalp,
                    status: "pending",
                    orderdate:`${today.getDate().toString().padStart(2, '0')}/${(today.getMonth()+1).toString().padStart(2, '0')}/${today.getFullYear()}`
                   
                })
            })
            .then(res => res.json())
            .then(data => {
                console.log("Checkout successful:");
    
                usercart.items = [];
                return fetch(`http://localhost:3000/cart/${usercart.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(usercart)
                });
            })
            .then(() => {
                itemsToCheckout.forEach(item => {
                    const product = products.find(p => p.id == item.productId); //to get the product from the products array
                    // if (!product) {
                    //     console.warn(` Product not found: ${item.productId}`);
                    //     return;
                    // }
                    const newCapacity = product.capacity - item.quantity;
                    let statust = "available";
                    if(newCapacity == 0) {statust = "out of stock";}
                    // if (newCapacity < 0) {
                    //     console.log(` Insufficient stock for product ${item.productId}`);
                    //     return;
                    // }
                    fetch(`http://localhost:3000/products/${item.productId}`, {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ capacity: newCapacity, status: statust })

                    })
                   
                });
                document.querySelectorAll(".cart-item").forEach(item => item.remove());
                alert("Checkout successful! Your order has been placed.");  
                console.log("Checkout successful! Your order has been placed.");
                window.location.href = '../../index.html'; // Redirect to home page or order confirmation page
            })
            .catch(err => console.error(' Error during checkout:', err));
        } else {
            alert("Your cart is empty. Please add items before checking out.");
        }
    });
    
    
})
