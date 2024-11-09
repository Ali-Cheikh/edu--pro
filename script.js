function register() {
    Swal.fire({
        title: 'Join Us!',
        color: "#a984ee",
        html: `
            <form id="registrationForm" method="post" style="text-align: left; color: #f44; align-items:center">
                <label for="name" style="color: #e36209;">Name</label>
                <input type="text" id="name" class="swal2-input" placeholder="Enter your name" style="background-color: #444; color: #00FF00;">
                
                <label for="school" style="color: #e36209;">School</label>
                <input type="text" id="school" class="swal2-input" placeholder="Enter your school" style="background-color: #444; color: #00FF00;">
                
                <label for="email" style="color: #e36209;">Email</label>
                <input type="email" id="email" class="swal2-input" placeholder="Enter your email" style="background-color: #444; color: #00FF00;">
                
                <label for="number" style="color: #e36209;">Phone Number</label>
                <input type="tel" id="number" class="swal2-input" placeholder="Enter your number" style="background-color: #444; color: #00FF00;">
                
                <label style="display: flex; align-items: center; margin-top: 10px; color: #e36209;">
                    <input type="checkbox" id="teamCheckbox" style="margin-right: 5px;">
                    Joining as a team
                </label>
                
                <label style="display: flex; align-items: center; margin-top: 10px; color: #e36209;">
                    <input type="checkbox" id="aloneCheckbox" style="margin-right: 5px;" checked>
                    Joining alone
                </label>

                <div id="teamNameField" style="display: none;">
                    <label for="teamName" style="color: #e36209;">Team Name</label>
                    <input type="text" id="teamName" class="swal2-input" placeholder="Enter your team name" style="background-color: #444; color: #00FF00;">
                </div>
                
                <div id="reasonField" style="margin-top: 10px;">
                    <label for="reason" style="color: #e36209;">Why are you joining?</label>
                    <textarea id="reason" class="swal2-textarea" placeholder="Share your reason" style="background-color: #444; color: #00FF00;"></textarea>
                </div>
                <button type="submit" style="display:none;" id="submitButton">Submit</button> <!-- Hidden submit button -->
            </form>
        `,
        background: '#333',
        confirmButtonText: 'Submit',
        confirmButtonColor: '#005cc5',
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        focusConfirm: false,
        preConfirm: () => {
            const name = document.getElementById('name').value;
            const school = document.getElementById('school').value;
            const email = document.getElementById('email').value;
            const number = document.getElementById('number').value;
            const isTeam = document.getElementById('teamCheckbox').checked;
            const isAlone = document.getElementById('aloneCheckbox').checked;
            const teamName = document.getElementById('teamName').value;
            const reason = document.getElementById('reason').value;

            if (!name || !email || !number || !reason) {
                Swal.showValidationMessage('Please fill in all required fields');
                return false;
            }
            return { name, school, email, number, isTeam, isAlone, teamName, reason };
        },
        didOpen: () => {
            // Attach submit event listener after the Swal modal is open
            document.getElementById('registrationForm').addEventListener('submit', function (e) {
                e.preventDefault();

                // Get form data from the form inputs
                const name = document.getElementById('name').value;
                const school = document.getElementById('school').value;
                const email = document.getElementById('email').value;
                const number = document.getElementById('number').value;
                const isTeam = document.getElementById('teamCheckbox').checked;
                const isAlone = document.getElementById('aloneCheckbox').checked;
                const teamName = document.getElementById('teamName').value;
                const reason = document.getElementById('reason').value;

                // Call the function to handle form submission
                submitFormData(name, school, email, number, isTeam, isAlone, teamName, reason);
            });
        }
    });

    // JavaScript to handle dynamic fields inside the Swal
    document.getElementById('teamCheckbox').addEventListener('change', function () {
        document.getElementById('teamNameField').style.display = this.checked ? 'block' : 'none';
        document.getElementById('aloneCheckbox').checked = !this.checked; // Uncheck "alone" if "team" is checked
    });

    document.getElementById('aloneCheckbox').addEventListener('change', function () {
        if (this.checked) {
            document.getElementById('teamCheckbox').checked = false; // Uncheck "team" if "alone" is checked
            document.getElementById('teamNameField').style.display = 'none';
        }
    });
}

function submitFormData(name, school, email, number, isTeam, isAlone, teamName, reason) {
    // Show loading spinner while submitting data
    Swal.fire({
        icon: 'info',
        title: 'Please wait...',
        text: 'Submitting your details and message',
        willOpen: () => {
            Swal.showLoading();
        },
        showConfirmButton: false,
        allowOutsideClick: false,
    });

    // Google Apps Script URL (replace with your URL)
    const url = 'https://script.google.com/macros/s/AKfycbxjGc-Y3azTcpRnr0t6-KG8deUsmB0q6iqfo0jX_sTXg0Soc2hx7LPe_9sPmytio4b4TQ/exec';

    // Create an object to send via POST request
    const dataToSend = {
        name: name,
        school: school,
        email: email,
        number: number,
        isTeam: isTeam,
        isAlone: isAlone,
        teamName: teamName,
        reason: reason
    };

    // Create a POST request
    const request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Convert the object into a query string
    const params = new URLSearchParams(dataToSend).toString();

    request.onload = function () {
        Swal.close(); // Close the loading popup
        if (request.status === 200) {
            const response = JSON.parse(request.responseText);
            if (response.result === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'Contact submitted!',
                    text: `Thank you, ${name}! We will reach out to you soon via email.`,
                }).then(() => {
                    location.reload(); // Reload page after success
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Submission failed',
                    text: 'An error occurred. Please try again later.',
                });
            }
        } else {
            Swal.close(); // Close the loading popup
            Swal.fire({
                icon: 'error',
                title: 'Submission failed',
                text: 'An error occurred. Please try again later.',
            });
        }
    };

    request.onerror = function () {
        Swal.close(); // Close the loading popup
        Swal.fire({
            icon: 'error',
            title: 'Submission failed',
            text: 'An error occurred. Please try again later.',
        });
    };

    // Send the data
    request.send(params);
}
