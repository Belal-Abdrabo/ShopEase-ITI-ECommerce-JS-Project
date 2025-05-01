window.addEventListener('load', function(evernt) {
    const currentUser = isAuthenticated();
    if(!isAuthenticated)
    {
        window.locatin.href = '../login';
    }
    
})
