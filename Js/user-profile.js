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

// Import SweetAlert2 if you're using npm/yarn
// import Swal from 'sweetalert2';

orderContainer.addEventListener("click", function (e) {
  const btn = e.target;

  // Open review form using SweetAlert2
  if (btn.classList.contains("btn-secondary")) {
    // Create the SweetAlert2 modal content
    Swal.fire({
      title: 'Write a Review',
      html: `
        <textarea id="reviewText" class="swal2-input" placeholder="Write your review..." rows="4"></textarea>
        <div class="rating" style="margin-top: 10px;">
          <input type="radio" name="rating" value="1" id="star1"><label for="star1">☆</label>
          <input type="radio" name="rating" value="2" id="star2"><label for="star2">☆</label>
          <input type="radio" name="rating" value="3" id="star3"><label for="star3">☆</label>
          <input type="radio" name="rating" value="4" id="star4"><label for="star4">☆</label>
          <input type="radio" name="rating" value="5" id="star5"><label for="star5">☆</label>
        </div>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const reviewText = document.getElementById('reviewText').value.trim();
        const rating = document.querySelector('input[name="rating"]:checked');
        const ratingValue = rating ? rating.value : null;

        if (reviewText === "") {
          Swal.showValidationMessage("Please write something first.");
          return false;
        }

        if (ratingValue === null) {
          Swal.showValidationMessage("Please select a rating.");
          return false;
        }

        // Submit review and rating
        const today = new Date();
        const data = {
          orderReview: reviewText,
          productId: btn.dataset.prodid,
          userId: x,
          sellerId: btn.dataset.sellerid,
          rating: ratingValue,
          date: `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`
        };

        return fetch(`http://localhost:3000/review`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
          console.log('Review submitted:', data);
          Swal.fire('Success', 'Your review has been submitted.', 'success');
        })
        .catch(error => {
          console.error('Error submitting review:', error);
          Swal.fire('Error', 'Something went wrong. Please try again.', 'error');
        });
      }
    });
  }
});

})

