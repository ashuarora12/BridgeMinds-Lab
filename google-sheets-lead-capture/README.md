# Website pop-up → Google Sheet

The homepage pop-up collects target year, preferred course, preferred country,
name and contact. This Apps Script receives each submission and adds a row to
the BridgeMinds Lab enquiries sheet.

## One-time setup (about 5 minutes)

1. Open the Google Sheet, then **Extensions → Apps Script**.
2. Delete any code in the editor, paste in everything from `Code.gs`, and click **Save**.
3. Click **Deploy → New deployment**. Choose type **Web app**, then set:
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Click **Deploy**, approve the permission prompt, and copy the **Web app URL**
   (it ends in `/exec`).
5. In `BridgeMinds-Lab-Complete-Updated-Code/js/main.js`, set
   `const LEADS_ENDPOINT = '<that URL>';` and deploy the site.

Until `LEADS_ENDPOINT` is set, the pop-up sends the details to the BridgeMinds
Lab WhatsApp number instead, so no enquiry is lost.

## Columns

Submitted at · Target year · Preferred course · Preferred country · Name · Contact · Page

Rows go to a tab called **Website pop-up**, which the script creates on the
first submission, along with its header row. The script only ever adds rows
to that tab: it never edits or deletes anything, and it doesn't touch Google
Form responses or any other tab.
