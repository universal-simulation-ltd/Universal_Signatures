// verify
// English is the source of truth: add a key here first, then to every other language.
export default {
  // The certificate page (opened from the QR on a signed PDF)
  'title': 'Signature certificate',
  'certificate_id': 'Certificate {id}', // {id} is the certificate's code
  'verifying': 'Verifying…',
  'verified_signing': 'Verified — this document was signed via Universal Signatures',
  'verified_signature': 'Verified — this is a genuine saved signature',
  'verified_request': 'Verified — this document was signed by everyone it was sent to',
  'request_waiting': 'Sent, and still waiting to be signed',
  'lookup_failed': 'Couldn’t reach the verification service, so this certificate hasn’t been checked yet. Check your connection and try again.',
  'try_again': 'Try again',
  'not_found': '✗ No record found for this certificate. The link may be wrong, or the record was removed.',
  'back_home': '← Universal Signatures', // link back to the app's start page

  // Row labels (label on the left, value on the right)
  'row_signed_by': 'Signed by',
  'row_waiting_for': 'Waiting for', // a person who hasn't signed yet; value is their email
  'row_organisation': 'Organisation',
  'row_document': 'Document',
  'row_signed': 'Signed', // value is a date and time
  'row_saved': 'Saved', // value is a date and time
  'row_sent': 'Sent', // value is a date and time
  'row_signer': 'Signer',
  'row_original_hash': 'Original document hash (SHA-256)',
  'row_signed_hash': 'Signed copy hash (SHA-256)',
  'row_sent_hash': 'Document as sent (SHA-256)',
  'row_signature_hash': 'Signature hash (SHA-256)',

  'hash_note_both': 'The first hash fingerprints the {original} document, before it was signed; the second, the {signed} exactly as it was produced.', // {original} = bold "original", {signed} = bold "signed copy"
  'hash_note_original_only': 'The hash above fingerprints the {original} document, before the signature was added.', // {original} = bold "original"
  'hash_note_original': 'original', // shown in bold inside the hash notes
  'hash_note_signed': 'signed copy', // shown in bold inside the hash notes

  // "Is this the document that was signed?" — checking a PDF against the record
  'check_intro_both': 'Have the signed copy, or the original? Check it against this record — it’s fingerprinted in your browser and never uploaded.',
  'check_intro_original': 'Have the original PDF? Check it against this record — it’s fingerprinted in your browser and never uploaded.',
  'check_busy': 'Checking…',
  'check_button': 'Check a PDF',
  'check_match_signed': '✓ {name} is the signed copy, byte for byte, exactly as it was produced. Nothing in it has changed since.', // {name} is the file name
  'check_match_original': '✓ {name} is the original document this record was made for, as it was before it was signed.', // {name} is the file name
  'check_no_match_both': '✗ {name} is neither the signed copy nor the original. If it’s meant to be the signed copy, it has been changed since it was signed — even re-saving or printing it to PDF counts.', // {name} is the file name
  'check_no_match_original': '✗ {name} doesn’t match this record. A signed copy won’t match either — the record fingerprints the original before the signature went on — so check the unsigned original.', // {name} is the file name
  'check_read_error': 'Couldn’t read that file.',

  // A document sent to be signed: activity log and download
  'activity': 'Activity', // heading over the list of events
  'action_opened': 'Opened',
  'action_verified': 'Confirmed their email address',
  'action_signature': 'Signed',
  'action_annotation': 'Added marks',
  'action_highlight': 'Highlighted',
  'action_text': 'Added text',
  'action_other': 'Made other changes',
  'action_completed': 'Completed',
  'download_busy': 'Fetching…',
  'download_button': 'Download the signed copy',
  'download_deleted': 'The stored copy has been removed.',
  'download_failed': 'Couldn’t fetch the signed copy. Try again in a moment.',

  // "Show it on a website" — the embeddable badge
  'badge_summary': 'Show it on a website',
  'badge_summary_hint': 'Embed a badge that links to this certificate.',
  'badge_format_aria': 'Badge format',
  'badge_tab_live': 'Live badge',
  'badge_tab_image': 'Image + link',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Checks this certificate each time the page is viewed and only then shows “✓ Signed and verified”. Needs a page that allows scripts.',
  'badge_desc_image': 'For email and sites that don’t allow scripts. The picture can’t check anything itself, so it says “click to verify” — the check happens on this page.',
  'badge_desc_markdown': 'For a README or anywhere else that takes Markdown. A fixed picture, like the image version.',
  'badge_preview_aria': 'Preview',
  'badge_link_text': 'Verify this signature', // link text, also pasted into other people's web pages
  'badge_image_alt': 'Signed with Universal Signatures — click to verify', // alt text of the badge picture, also pasted into other people's pages
  'badge_paste_label': 'Paste this into your page',
  'badge_copy': 'Copy',
  'badge_copied': 'Copied ✓',
}
