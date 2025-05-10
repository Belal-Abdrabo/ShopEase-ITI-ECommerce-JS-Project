window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    const sellerId = params.get('sellerId');
    const button = document.getElementsByClassName('btn')[0];
    const productUrl = `http://localhost:3000/products?id=${productId}`;
    const revUrl = `http://localhost:3000/review?productId=${productId}`;

    fetch(productUrl)
      .then(res => res.json())
      .then(product =>  {
        for(let f of product){  
          document.getElementById('product-name').textContent = f.name;
          document.getElementById('product-price').textContent = `${f.price} EGP`;
          //document.getElementById('product-img').src = "../" + f.image;
          document.getElementById('product-img').src = f.image;
          document.getElementById('product-img').alt = f.name;
          document.getElementById('product-description').textContent = f.productDescription;

        }
      })
      .catch(err => {
        console.error("Error loading product details:", err);
      });
      button.addEventListener('click', function() {
        handleAddToCart(productId,sellerId);
      })
      

let male = "../images/DefaultProfile.webp";
let female = '../images/userFemail.png'
const usersUrl = `http://localhost:3000/users`;
const reviewContainer = document.querySelector('.user-reviews');

// Fetch users and reviews in parallel
Promise.all([
    fetch(usersUrl).then(res => res.json()),
    fetch(revUrl).then(res => res.json())
])
.then(([users, reviews]) => {
    reviewContainer.innerHTML = ""; // Clear any existing reviews

    reviews.forEach(review => {
        const user = users.find(u => u.id === review.userId);
        const userName = user ? user.userName : "Unknown User";
        let userAvatar = user?.avatar || "images/default-avatar.png"; // fallback image
        if(user.gender==="male"){userAvatar = male}
        else if(user.gender==="female"){userAvatar = female}
        

        // Create star rating
        let stars = '';
        for (let i = 0; i < 5; i++) {
            stars += i < review.rating 
                ? '<i class="fas fa-star"></i>' 
                : '<i class="far fa-star"></i>';
        }

  const reviewElement = document.createElement('div');
reviewElement.classList.add('review');
reviewElement.innerHTML = `
    <div class="review-header">
        <img src="${userAvatar}" alt="${userName}">
        <div>
            <h4>${userName}</h4>
            <div class="review-rating">${stars}</div>
            <span class="review-date">${review.date}</span>
        </div>
    </div>
    <div class="review-content">
        <p>${review.orderReview}</p>
    </div>
`;


        reviewContainer.appendChild(reviewElement);
    });
})
.catch(error => {
    console.error("Failed to load reviews or users:", error);
    reviewContainer.innerHTML = "<p>Unable to load reviews at this time.</p>";
});


  });