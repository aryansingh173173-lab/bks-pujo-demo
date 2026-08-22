/* Bharatiya Krishak Samaj Pujo - sponsor briefing
   Nothing here talks to a network. The enquiry file is built in the browser
   and written to the visitor's own device. */

(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  /* ---------- enquiry file ---------- */

  (function enquiry() {
    var btn = document.getElementById('downloadBtn');
    var status = document.getElementById('status');
    if (!btn || !status) return;

    var FILENAME = 'bks-pujo-sponsor-enquiry.json';
    var MAILTO = 'mailto:contact@bkswbengal.org?subject=' +
      encodeURIComponent('Sponsor enquiry — Bharatiya Krishak Samaj Pujo 2026');

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
        fail('Check the email address — it needs an @ and a domain.');
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
          dates: '16-20 October 2026',
          venue: 'Munshir Bheri Management / Fishermen’s Committee, Near Sukantanagar / Salt Lake Sector V (East Kolkata Wetlands), Kolkata - 700091, West Bengal',
          organised_by: 'KarmYog for the 21st Century',
          organising_partner: 'Bharatiya Krishak Samaj'
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
