adminCheckAuthentication();
window.addEventListener('load', function() {
    // Get the userId from the URL query parameters
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Elements from the form
    const userNameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const roleInput = document.getElementById('role');
     const genderInput = document.getElementById('gender');
    const currentPasswordInput = document.getElementById('current-password');
    const newPasswordInput = document.getElementById('new-password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const deleteUserButton = document.querySelector('.danger-btn');

    // Error elements to display validation messages
    const userNameError = document.querySelector('#user-name-error');
    const emailError = document.querySelector('#email-error');
    const passwordError = document.querySelector('#password-error');
    const confirmPasswordError = document.querySelector('#confirm-password-error');
    const currentPasswordError = document.querySelector('#current-password-error');

    // Fetch user data using the userId to pre-fill the form fields
    fetch(`http://localhost:3000/users/${userId}`)
      .then(response => response.json())
      .then(user => {
          // Pre-fill the form with the user's current data
          userNameInput.value = user.userName;
          emailInput.value = user.email;
          roleInput.value = user.role;
          genderInput.value = user.gender;
          currentPasswordInput.value = user.password; // Assuming you want to show the current password (not recommended for security reasons)
          document.getElementById('user-id').value = user.id;
          document.getElementById('registration-date').value = user.registrationDate || "Not Available"; 

          // Handle form submission to update user data
          document.querySelector('.edit-user-form').addEventListener('submit', function(event) {
              event.preventDefault();
              
              // Validate form fields before proceeding
              if (!validateForm()) {
                  return; // Stop if validation fails
              }

              // Validate current password with the stored password
              if (currentPasswordInput.value !== user.password) {
                  currentPasswordError.textContent = 'Current password is incorrect';  // Display error if passwords do not match
                  currentPasswordInput.classList.add('error');
                  return; // Stop the update if current password is incorrect
              } else {
                  currentPasswordError.textContent = ''; // Clear error if current password is correct
                  currentPasswordInput.classList.remove('error');
              }

              // Check if the new email already exists in the database
              const updatedEmail = emailInput.value.trim();
              fetch('http://localhost:3000/users?email=' + updatedEmail)
                .then(response => response.json())
                .then(existingUsers => {
                    if (existingUsers.length > 0 && existingUsers[0].id !== userId) {
                        // Email already exists for another user, show error
                        emailError.textContent = 'Email is already in use by another user';
                        emailInput.classList.add('error');
                    } else {
                        // Proceed with updating the user if no conflict with email
                        emailError.textContent = ''; // Clear error message
                        emailInput.classList.remove('error');

                        // Prepare the updated user data
                        const updatedUser = {
                            userName: userNameInput.value,
                            email: updatedEmail,
                            role: roleInput.value,
                            gender: genderInput.value,
                            address: user.address || "", // Assuming address is optional
                            phoneNumber: user.phoneNumber || "", // Assuming phone number is optional
                            registrationDate: document.getElementById('registration-date').value || "Not Available"
                        };

                        // If a new password is provided, include it in the update
                        const newPasswordValue = newPasswordInput.value.trim();
                        if (newPasswordValue) {
                            updatedUser.password = newPasswordValue;  // Use the new password
                        } else {
                            // If no new password, keep the current password
                            updatedUser.password = currentPasswordInput.value;
                        }

                        // Send updated user data to the server
                        fetch(`http://localhost:3000/users/${userId}`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(updatedUser)
                        })
                        .then(response => response.json())
                        .then(data => {
                            console.log('User updated successfully:', data);
                            window.location.href = 'admin-users.html'; // Redirect after update
                        })
                        .catch(error => {
                            console.error('Error updating user:', error);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error checking email uniqueness:', error);
                });
          });

      })
      .catch(error => {
          console.error('Error fetching user:', error);
      });

    // Validate form fields
    function validateForm() {
        let isValid = true;

        // Validate Username
        if (userNameInput.value.trim() === '') {
            userNameError.textContent = 'Username is required';  // Display error if username is empty
            userNameInput.classList.add('error');
            isValid = false;
        } else {
            userNameError.textContent = '';  // Clear error if username is valid
            userNameInput.classList.remove('error');
        }

        // Validate Email
        const emailValue = emailInput.value.trim();
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailValue === '') {
            emailError.textContent = 'Email is required';  // Display error if email is empty
            emailInput.classList.add('error');
            isValid = false;
        } else if (!emailPattern.test(emailValue)) {
            emailError.textContent = 'Invalid email format';  // Display error if email is invalid
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailError.textContent = '';  // Clear error if email is valid
            emailInput.classList.remove('error');
        }

        // Validate Password
        const newPasswordValue = newPasswordInput.value.trim();
        const confirmPasswordValue = confirmPasswordInput.value.trim();

        if (newPasswordValue) {
            if (newPasswordValue.length < 6) {
                passwordError.textContent = 'Password must be at least 6 characters';  // Display error if password is too short
                newPasswordInput.classList.add('error');
                isValid = false;
            } else if (newPasswordValue !== confirmPasswordValue) {
                confirmPasswordError.textContent = 'Passwords do not match';  // Display error if passwords don't match
                confirmPasswordInput.classList.add('error');
                isValid = false;
            } else {
                passwordError.textContent = '';  // Clear error if password is valid
                confirmPasswordError.textContent = '';  // Clear error if passwords match
                newPasswordInput.classList.remove('error');
                confirmPasswordInput.classList.remove('error');
            }
        }

        // Validate Confirm Password if New Password is entered
        if (newPasswordValue && newPasswordValue !== confirmPasswordValue) {
            confirmPasswordError.textContent = 'Passwords do not match';  // Display error if confirm password doesn't match
            confirmPasswordInput.classList.add('error');
            isValid = false;
        }

        return isValid;
    }

    // Handle user deletion
    deleteUserButton.addEventListener('click', function(event) {
        const confirmed = confirm('Are you sure you want to delete this user?');
        if (confirmed) {
            fetch(`http://localhost:3000/users/${userId}`, {
                method: 'DELETE'
            })
            .then(response => {
                if (response.ok) {
                    alert('User deleted successfully.');
                    window.location.href = 'admin-users.html'; // Redirect after deletion
                } else {
                    alert('Error deleting user.');
                }
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
        }
    });
});
