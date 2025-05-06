window.addEventListener('load', function () {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');
    const button = document.getElementsByClassName('btn')[0];
    const productUrl = `http://localhost:3000/products?id=${productId}`;
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
        handleAddToCart(productId);
      })
  });