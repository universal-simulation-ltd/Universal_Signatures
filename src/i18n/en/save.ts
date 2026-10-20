// save
// English is the source of truth: add a key here first, then to every other language.
export default {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Save your signature', // the collapsible card's heading button

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
  'local_intro': 'Keep your signature in this browser and reuse it later — free, no sign-in. Nothing is uploaded. Clearing this browser’s data removes it, so save it to a file if you want a copy.',
  'local_name_placeholder': 'Name this signature (optional)',
  'local_saved': '✓ Saved to this device',
  'local_save': 'Save to this device',
  'local_saved_alt': 'Saved signature', // image alt text
  'local_rename_placeholder': 'Signature name',
  'local_rename': 'Rename', // tooltip on the signature's name
  'local_in_use': 'In use ✓', // badge on the signature currently loaded
  'local_use': 'Use', // button: load this saved signature
  'local_remove_aria': 'Remove saved signature',

  // ── Save to a file / Open a file (moves saved signatures between devices) ───
  'file_title': 'Use them on another device', // small heading above the file buttons
  'file_intro': 'Save your signatures to a file, then open that file here in another browser or on another device. Nothing is uploaded.',
  'file_password_label': 'Password for the file (optional)',
  'file_password_hint': 'With a password, the file opens only with it. A forgotten password can’t be recovered. Use the same box to open a file that has one.',
  'file_save': 'Save to a file',
  'file_nothing_to_save': 'Nothing saved here yet', // disabled "Save to a file" button
  'file_open': 'Open a file',
  'file_opening': 'Opening…',
  'file_try_again': 'Open it', // button shown after a file asked for its password
  'file_saved': 'Saved {name}.', // {name} = the file name
  'file_error_save': 'Could not save the file.',
  'file_added_one': 'Added {count} signature from the file.',
  'file_added_other': 'Added {count} signatures from the file.',
  'file_already_here': 'Every signature in this file is already here.',
  'file_none_usable': 'This file has no signatures that can be used.',
  'file_not_fit_one': '{count} did not fit: this browser keeps up to {max}. Remove one and open the file again.', // {max} = the most this browser keeps
  'file_not_fit_other': '{count} did not fit: this browser keeps up to {max}. Remove some and open the file again.', // {max} = the most this browser keeps
  'file_skipped_one': '{count} could not be used and was left out.',
  'file_skipped_other': '{count} could not be used and were left out.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_record': 'Sign in with your Universal ID to create a verifiable record.',
  'error_no_company_record': 'Set up a company on your Universal ID (it’s free) at app.unisim.co.uk to create a verifiable record.',
}
