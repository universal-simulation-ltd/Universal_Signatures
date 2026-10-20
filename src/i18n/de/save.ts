import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Unterschrift speichern',

  // ── Shared ───────────────────────────────────────────────────────────────────
  'create_first': 'Erstelle zuerst eine Unterschrift',
  'create_first_error': 'Erstelle zuerst eine Unterschrift.',
  'typed_signature': 'Getippte Unterschrift',
  'drawn_signature': 'Gezeichnete Unterschrift',
  'style_type': 'getippt',
  'style_draw': 'gezeichnet',
  'remove': 'Entfernen',
  'removing': 'Wird entfernt…',
  'saving': 'Wird gespeichert…',

  // ── Save on this device ─────────────────────────────────────────────────────
  'local_title': 'Auf diesem Gerät speichern',
  'local_no_account': 'Kein Konto',
  'local_intro': 'Bewahre deine Unterschrift in diesem Browser auf und verwende sie später wieder – kostenlos, ohne Anmeldung. Es wird nichts hochgeladen. Wenn du die Browserdaten löschst, ist sie weg – speichere sie also in einer Datei, wenn du eine Kopie möchtest.',
  'local_name_placeholder': 'Name der Unterschrift (optional)',
  'local_saved': '✓ Auf diesem Gerät gespeichert',
  'local_save': 'Auf diesem Gerät speichern',
  'local_saved_alt': 'Gespeicherte Unterschrift',
  'local_rename_placeholder': 'Name der Unterschrift',
  'local_rename': 'Umbenennen',
  'local_in_use': 'Wird verwendet ✓',
  'local_use': 'Verwenden',
  'local_remove_aria': 'Gespeicherte Unterschrift entfernen',

  // ── Save to a file / Open a file (moves saved signatures between devices) ───
  'file_title': 'Auf einem anderen Gerät verwenden',
  'file_intro': 'Speichere deine Unterschriften in einer Datei und öffne diese Datei dann hier in einem anderen Browser oder auf einem anderen Gerät. Es wird nichts hochgeladen.',
  'file_password_label': 'Passwort für die Datei (optional)',
  'file_password_hint': 'Mit einem Passwort lässt sich die Datei nur damit öffnen. Ein vergessenes Passwort kann nicht wiederhergestellt werden. Nutze dasselbe Feld, um eine Datei mit Passwort zu öffnen.',
  'file_save': 'In einer Datei speichern',
  'file_nothing_to_save': 'Hier ist noch nichts gespeichert',
  'file_open': 'Datei öffnen',
  'file_opening': 'Wird geöffnet…',
  'file_try_again': 'Öffnen',
  'file_saved': '{name} gespeichert.',
  'file_error_save': 'Die Datei konnte nicht gespeichert werden.',
  'file_added_one': '{count} Unterschrift aus der Datei hinzugefügt.',
  'file_added_other': '{count} Unterschriften aus der Datei hinzugefügt.',
  'file_already_here': 'Alle Unterschriften in dieser Datei sind schon hier.',
  'file_none_usable': 'Diese Datei enthält keine verwendbaren Unterschriften.',
  'file_not_fit_one': '{count} passte nicht mehr: Dieser Browser speichert bis zu {max}. Entferne eine und öffne die Datei erneut.',
  'file_not_fit_other': '{count} passten nicht mehr: Dieser Browser speichert bis zu {max}. Entferne einige und öffne die Datei erneut.',
  'file_skipped_one': '{count} konnte nicht verwendet werden und wurde ausgelassen.',
  'file_skipped_other': '{count} konnten nicht verwendet werden und wurden ausgelassen.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_record': 'Melde dich mit deiner Universal ID an, um einen überprüfbaren Eintrag zu erstellen.',
  'error_no_company_record': 'Richte unter app.unisim.co.uk in deiner Universal ID ein Unternehmen ein (kostenlos), um einen überprüfbaren Eintrag zu erstellen.',
}

export default save
