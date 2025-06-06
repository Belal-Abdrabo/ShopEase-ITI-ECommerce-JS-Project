window.addEventListener('load', function(){
    let currentUser = isAuthenticated();
    let addcart = document.querySelectorAll('.cartprod');
    console.log(addcart);
    
    const disableCart = function(){
        console.log(addcart);
        
        addcart.forEach(cart => cart.display = 'none');
    }
    if(currentUser)
    {
        document.querySelector('#logout').style.display = 'block';
        if(currentUser.role == 'customer')
        {
            document.querySelector('#cart').style.display = 'block';
            document.querySelector('#profile').style.display = 'block';
        }
        else if(currentUser.role == 'seller' || currentUser.role == 'admin')
        {
            disableCart();
            let dashboardtag = document.querySelector('#dashboard');
            dashboardtag.style.display = 'block';
            dashboardtag.href = `./${currentUser.role}/${currentUser.role}-dashboard.html`;
        }
    }
    else{
        disableCart();
        document.querySelector('#login').style.display = 'block';
        document.querySelector('#register').style.display = 'block';

    }

    
});//end of load

