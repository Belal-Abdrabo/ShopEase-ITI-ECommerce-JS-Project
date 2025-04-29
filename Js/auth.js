window.addEventListener('load', function(){
    const form = document.querySelector("#login-form");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const emailErrorMessage = document.querySelector("#email-login-error");
    const passwordErrorMessage = document.querySelector("#password-login-error");

    form.addEventListener('submit', function(event){
        let flag = true;
        console.log("submit event triggered");
        
        let emailValue = email.value.trim();
        let passwordValue = password.value.trim();
        if(emailValue === '')
        {
            console.log("Email is empty");
            event.preventDefault(); // Prevent form submission
            emailErrorMessage.textContent = "Please fill email field";
            emailErrorMessage.style.display = "block"; // Show the error message
            flag = false;
        }
        else if(!isValidEmail(emailValue))
        {
            event.preventDefault(); // Prevent form submission
            emailErrorMessage.textContent = "Please enter a valid email address";
            emailErrorMessage.style.display = "block"; // Show the error message
            flag = false;
        }
        if(passwordValue === '')
        {
            console
            event.preventDefault(); // Prevent form submission
            passwordErrorMessage.textContent = "Please fill password field";
            passwordErrorMessage.style.display = "block"; // Show the error message
            flag = false;
        }
        if(flag)
        {
            emailErrorMessage.style.display = "none"; // Hide the error message
            passwordErrorMessage.style.display = "none"; // Hide the error message
            event.preventDefault();
            console.log("log in");
            
        }
    });
});

const isValidEmail = (email_value) =>{
    console.log('email val: '+email_value);
    
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern
    console.log('email val: '+emailPattern.test(email_value));
    
    return emailPattern.test(email_value);
}

const login = (_email, _password) => {

}