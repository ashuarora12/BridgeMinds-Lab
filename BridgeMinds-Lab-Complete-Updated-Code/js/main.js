const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
}

// Optional URL that stores pop-up enquiries (e.g. a Google Apps Script web app).
// While empty, the pop-up sends the enquiry to WhatsApp instead.
const LEADS_ENDPOINT = '';
const WHATSAPP_NUMBER = '918858869624';

// Free consultation pop-up: shown every time the homepage loads
(function () {
  if (document.body.dataset.page !== 'home') return;
  if (typeof HTMLDialogElement !== 'function') return;

  function options(name, values) {
    return values.map(function (v) {
      return '<button type="button" class="lead-option" data-field="' + name + '" data-value="' + v + '">' + v + '</button>';
    }).join('');
  }

  var modal = document.createElement('dialog');
  modal.className = 'consult-modal';
  modal.setAttribute('aria-labelledby', 'consult-title');
  modal.innerHTML =
    '<div class="consult-body" tabindex="-1" autofocus>' +
    '<button type="button" class="consult-close" data-close aria-label="Close">×</button>' +
    '<p class="eyebrow">BridgeMinds Lab</p>' +
    '<h2 id="consult-title">Book your free consultation today</h2>' +
    '<p class="consult-sub">Share a few details and we will get in touch.</p>' +
    '<form class="lead-form" novalidate>' +
    '<div class="lead-progress" aria-hidden="true"><span></span><span></span><span></span><span></span></div>' +
    '<fieldset class="lead-step" data-step="1"><legend>Which year are you targeting?</legend>' +
    '<div class="lead-options">' + options('year', ['2027', '2028', '2029']) + '</div></fieldset>' +
    '<fieldset class="lead-step" data-step="2" hidden><legend>Preferred course</legend>' +
    '<div class="lead-options">' + options('course', ['Bachelors', 'Masters', 'Doctoral']) + '</div></fieldset>' +
    '<fieldset class="lead-step" data-step="3" hidden><legend>Any preferred country?</legend>' +
    '<div class="lead-options lead-options-wrap">' + options('country', ['USA', 'UK', 'Canada', 'Australia', 'Germany', 'Ireland', 'Not sure yet']) + '</div>' +
    '<div class="lead-other"><input type="text" name="countryOther" maxlength="60" placeholder="Or type another country" aria-label="Another country"><button type="button" class="lead-next">Next</button></div></fieldset>' +
    '<fieldset class="lead-step" data-step="4" hidden><legend>Your details</legend>' +
    '<label>Name<input type="text" name="name" maxlength="80" autocomplete="name" required></label>' +
    '<label>Phone / WhatsApp or email<input type="text" name="contact" maxlength="100" autocomplete="tel" required></label>' +
    '<input type="text" name="website" class="lead-hp" tabindex="-1" autocomplete="off" aria-hidden="true">' +
    '<p class="lead-error" role="alert" hidden></p>' +
    '<button type="submit" class="button lead-submit">Submit</button></fieldset>' +
    '<div class="lead-nav"><button type="button" class="lead-back" hidden>← Back</button><span class="lead-summary"></span></div>' +
    '</form>' +
    '<div class="lead-done" hidden><h3>Thank you!</h3><p>We have received your details and will contact you soon about your free consultation.</p><a class="button lead-whatsapp" target="_blank" rel="noopener" hidden>Open WhatsApp to send</a><button type="button" class="button lead-close" data-close>Close</button></div>' +
    '<p class="consult-alt">Prefer to chat? <a href="https://wa.me/' + WHATSAPP_NUMBER + '" target="_blank" rel="noopener">Message us on WhatsApp</a></p>' +
    '</div>';
  document.body.appendChild(modal);

  var form = modal.querySelector('.lead-form');
  var steps = form.querySelectorAll('.lead-step');
  var bars = form.querySelectorAll('.lead-progress span');
  var back = form.querySelector('.lead-back');
  var summary = form.querySelector('.lead-summary');
  var error = form.querySelector('.lead-error');
  var answers = { year: '', course: '', country: '' };
  var current = 1;

  function show(step) {
    current = step;
    steps.forEach(function (s) { s.hidden = Number(s.dataset.step) !== step; });
    bars.forEach(function (b, i) { b.classList.toggle('on', i < step); });
    back.hidden = step === 1;
    summary.textContent = [answers.year, answers.course, answers.country].filter(Boolean).slice(0, step - 1).join(' · ');
    var focusable = steps[step - 1].querySelector('input:not(.lead-hp), .lead-option');
    if (focusable) focusable.focus();
  }

  form.addEventListener('click', function (e) {
    var opt = e.target.closest('.lead-option');
    if (opt) {
      answers[opt.dataset.field] = opt.dataset.value;
      opt.parentNode.querySelectorAll('.lead-option').forEach(function (b) { b.classList.toggle('selected', b === opt); });
      if (opt.dataset.field === 'country') form.countryOther.value = '';
      show(current + 1);
    }
    if (e.target.closest('.lead-next')) {
      var other = form.countryOther.value.trim();
      if (!other && !answers.country) { form.countryOther.focus(); return; }
      if (other) answers.country = other;
      show(4);
    }
    if (e.target.closest('.lead-back')) show(current - 1);
  });

  form.addEventListener('input', function () { error.hidden = true; });

  form.countryOther.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); form.querySelector('.lead-next').click(); }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var contact = form.contact.value.trim();
    var digits = contact.replace(/\D/g, '');
    var validContact = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || digits.length >= 8;
    if (!name) { error.textContent = 'Please enter your name.'; error.hidden = false; form.name.focus(); return; }
    if (!validContact) { error.textContent = 'Please enter a valid phone number or email.'; error.hidden = false; form.contact.focus(); return; }
    error.hidden = true;

    var data = { year: answers.year, course: answers.course, country: answers.country, name: name, contact: contact, website: form.website.value, page: location.href };
    var submit = form.querySelector('.lead-submit');

    function done(whatsappUrl) {
      form.hidden = true;
      modal.querySelector('.consult-sub').hidden = true;
      modal.querySelector('.consult-alt').hidden = true;
      if (whatsappUrl) {
        modal.querySelector('.lead-done h3').textContent = 'Almost done!';
        modal.querySelector('.lead-done p').textContent = 'Send us your details on WhatsApp and we will contact you about your free consultation.';
        var send = modal.querySelector('.lead-whatsapp');
        send.href = whatsappUrl;
        send.hidden = false;
      }
      modal.querySelector('.lead-done').hidden = false;
    }

    if (!LEADS_ENDPOINT) {
      // No storage endpoint configured: send the details on WhatsApp instead
      var text = 'Hi BridgeMinds Lab, I would like a free consultation.\nTarget year: ' + data.year + '\nCourse: ' + data.course + '\nCountry: ' + data.country + '\nName: ' + data.name + '\nContact: ' + data.contact;
      var url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(text);
      window.open(url, '_blank', 'noopener');
      done(url);
      return;
    }

    submit.disabled = true;
    submit.textContent = 'Submitting…';
    fetch(LEADS_ENDPOINT, { method: 'POST', mode: 'no-cors', body: new URLSearchParams(data) })
      .then(function () { done(''); })
      .catch(function () {
        submit.disabled = false;
        submit.textContent = 'Submit';
        error.textContent = 'Something went wrong. Please try again or message us on WhatsApp.';
        error.hidden = false;
      });
  });

  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-close]')) modal.close();
  });
  show(1);
  setTimeout(function () { modal.showModal(); }, 800);
})();

// Floating WhatsApp button
(function () {
  var a = document.createElement('a');
  a.className = 'wa-float';
  a.href = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent('Hi BridgeMinds Lab, I would like to know more about your services.');
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with us on WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.18 1.62 6L4 29l8.23-2.15a12.1 12.1 0 0 0 3.8.61h.01C22.67 27.46 28 22.1 28 15.5 28 8.9 22.67 3 16.04 3zm0 22.44h-.01a10 10 0 0 1-5.1-1.4l-.37-.21-4.88 1.27 1.3-4.75-.24-.39a9.9 9.9 0 0 1-1.52-5.3c0-5.5 4.49-9.97 10.03-9.97 5.48 0 9.94 4.36 9.94 9.86 0 5.5-4.47 10.89-9.15 10.89zm5.5-7.47c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z"/></svg>';
  document.body.appendChild(a);
})();
