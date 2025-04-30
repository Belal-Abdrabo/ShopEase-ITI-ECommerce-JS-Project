window.addEventListener('load', function(){
    const form = document.querySelector("#login-form");
    const email = document.querySelector("#email");
    const password = document.querySelector("#password");
    const loginErrorMessage = document.querySelector("#login-error");
    const emailErrorMessage = document.querySelector("#email-login-error");
    const passwordErrorMessage = document.querySelector("#password-login-error");
    const url = "http://localhost:3000/users";

    form.addEventListener("keyup", function(event){
        if(event.target.id == "email")
        {
            console.log("email event triggered");
        
            let emailValue = email.value.trim();
            if(emailValue === '' || !isValidEmail(emailValue))
            {
                if(emailValue === '')
                    {
                        console.log("Email is empty"); // Prevent form submission
                        emailErrorMessage.textContent = "Please fill email field";
                        emailErrorMessage.style.display = "block"; // Show the error message
                    }
                    else
                    {
                        event.preventDefault(); // Prevent form submission
                        emailErrorMessage.textContent = "Please enter a valid email address";
                        emailErrorMessage.style.display = "block"; // Show the error message
                        flag = false;
                    }
            }
            else
            {
                emailErrorMessage.style.display = "none";   
            }
        }
        if(event.target.id == "password")
        {
            let passwordValue = password.value.trim();
            if(passwordValue === '')
                {
                    console
                    event.preventDefault(); // Prevent form submission
                    passwordErrorMessage.textContent = "Please fill password field";
                    passwordErrorMessage.style.display = "block"; // Show the error message
                    flag = false;
                } 
                else{
                    passwordErrorMessage.style.display = "none";
                }
        }
        
    });
    form.addEventListener('submit', function(event){
        let flag = true;
        console.log("submit event triggered");
        
        let emailValue = email.value.trim().toLowerCase();
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
            login(emailValue, passwordValue);
            
        }
    });

    const isValidEmail = (email_value) =>{
        console.log('email val: '+email_value);
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; // Basic email pattern
        console.log('email val: '+emailPattern.test(email_value));
        
        return emailPattern.test(email_value);
    }
    
    // const login = (_email, _password) => {
    //     fetch(`${url}?email=${_email}`)
    //     .then((result) => {
    //         result.json()
    //     })
    //     .then((user) => {
    //         if(user) //found user with same email
    //         {
    //             if(user.password == _password) //password Check
    //             {
    //                 loginErrorMessage.style.display = "none";
    //                 console.log("logged in successfully");
    //                 console.log("user =>"+user);
                    
    //                 //save at local storage
    //                 //redirect base on his role
    //             }
    //         }
    //         else{
    //             loginErrorMessage.style.display = "block";
    //             console.log("invalid login");
                
    //         }
    //     }).catch((err) => {
            
    //     });;
    // };
    const login = (_email, _password) => {
        fetch(`${url}?email=${_email}`)
            .then((result) => result.json())
            .then((users) => {
                // JSON Server returns an array of users
                if (users.length > 0) {
                    const user = users[0];
                    if (user.password === _password) {
                        loginErrorMessage.style.display = "none";
                        console.log("✅ Logged in successfully");
                        let UserDto = {
                            id: user.id,
                            fullName: user.fullName,
                            email: user.email,
                            role: user.role,
                        };
                        console.log("user =>", UserDto);
                        
                        // Save to localStorage
                        localStorage.setItem("loggedInUser", JSON.stringify(UserDto));
    
                        // Redirect based on role
                        switch (user.role) {
                            case "admin":
                                window.location.href = "./admin-dashboard.html";
                                break;
                            case "seller":
                                window.location.href = "./seller-dashboard.html";
                                break;
                            case "customer":
                                window.location.href = "./products.html";
                                break;
                            default:
                                alert("Unknown user role");
                        }
                    } else {
                        loginErrorMessage.style.display = "block";
                        loginErrorMessage.textContent = "❌ Wrong password.";
                    }
                } else {
                    loginErrorMessage.style.display = "block";
                    loginErrorMessage.textContent = "❌ invalid login credentials";
                }
            })
            .catch((err) => {
                console.error("❌ Fetch error:", err);
                loginErrorMessage.style.display = "block";
                loginErrorMessage.textContent = "❌ Login failed. Please try again";
            });
    };
    
});

