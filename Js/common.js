//check if user is logged in or not
const isAuthenticated = function()   
{
    const user = localStorage.getItem("loggedInUser");
    if(user)
    {
        const userData = JSON.parse(user);
        return userData;
    }
    else
    {
        return false;
    }
}
//check if user role has access to the page or not
const isHasAccess = function(page, role)
{
    if(role == 'admin')
    {
        if(page.includes('admin'))
        {
            return true;
        }
    }
    else if(role == 'seller')
    {
        if(page.includes('seller'))
        {
            return true;
        }
    }
    return false;
    
}

const logOut = functio()
{
    localStorage.removeItem("loggedInUser");
    window.location.href = "../index.html";
}
// const isValidEmail = function (_emailValue, _errorMessageElement){
//     if(_emailValue === '')
//     {
//         _errorMessageElement.style.display = "block";
//         _errorMessageElement.textContent = "Please fill Email field"
//     }
// }