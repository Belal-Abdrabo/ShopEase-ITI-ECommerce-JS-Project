window.addEventListener('load', function(evernt) {
    const currentUser = isAuthenticated();
    if(!currentUser)
    {
        window.location.href = '../login.html';
    }
    
})
