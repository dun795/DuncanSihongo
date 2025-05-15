// Smooth Scrolling for Internal Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    const target = document.querySelector(this.getAttribute("href"));
    target.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
});

// Add animations on scroll
const fadeInElements = document.querySelectorAll(".fade-in");

const onScroll = () => {
  fadeInElements.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add("visible");
    }
  });
};

window.addEventListener("scroll", onScroll);

// Trigger the scroll event to load visible elements on page load
onScroll();

// Initialize EmailJS
emailjs.init("hWoqjWtrA9ReGybO5"); // Replace with your actual User ID

// Handle Contact Form Submission
const contactForm = document.getElementById("contactForm");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent default form submission

  // Get form values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  // Validate form inputs
  if (name === "" || email === "" || message === "") {
    alert("Please fill out all fields.");
    return;
  }

  if (!validateEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  // Log the form values to the console for debugging
  console.log("Form Data:", { name, email, message });

  // Log before sending the email
  console.log("Sending email...");

  // Send email using EmailJS
  emailjs
    .send("service_199u7yr", "template_1kfpiwa", {
      name: name,
      email: email,
      message: message,
    })
    .then(
      function () {
        // Log success
        console.log("Email sent successfully!");
        alert("Message sent successfully!");
        contactForm.reset(); // Clear the form after successful submission
      },
      function (error) {
        // Log error
        console.error("Failed to send email:", error);
        alert("Failed to send message. Error: " + error.text);
      }
    );
});

// Validate Email Function
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}
// Chat Widget Toggle
const chatToggle = document.getElementById("chat-toggle");
const chatBox = document.getElementById("chat-box");

chatToggle.addEventListener("click", function () {
  chatBox.classList.toggle("hidden");
});

// Highlight the active navigation link
const navLinks = document.querySelectorAll(".nav-links a");
const currentPage = window.location.pathname.split("/").pop();

navLinks.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// JavaScript to toggle visibility of project info when clicking "View More"
document.querySelectorAll('.view-more-btn').forEach(button => {
  button.addEventListener('click', () => {
    const projectInfo = button.nextElementSibling;
    projectInfo.style.display = projectInfo.style.display === 'block' ? 'none' : 'block';
  });
});

document.getElementById('cv-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const firstName = document.getElementById('first-name').value.trim();
  const lastName = document.getElementById('last-name').value.trim();
  const email = document.getElementById('email').value.trim();
  const contact = document.getElementById('contact').value.trim();

  if (firstName && lastName && email && contact.match(/^\d{10}$/)) {
    // Send data to the server to be saved in a JSON file
    fetch('/save-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ firstName, lastName, email, contact }),
    })
    .then(response => response.json())
    .then(data => {
      // Show the download button if the details are saved
      if (data.success) {
        document.getElementById('download-btn').style.display = 'block';
      }
    })
    .catch(err => {
      console.error('Error:', err);
    });
  } else {
    alert('Please fill in the details correctly.');
  }
});
