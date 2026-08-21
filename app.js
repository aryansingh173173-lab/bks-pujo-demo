
  window.BKS_I18N_EXTRA = {
    en: {
      heroEyebrow: "For corporate sponsors and organisational partners",
      heroTitle: "A sponsorship conversation. Not a four-day booking.",
      heroLede: "Durga Puja is when Bengal gathers outdoors. Bharatiya Krishak Samaj Pujo places the farmer and Integrated Farming inside that civic week — so an organisation can enter a named public platform while it is being shaped. Civic window: 16–20 October 2026, Kolkata. Venue details will be announced through the official Puja channels. Payment is not taken through this experience."
    },
    bn: {
      heroEyebrow: "কর্পোরেট স্পন্সর ও প্রতিষ্ঠানিক অংশীদারদের জন্য",
      heroTitle: "একটি স্পন্সরশিপ আলোচনা। চার দিনের বুকিং নয়।",
      heroLede: "দুর্গাপূজা হলো যখন বাংলা বাইরে একত্র হয়। ভারতীয় কৃষক সমাজ পূজা সেই নাগরিক সপ্তাহে কৃষক ও সমন্বিত চাষকে স্থান দেয় — যাতে একটি প্রতিষ্ঠান শুধু প্যান্ডেলের দেয়ালে জায়গা কেনার বদলে একটি নামকরা জনমঞ্চে প্রবেশ করতে পারে। নাগরিক সময়: ১৬–২০ অক্টোবর ২০২৬, কলকাতা। পূজার স্থানের বিবরণ অফিসিয়াল পূজা চ্যানেলের মাধ্যমে ঘোষণা হবে। এই অভিজ্ঞতায় অর্থ নেওয়া হয় না।"
    },
    hi: {
      heroEyebrow: "कॉर्पोरेट प्रायोजकों और संस्थागत भागीदारों के लिए",
      heroTitle: "एक प्रायोजन बातचीत। चार दिनों की बुकिंग नहीं।",
      heroLede: "दुर्गा पूजा वह समय है जब बंगाल बाहर एकत्र होता है। भारतीय कृषक समाज पूजा उस नागरिक सप्ताह में किसान और समेकित कृषि को स्थान देती है — ताकि कोई संस्थान केवल पंडाल की दीवार पर जगह खरीदने के बजाय एक नामित सार्वजनिक मंच में प्रवेश कर सके। नागरिक अवधि: 16–20 अक्टूबर 2026, कोलकाता। पूजा स्थल की जानकारी आधिकारिक पूजा माध्यमों से घोषित होगी। इस अनुभव में भुगतान नहीं लिया जाता।"
    }
  };

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
        statusEl.textContent = "Interest note downloaded to your device. You can email it to contact@bkswbengal.org if you wish to continue. Payment is not taken through this experience.";
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
