const toggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');
if (toggle && nav) {
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
    toggle.textContent = open ? '×' : '☰';
  });
}

// Free consultation pop-up, shown once per browser session
(function () {
  if (typeof HTMLDialogElement !== 'function') return;
  var KEY = 'bml-consult-popup-seen';
  try { if (sessionStorage.getItem(KEY) === '1') return; } catch (e) {}
  var modal = document.createElement('dialog');
  modal.className = 'consult-modal';
  modal.setAttribute('aria-labelledby', 'consult-title');
  modal.innerHTML =
    '<div class="consult-body" tabindex="-1" autofocus>' +
    '<button type="button" class="consult-close" data-close aria-label="Close">×</button>' +
    '<p class="eyebrow">BridgeMinds Lab</p>' +
    '<h2 id="consult-title">Book your free consultation today</h2>' +
    '<p>Talk to us about your study-abroad, academic or career plans. Your first consultation is completely free, with no commitment.</p>' +
    '<div class="consult-actions">' +
    '<a class="button" href="https://forms.gle/4APE1v6JgBJ3oneW6" target="_blank" rel="noopener" data-close>Book my free consultation</a>' +
    '<a class="button consult-whatsapp" href="https://wa.me/918858869624" target="_blank" rel="noopener" data-close>Message us on WhatsApp</a>' +
    '</div>' +
    '<button type="button" class="consult-later" data-close>Maybe later</button>' +
    '</div>';
  document.body.appendChild(modal);
  function markSeen() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  modal.addEventListener('click', function (e) {
    if (e.target === modal || e.target.closest('[data-close]')) { modal.close(); markSeen(); }
  });
  modal.addEventListener('cancel', markSeen);
  setTimeout(function () { modal.showModal(); }, 800);
})();

// Floating WhatsApp button
(function () {
  var a = document.createElement('a');
  a.className = 'wa-float';
  a.href = 'https://wa.me/918858869624?text=' + encodeURIComponent('Hi BridgeMinds Lab, I would like to know more about your services.');
  a.target = '_blank';
  a.rel = 'noopener';
  a.setAttribute('aria-label', 'Chat with us on WhatsApp');
  a.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16.04 3C9.4 3 4 8.36 4 14.97c0 2.11.56 4.18 1.62 6L4 29l8.23-2.15a12.1 12.1 0 0 0 3.8.61h.01C22.67 27.46 28 22.1 28 15.5 28 8.9 22.67 3 16.04 3zm0 22.44h-.01a10 10 0 0 1-5.1-1.4l-.37-.21-4.88 1.27 1.3-4.75-.24-.39a9.9 9.9 0 0 1-1.52-5.3c0-5.5 4.49-9.97 10.03-9.97 5.48 0 9.94 4.36 9.94 9.86 0 5.5-4.47 10.89-9.15 10.89zm5.5-7.47c-.3-.15-1.78-.87-2.05-.97-.28-.1-.48-.15-.68.15-.2.3-.78.97-.95 1.17-.18.2-.35.22-.65.07-.3-.15-1.27-.46-2.42-1.48-.9-.8-1.5-1.78-1.67-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.68-.51h-.58c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.22 3.08.15.2 2.1 3.2 5.08 4.48.71.31 1.26.49 1.7.63.71.22 1.36.19 1.87.12.57-.09 1.78-.73 2.03-1.43.25-.7.25-1.3.18-1.43-.08-.12-.28-.2-.58-.35z"/></svg>';
  document.body.appendChild(a);
})();
