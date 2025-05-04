window.addEventListener('load', function(evernt) {
    const currentUser = isAuthenticated();
    if(!currentUser)
    {
        window.location.href = '../login.html';
    }
                                              //start from here

let x =currentUser.id;

let cartContainer = document.querySelector(".cart-items");
let cartItem = document.querySelector(".cart-item");
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
        if(carts.length > 0){
        usercart = carts[0];
        for (let index in usercart.items) {
            let prod = products.find(pr => pr.id == usercart.items[index].productId);
            let newItem = cartItem.cloneNode(true); //to get fresh copy of the cart item layout
        
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
                    <input type="number" class='quantity-input' value="${usercart.items[index].quantity}">
                    <button class="quantity-btn plus"><i class="fas fa-plus"></i></button>
                </div>
                <div class="item-total">${prod.price * usercart.items[index].quantity} EGP</div>
                <button class="remove-item"><i class="fas fa-trash"></i></button>
            `;
        

            const plusBtn = newItem.querySelector(".plus");
            const minusBtn = newItem.querySelector(".minus");
            const quantityInput = newItem.querySelector(".quantity-input");
            const itemTotal = newItem.querySelector(".item-total");
            const deletbtn = newItem.querySelector(".remove-item");

            plusBtn.addEventListener("click", () => {
                let quantity = parseInt(quantityInput.value);
        
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

})
