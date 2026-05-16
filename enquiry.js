/* ============================================================
   Alije Group — enquiry.js (Improved & Bug-Fixed)
   ============================================================ */

// Initialize EmailJS
(function () {
  if (typeof emailjs !== "undefined") {
    emailjs.init("2879sthwSM7HN3K4_");
  }
})();

const encodedWhatsapp = "OTE4NDc2MDE2OTU1";

function decodeBase64(str) {
  return atob(str);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ─── Live error clearing ─── */
["name", "email", "phone", "country", "message"].forEach(id => {
  const field = document.getElementById(id);
  const error = document.getElementById(id + "Error");
  if (!field || !error) return;
  field.addEventListener("input", () => {
    field.classList.remove("invalid");
    error.style.display = "none";
    if (id === "email") error.innerText = "This field is required";
  });
});

/* ─── Form submit (Email) ─── */
const enquiryForm = document.getElementById("enquiryForm");
if (enquiryForm) {
  enquiryForm.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateForm()) return;

    const submitBtn = document.getElementById("emailBtn");
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    const params = getFormData();

    if (typeof emailjs !== "undefined") {
      emailjs.send("service_5v70fm7", "template_pl8pwbl", params)
        .then(() => {
          showPopup("thankYouPopup");
          enquiryForm.reset();
        })
        .catch(err => {
          alert("Email failed. Please try again or use WhatsApp.");
          console.error(err);
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Send Enquiry via Email';
        });
    } else {
      alert("Email service unavailable. Please use WhatsApp.");
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-envelope"></i> Send Enquiry via Email';
    }
  });
}

/* ─── WhatsApp button ─── */
// BUG FIX: removed duplicate class= attribute; handled via JS
const whatsappBtn = document.getElementById("whatsappBtn");
if (whatsappBtn) {
  whatsappBtn.addEventListener("click", function () {
    if (!validateForm()) return;

    const params = getFormData();
    const whatsappNumber = decodeBase64(encodedWhatsapp);

    const whatsappText = encodeURIComponent(
      `Alije Group — New Enquiry\nName: ${params.name}\nEmail: ${params.email}\nPhone: ${params.phone || "Not provided"}\nCountry: ${params.country}\nMessage: ${params.message}`
    );

    showPopup("whatsappPopup");

    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappText}`, "_blank");
    }, 1200);
  });
}

/* ─── Validation ─── */
function validateForm() {
  let valid = true;

  ["name", "email", "country", "message"].forEach(id => {
    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    if (!field || !error) return;

    if (!field.value.trim()) {
      field.classList.add("invalid");
      error.style.display = "block";
      error.innerText = "This field is required";
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
    name: document.getElementById("name")?.value.trim() || "",
    email: document.getElementById("email")?.value.trim() || "",
    phone: document.getElementById("phone")?.value.trim() || "",
    country: document.getElementById("country")?.value.trim() || "",
    message: document.getElementById("message")?.value.trim() || "",
  };
}

/* ─── Popup helpers ─── */
function showPopup(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("visible");
  document.body.classList.add("no-scroll");
}

function closePopup() {
  const el = document.getElementById("thankYouPopup");
  if (!el) return;
  el.classList.remove("visible");
  document.body.classList.remove("no-scroll");
}

function closeWhatsappPopup() {
  const el = document.getElementById("whatsappPopup");
  if (!el) return;
  el.classList.remove("visible");
  document.body.classList.remove("no-scroll");
}

// Expose for inline onclick
window.closePopup = closePopup;
window.closeWhatsappPopup = closeWhatsappPopup;
