// sign
// English is the source of truth: add a key here first, then to every other language.
export default {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'Sign a PDF',
  'mode_group_label': 'Who signs', // aria-label of the two-button switch below
  'mode_self': 'Sign it myself',
  'mode_send': 'Send to be signed',
  'intro_self': 'Add your signature to a document — it\'s processed in your browser and never uploaded.',
  'intro_send': 'Ask someone else to sign a document. They sign in their browser with no account, and you both get a certificate. You don’t need a signature of your own for this.',

  // ── The drop circle (small round area — keep these short) ────────────────
  'drop_label': 'Drop a PDF here, or click to choose one', // accessible name of the drop circle
  'drop_label_another': 'Drop another PDF here, or click to choose one', // same, once a PDF is loaded
  'drop_pages_one': '{count} page',
  'drop_pages_other': '{count} pages',
  'change_pdf': 'Change PDF', // the button beside the loaded PDF's name: choose another
  'drop_over': 'Drop to open', // shown while a file is dragged over the circle
  'drop_here': 'Drop a PDF here',
  'drop_stays_local': 'it stays on your device',
  'drop_uploaded_on_send': 'uploaded only when you send it',
  'drop_browse': 'or click to browse',
  'drop_browse_tap': 'or tap to choose', // drop_browse on touch screens
  'signature_first': 'Create your signature first, then add the PDF.', // under the greyed-out drop circle until there is a signature; turns red if a PDF is dropped anyway
  'drop_anywhere_title': 'Drop it anywhere', // full-page overlay while dragging a file
  'drop_anywhere_hint': 'A PDF — it\'s signed in this browser and never uploaded',

  // ── Errors ───────────────────────────────────────────────────────────────
  'error_not_pdf': '{name} isn\'t a PDF.', // {name} is the file name
  'error_encrypted': '{name} is password-protected, so it can\'t be signed here. Remove its password first, then try again.',
  'error_unreadable': 'Could not read {name}. It may be damaged, or not really a PDF.',
  'error_no_email': 'Your Universal ID has no email on file, so a verifiable record can\'t be created.',
  'error_record': 'Could not create the verifiable record.',
  'error_sign': 'Could not sign the PDF.',

  // ── Page, size and position ──────────────────────────────────────────────
  'layout_label': 'How to sign', // heading over the four ways to sign a PDF of more than one page
  'layout_once': 'Sign once',
  'layout_once_hint': 'Your signature on one page',
  'layout_every': 'Sign every page',
  'layout_every_hint': 'Your signature in the same place on each page',
  'layout_initial_once': 'Initial all pages, sign once',
  'layout_initial_once_hint': 'Your initials on each page, your signature on the last',
  'layout_initial_every': 'Initial and sign all pages',
  'layout_initial_every_hint': 'Your initials and your signature on every page',
  'page_label': 'Page',
  'page_option': 'Page {n}', // an entry in the page list; {n} is the page number
  'page_option_last': 'Page {n} (last)',
  'size_label': 'Size ({pct}%)', // {pct} is the signature width as a percentage of the page
  'position_label': 'Position',
  'position_label_initials': 'Signature position (last page)',
  'position_label_every': 'Signature position (every page)',
  'position_needs_signature': 'Create a signature to preview placement.',
  'placer_hint': 'Drag your signature to where it goes, or tap the page to move it there.', // under the page preview, once there is a signature to drag
  'position_reset': 'Back to the corner', // drops a dragged position: the signature goes back to the bottom-right corner

  // ── Options ──────────────────────────────────────────────────────────────
  'omit_extras': '{bold} — sign this document with the signature alone, without what you added in "Create your signature".', // {bold} is sign.omit_extras_bold
  'omit_extras_bold': 'Leave off the name, date & time',
  'certificate': '{bold} — appends a certificate page and a QR to the PDF, and saves a free, verifiable record (your email, the file name, a hash of the unsigned original and the time). The page also shows your device\'s clock and timezone, marked as self-reported. The document itself is never uploaded.', // {bold} is sign.certificate_bold
  'certificate_bold': 'Add a signing certificate',
  'certificate_sign_in': '{link} to enable verifiable records.', // {link} is sign.certificate_sign_in_link
  'certificate_sign_in_link': 'Sign in with a free Universal ID',

  // ── Signing ──────────────────────────────────────────────────────────────
  'signing': 'Signing…',
  'button_needs_signature': 'Create a signature first',
  'button_needs_initials': 'Add your initials first',
  'button_sign': 'Sign & download PDF',
  'button_sign_embedded': 'Sign', // embedded in another app: the signed PDF goes back to it, not to Downloads
  'signed_as': '✓ Signed — downloaded as {name}', // {name} is the downloaded file name
  'record_created': '✓ Verifiable record created',
  'record_qr_links_here': 'The signed PDF carries a QR linking here:',
  'record_copy': 'Copy', // copies the verification link
  'record_copy_hash': 'The signed copy’s fingerprint is on the record too, so anyone you send it to can check on that page that it hasn’t been changed.',

  // ── Position picker (dialog) ─────────────────────────────────────────────
  'picker_title': 'Choose signature position',
  'picker_hint': 'Click or drag on the page to place your signature, or use the arrow keys.',
  'picker_close': 'Close',
  'picker_error': 'Could not render this page.',
  'picker_rendering': 'Rendering page…',
  'picker_surface_label': 'Page preview. Use the arrow keys to move the signature; hold Shift to move it further.', // screen-reader label
  'picker_page_alt': 'PDF page',
  'picker_sig_alt': 'Signature preview',
  'picker_initials_alt': 'Initials preview',
  'preview_other_pages': 'The other pages: your initials', // over a small preview of page 1 with initials, under the signed last page
  'picker_live': 'Signature centre {x}% across, {y}% down the page.', // screen-reader announcement; {x}/{y} are percentages
  'picker_cancel': 'Cancel',
  'picker_confirm': 'Use this position',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Scan to verify · Universal Signatures', // tiny caption under the verification QR; Latin letters only render (Western European set)
  'attest_heading': 'Signature sent from a phone', // certificate page: heading over the line below, when the signature came from the UNI·SIM Hub phone app (printed in capitals)
  'attest_line': 'Signed by {email} via Universal ID · {time}', // certificate page and the received-from-phone panel; {email} is the signer's confirmed Universal ID email, {time} when our server recorded it. Universal ID is a product name: keep it
}
