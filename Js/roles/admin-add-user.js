window.addEventListener("load", function () {
    const form = document.querySelector('#register-form');
    const fullName = document.querySelector('#fullname');
    const email = document.querySelector('#email');
    const password = document.querySelector('#password');
    const confirmPassword = document.querySelector('#confirm-password');
    const accountTypeRadios = document.getElementsByName('account-type');
    const termsCheckbox = document.querySelector('#terms');

    const nameError = document.querySelector('#fullname-error');
    const emailError = document.querySelector('#email-error');
    const passwordError = document.querySelector('#password-error');
    const confirmPasswordError = document.querySelector('#confirm-password-error');

    const url = "http://localhost:3000/";

    const user = isAuthenticated();  //return user data if user is logged in or flase if not logged in
    if(user)
    {
        if(user.role == "seller"|| user.role == "customer")
        {
            window.location.href = "../access-denied.html";
        }
    }

    const isValidEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
    };

    form.addEventListener('keyup', function (event) {
        const value = event.target.value.trim();

        if (event.target.id === 'fullname') {
            nameError.textContent = value === '' ? "Full name is required" : "";
        }

        if (event.target.id === 'email') {
            if (value === '') {
                emailError.textContent = "Email is required";
            } else if (!isValidEmail(value)) {
                emailError.textContent = "Invalid email format";
            } else {
                emailError.textContent = "";
            }
        }

        if (event.target.id === 'password') {
            passwordError.textContent = value.length < 6 ? "Password must be at least 6 characters" : "";
        }

        if (event.target.id === 'confirm-password') {
            confirmPasswordError.textContent = value !== password.value.trim() ? "Passwords do not match" : "";
        }
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const fullNameVal = fullName.value.trim();
        const emailVal = email.value.trim();
        const passwordVal = password.value.trim();
        const confirmPasswordVal = confirmPassword.value.trim();
        // Convert the NodeList of radio buttons into an array using the spread operator,
        // then use .find() to get the radio button that is currently checked,
        // and finally get its value ("customer" or "seller")
        const selectedRole = [...accountTypeRadios].find(r => r.checked).value;

        let isValid = true;

        // Validate again on submit
        if (fullNameVal === '') {
            nameError.textContent = "Full name is required";
            isValid = false;
        } else {
            nameError.textContent = "";
        }

        if (!isValidEmail(emailVal)) {
            emailError.textContent = "Invalid email format";
            isValid = false;
        } else {
            emailError.textContent = "";
        }

        if (passwordVal.length < 6) {
            passwordError.textContent = "Password must be at least 6 characters";
            isValid = false;
        } else {
            passwordError.textContent = "";
        }

        if (passwordVal !== confirmPasswordVal) {
            confirmPasswordError.textContent = "Passwords do not match";
            isValid = false;
        } else {
            confirmPasswordError.textContent = "";
        }

        if (!termsCheckbox.checked) {
            alert("You must agree to the Terms & Conditions.");
            isValid = false;
        }

        if (!isValid) return;

        // Check if email already exists
        fetch(`${url+'users'}?email=${emailVal}`)
            .then(res => res.json())
            .then(users => {
                if (users.length > 0) {
                    emailError.textContent = "Email already exists";
                } else {
                    const newUser = {
                        userName: fullNameVal,
                        email: emailVal,
                        password: passwordVal,
                        role: selectedRole
                    };
                    
                    fetch(url+'users', {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(newUser)
                    })
                    .then(res => {
                        if (res.ok) {
                            window.location.href = "./login.html";
                        } else {
                            alert("Failed to register. Try again.");
                        }
                    });
                }
            })
            .catch(err => {
                alert("An error occurred. Try again.");
                console.error(err);
            });
    });
});
