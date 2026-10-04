// create
// English is the source of truth: add a key here first, then to every other language.
export default {
  // Signature studio (left column, "Create your signature")
  'studio_title': 'Create your signature',
  'mode_draw': 'Draw', // tab: draw the signature by hand
  'mode_type': 'Type', // tab: type the name in a cursive font
  'mode_phone': 'Sign on phone', // tab: draw it on a phone via a QR code
  'labels_heading': 'Add name, date & time', // section heading, shown in capitals
  'labels_add_name': 'Add your name',
  'labels_name_placeholder': 'Your name',
  'labels_add_date': 'Add today\'s date {date}', // {date} is today's date in brackets, e.g. "(14 Jul 2026)"
  'labels_add_time': 'Add the time {time}', // {time} is the current time in brackets, e.g. "(14:32)"
  'labels_align': 'Align', // label before the left / centre / right buttons
  'align_left': 'Left',
  'align_center': 'Centre',
  'align_right': 'Right',
  'labels_preview': 'Preview',
  'labels_preview_alt': 'Your signature with the name, date and time stamped beneath it',
  'labels_preview_building': 'Building preview…',
  'labels_preview_empty': 'Add your signature above to see the preview.',
  'labels_note': 'Appears beneath your signature. When signing a PDF you can choose whether to include it.',
  'studio_footer': 'Everything here runs in your browser. Use your signature to sign a PDF on the right — for free, no account needed.',
  // Privacy note under the right column. Completes "… never leaves this computer, except …".
  'privacy_subject': 'Your signature',
  'privacy_except': 'saving one to the cloud, signing on your phone, or sending a document to be signed', // must keep exactly this scope: all three ways a signature can leave the device

  // Draw pad
  'pad_aria': 'Signature pad. Draw your signature with a mouse, finger or stylus. To use the keyboard instead, choose Type.', // "Type" is the tab name mode_type
  'pad_hint': 'Sign above', // faint hint under the empty pad
  'pad_rather_type': 'Rather type it?', // switches to the Type tab
  'pad_undo': 'Undo',
  'pad_clear': 'Clear',

  // Typed signature
  'type_placeholder': 'Type your name',
  'font_flowing': 'Flowing', // name of a cursive font style (keep short, it is a button)
  'font_elegant': 'Elegant', // name of a cursive font style (keep short)
  'font_fine': 'Fine', // name of a cursive font style: thin strokes (keep short)
  'font_bold': 'Bold', // name of a cursive font style: heavy strokes (keep short)
  'type_import_title': 'Import a font file',
  'type_import': 'Import font',
  'type_imported_font': 'Imported', // fallback name for an imported font whose file name is empty
  'type_import_error': 'Could not load that font. Use a .woff2, .woff, .ttf or .otf file.',
  'type_preview_empty': 'Your typed signature previews here',

  // Main signature (kept on the Universal ID)
  'main_alt': 'Your main signature',
  'main_title': 'Your main signature',
  'main_saved': 'Saved to your Universal ID',
  'main_in_use': 'In use ✓', // button state when the main signature is already loaded
  'main_use': 'Use it', // button: load the main signature

  // Sign on phone (desktop side)
  'phone_received_alt': 'Signature received from your phone',
  'phone_received': 'Signature received ✓',
  'phone_received_hint': 'Add your name, the date or the time below, then use it to sign a PDF.',
  'phone_sign_again': 'Sign again on phone',
  'phone_expired': 'This code has expired',
  'phone_codes_last_one': 'Codes last {count} minute. Get a new one, then scan it with your phone.',
  'phone_codes_last_other': 'Codes last {count} minutes. Get a new one, then scan it with your phone.',
  'phone_get_new_code': 'Get a new code',
  'phone_enlarge_aria': 'Enlarge the QR code',
  'phone_qr_label': 'signing on your phone', // read after "QR code for "
  'phone_tap_to_enlarge': 'Tap to enlarge',
  'phone_scan_then_pin': 'Scan with your phone camera, then enter this PIN:',
  'phone_expires_in': 'Code expires in {time}', // {time} is a countdown such as "9:41"
  'phone_new_code': 'New code',
  'phone_too_many_pins': 'Too many wrong PINs, so this is a new code. Scan it again.',
  'phone_waiting': 'Waiting for your phone…',
  'phone_offline_demo': 'Offline demo — connect a real session (VITE_REAL_AUTH=1) or use the deployed app to receive from your phone.', // developer-only message
  'phone_lightbox_title': 'Point your phone\'s camera at this code',
  'phone_lightbox_hint': 'Then enter this PIN on your phone:', // the PIN follows on its own line

  // Sign on phone (the phone's page)
  'mobile_invalid': 'Draw a signature and enter the 6-digit PIN shown on your computer.',
  'mobile_wrong_pin': 'That PIN doesn’t match. Check the 6 digits on your computer and send again.',
  'mobile_refused': 'Your computer couldn’t use that drawing. Clear it, draw again and send.',
  'mobile_error': 'Couldn’t reach your computer. Check your connection and try again.',
  'mobile_expired_title': 'This code has expired',
  'mobile_expired_body': 'On your computer, press “Get a new code”, then scan the new code with your phone.', // quotes the desktop button phone_get_new_code
  'mobile_sent_title': 'Signature sent',
  'mobile_sent_body': 'Go back to the page you scanned the code from — your signature is ready there.',
  'mobile_unconfirmed_body': 'Go back to the page you scanned the code from. If your signature isn’t there, check the code is still showing and scan it again.',
  'mobile_title': 'Sign on your phone',
  'mobile_intro': 'Draw your signature, enter the PIN shown on your computer, then send.',
  'mobile_pad_aria': 'Signature pad. Draw your signature with your finger or a stylus.',
  'mobile_undo': 'Undo',
  'mobile_clear': 'Clear',
  'mobile_pin': 'PIN',
  'mobile_sending': 'Sending…',
  'mobile_send': 'Send signature to my computer',

  // Initials ("initials on every page, signature on the last")
  'initials_title': 'Your initials',
  'initials_mode_type': 'Type',
  'initials_mode_draw': 'Draw',
  'initials_placeholder': 'e.g. JM', // example initials
  'initials_preview': 'Preview',
  'initials_pad_aria': 'Initials pad. Draw your initials with a mouse, finger or stylus, or choose Type.',
  'initials_undo': 'Undo',
  'initials_clear': 'Clear',
  'initials_position': 'Initials position',
  'initials_position_aria': 'Where the initials go on each page',
  'corner_top_left': 'Top left',
  'corner_top_center': 'Top centre',
  'corner_top_right': 'Top right',
  'corner_bottom_left': 'Bottom left',
  'corner_bottom_center': 'Bottom centre',
  'corner_bottom_right': 'Bottom right',
  'initials_size': 'Initials size ({pct}%)', // {pct} is a number, e.g. 8
  'initials_include_last': 'Initial the last page too, as well as signing it',
}
