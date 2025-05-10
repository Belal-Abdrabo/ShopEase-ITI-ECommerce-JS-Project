window.addEventListener('load', function(){
    let currentUser = isAuthenticated();
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
            let dashboardtag = document.querySelector('#dashboard');
            dashboardtag.style.display = 'block';
            dashboardtag.href = `./pages/${currentUser.role}/${currentUser.role}-dashboard.html`;
        }
    }
    else{
        document.querySelector('#login').style.display = 'block';
        document.querySelector('#register').style.display = 'block';

    }

});//end of load

