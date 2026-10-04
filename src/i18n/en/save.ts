// save
// English is the source of truth: add a key here first, then to every other language.
export default {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Save your signature', // the collapsible card's heading button
  'tabs_local': 'Local (temporary)', // tab: keep it in this browser, no account
  'tabs_online': 'Online', // tab: save it to the cloud against a Universal ID

  // ── Shared ───────────────────────────────────────────────────────────────────
  'create_first': 'Create a signature first', // disabled save button before anything is drawn/typed
  'create_first_error': 'Create a signature first.', // error shown if save is pressed with nothing drawn/typed
  'typed_signature': 'Typed signature', // fallback name for a saved typed signature
  'drawn_signature': 'Drawn signature', // fallback name for a saved drawn signature
  'style_type': 'type', // small caps tag under a saved signature (shown upper-case)
  'style_draw': 'draw', // small caps tag under a saved signature (shown upper-case)
  'remove': 'Remove',
  'removing': 'Removing…',
  'saving': 'Saving…',

  // ── Save on this device ─────────────────────────────────────────────────────
  'local_title': 'Save on this device',
  'local_no_account': 'No account', // small chip beside the heading
  'local_intro': 'Keep your signature in this browser and reuse it later — free, no sign-in. It stays on this device and never leaves it.',
  'local_name_placeholder': 'Name this signature (optional)',
  'local_saved': '✓ Saved to this device',
  'local_save': 'Save to this device',
  'local_saved_alt': 'Saved signature', // image alt text
  'local_rename_placeholder': 'Signature name',
  'local_rename': 'Rename', // tooltip on the signature's name
  'local_in_use': 'In use ✓', // badge on the signature currently loaded
  'local_use': 'Use', // button: load this saved signature
  'local_remove_aria': 'Remove saved signature',

  // ── Save a verified signature to the cloud ──────────────────────────────────
  'cloud_title': 'Save a verified signature to the cloud',
  'cloud_intro': 'Store your signature against your Universal ID with a tamper-evident certificate, so you can reuse and verify it anywhere.',
  'cloud_checking': 'Checking your account…',
  'cloud_signed_out': 'Create a {id} to store your signature online for FREE.', // {id} = "Universal ID" in bold
  'cloud_sign_in': 'Create / sign in with Universal ID →',
  'cloud_no_company': 'To store more signatures, with a certificate for each, set up a company on your {id} (it’s free).', // {id} = "Universal ID" in bold
  'cloud_set_up_company': 'Set up a company →',
  'cloud_save': 'Save verified signature ☁',
  'cloud_via_token': 'Stored against your Universal ID — remove it any time.',
  'cloud_via_subscription': 'Cloud hosting included via your subscription.',
  'cloud_via_project': 'Cloud hosting included via your active project.',
  'cloud_usage_one': 'You’ve used {used} of your {count} free stored signature.', // {used} = stored so far, {count} = the free limit
  'cloud_usage_other': 'You’ve used {used} of your {count} free stored signatures.', // {used} = stored so far, {count} = the free limit
  'cloud_saved': '✓ Saved & verified',
  'cloud_cert_link': 'Anyone can confirm this signature with its certificate link:',
  'cloud_copy': 'Copy', // copies the certificate link
  'cloud_remove_any_time': 'You can remove this stored signature at any time.',
  'cloud_remove_stored': 'Remove stored signature',
  'cloud_blocked_remove_one': 'You’ve used all {count} of your free stored signature. Remove one below to make room, or self-host your own copy for free.', // {count} = the free limit
  'cloud_blocked_remove_other': 'You’ve used all {count} of your free stored signatures. Remove one below to make room, or self-host your own copy for free.', // {count} = the free limit
  'cloud_blocked_selfhost_one': 'You’ve used all {count} of your free stored signature. You can self-host your own copy for free.', // {count} = the free limit
  'cloud_blocked_selfhost_other': 'You’ve used all {count} of your free stored signatures. You can self-host your own copy for free.', // {count} = the free limit
  'cloud_blocked_no_limit': 'You’ve used your free signature storage. You can self-host your own copy for free.',
  'cloud_self_host': 'Self-host for free', // button to the self-hosting docs on GitHub
  'cloud_need_more': 'Need more? Tell us', // link to the support page
  'cloud_source': 'Source: {link}', // {link} = the GitHub repository address
  'cloud_error_save': 'Could not save.',
  'cloud_error_store': 'Could not store your signature.',
  'cloud_error_remove': 'Could not remove.',

  // ── Your stored signatures ──────────────────────────────────────────────────
  'stored_title': 'Your stored signatures',
  'stored_loading': 'Loading…',
  'stored_none': 'None stored online yet.',
  'stored_alt': 'Stored signature', // image alt text
  'stored_by_colleague': 'Saved by a colleague', // tag on a signature someone else in the company stored
  'stored_error_load': 'Could not load your stored signatures.',

  // ── Your main signature ─────────────────────────────────────────────────────
  'main_replace_confirm': 'Your Universal ID keeps one main signature. Replace the one you have now?',
  'main_replace': 'Replace it',
  'main_keep': 'Keep the current one',
  'main_is_main': 'This is your main signature ✓',
  'main_save': 'Save as my main signature',
  'main_saved_note': 'Saved to your Universal ID — use it here, in Universal PDF and on any device.',
  'main_note': 'One per Universal ID, free, with or without a company. Use it here, in Universal PDF and on any device.',
  'main_error_save': 'Could not save your main signature.',
  'main_error_too_large': 'That signature image is too large to store.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_save': 'Sign in with your Universal ID to save.',
  'error_storage_full': 'You’ve used your free signature storage. Remove a stored signature to make room.',
  'error_sign_in_to_record': 'Sign in with your Universal ID to create a verifiable record.',
  'error_no_company_record': 'Set up a company on your Universal ID (it’s free) at app.unisim.co.uk to create a verifiable record.',
}
