window.addEventListener('load', function(){
    let currentUser = isAuthenticated();
    let button = document.querySelector('#addToCart');
    console.log(button);
    
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
            button.style.display = 'none';
            let dashboardtag = document.querySelector('#dashboard');
            dashboardtag.style.display = 'block';
            dashboardtag.href = `./${currentUser.role}/${currentUser.role}-dashboard.html`;
        }
    }
    else{
        document.querySelector('#login').style.display = 'block';
        document.querySelector('#register').style.display = 'block';
        button.style.display = 'none';
    }

});//end of load

