//check if user is logged in and has admin role
//adminCheckAuthentication();
window.addEventListener('load', function(event){
    let currentPage = 1;
    let pageCount = 0;
    let userCount = 0;
    let start;
    let end;
    let countPerPage = 0; // Number of users per page   
    const filterSelectElement = document.querySelector('#role-filter');
    const nextButton = document.querySelector('#next');
    const previousButton = document.querySelector('#previous');
    const searchInput = document.querySelector('#search-dive');
    console.log("Search input", searchInput);
    
    const paginationDiv = document.querySelector('.pagination');
    let usersTableBody = document.querySelector('#admin-users-table');
    const url = "http://localhost:3000/";
    let users = [];
    let clondedUsers = [];
    let pageUsers = [];
    let filteredUsers = [];
    getAllUsers().then(data => {
        users = data;
        clondedUsers = users.slice(); //clone users array
        userCount = clondedUsers.length;
        countPerPage = 10; // Number of users per page
        pageCount = Math.ceil(userCount / countPerPage);
        start = (currentPage - 1) * countPerPage; 
        end = start + countPerPage;
        pageUsers = clondedUsers.slice(start, end);
        usersTableBody.innerHTML = ''; // Clear the table body before populating it
        paginationDiv.innerHTML = `<button class="btn-page" id="previous" disabled><i class="fas fa-chevron-left"></i></button>
        <!-- <button class="btn-page active">1</button> -->
        <span class="pagination-ellipsis">${currentPage} of ${pageCount}</span>
        <!-- <button class="btn-page">10</button> -->
        <button class="btn-page" id="next"><i class="fas fa-chevron-right"></i></button>`; // Clear the pagination div before populating it
        updateUsersTable(pageUsers);
    }).catch(error => {
        console.error("Error fetching users:", error);
    });//end of getAllUsers

//pagination event
    paginationDiv.addEventListener('click', function(event){
        console.log("Pagination clicked", event.target.id);
        const nextButton = document.querySelector('#next');
        const previousButton = document.querySelector('#previous');
        if(event.target.id === 'next'){
            currentPage++;
            if(currentPage >= pageCount){
                currentPage = pageCount;
            }

            // ⚠️ Re-select the updated element
            updatePagination();

            // Update buttons state
            nextButton.disabled = currentPage === pageCount;
            previousButton.disabled = currentPage === 1;

            console.log("Next button clicked", currentPage);
        }
        else if(event.target.id === 'previous'){
            currentPage--;
            if(currentPage <= 1){
                currentPage = 1;
            }
            updatePagination();

            // Update buttons state
            nextButton.disabled = currentPage === pageCount;
            previousButton.disabled = currentPage === 1;

            console.log("Previous button clicked", currentPage);
        }
        start = (currentPage - 1) * countPerPage;
        end = start + countPerPage;
        
        pageUsers = clondedUsers.slice(start, end);
        updateUsersTable(pageUsers);
    });//end of paginationDiv

    //search event
    searchInput.addEventListener('keyup', function(event){
        console.log("Search clicked", event.target.value);
        const searchValue = event.target.value.toLowerCase();
        filteredUsers = clondedUsers.filter(user => {
            return user.userName.toLowerCase().includes(searchValue) || user.email.toLowerCase().includes(searchValue) || user.role.toLowerCase().includes(searchValue);
        });
        userCount = filteredUsers.length;
        pageCount = Math.ceil(userCount / countPerPage);
        currentPage = 1; // Reset to the first page
        start = (currentPage - 1) * countPerPage; 
        end = start + countPerPage;
        pageUsers = filteredUsers.slice(start, end);
        updatePagination();
        updateUsersTable(pageUsers);
    });//end of searchInput

//delete user event
usersTableBody.addEventListener('click', function(event) {
    if (event.target.closest('#delete-user')) {
        const deleteBtn = event.target.closest('#delete-user');
        const userRow = deleteBtn.closest('tr');
        const userId = userRow.children[0].textContent;

        const confirmed = confirm(`Are you sure you want to delete user with ID ${userId}?`);
        if (!confirmed) return;

        fetch(`${url}users/${userId}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete user.');
            }
            // Remove the user from clondedUsers
            clondedUsers = clondedUsers.filter(user => user.id != userId);

            // Recalculate pagination
            userCount = clondedUsers.length;
            pageCount = Math.ceil(userCount / countPerPage);
            if (currentPage > pageCount) currentPage = pageCount;

            start = (currentPage - 1) * countPerPage;
            end = start + countPerPage;
            pageUsers = clondedUsers.slice(start, end);

            updatePagination();
            updateUsersTable(pageUsers);
        })
        .catch(error => {
            console.error('Error deleting user:', error);
            alert('Error deleting user. Please try again.');
        });
    }
});
    //end of delete user event

    const updateUsersTable = function(_users){
        usersTableBody.innerHTML = '';
        _users.forEach(user => {
            const tr  = document.createElement('tr');
            tr.innerHTML = `
                    <td>${user.id}</td>
                    <td class="user-info">
                        <img src="../../images/DefaultProfile.webp" alt="User">
                        <span>${user.userName}</span>
                    </td>
                    <td>${user.email}</td>
                    <td>${user.role}</td>
                    <td>
                        <div class="action-buttons">
                            <a href="../customer/user-details.html?userId=${user.id}"><button class="btn-icon"><i class="fas fa-eye"></i></button></a>
                            <a href="./admin-edit-user.html?userId=${user.id}"><button class="btn-icon"><i class="fas fa-edit"></i></button></a>
                            <button class="btn-icon" id="delete-user"><i class="fas fa-trash"></i></button>
                        </div>
                    </td>
            `;
            usersTableBody.appendChild(tr);
        
        }); // end of forEach

    }//end of update table


    const updatePagination = function(){
            //select the updated element
            const pageNumberElement = document.querySelector('.pagination-ellipsis');
            pageNumberElement.innerHTML = `${currentPage} of ${pageCount}`;
    }//end of update pagination
});//load end

