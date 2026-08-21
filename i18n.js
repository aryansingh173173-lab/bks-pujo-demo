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
      maps: "View location on Google Maps",
      namedPlaceNote: "A live Integrated Farming demonstration is being built at this address. The exact Puja venue will be announced through the official Puja channels.",
      placeOnFile: "Demonstration / project location",
      pandalTBA: "Puja venue details will be announced through the official Puja channels",
      formHonesty: "Your interest note is downloaded to your device. You can then share it with the BKS team if you would like to continue the conversation.",
      name: "Name",
      organisation: "Organisation",
      phone: "Phone",
      email: "Email",
      locality: "Locality / village / area",
      district: "District (if you know it)",
      message: "Anything you want us to know",
      consent: "I understand the interest note downloads to my device. I can share it with the BKS team myself if I wish to continue.",
      downloaded: "Your interest note has been downloaded to your device. You can email it to contact@bkswbengal.org if you wish to continue.",
      noPayment: "Payment is not taken through this experience.",
      participate: "Participate",
      interestNote: "Express interest",
      farmer: "Farmer",
      supporter: "Supporter",
      pendingNotice: "",
      farmtech: "FarmTech and AgriTech",
      seedNote: "₹1 lakh is the proposed seed for an integrated model farm — in full, or ₹20,000 every two months. It is not collected on this website.",
      target5000: "About 5,000 village farms is a mobilisation target, not a completed count.",
      arithmetic50: "₹50 crore is the arithmetic of the target (5,000 × ₹1 lakh). It is not funds already raised.",
      demoLocationTitle: "Demonstration / project location",
      demoLocationNote: "A live Integrated Farming demonstration is being built at this address. The exact Puja venue will be announced through the official Puja channels.",
      expressSponsor: "Express Sponsor Interest",
      requestBriefing: "Request a Briefing",
      expressFarmer: "Express Farmer Interest",
      explorePuja: "Explore the Puja",
      expressSupporter: "Express Supporter Interest"
    },
    bn: {
      skip: "সরাসরি মূল লেখায় যান",
      menu: "মেনু",
      close: "মেনু বন্ধ করুন",
      language: "ভাষা",
      back: "ভারতীয় কৃষক সমাজ পূজায় ফিরে যান",
      event: "ভারতীয় কৃষক সমাজ পূজা",
      organiser: "KarmYog for the 21st Century আয়োজিত",
      partner: "ভারতীয় কৃষক সমাজ · আয়োজক অংশীদার",
      parent: "ভারতীয় কৃষক সমাজ",
      faq: "প্রশ্ন",
      thePuja: "পূজা",
      ifs: "সমন্বিত চাষ",
      maps: "Google Maps-এ অবস্থান দেখুন",
      namedPlaceNote: "এই ঠিকানায় একটি সমন্বিত চাষের প্রদর্শনী খামার তৈরি হচ্ছে। পূজার সঠিক স্থান অফিসিয়াল পূজা চ্যানেলের মাধ্যমে ঘোষণা করা হবে।",
      placeOnFile: "প্রদর্শনী / প্রকল্প অবস্থান",
      pandalTBA: "পূজার স্থানের বিবরণ অফিসিয়াল পূজা চ্যানেলের মাধ্যমে ঘোষণা করা হবে",
      formHonesty: "আপনার আগ্রহের নোট আপনার যন্ত্রে ডাউনলোড হয়। চাইলে সেটি BKS টিমের সঙ্গে শেয়ার করতে পারেন।",
      name: "নাম",
      organisation: "প্রতিষ্ঠান",
      phone: "ফোন",
      email: "ইমেল",
      locality: "এলাকা / গ্রাম / পাড়া",
      district: "জেলা (জানা থাকলে)",
      message: "আর কিছু জানাতে চান",
      consent: "আমি বুঝি আগ্রহের নোট আমার যন্ত্রে ডাউনলোড হয়। চাইলে আমি নিজে BKS টিমের সঙ্গে শেয়ার করতে পারি।",
      downloaded: "আপনার আগ্রহের নোট যন্ত্রে ডাউনলোড হয়েছে। চাইলে contact@bkswbengal.org-এ পাঠাতে পারেন।",
      noPayment: "এই অভিজ্ঞতায় অর্থ নেওয়া হয় না।",
      participate: "যোগদান",
      interestNote: "আগ্রহ জানান",
      farmer: "কৃষক",
      supporter: "সমর্থক",
      pendingNotice: "",
      farmtech: "FarmTech and AgriTech",
      seedNote: "₹১ লক্ষ একটি সমন্বিত মডেল খামারের প্রস্তাবিত বীজ — একসাথে, অথবা প্রতি দুই মাসে ₹২০,০০০। এটি এই ওয়েবসাইটে সংগ্রহ হয় না।",
      target5000: "প্রায় ৫,০০০ গ্রামীণ খামার একটি সংহতির লক্ষ্য, সম্পূর্ণ গণনা নয়।",
      arithmetic50: "₹৫০ কোটি লক্ষ্যের গাণিতিক অঙ্ক (৫,০০০ × ₹১ লক্ষ)। এটি ইতিমধ্যে সংগৃহীত তহবিল নয়।",
      demoLocationTitle: "প্রদর্শনী / প্রকল্প অবস্থান",
      demoLocationNote: "এই ঠিকানায় একটি সমন্বিত চাষের প্রদর্শনী খামার তৈরি হচ্ছে। পূজার সঠিক স্থান অফিসিয়াল পূজা চ্যানেলের মাধ্যমে ঘোষণা করা হবে।",
      expressSponsor: "স্পন্সর আগ্রহ জানান",
      requestBriefing: "ব্রিফিং অনুরোধ করুন",
      expressFarmer: "কৃষক আগ্রহ জানান",
      explorePuja: "পূজা দেখুন",
      expressSupporter: "সমর্থক আগ্রহ জানান"
    },
    hi: {
      skip: "सीधे मुख्य लेख पर जाएँ",
      menu: "मेनू",
      close: "मेनू बंद करें",
      language: "भाषा",
      back: "भारतीय कृषक समाज पूजा पर वापस जाएँ",
      event: "भारतीय कृषक समाज पूजा",
      organiser: "KarmYog for the 21st Century द्वारा आयोजित",
      partner: "भारतीय कृषक समाज · आयोजन सहयोगी",
      parent: "भारतीय कृषक समाज",
      faq: "प्रश्न",
      thePuja: "पूजा",
      ifs: "समेकित कृषि",
      maps: "Google Maps-এ অবস্থান দেখুন",
      namedPlaceNote: "এই ঠিকানায় একটি সমন্বিত চাষের প্রদর্শনী খামার তৈরি হচ্ছে। পূজার সঠিক স্থান অফিসিয়াল পূজা চ্যানেলের মাধ্যমে ঘোষণা করা হবে।",
      placeOnFile: "প্রদর্শনী / প্রকল্প অবস্থান",
      pandalTBA: "पूजा स्थल की जानकारी आधिकारिक पूजा माध्यमों से घोषित होगी",
      formHonesty: "आपका रुचि नोट आपके डिवाइस पर डाउनलोड होता है। चाहें तो BKS टीम के साथ साझा करें।",
      name: "नाम",
      organisation: "প্রতিষ্ঠান",
      phone: "ফোন",
      email: "ইমেল",
      locality: "इलाका / गाँव / क्षेत्र",
      district: "ज़िला (यदि पता हो)",
      message: "और कुछ बताना हो",
      consent: "I understand the interest note downloads to my device. I can share it with the BKS team myself if I wish to continue.",
      downloaded: "Your interest note has been downloaded to your device. You can email it to contact@bkswbengal.org if you wish to continue.",
      noPayment: "इस अनुभव में भुगतान नहीं लिया जाता।",
      participate: "सहभागिता",
      interestNote: "यह रुचि नोट डाउनलोड करें",
      farmer: "किसान",
      supporter: "समर्थक",
      pendingNotice: "",
      farmtech: "FarmTech and AgriTech",
      seedNote: "₹1 lakh is the proposed seed for an integrated model farm — in full, or ₹20,000 every two months. It is not collected on this website.",
      target5000: "About 5,000 village farms is a mobilisation target, not a completed count.",
      arithmetic50: "₹50 crore लक्ष्य का अंकगणित है (5,000 × ₹1 लाख)। यह पहले से जुटाई गई राशि नहीं है।",
      demoLocationTitle: "प्रदर्शन / परियोजना स्थान",
      demoLocationNote: "इस पते पर एक समेकित कृषि प्रदर्शन फार्म बन रहा है। पूजा स्थल की जानकारी आधिकारिक पूजा माध्यमों से घोषित होगी।",
      expressSponsor: "प्रायोजक रुचि दर्ज करें",
      requestBriefing: "ब्रीफिंग का अनुरोध करें",
      expressFarmer: "किसान रुचि दर्ज करें",
      explorePuja: "पूजा देखें",
      expressSupporter: "समर्थक रुचि दर्ज करें"
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
      var notice = get(lang, "pendingNotice");
      if (lang === "en" || !notice) {
        banner.hidden = true;
        banner.textContent = "";
      } else {
        banner.hidden = false;
        banner.textContent = notice;
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
