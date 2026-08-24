/* Bharatiya Krishak Samaj Pujo - sponsor briefing
   Nothing here talks to a network. The enquiry file is built in the browser
   and written to the visitor's own device. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- section navigation ---------- */

  (function navigation() {
    var toggle = document.getElementById('siteNavToggle');
    var links = document.getElementById('siteNavLinks');
    if (!toggle || !links) return;

    function closeMenu() {
      toggle.setAttribute('aria-expanded', 'false');
      links.classList.remove('is-open');
    }

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      links.classList.toggle('is-open', !open);
    });

    var anchors = links.querySelectorAll('a[href^="#"]');
    for (var i = 0; i < anchors.length; i++) {
      anchors[i].addEventListener('click', closeMenu);
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') closeMenu();
    });

    if (!('IntersectionObserver' in window)) return;
    var targets = [];
    for (var j = 0; j < anchors.length; j++) {
      var target = document.querySelector(anchors[j].getAttribute('href'));
      if (target) targets.push(target);
    }
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        for (var k = 0; k < anchors.length; k++) anchors[k].removeAttribute('aria-current');
        var active = links.querySelector('a[href="#' + entry.target.id + '"]');
        if (active) active.setAttribute('aria-current', 'location');
      });
    }, { rootMargin: '-20% 0px -68% 0px', threshold: 0 });
    for (var m = 0; m < targets.length; m++) sectionObserver.observe(targets[m]);
  })();

  /* ---------- hero film ---------- */

  (function film() {
    var video = document.getElementById('heroFilm');
    var toggle = document.getElementById('filmToggle');
    if (!video || !toggle) return;

    var saveData = !!(navigator.connection && navigator.connection.saveData);
    var portrait = window.matchMedia('(max-aspect-ratio: 3/4)').matches;

    if (portrait) {
      video.setAttribute('poster', video.getAttribute('data-poster-portrait'));
    }

    // Reduced motion or a metered connection: the poster frame stands in for the film.
    if (reduceMotion || saveData) return;

    video.src = portrait
      ? video.getAttribute('data-film-portrait')
      : video.getAttribute('data-film');
    video.load();

    var started = video.play();
    if (started && typeof started.then === 'function') {
      started.then(function () {
        toggle.hidden = false;
      }).catch(function () {
        // Autoplay refused. The poster stays, and there is nothing to pause.
      });
    } else {
      toggle.hidden = false;
    }

    toggle.addEventListener('click', function () {
      if (video.paused) {
        video.play();
        toggle.textContent = 'Pause footage';
      } else {
        video.pause();
        toggle.textContent = 'Play footage';
      }
    });
  })();

  /* ---------- scroll reveal ---------- */

  (function reveal() {
    var items = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('is-in');
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    for (var j = 0; j < items.length; j++) io.observe(items[j]);
  })();

  /* ---------- staggered audience cards ---------- */

  (function audienceCards() {
    var groups = document.querySelectorAll('.aud');
    if (!groups.length || reduceMotion || !('IntersectionObserver' in window)) return;

    var cards = document.querySelectorAll('.aud__item');
    for (var i = 0; i < groups.length; i++) groups[i].classList.add('aud--staged');

    var audienceObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        audienceObserver.unobserve(entry.target);
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -12% 0px' });

    for (var j = 0; j < cards.length; j++) audienceObserver.observe(cards[j]);
  })();

  /* ---------- contribution route chooser ---------- */

  (function contributionChooser() {
    var buttons = document.querySelectorAll('.position__select');
    var panel = document.getElementById('routePanel');
    var eyebrow = document.getElementById('routePanelEyebrow');
    var title = document.getElementById('routePanelTitle');
    var copy = document.getElementById('routePanelCopy');
    var figure = document.getElementById('routePanelFigure');
    var proof = document.getElementById('routePanelProof');
    var interest = document.getElementById('interestSelect');
    if (!buttons.length || !panel || !eyebrow || !title || !copy || !figure || !proof || !interest) return;

    var routes = {
      title: {
        eyebrow: 'One organisation only',
        title: 'The title position',
        figure: '₹10 lakh indicative',
        conversation: 'Title position',
        copy: 'A first conversation defines naming, ground presence, demonstration farm scope and payment terms. Nothing is reserved by selecting this route.',
        proof: ['One organisation in the title position', 'Name, mark and ground scope agreed in writing', 'Nothing reserved until terms are signed']
      },
      category: {
        eyebrow: 'Your category, held by you',
        title: 'A category position',
        figure: '₹2.5 lakh indicative',
        conversation: 'Category position',
        copy: 'A first conversation defines your category, your place through the week and what may run on the demonstration farm. Category protection only begins with agreed written terms.',
        proof: ['Presence through the public week', 'A place on the demonstration farm', 'Your category not shared on the same ground']
      },
      farms: {
        eyebrow: 'No pandal required',
        title: 'Seeding farms directly',
        figure: '₹1 lakh a farm',
        conversation: 'Seeding village farms directly',
        copy: 'A first conversation identifies the farm route, payment schedule and written reporting. This route carries no visibility obligation unless one is separately agreed.',
        proof: ['₹1 lakh seeds one village integrated farm', 'No visibility obligation', 'The farm record and task cycle are included']
      }
    };

    for (var i = 0; i < buttons.length; i++) {
      buttons[i].addEventListener('click', function () {
        var route = routes[this.getAttribute('data-route')];
        if (!route) return;

        for (var j = 0; j < buttons.length; j++) {
          buttons[j].setAttribute('aria-pressed', 'false');
          buttons[j].classList.remove('is-selected');
        }

        this.setAttribute('aria-pressed', 'true');
        this.classList.add('is-selected');
        interest.value = route.conversation;
        eyebrow.textContent = route.eyebrow;
        title.textContent = route.title;
        copy.textContent = route.copy;
        figure.textContent = route.figure;
        proof.replaceChildren();
        for (var k = 0; k < route.proof.length; k++) {
          var item = document.createElement('li');
          item.textContent = route.proof[k];
          proof.appendChild(item);
        }
      });
    }
  })();

  /* ---------- partnership enquiry prefill ---------- */

  (function partnershipPrefill() {
    var links = document.querySelectorAll('[data-interest]');
    var interest = document.getElementById('interestSelect');
    if (!links.length || !interest) return;

    for (var i = 0; i < links.length; i++) {
      links[i].addEventListener('click', function () {
        var route = this.getAttribute('data-interest');
        if (route) interest.value = route;
      });
    }
  })();

  /* ---------- enquiry file ---------- */

  (function enquiry() {
    var btn = document.getElementById('downloadBtn');
    var status = document.getElementById('status');
    if (!btn || !status) return;

    var FILENAME = 'bks-pujo-sponsor-enquiry.json';
    var MAILTO = 'mailto:contact@bkswbengal.org?subject=' +
      encodeURIComponent('Sponsor enquiry: Bharatiya Krishak Samaj Pujo 2026');

    function val(id) {
      var el = document.getElementById(id);
      return el ? String(el.value).trim() : '';
    }

    function fail(message) {
      status.hidden = false;
      status.className = 'status status--err';
      status.textContent = message;
    }

    function succeed() {
      status.hidden = false;
      status.className = 'status status--ok';
      status.innerHTML = 'Saved to your device as ' + FILENAME +
        '. Nothing has been sent yet. Email the file to ' +
        '<a href="' + MAILTO + '">contact@bkswbengal.org</a>' +
        ' and we will reply to arrange the conversation.';
    }

    btn.addEventListener('click', function () {
      var org = val('org');
      var name = val('name');
      var email = val('email');
      var consent = document.getElementById('consent');

      if (!org || !name || !email) {
        fail('Add your organisation, your name and your email before downloading the file.');
        return;
      }
      if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
        fail('Check the email address. It needs an @ and a domain.');
        return;
      }
      if (!consent || !consent.checked) {
        fail('Tick the box to confirm the file stays on your device.');
        return;
      }

      var data = {
        form: 'bks-pujo-sponsor-enquiry',
        version: '1.0',
        generated_at: new Date().toISOString(),
        event: {
          name: 'Bharatiya Krishak Samaj Pujo',
          dates: '16 to 20 October 2026',
          venue: 'Munshir Bheri Management / Fishermen’s Committee, near Sukantanagar and Salt Lake Sector V, East Kolkata Wetlands, Kolkata 700091, West Bengal',
          organised_by: 'KarmYog for the 21st Century Foundation',
          organisation_partner: 'Bharatiya Krishak Samaj'
        },
        sponsor: {
          organisation: org,
          contact_name: name,
          role: val('role'),
          email: email,
          phone: val('phone'),
          conversation: val('interestSelect'),
          sector: val('sector'),
          notes: val('notes')
        },
        declaration: 'Generated locally in the sender’s browser. Not submitted to any server. No payment or booking made.',
        send_to: 'contact@bkswbengal.org'
      };

      try {
        var blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = FILENAME;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
        succeed();
      } catch (e) {
        fail('This browser could not create the file. Email contact@bkswbengal.org directly and we will take it from there.');
      }
    });
  })();
})();
