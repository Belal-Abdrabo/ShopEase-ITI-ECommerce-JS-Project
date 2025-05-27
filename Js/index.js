window.addEventListener('load', function () {
    const productGrid = document.getElementsByClassName('product-grid')[0];

    fetch("http://localhost:3000/products")
        .then(response => response.json())
        .then(data => {
            const newProducts = data.filter(i => i.status != "pending" && i.status != "rejected").slice(-4); // Get last 4 products

            newProducts.forEach(product => {
                const div = document.createElement('div');
                div.className = 'product-card';

                div.innerHTML = `
                    <div class="product-card">
                        <div class="product-badge">New</div>
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-info">
                            <h3>${product.name}</h3>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>(120)</span>
                            </div>
                            <p class="product-price">${product.price} EGP</p>
                            <a href="./pages/product-detail.html?id=${product.id}" class="btn btn-secondary">View Details</a>
                        </div>
                    </div>
                `;

                productGrid.appendChild(div);
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});
