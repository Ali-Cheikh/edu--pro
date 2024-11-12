function register() {
    Swal.fire({
        title: 'Join Us!',
        color: "#a984ee",
        html: `
<form id="registrationForm" method="post" style="color: #f44; max-width: 500px; margin: 0 auto; text-align: left;">
    <div style="margin-bottom: 15px;">
        <label for="name" style="color: #e36209;">Full Name</label><br>
        <input type="text" id="name" class="swal2-input" placeholder="Enter your name" 
               style="width: 70%; background-color: #444; color: #00FF00; border: 1px solid #777; padding: 8px;">
    </div>

    <div style="margin-bottom: 15px;">
        <label for="school" style="color: #e36209;">School</label>
        <input type="text" id="school" class="swal2-input" placeholder="Enter your school" 
               style="width: 70%; background-color: #444; color: #00FF00; border: 1px solid #777; padding: 8px;">
    </div>

    <div style="margin-bottom: 15px;">
        <label for="email" style="color: #e36209;">Email</label>
        <input type="email" id="email" class="swal2-input" placeholder="Enter your email" 
               style="width: 70%; background-color: #444; color: #00FF00; border: 1px solid #777; padding: 8px;">
    </div>

    <div style="margin-bottom: 15px;">
        <label for="number" style="color: #e36209;">Phone Number</label>
        <input type="tel" id="number" class="swal2-input" placeholder="Enter your number" 
               style="width: 70%; background-color: #444; color: #00FF00; border: 1px solid #777; padding: 8px;">
    </div>

    <div style="display: flex; align-items: center; color: #e36209; margin-bottom: 10px;">
        <input type="checkbox" id="teamCheckbox" style="margin-right: 5px;">
        <label for="teamCheckbox">Joining as a team</label>
    </div>
    <div style="display: flex; align-items: center; color: #e36209; margin-bottom: 10px;">
        <input type="checkbox" id="aloneCheckbox" style="margin-right: 5px;" checked>
        <label for="aloneCheckbox">Joining alone</label>
    </div>

    <div id="teamNameField" style="display: none; margin-bottom: 15px;">
        <label for="teamName" style="color: #e36209;">Team Name</label>
        <input type="text" id="teamName" class="swal2-input" placeholder="Enter your team name" 
               style="width: 70%; background-color: #444; color: #00FF00; border: 1px solid #777; padding: 8px;">
    </div>

    <div id="reasonField" style="margin-bottom: 15px;">
        <label for="reason" style="color: #e36209;">Why are you joining?</label>
        <textarea id="reason" class="swal2-textarea" placeholder="Share your reason" 
                  style="width: 70%; background-color: #444; color: #00FF00; border: 1px solid #777; padding: 8px; height: 80px;"></textarea>
    </div>

    <div style="text-align: center; margin-top: 15px;">
        <button type="submit" id="submitButton" 
                style="background-color: #005cc5; color: white; padding: 10px 20px; border: none; border-radius: 5px;">
            Submit
        </button>
    </div>
</form>

        `,
        background: '#333',
        showConfirmButton: false,
        focusConfirm: false,
        willOpen: () => {
            // Attach event listener for form submission when button is clicked
            document.getElementById('submitButton').addEventListener('click', function (e) {
                e.preventDefault(); // Prevent default form submission

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

                // Call function to handle form submission
                submitFormData(name, school, email, number, isTeam, isAlone, teamName, reason);
            });
        },
    });

    // Handle dynamic fields inside the Swal modal
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

// Function to handle form submission and send data to Google Sheets
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
    const url = 'https://script.google.com/macros/s/AKfycbwxaEFR8K09cKyP0VFDVXeXYm4-VQu_bHxrfloxJdcyb-e0d0UTDJU7NV4pav6vfcJDdw/exec';

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
                icon: 'success',
                title: 'Contact submitted!',
                text: `Thank you, ${name}! We will reach out to you soon via email.`,
            }).then(() => {
                location.reload(); // Reload page after success
            });
        }
    };

    request.onerror = function () {
        Swal.close(); // Close the loading popup
        Swal.fire({
            icon: 'success',
            title: 'Contact submitted!',
            text: `Thank you, ${name}! We will reach out to you soon via email.`,
        }).then(() => {
            location.reload(); // Reload page after success
        });
    };

    // Send the data
    request.send(params);
}


// ===================================================================================

async function fetchParticipants() {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwxaEFR8K09cKyP0VFDVXeXYm4-VQu_bHxrfloxJdcyb-e0d0UTDJU7NV4pav6vfcJDdw/exec');
        if (!response.ok) throw new Error('Failed to fetch participant count');
        
        const data = await response.json();
        return data.lastRow - 1; // Assuming lastRow contains the total number of participants
    } catch (error) {
        console.error('Error fetching participant count:', error);
        return 0; // Return 0 as a fallback for participant count
    }
}

function displayCountdown(participants = "Loading...") {
    const countdownDate = new Date("2024-11-23T23:59:59Z").getTime();
    const objective = `You have 2 weeks to<br>
                       Create a Project that<br>
                       has anything to do with<br>
                       Tech, School, Education<br>
                       in general, It doesn't have<br>
                       to be a website <small>(prototype*)</small>`;
    
    const now = new Date().getTime();
    const distance = countdownDate - now;

    if (distance < 0) {
        document.querySelector(".screen").innerHTML = `<p>The countdown has ended!</p>`;
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const valFormat = (val) => 
        `<span class="value ${typeof val === 'number' ? 'number' : 'string'}">${typeof val === 'string' ? `"${val}"` : val}</span>`;

    document.querySelector(".screen").innerHTML = `
        <span class="keyword">const</span> <span class="def">Edu-ProDetails</span> <span class="operator">= {</span><br>
          &nbsp;&nbsp;<span class="property">days</span>: ${valFormat(days)},<br>
          &nbsp;&nbsp;<span class="property">hours</span>: ${valFormat(hours)},<br>
          &nbsp;&nbsp;<span class="property">minutes</span>: ${valFormat(minutes)},<br>
          &nbsp;&nbsp;<span class="property">seconds</span>: ${valFormat(seconds)},<br>
          &nbsp;&nbsp;<span class="property">objective</span>: ${valFormat(objective)},<br>
          &nbsp;&nbsp;<span class="property">participants</span>: ${valFormat(participants)}<br>
        <span class="operator">};</span>`;
}

async function startCountdown() {
    displayCountdown(); // display without participants

    // Fetch
    const participants = await fetchParticipants();
    displayCountdown(participants); // Update after fetching

    // Update every second
    setInterval(() => displayCountdown(participants), 1000);
}

startCountdown();
