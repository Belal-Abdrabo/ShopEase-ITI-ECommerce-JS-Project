window.addEventListener('load', function () {
    const currentUser = isAuthenticated();
    let s = cartsize();
    if (!currentUser) {
        window.location.href = '../login.html';
    }
    let x = currentUser.id;
    const userProfile = document.querySelector('#personal-info-form');

    //start from here
    fetch(`http://localhost:3000/users/${x}`).then(res => res.json())
        .then(user => {
            console.log(user);
            
            this.document.getElementById('first-name').value = user.userName.split(' ')[0];
            this.document.getElementById('last-name').value = user.userName.split(' ')[1];
            this.document.getElementById('email').value = user.email;
            this.document.getElementById('phone').value = user.phone;
            this.document.getElementById('adress').value = user.address;
            this.document.getElementById('gender').value = user.gender;

            this.document.querySelector('.username').textContent = user.userName;
            this.document.querySelector('.useremail').textContent = user.email;
            if (user.gender === 'male') {
                const imgElement = document.querySelector('.userimg');
                imgElement.src = "../../images/DefaultProfile.webp";
            } else if (user.gender === 'female') {
                const imgElement = document.querySelector('.userimg');
                imgElement.src = "../../images/userFemail.png";
            }



        })

    userProfile.addEventListener('submit', function (event) {

        let fname = document.querySelector('#first-name').value;
        let lname = document.querySelector('#last-name').value;
        let fullname = `${fname} ${lname}`;
        let editemail = document.querySelector('#email').value;
        let editphone = document.querySelector('#phone').value;
        let editaddress = document.querySelector('#adress').value;
        let editgender = document.querySelector('#gender').value;

        fetch(`http://localhost:3000/users/${x}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ address: editaddress, gender: editgender, phone: editphone, email: editemail, userName: fullname })

        })
    })


    //////////////////////////////for order history




    const orderContainer = document.querySelector('.orders-list');
    const pag = document.querySelector('.h2-pag');
    const next = document.querySelector('#r');
    const prev = document.querySelector('#l');
    const addreviewo = document.getElementById("addReviewBtn")
    const revform = document.getElementById("reviewForm")
    let products = [];
    let allOrders = [];
    let currentPage = 1;
    const itemsPerPage = 2;

    // Fetch products first, then orders
    fetch("http://localhost:3000/products")
        .then(res => res.json())
        .then(prodData => {
            products = prodData;
            return fetch(`http://localhost:3000/cartcheckout?customerId=${x}`); // Replace x with actual customerId
        })
        .then(res => res.json())
        .then(orderData => {
            allOrders = orderData;
            renderProducts(currentPage);
        })
        .catch(err => console.error("Error fetching data:", err));

    // Render function
    function renderProducts(page) {
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = allOrders.slice(start, end);

        const totalPages = Math.ceil(allOrders.length / itemsPerPage);
        orderContainer.innerHTML = '';
        pag.innerHTML = `<h2>Page ${page} of ${totalPages}</h2>`;

        currentItems.forEach(order => {
            const newOrder = document.createElement('div');
            newOrder.classList.add("single-order");

            const orderHeader = document.createElement('div');
            orderHeader.innerHTML = `
      <div class="order-info">
        <span class="order-id">Order-ID: ${order.id}</span>
        <span class="order-date">${order.orderdate}</span>
      </div>
      <div class="order-status">
        <span class="status-badge delivered">${order.status}</span>
      </div>`;

            const orderItems = document.createElement('div');
            orderItems.classList.add("order-items");

            let total = 0;

            for (let item of order.items) {
                const prod = products.find(pr => pr.id == item.productId);
                if (!prod) continue;

                const orderItem = document.createElement('div');
                orderItem.innerHTML = `
        <div class="order-item">
          <img src="${prod.image}" alt="${prod.name}">
          <div class="item-details">
            <h4>${prod.name}</h4>
            <p class="item-price">${prod.price} EGP</p>
            <p class="item-quantity">Qty: ${item.quantity}</p>
            <a href="../product-detail.html?id=${prod.id}&sellerId=${prod.sellerId}" class="btn btn-outline btn-sm">View Details</a>
            <button class="btn btn-secondary btn-sm addReviewBtn">Write Review</button>
            <div class="reviewForm" style="display: none;">
            <textarea class="reviewText" placeholder="Write your review..."></textarea>
            <br>
            <button class="submitReview btn btn-primary btn-sm" data-sellerid=${prod.sellerId} data-prodid=${prod.id}>Submit</button>
            <button class="cancelReview btn btn-outline btn-sm">Cancel</button>
            </div>
            </div>
        </div>`;

                total += prod.price * item.quantity;
                orderItems.appendChild(orderItem);
            }

            const orderFooter = document.createElement('div');
            orderFooter.innerHTML = `
      <div class="order-total">
      
        <span>Total:</span>
        <span class="total-amount">${total} EGP</span>
      </div>`;

            newOrder.appendChild(orderHeader);
            newOrder.appendChild(orderItems);
            newOrder.appendChild(orderFooter);

            orderContainer.appendChild(newOrder);
        });

        if (currentPage === 1) {
            prev.style.cssText = "display: none;";
        } else if (currentPage === totalPages) {
            next.style.cssText = "display: none;";
        }
        else {
            prev.style.cssText = "display: flex;";
            next.style.cssText = "display: flex;";
        }
    }


    // Pagination controls
    next.addEventListener('click', () => {
        const totalPages = Math.ceil(allOrders.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(currentPage);
        }
    });

    prev.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderProducts(currentPage);
        }
    });

    // Event delegation for review items

    orderContainer.addEventListener("click", function (e) {
        const btn = e.target;
      
        // Open review form
        if (btn.classList.contains("addReviewBtn")) {
          const reviewForm = btn.nextElementSibling;
          reviewForm.style.display = "block";
        }
      
        // Submit review
        if (btn.classList.contains("submitReview")) {
          const form = btn.closest(".reviewForm");
          const textarea = form.querySelector(".reviewText");
          const review = textarea.value.trim();
      
          if (review === "") {
            alert("Please write something first.");
            return;
          }
      
          alert("Review submitted: " + review);
          textarea.value = "";
          form.style.display = "none";

          fetch(`http://localhost:3000/review`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderReview: review, productId: btn.dataset.prodid,userId:x ,sellerId:btn.dataset.sellerid})
          })
            .then(response => response.json())
            .then(data => {
              console.log('Review submitted:', data);
            })
            .catch(error => {
              console.error('Error submitting review:', error);
            });
        }
        // Cancel review
        if (btn.classList.contains("cancelReview")) {
          const form = btn.closest(".reviewForm");
          form.querySelector(".reviewText").value = "";
          form.style.display = "none";
        }
      });
      

    




})

