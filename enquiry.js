/* ============================================================
   Alije Group — enquiry.js for version 2.X.X
   ============================================================ */

// FIX: wrap everything in DOMContentLoaded so getElementById calls
// are guaranteed to find elements even if script moves to <head> later
document.addEventListener("DOMContentLoaded", function () {

  /* ── EmailJS init ── */
  if (typeof emailjs !== "undefined") {
    emailjs.init("2879sthwSM7HN3K4_");
  }

  const encodedWhatsapp = "OTE4NDc2MDE2OTU1";

  function decodeBase64(str) { return atob(str); }
  function isValidEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

  /* ── Live error clearing ── */
  // FIX: phone field error div existed but phone was never validated — removed phone from list
  ["name", "email", "country", "message"].forEach(id => {
    const field = document.getElementById(id);
    const error = document.getElementById(id + "Error");
    if (!field || !error) return;
    field.addEventListener("input", () => {
      field.classList.remove("invalid");
      error.style.display = "none";
      error.innerText = "This field is required"; // reset email-specific message
    });
  });

  /* ── Form submit (Email) ── */
  const enquiryForm = document.getElementById("enquiryForm");
  if (enquiryForm) {
    enquiryForm.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      const submitBtn = document.getElementById("emailBtn");
      if (!submitBtn) return;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';

      const params = getFormData();

      if (typeof emailjs !== "undefined") {
        emailjs.send("service_5v70fm7", "template_pl8pwbl", params)
          .then(() => {
            showPopup("thankYouPopup");
            enquiryForm.reset();
          })
          .catch(err => {
            alert("Email failed. Please try again or use WhatsApp.");
            console.error("EmailJS error:", err);
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

  /* ── WhatsApp button ── */
  const whatsappBtn = document.getElementById("whatsappBtn");
  if (whatsappBtn) {
    whatsappBtn.addEventListener("click", function () {
      if (!validateForm()) return;

      const params = getFormData();
      const number = decodeBase64(encodedWhatsapp);
      const text = encodeURIComponent(
        `Alije Group — New Enquiry\nName: ${params.name}\nEmail: ${params.email}\nPhone: ${params.phone || "Not provided"}\nCountry: ${params.country}\nMessage: ${params.message}`
      );

      showPopup("whatsappPopup");
      // Open WhatsApp after popup renders
      setTimeout(() => {
        window.open(`https://wa.me/${number}?text=${text}`, "_blank");
      }, 1200);
    });
  }

  /* ── Validation ── */
  function validateForm() {
    let valid = true;
    // Required fields: name, email, country, message (phone is optional)
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
    // Extra email format check
    const emailField = document.getElementById("email");
    const emailError = document.getElementById("emailError");
    if (emailField && emailError && emailField.value.trim() && !isValidEmail(emailField.value.trim())) {
      emailField.classList.add("invalid");
      emailError.style.display = "block";
      emailError.innerText = "Please enter a valid email address";
      valid = false;
    }
    return valid;
  }

  function getFormData() {
    return {
      name: (document.getElementById("name")?.value || "").trim(),
      email: (document.getElementById("email")?.value || "").trim(),
      phone: (document.getElementById("phone")?.value || "").trim(),
      country: (document.getElementById("country")?.value || "").trim(),
      message: (document.getElementById("message")?.value || "").trim(),
    };
  }

  /* ── Popup helpers ── */
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

  // Expose for inline onclick="closePopup()" in HTML
  window.closePopup = closePopup;
  window.closeWhatsappPopup = closeWhatsappPopup;

});
