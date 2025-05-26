const currentUser = customerCheckAuthentication();
window.addEventListener('load', function () {
    let x = currentUser.id;
    let cartContainer = document.querySelector(".cart-items");
    let cartItem = document.querySelector(".cart-item");
    let suptotal = document.querySelector(".subtotal");
    let tax = document.querySelector(".tax");
    let total = document.querySelector(".totall");
    let checkout = document.querySelector(".checkout-btn");
    let totalp = 0;
    cartItem.remove();
    let products = [];

    fetch("http://localhost:3000/products")
        .then(res => res.json())
        .then(data => { products = data; });

    fetch(`http://localhost:3000/cart?customerId=${x}`)
        .then(res => res.json()).then(carts => {
            if (carts.length > 0) {
                usercart = carts[0];
                for (let index in usercart.items) {
                    let prod = products.find(pr => pr.id == usercart.items[index].productId);
                    let capacity = prod.capacity;
                    let newItem = cartItem.cloneNode(true);
                    let quantity = usercart.items[index].quantity;
                    let cost = prod.price * quantity;

                    usercart.items[index].sellerId = prod.sellerId;
                    usercart.status = "pending";
                    totalp += cost;

                    suptotal.innerHTML = `<span>Subtotal</span><span>${totalp} EGP</span>`;
                    tax.innerHTML = `<span>Tax (8%)</span><span>${(totalp * 0.08).toFixed(2)} EGP</span>`;
                    total.innerHTML = `<span>Total</span><span>${(totalp * 0.08 + 10 + totalp).toFixed(2)} EGP</span>`;

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
                            <input type="text" disabled class='quantity-input' value="${quantity}">
                            <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                        </div>
                        <div class="item-total">${cost} EGP</div>
                        <button class="remove-item"><i class="fas fa-trash"></i></button>
                    `;

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

                            fetch(`http://localhost:3000/cart/${usercart.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(usercart)
                            });
                        } else {
                            Swal.fire({
                                icon: 'warning',
                                title: 'Limit Reached',
                                text: 'You can not add more than the available capacity.',
                            });
                        }
                    });

                    minusBtn.addEventListener("click", () => {
                        let quantity = parseInt(quantityInput.value);
                        if (quantity > 1) {
                            quantity--;
                            quantityInput.value = quantity;
                            itemTotal.textContent = `${prod.price * quantity} EGP`;
                            usercart.items[index].quantity = quantity;

                            fetch(`http://localhost:3000/cart/${usercart.id}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(usercart)
                            });
                        }
                    });

                    deletbtn.addEventListener("click", () => {
                        Swal.fire({
                            title: 'Are you sure?',
                            text: `Do you want to remove ${prod.name} from the cart?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, delete it!',
                            cancelButtonText: 'Cancel'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                usercart.items.splice(index, 1);
                                fetch(`http://localhost:3000/cart/${usercart.id}`, {
                                    method: 'PUT',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(usercart)
                                }).then(() => {
                                    newItem.remove();
                                    Swal.fire('Deleted!', 'The item has been removed from your cart.', 'success');
                                }).catch(err => {
                                    console.error('Error updating cart:', err);
                                    Swal.fire('Error', 'Something went wrong while updating the cart.', 'error');
                                });
                            }
                        });
                    });

                    cartContainer.appendChild(newItem);
                }
            }
        });

    checkout.addEventListener("click", () => {
        if (usercart.items.length > 0) {
            const itemsToCheckout = [...usercart.items];
            const today = new Date();

            fetch("http://localhost:3000/cartcheckout", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    customerId: x,
                    items: itemsToCheckout,
                    amount: totalp * 0.08 + 10 + totalp,
                    status: "pending",
                    orderdate: `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
                })
            }).then(res => res.json()).then(data => {
                usercart.items = [];
                return fetch(`http://localhost:3000/cart/${usercart.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usercart)
                });
            }).then(() => {
                document.querySelectorAll(".cart-item").forEach(item => item.remove());
                Swal.fire({
                    icon: 'success',
                    title: 'Order Placed!',
                    text: 'Your order has been successfully placed.',
                    confirmButtonText: 'OK'
                }).then(() => {
                    window.location.href = '../../index.html';
                });
            }).catch(err => console.error('Error during checkout:', err));
        } else {
            Swal.fire({
                icon: 'info',
                title: 'Empty Cart',
                text: 'Your cart is empty. Please add items before checking out.'
            });
        }
    });
});
