window.addEventListener('load', function(event){
    setTimeout(() => {
        let user = isAuthenticated();
        if(user)
        {
            if(user.role == "admin")
                {
                    window.location.href = "../admin/admin-dashboard.html";
                }
                else if(user.role == "seller")
                {
                    window.location.href = "../seller/seller-dashboard.html";
                }
                else if(user.role == "customer")
                {
                    window.location.href = "../../index.html";
                }
        }
        else{
            window.location.href = "../login.html"
        }
    }, 5000);
});//load end