// Receives BridgeMinds Lab website pop-up enquiries and adds them to the Google Sheet.
// Deploy as a web app (see README.md), then paste the web-app URL into
// BridgeMinds-Lab-Complete-Updated-Code/js/main.js as LEADS_ENDPOINT.

const SHEET_ID = '1BeXVTeRQlpjoJIvdHVWGKemN9B7OxnrrOX5v-CA7s4Q';
const SHEET_GID = 239317024;
const HEADERS = ['Submitted at', 'Target year', 'Preferred course', 'Preferred country', 'Name', 'Contact', 'Page'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p.website) return reply_(); // hidden spam-trap field was filled in

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const sheet = ss.getSheets().find(s => s.getSheetId() === SHEET_GID) || ss.getSheets()[0];
    if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);
    sheet.appendRow([
      new Date(),
      clean_(p.year),
      clean_(p.course),
      clean_(p.country),
      clean_(p.name),
      clean_(p.contact),
      clean_(p.page),
    ]);
  } finally {
    lock.releaseLock();
  }
  return reply_();
}

// Keep values short, and stop text starting with = + - @ being treated as a formula
function clean_(value) {
  const text = String(value || '').trim().slice(0, 200);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function reply_() {
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
