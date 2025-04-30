window.addEventListener("load", function() {
    const currentUser = localStorage.getItem("loggedInUser");
    const user = JSON.parse(currentUser);
    const userRole = user.role;
    if(!currentUser)
    {
        //hide items ()
    }
    else{
        //view items(cart - logout - cart)
    }

});//load end