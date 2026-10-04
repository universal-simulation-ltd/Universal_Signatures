// send
// English is the source of truth: add a key here first, then to every other language.
export default {
  // ── Sender: send a PDF to someone to sign ──────────────────────────────────
  'signed_out_intro': 'Send a PDF to someone to sign — they sign in their browser, no account needed, and you both get a certificate. Sending needs a free {id}, so the signer knows who it’s from.', // {id} = "Universal ID" in bold (brand, not translated)
  'signed_out_cta': 'Create / sign in with Universal ID →',
  'unverified': 'Confirm your email address first — documents are only sent from addresses that have been confirmed. Use the link in the email we sent when you signed up, or {link} to send it again.', // {link} = send.unverified_link
  'unverified_link': 'open your Universal ID',

  'err_copy': 'Couldn’t copy — select the link and copy it yourself.',
  'err_no_email': 'Enter the signer’s email address.',
  'err_storage_full': 'Couldn’t store the document right now. Please try again later.',
  'err_create': 'Couldn’t create the request. Please try again.',
  'err_rate_limited': 'You’ve reached today’s sending limit.',
  'err_encrypted': '{name} is password-protected. Remove its password first, then try again.', // {name} = the PDF's file name
  'err_prepare': 'Couldn’t prepare that PDF for signing.',
  'err_link_not_found': 'Couldn’t find that link.',
  'err_withdraw': 'Couldn’t withdraw it.',

  'mail_subject': 'Please sign: {name}', // email subject when the user's own email app sends the request; {name} = file name
  'mail_body': 'Hello,\n\nPlease read and sign {name} here:\n{link}\n\nNo account or download is needed.', // email body; keep the {link} on its own line

  'where_label': 'Where they sign', // field label: which page the signer signs on
  'page_last': 'Last page',
  'page_last_n': 'Last page (page {n})',
  'page_n': 'Page {n}',
  'size_label': 'Signature size ({pct}%)',
  'position_label': 'Position',
  'position_group_aria': 'Where the signature goes on the page',
  'anchor_top_left': 'Top left',
  'anchor_top_center': 'Top centre',
  'anchor_top_right': 'Top right',
  'anchor_mid_left': 'Middle left',
  'anchor_mid_center': 'Centre',
  'anchor_mid_right': 'Middle right',
  'anchor_bottom_left': 'Bottom left',
  'anchor_bottom_center': 'Bottom centre',
  'anchor_bottom_right': 'Bottom right',
  'custom_position': 'Custom position',
  'choose_on_page': 'Choose on the page…',
  'custom_set': '✓ Custom position set',
  'use_grid': 'Use grid', // go back to the 9-position grid
  'sign_here': 'Sign here', // drawn inside the box that marks where to sign; keep short (about 12 characters)

  'email_label': 'Signer’s email',
  'email_placeholder': 'name@example.com',
  'protect_label': '{title} — they type the address and enter a code we email to it, so a forwarded link can’t be used to sign. The PDF isn’t attached to the email.', // {title} = send.protect_title, in bold
  'protect_title': 'Ask them to confirm their email address before it opens',
  'storage_note': 'The PDF is stored so they can open it, and the link works for 30 days. Who signed, when, and fingerprints of the original and the signed copy go on a public certificate page. You can withdraw it from the list below at any time.',

  'btn_sending': 'Sending…',
  'btn_enter_email': 'Enter the signer’s email',
  'btn_send': 'Send for signing',
  'drop_hint': 'Drop the PDF to be signed into the circle above.',

  'result_sent': '✓ Sent to {email}',
  'result_draft': 'Your email app has a message to {email} ready to send.',
  'result_failed': 'The request is ready, but the email to {email} didn’t go. {note} Copy the link and send it yourself.', // {note} = the reason, may be empty
  'link_aria': 'Signing link',
  'copied': 'Copied ✓',
  'copy_link': 'Copy link',
  'cert_page_link': 'Its certificate page',

  // ── Sender: the list of requests already sent ──────────────────────────────
  'list_load_error': 'Couldn’t load what you’ve sent for signing.',
  'list_title': 'Sent for signing',
  'list_loading': 'Loading…',
  'list_empty': 'Nothing sent yet.',
  'status_signed': 'Signed', // status chip; keep short
  'status_expired': 'Expired', // status chip; keep short
  'status_waiting': 'Waiting', // status chip: not signed yet; keep short
  'withdraw_confirm': 'Withdraw it? The link stops working and the stored copies are deleted.',
  'withdrawing': 'Withdrawing…',
  'withdraw': 'Withdraw', // cancel a request that hasn't been signed yet
  'keep_it': 'Keep it',
  'certificate': 'Certificate',

  // ── Signer: opening the link ───────────────────────────────────────────────
  'req_invalid_token': 'This signing link isn’t valid. Check you have the whole link from the email.',
  'req_expired': 'This signing link has expired. Ask the sender to send the document again.',
  'req_deleted': 'The sender has withdrawn this document.',
  'req_completed': 'This document has already been signed.',
  'req_already_signed': 'You’ve already signed this document.',
  'req_network': 'Couldn’t reach the signing service. Check your connection and try again.',
  'req_verification_expired': 'Your confirmation has expired. Confirm your email address again.',
  'req_generic': 'Something went wrong opening this document.',
  'req_open_failed': 'Couldn’t open the document.',
  'req_opening_link': 'Opening the signing link…',
  'req_opening_doc': 'Opening the document…',
  'req_try_again': 'Try again',
  'req_done_before': '✓ This document has already been signed. There’s nothing more to do here.',

  // ── Signer: confirm their email address first ──────────────────────────────
  'gate_title': 'Confirm it’s you',
  'gate_intro': 'The sender asked for this document to open only for the person it was sent to. Enter that email address and we’ll send it a code.',
  'gate_intro_masked': 'The sender asked for this document to open only for the person it was sent to ({email}). Enter that email address and we’ll send it a code.', // {email} = partly hidden address, e.g. j***@example.com
  'gate_email_label': 'Your email address',
  'gate_email_placeholder': 'name@example.com',
  'gate_sending': 'Sending…',
  'gate_send_code': 'Email me a code',
  'gate_code_sent': 'We’ve emailed a 6-digit code to {email}.',
  'gate_code_label': 'The code from the email',
  'gate_checking': 'Checking…',
  'gate_open': 'Open the document',
  'gate_send_another': 'Send another code',
  'gate_err_mismatch': 'That isn’t the address this document was sent to.',
  'gate_err_too_soon_one': 'Please wait {count} second before asking for another code.',
  'gate_err_too_soon_other': 'Please wait {count} seconds before asking for another code.',
  'gate_err_too_many_sends': 'Too many codes have been sent for this link. Ask the sender to send it again.',
  'gate_err_send': 'Couldn’t send a code.',
  'gate_err_tries_left_one': 'That code doesn’t match. {count} try left.',
  'gate_err_tries_left_other': 'That code doesn’t match. {count} tries left.',
  'gate_err_no_match': 'That code doesn’t match. Ask for a new one.',
  'gate_err_code_expired': 'That code has expired. Ask for a new one.',
  'gate_err_too_many_attempts': 'Too many wrong tries. Ask for a new code.',
  'gate_err_check': 'Couldn’t check that code.',

  // ── Signer: read and sign ──────────────────────────────────────────────────
  'doc_title': 'Sign {name}', // {name} = the document's file name
  'doc_intro': 'You’ve been asked to sign this document. Read it, then add your signature below — it goes on {link}.', // {link} = send.doc_intro_link, a button that scrolls to the spot
  'doc_intro_link': 'page {page}, where it’s marked',
  'doc_download': 'Download it to read in your own PDF viewer',
  'doc_aria': 'The document',
  'doc_page_alt': 'Page {n} of {total}',
  'doc_stamp_alt': 'Your signature, where it will go',
  'doc_showing_first': 'Showing the first {shown} of {total} pages. Download it to read the rest.',
  'doc_field_page': 'Your signature goes on page {page}.',
  'doc_your_signature': 'Your signature',
  'mode_draw': 'Draw', // tab: draw a signature
  'mode_type': 'Type', // tab: type a signature
  'mode_phone': 'Sign on phone', // tab
  'doc_agree': 'I’ve read this document, and I’m signing it with the signature above.',
  'doc_err_sign': 'Couldn’t sign the document.',
  'doc_btn_signing': 'Signing…',
  'doc_btn_add_first': 'Add your signature first',
  'doc_btn_tick': 'Tick the box to sign',
  'doc_btn_sign': 'Sign and send back',
  'doc_privacy': 'The signed copy goes back to the sender and downloads to you. Its certificate records your email address, when you signed and a fingerprint of the signed copy. Your IP address and browser are logged with it; the public certificate shows only the country.',

  // ── Signer: done ───────────────────────────────────────────────────────────
  'signed_title': '✓ Signed and sent back',
  'signed_completed': 'The sender has been told, and your signed copy has downloaded.',
  'signed_partial': 'Your signed copy has downloaded.',
  'signed_open_cert': 'Open the certificate →',
}
