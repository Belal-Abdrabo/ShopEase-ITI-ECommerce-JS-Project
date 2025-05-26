window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);
    let cat = params.get('id');
    const currentUser = isAuthenticated();
    const productUrl = "http://localhost:3000/products";
    const searchInput = document.getElementById('searchInput');
    let searchQuery = "";
    const container = document.getElementsByClassName('products-grid')[0];
    const categoryButtons = document.querySelectorAll('.categoriesbutton');
    const next = document.getElementById('r');
    const left = document.getElementById('l');
    const pag = document.getElementsByClassName('pagination-ellipsis')[0];
    let totalPages;

    const minPriceInput = document.getElementById('min-price');
    const maxPriceInput = document.getElementById('max-price');
    const applyPriceButton = document.querySelector('.filter-section .btn');

    let productsData = [];
    let currentPage = 1;
    const itemsPerPage = 9;
    let selectedCategory = cat ?? 'all';

    let minPrice = 0;
    let maxPrice = null;

    applyPriceButton.addEventListener('click', function () {
        minPrice = parseFloat(minPriceInput.value) || 0;
        maxPrice = parseFloat(maxPriceInput.value) || null;
        currentPage = 1;
        renderProducts(currentPage);
    });

    searchInput.addEventListener('input', function () {
        searchQuery = this.value;
        currentPage = 1;
        renderProducts(currentPage);
    });

    function getFilteredProducts() {
        let filtered = selectedCategory === 'all'
            ? productsData
            : productsData.filter(product => product.categoryId == selectedCategory);

        if (searchQuery.trim() !== "") {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (maxPrice !== null) {
            filtered = filtered.filter(product =>
                product.price >= minPrice && product.price <= maxPrice
            );
        }

        return filtered;
    }

    function renderProducts(page) {
        const filteredProducts = getFilteredProducts();
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = filteredProducts.slice(start, end);

        container.innerHTML = '';

        currentItems
            .filter(i => i.status != "pending" && i.status != "rejected")
            .forEach(product => {
                const div = document.createElement('div');
                div.innerHTML = `
                    <div class="product-card">
                        <div class="product-badge" id="stat">${product.status}</div>
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}">
                            <div class="product-actions">
                                <button class="action-btn"><i class="fas fa-heart"></i></button>
                                <button class="action-btn cartprod" product-id="${product.id}"><i class="fas fa-shopping-cart"></i></button>
                                <a href="./product-detail.html?id=${product.id}" class="action-btn"><i class="fas fa-eye"></i></a>
                            </div>
                        </div>
                        <div class="product-info">
                            <h3><a href="./product-detail.html?id=${product.id}">${product.name}</a></h3>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                                <span>(42)</span>
                            </div>
                            <p class="product-price">${product.price} EGP</p>
                            <p class="product-description">${product.productDescription}</p>
                            <a href="product-detail.html?id=${product.id}&sellerId=${product.sellerId}" class="btn btn-secondary">View Details</a>
                        </div>
                    </div>
                `;

                if (product.status === "out of stock") {
                    let badge = div.querySelector('.product-badge');
                    badge.style.backgroundColor = 'red';
                }

                container.appendChild(div);

                const cartprod = div.querySelector('.cartprod');
                if (product.status === "out of stock" || currentUser.role !== 'customer') {
                    cartprod.style.display = 'none';
                } else {
                    cartprod.addEventListener('click', function () {
                        const productId = parseInt(this.getAttribute('product-id'));
                        handleAddToCart(productId, product.sellerId);

                        // ✅ SweetAlert يظهر بعد إضافة المنتج
                        Swal.fire({
                            icon: 'success',
                            title: 'Added to Cart!',
                            text: 'The product has been added to your cart.',
                            timer: 1500,
                            showConfirmButton: false
                        });
                    });
                }
            });

        totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        pag.innerHTML = `${page} of ${totalPages}`;
    }

    fetch(productUrl)
        .then(response => response.json())
        .then(data => {
            productsData = data;
            renderProducts(currentPage);
        })
        .catch(error => {
            console.error("Error fetching products:", error);
        });

    categoryButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedCategory = this.getAttribute('data-category');
            currentPage = 1;
            renderProducts(currentPage);
        });
    });

    next.addEventListener('click', function () {
        if (currentPage < totalPages) {
            currentPage++;
            renderProducts(currentPage);
        }
    });

    left.addEventListener('click', function () {
        if (currentPage > 1) {
            currentPage--;
            renderProducts(currentPage);
        }
    });
});
