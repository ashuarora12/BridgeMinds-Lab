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
