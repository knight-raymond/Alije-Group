// Initialize EmailJS
(function () {
  emailjs.init("2879sthwSM7HN3K4_");
})();

const encodedWhatsapp = "OTE4NDc2MDE2OTU1";

function decodeBase64(str) {
  return atob(str);
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
["name", "email", "phone", "country", "message"].forEach(id => {
  const field = document.getElementById(id);
  const error = document.getElementById(id + "Error");

  if (!field || !error) return;

  field.addEventListener("input", () => {
    field.classList.remove("invalid");
    error.style.display = "none";
  });
});
document.getElementById("enquiryForm").addEventListener("submit", function (e) {
  e.preventDefault();
  if (!validateForm()) return;

  const submitBtn = document.getElementById("emailBtn");
  submitBtn.disabled = true;
  submitBtn.innerText = "Sending Enquiry...";

  const params = getFormData();

  emailjs.send("service_5v70fm7", "template_pl8pwbl", params)
    .then(() => {
      document.getElementById("thankYouPopup").style.display = "block";
document.body.classList.add("no-scroll");
    document.getElementById("enquiryForm").reset();
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Enquiry (Email)";
    })
    .catch(err => {
      alert("Email failed. Please try again.");
      console.error(err);
      submitBtn.disabled = false;
      submitBtn.innerText = "Send Enquiry (Email)";
    });
});
document.getElementById("whatsappBtn").addEventListener("click", function () {
  if (!validateForm()) return;

  const params = getFormData();
  const whatsappNumber = decodeBase64(encodedWhatsapp);

  const whatsappText = encodeURIComponent(
    `Alije Group New Enquiry
Name: ${params.name}
Email: ${params.email}
Phone: ${params.phone || "Not provided"}
Country: ${params.country}
Message: ${params.message}`
  );

  document.getElementById("whatsappPopup").style.display = "block";
document.body.classList.add("no-scroll");

  setTimeout(() => {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${whatsappText}`,
      "_blank"
    );
  }, 1200);
});

function validateForm() {
  let valid = true;

   ["name", "email", "country", "message"].forEach(id => {
    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");

    if (!field || !error) return;

    if (!field.value.trim()) {
      field.classList.add("invalid");
      error.style.display = "block";
      valid = false;
    }
  });
  const emailField = document.getElementById("email");
  const emailError = document.getElementById("emailError");

  if (emailField && emailError && emailField.value.trim()) {
    if (!isValidEmail(emailField.value.trim())) {
      emailField.classList.add("invalid");
      emailError.style.display = "block";
      emailError.innerText = "Please enter a valid email address";
      valid = false;
    }
  }

  return valid;
}
function getFormData() {
  return {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(), // optional
    country: document.getElementById("country").value.trim(),
    message: document.getElementById("message").value.trim()
  };
}

function closePopup() {
  document.getElementById("thankYouPopup").style.display = "none";
document.body.classList.remove("no-scroll");
}

function closeWhatsappPopup() {
  document.getElementById("whatsappPopup").style.display = "none";
document.body.classList.remove("no-scroll");
}