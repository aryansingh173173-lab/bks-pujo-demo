(function () {
  "use strict";

  var nav = document.querySelector(".nav");
  var toggle = document.getElementById("nav-toggle");
  var panel = document.getElementById("nav-panel");
  var form = document.getElementById("sponsor-enquiry-form");
  var statusEl = document.getElementById("form-status");

  function setNavOpen(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.textContent = open ? "Close" : "Menu";
  }

  if (toggle) {
    toggle.addEventListener("click", function () {
      setNavOpen(!nav.classList.contains("is-open"));
    });
  }

  if (panel) {
    panel.addEventListener("click", function (event) {
      if (event.target.closest("a")) setNavOpen(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setNavOpen(false);
  });

  function showError(field, show) {
    var wrap = field.closest(".field");
    if (!wrap) return;
    wrap.classList.toggle("invalid", show);
    var error = wrap.querySelector(".error");
    if (error) error.hidden = !show;
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validate() {
    if (!form) return false;
    var organisation = form.elements.organisation_name;
    var person = form.elements.contact_person;
    var phone = form.elements.phone;
    var email = form.elements.email;
    var consent = form.elements.consent;
    var ok = true;

    showError(organisation, !organisation.value.trim());
    if (!organisation.value.trim()) ok = false;

    showError(person, !person.value.trim());
    if (!person.value.trim()) ok = false;

    showError(phone, !phone.value.trim());
    if (!phone.value.trim()) ok = false;

    var emailValue = email.value.trim();
    showError(email, Boolean(emailValue) && !isEmail(emailValue));
    if (emailValue && !isEmail(emailValue)) ok = false;

    showError(consent, !consent.checked);
    if (!consent.checked) ok = false;

    return ok;
  }

  function downloadEnquiry(payload) {
    var blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json"
    });
    var url = URL.createObjectURL(blob);
    var link = document.createElement("a");
    link.href = url;
    link.download = "bks-pujo-sponsor-enquiry.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  if (form) {
    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (statusEl) {
        statusEl.hidden = true;
        statusEl.textContent = "";
      }
      if (!validate()) {
        var firstInvalid = form.querySelector(".field.invalid input, .field.invalid select, .field.invalid textarea");
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      downloadEnquiry({
        form: "bks-pujo-sponsor-enquiry",
        generated_at: new Date().toISOString(),
        organisation_name: form.elements.organisation_name.value.trim(),
        contact_person: form.elements.contact_person.value.trim(),
        designation: form.elements.designation.value.trim(),
        phone: form.elements.phone.value.trim(),
        email: form.elements.email.value.trim(),
        sector: form.elements.sector.value,
        message: form.elements.message.value.trim(),
        consent: true,
        note: "This file was downloaded locally. The website did not send it to Bharatiya Krishak Samaj. Sending the file is outside this website."
      });

      if (statusEl) {
        statusEl.hidden = false;
        statusEl.textContent = "File downloaded to this device. Not uploaded. Nothing here takes money.";
      }
    });

    form.addEventListener("input", function (event) {
      if (event.target && event.target.closest(".field.invalid")) {
        validate();
      }
    });
  }
  if (window.BKS_I18N) window.BKS_I18N.init();
})();
