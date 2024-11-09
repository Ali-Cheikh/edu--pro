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
                <button type="submit" id="submitButton" style="background-color: #005cc5; color: white; padding: 10px 20px; border: none; border-radius: 5px; margin-top: 10px;">Submit</button>
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


async function displayCountdown() {
    try {
      // Set up the countdown date, objective, and number of participants
      const countdownDate = new Date("2024-11-23 UTC23:59:59").getTime(); // Adjust target date here
      const objective = `You have 2 weeks to<br>
                         Create a Project that<br>
                         has anything to do with<br>
                         Tech, School, Education<br>
                         in general, It doesn't have<br>
                         to be a website <small>(prototype*)</small> `;

      const participants = await fetchParticipants();

      // Function to format values as HTML elements
      const valFormat = (val) => {
        if (typeof val === 'number') return `<span class="value number">${val}</span>`;
        else if (typeof val === 'string') return `<span class="value string">"${val}"</span>`;
      };
  
      // Countdown calculation
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
  
      // Display the countdown, objective, and participants in the HTML
      document.querySelector(".screen").innerHTML =
        `<span class="keyword">const</span>
        <span class="def">Edu-ProDetails</span>
        <span class="operator">= {</span><br>
          &nbsp;&nbsp;<span class="property">days</span>: ${valFormat(days)},<br>
          &nbsp;&nbsp;<span class="property">hours</span>: ${valFormat(hours)},<br>
          &nbsp;&nbsp;<span class="property">minutes</span>: ${valFormat(minutes)},<br>
          &nbsp;&nbsp;<span class="property">seconds</span>: ${valFormat(seconds)},<br>
          &nbsp;&nbsp;<span class="property">objective</span>: <br>${valFormat(objective)},<br>
          &nbsp;&nbsp;<span class="property">participants</span>: ${valFormat(participants)}<br>
          <span class="operator"> };</span>`;
    } catch (error) {
      console.error('Error displaying countdown:', error);
    }
  }
  
  function startCountdown() {
    displayCountdown();
    setInterval(displayCountdown, 1000); // Update every second
  }
  
  startCountdown();
  