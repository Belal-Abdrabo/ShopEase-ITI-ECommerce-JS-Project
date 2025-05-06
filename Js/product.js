window.addEventListener('load', function () {
    const productUrl = "http://localhost:3000/products";
    const searchInput = document.getElementById('searchInput');
    let searchQuery = ""; 
    const container = document.getElementsByClassName('products-grid')[0];
    const categoryButtons = document.querySelectorAll('.categoriesbutton');
    const next = document.getElementById('r');
    const left = document.getElementById('l');
    const pag = document.getElementsByClassName('h2-pag')[0];
    searchInput.addEventListener('input', function () {
        searchQuery = this.value;
        currentPage = 1;
        renderProducts(currentPage);
      });
      
    let productsData = [];
    let currentPage = 1;
    const itemsPerPage = 9;
    let selectedCategory = 'all'; // store selected category globally
    function getFilteredProducts() {
        let filtered = selectedCategory === 'all'
          ? productsData
          : productsData.filter(product => product.categoryId == selectedCategory);
      
        if (searchQuery.trim() !== "") {
          filtered = filtered.filter(product =>
            product.name.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        return filtered;

      }
    function renderProducts(page) {
        const filteredProducts = getFilteredProducts(); // filter based on selectedCategory
        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const currentItems = filteredProducts.slice(start, end);

        container.innerHTML = '';
        currentItems.forEach(product => {
            const div = document.createElement('div');
            div.innerHTML = `
                <div class="product-card">
                    <div class="product-badge">New</div>
                    <div class="product-image">
                        <img src="../${product.image}" alt="${product.name}">
                        <div class="product-actions">
                            <button class="action-btn"><i class="fas fa-heart"></i></button>
                            <button class="action-btn cartprod" product-id=${product.id}><i class="fas fa-shopping-cart"></i></button>
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
            container.appendChild(div);


            // Add event listener to the cart button
            const cartprod = div.querySelector('.cartprod');
            cartprod.addEventListener('click', function () {
                const productId = parseInt(this.getAttribute('product-id'));
            
                handleAddToCart(productId, product.sellerId); 
            });
            
            
        });

        const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
        pag.innerHTML = `<h2> ${page}</h2>`;
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
            selectedCategory = this.getAttribute('data-category'); //  update global filter
            currentPage = 1;
            renderProducts(currentPage);
        });
    });

    next.addEventListener('click', function () {
        const filtered = getFilteredProducts();
        const totalPages = Math.ceil(filtered.length / itemsPerPage);
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
