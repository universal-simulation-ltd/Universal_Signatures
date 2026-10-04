// sign
// English is the source of truth: add a key here first, then to every other language.
export default {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'Sign a PDF',
  'mode_group_label': 'Who signs', // aria-label of the two-button switch below
  'mode_self': 'Sign it myself',
  'mode_send': 'Send to be signed',
  'intro_self': 'Add your signature to a document — it\'s processed in your browser and never uploaded.',
  'intro_send': 'Ask someone else to sign a document. They sign in their browser with no account, and you both get a certificate.',

  // ── The drop circle (small round area — keep these short) ────────────────
  'drop_label': 'Drop a PDF here, or click to choose one', // accessible name of the drop circle
  'drop_label_another': 'Drop another PDF here, or click to choose one', // same, once a PDF is loaded
  'drop_pages_one': '{count} page',
  'drop_pages_other': '{count} pages',
  'drop_change': 'drop another, or click to change',
  'drop_over': 'Drop to open', // shown while a file is dragged over the circle
  'drop_here': 'Drop a PDF here',
  'drop_stays_local': 'it stays on your device',
  'drop_uploaded_on_send': 'uploaded only when you send it',
  'drop_browse': 'or click to browse',
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
  'page_label': 'Page',
  'page_option': 'Page {n}', // an entry in the page list; {n} is the page number
  'page_option_last': 'Page {n} (last)',
  'page_every': 'Every page ({count})', // {count} is the number of pages
  'page_initial_each': 'Initial each page, sign the last',
  'size_label': 'Size ({pct}%)', // {pct} is the signature width as a percentage of the page
  'position_label': 'Position',
  'position_label_initials': 'Signature position (last page)',
  'position_group_label': 'Position on the page', // aria-label of the 3×3 grid of positions
  'anchor_top_left': 'Top left',
  'anchor_top_center': 'Top centre',
  'anchor_top_right': 'Top right',
  'anchor_mid_left': 'Middle left',
  'anchor_mid_center': 'Centre',
  'anchor_mid_right': 'Middle right',
  'anchor_bottom_left': 'Bottom left',
  'anchor_bottom_center': 'Bottom centre',
  'anchor_bottom_right': 'Bottom right',
  'position_custom': 'Custom position', // button label once a position was picked on the page
  'position_choose': 'Choose position…', // opens the visual position picker
  'position_custom_set': '✓ Custom position set',
  'position_use_grid': 'Use grid', // drops the custom position and goes back to the 3×3 grid
  'position_needs_signature': 'Create a signature to preview placement.',

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
  'picker_live': 'Signature centre {x}% across, {y}% down the page.', // screen-reader announcement; {x}/{y} are percentages
  'picker_cancel': 'Cancel',
  'picker_confirm': 'Use this position',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Scan to verify · Universal Signatures', // tiny caption under the verification QR; Latin letters only render (Western European set)
}
