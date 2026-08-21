(function (global) {
  "use strict";

  var STORAGE = "bks-puja-lang";
  var LANGS = { en: true, bn: true, hi: true };

  /* Approved translations only. Empty string = English fallback.
     Sources: site/data/content/{en,bn,hi}/ui.json, participate.json,
     nrb.json, integrated-farming.json, campaign.json. */
  var STR = {
    en: {
      skip: "Skip to content",
      menu: "Menu",
      close: "Close menu",
      language: "Language",
      back: "Back to Bharatiya Krishak Samaj Pujo",
      event: "Bharatiya Krishak Samaj Pujo",
      organiser: "Organised by KarmYog for the 21st Century",
      partner: "Bharatiya Krishak Samaj · Organising Partner",
      parent: "Bharatiya Krishak Samaj",
      faq: "FAQ",
      thePuja: "The Puja",
      ifs: "Integrated Farming",
      maps: "Open in Google Maps",
      namedPlaceNote: "This named location is on file for the wetland / fishermen's-committee site. The exact Puja pandal and ritual venue remain to be announced.",
      placeOnFile: "Place on file",
      pandalTBA: "Pandal address to be announced",
      formHonesty: "This form downloads a file to your device. It is not submitted to a BKS server by this website.",
      name: "Name",
      organisation: "Organisation",
      phone: "Phone",
      email: "Email",
      locality: "Locality / village / area",
      district: "District (if you know it)",
      message: "Anything you want us to know",
      consent: "This website does not submit your details to BKS. The information is downloaded as a file to your device. If you choose to send that file to BKS, subsequent handling is outside this website.",
      downloaded: "The information has been downloaded as a file to your device.",
      noPayment: "Nothing on this page takes money.",
      participate: "Participate",
      interestNote: "Express interest",
      farmer: "Farmer",
      supporter: "Supporter",
      pendingNotice: "",
      farmtech: "FarmTech and AgriTech",
      seedNote: "₹1 lakh is the proposed seed for an integrated model farm — in full, or ₹20,000 every two months. It is not collected on this website.",
      target5000: "About 5,000 village farms is a mobilisation target, not a completed count.",
      arithmetic50: "₹50 crore is the arithmetic of the target (5,000 × ₹1 lakh). It is not funds already raised."
    },
    bn: {
      skip: "সরাসরি মূল লেখায় যান",
      menu: "মেনু",
      close: "মেনু বন্ধ করুন",
      language: "ভাষা",
      back: "",
      event: "ভারতীয় কৃষক সমাজ পূজা",
      organiser: "KarmYog for the 21st Century আয়োজিত",
      partner: "",
      parent: "ভারতীয় কৃষক সমাজ",
      faq: "প্রশ্ন",
      thePuja: "পূজা",
      ifs: "সমন্বিত চাষ",
      maps: "",
      namedPlaceNote: "",
      placeOnFile: "",
      pandalTBA: "প্যান্ডেলের ঠিকানা শীঘ্রই ঘোষণা করা হবে",
      formHonesty: "এই ফর্ম আপনার যন্ত্রে একটি ফাইল তৈরি করে। সমাজ যে পেয়েছে, তা দেখায় না।",
      name: "নাম",
      organisation: "",
      phone: "",
      email: "",
      locality: "এলাকা / গ্রাম / পাড়া",
      district: "জেলা (জানা থাকলে)",
      message: "আর কিছু জানাতে চান",
      consent: "This website does not submit your details to BKS. The information is downloaded as a file to your device. If you choose to send that file to BKS, subsequent handling is outside this website.",
      downloaded: "The information has been downloaded as a file to your device.",
      noPayment: "",
      participate: "যোগদান",
      interestNote: "আগ্রহ জানান",
      farmer: "কৃষক",
      supporter: "সমর্থক",
      pendingNotice: "বাংলা খসড়া — মাতৃভাষার সম্পাদনা বাকি। DRAFT — NATIVE REVIEW REQUIRED. Shared identity, navigation, forms and labels that already have approved translations switch. Remaining specialist copy stays in English.",
      farmtech: "FarmTech and AgriTech",
      seedNote: "₹1 lakh is the proposed seed for an integrated model farm — in full, or ₹20,000 every two months. It is not collected on this website.",
      target5000: "About 5,000 village farms is a mobilisation target, not a completed count.",
      arithmetic50: "₹50 crore is the arithmetic of the target (5,000 × ₹1 lakh). It is not funds already raised."
    },
    hi: {
      skip: "सीधे मुख्य लेख पर जाएँ",
      menu: "मेनू",
      close: "मेनू बंद करें",
      language: "भाषा",
      back: "",
      event: "भारतीय कृषक समाज पूजा",
      organiser: "KarmYog for the 21st Century द्वारा आयोजित",
      partner: "",
      parent: "भारतीय कृषक समाज",
      faq: "प्रश्न",
      thePuja: "पूजा",
      ifs: "समेकित कृषि",
      maps: "",
      namedPlaceNote: "",
      placeOnFile: "",
      pandalTBA: "पंडाल का पता शीघ्र घोषित किया जाएगा",
      formHonesty: "",
      name: "नाम",
      organisation: "",
      phone: "",
      email: "",
      locality: "इलाका / गाँव / क्षेत्र",
      district: "ज़िला (यदि पता हो)",
      message: "और कुछ बताना हो",
      consent: "This website does not submit your details to BKS. The information is downloaded as a file to your device. If you choose to send that file to BKS, subsequent handling is outside this website.",
      downloaded: "The information has been downloaded as a file to your device.",
      noPayment: "",
      participate: "सहभागिता",
      interestNote: "यह रुचि नोट डाउनलोड करें",
      farmer: "किसान",
      supporter: "समर्थक",
      pendingNotice: "हिन्दी मसौदा — मातृभाषा संपादन बाकी। DRAFT — NATIVE REVIEW REQUIRED. Shared identity, navigation, forms and labels that already have approved translations switch. Remaining specialist copy stays in English.",
      farmtech: "FarmTech and AgriTech",
      seedNote: "₹1 lakh is the proposed seed for an integrated model farm — in full, or ₹20,000 every two months. It is not collected on this website.",
      target5000: "About 5,000 village farms is a mobilisation target, not a completed count.",
      arithmetic50: "₹50 crore is the arithmetic of the target (5,000 × ₹1 lakh). It is not funds already raised."
    }
  };

  function mergeExtra() {
    var extra = global.BKS_I18N_EXTRA;
    if (!extra) return;
    ["en", "bn", "hi"].forEach(function (lang) {
      if (!extra[lang]) return;
      Object.keys(extra[lang]).forEach(function (key) {
        STR[lang][key] = extra[lang][key];
      });
    });
  }

  function get(lang, key) {
    var pack = STR[lang] || STR.en;
    if (pack[key] != null && pack[key] !== "") return pack[key];
    return STR.en[key] || "";
  }

  function setBackLinks(lang) {
    document.querySelectorAll('a[href*="bks-durga-puja-2026.vercel.app"]').forEach(function (a) {
      try {
        var url = new URL(a.getAttribute("href"), window.location.origin);
        if (url.pathname.indexOf("/site") === -1 && url.pathname !== "/" && url.pathname !== "") return;
        url.searchParams.set("lang", lang);
        a.setAttribute("href", "https://bks-durga-puja-2026.vercel.app/site/" + url.search + url.hash);
      } catch (err) {
        /* ignore */
      }
    });
  }

  function apply(lang) {
    if (!LANGS[lang]) lang = "en";
    document.documentElement.lang = lang;
    document.documentElement.setAttribute("data-lang", lang);

    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var text = get(lang, key);
      if (!text) return;
      el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var text = get(lang, key);
      if (text) el.setAttribute("aria-label", text);
    });

    var banner = document.getElementById("lang-pending");
    if (banner) {
      if (lang === "en") {
        banner.hidden = true;
        banner.textContent = "";
      } else {
        banner.hidden = false;
        banner.textContent = get(lang, "pendingNotice");
      }
    }

    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.setAttribute("aria-pressed", btn.getAttribute("data-lang") === lang ? "true" : "false");
    });
    var select = document.getElementById("lang-select");
    if (select) select.value = lang;

    try {
      global.localStorage.setItem(STORAGE, lang);
    } catch (err) {
      /* ignore */
    }

    try {
      var url = new URL(window.location.href);
      url.searchParams.set("lang", lang);
      window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    } catch (err) {
      /* ignore */
    }

    setBackLinks(lang);
    return lang;
  }

  function current() {
    var lang = "en";
    try {
      lang = global.localStorage.getItem(STORAGE) || "en";
    } catch (err) {
      /* ignore */
    }
    try {
      var q = new URLSearchParams(window.location.search).get("lang");
      if (LANGS[q]) lang = q;
    } catch (err) {
      /* ignore */
    }
    return LANGS[lang] ? lang : "en";
  }

  function init() {
    mergeExtra();
    var lang = apply(current());
    document.querySelectorAll("[data-lang]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        apply(btn.getAttribute("data-lang") || "en");
      });
    });
    var select = document.getElementById("lang-select");
    if (select) {
      select.addEventListener("change", function () {
        apply(select.value);
      });
    }
    return lang;
  }

  global.BKS_I18N = {
    STORAGE: STORAGE,
    get: get,
    apply: apply,
    current: current,
    init: init
  };
})(window);
