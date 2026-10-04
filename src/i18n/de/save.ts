import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Unterschrift speichern',
  'tabs_local': 'Lokal (vorübergehend)',
  'tabs_online': 'Online',

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
  'local_intro': 'Bewahre deine Unterschrift in diesem Browser auf und verwende sie später wieder – kostenlos, ohne Anmeldung. Sie bleibt auf diesem Gerät und verlässt es nie.',
  'local_name_placeholder': 'Name der Unterschrift (optional)',
  'local_saved': '✓ Auf diesem Gerät gespeichert',
  'local_save': 'Auf diesem Gerät speichern',
  'local_saved_alt': 'Gespeicherte Unterschrift',
  'local_rename_placeholder': 'Name der Unterschrift',
  'local_rename': 'Umbenennen',
  'local_in_use': 'Wird verwendet ✓',
  'local_use': 'Verwenden',
  'local_remove_aria': 'Gespeicherte Unterschrift entfernen',

  // ── Save a verified signature to the cloud ──────────────────────────────────
  'cloud_title': 'Verifizierte Unterschrift in der Cloud speichern',
  'cloud_intro': 'Speichere deine Unterschrift mit einem manipulationserkennbaren Zertifikat in deiner Universal ID, damit du sie überall wiederverwenden und überprüfen kannst.',
  'cloud_checking': 'Dein Konto wird geprüft…',
  'cloud_signed_out': 'Erstelle eine {id}, um deine Unterschrift KOSTENLOS online zu speichern.',
  'cloud_sign_in': 'Mit Universal ID registrieren / anmelden →',
  'cloud_no_company': 'Um mehr Unterschriften mit je einem Zertifikat zu speichern, richte in deiner {id} ein Unternehmen ein (kostenlos).',
  'cloud_set_up_company': 'Unternehmen einrichten →',
  'cloud_save': 'Verifizierte Unterschrift speichern ☁',
  'cloud_via_token': 'In deiner Universal ID gespeichert – jederzeit entfernbar.',
  'cloud_via_subscription': 'Cloud-Hosting ist in deinem Abo enthalten.',
  'cloud_via_project': 'Cloud-Hosting ist in deinem aktiven Projekt enthalten.',
  'cloud_usage_one': 'Du hast {used} von {count} kostenlosen Speicherplatz für Unterschriften genutzt.',
  'cloud_usage_other': 'Du hast {used} von {count} kostenlosen Speicherplätzen für Unterschriften genutzt.',
  'cloud_saved': '✓ Gespeichert & verifiziert',
  'cloud_cert_link': 'Mit diesem Zertifikatslink kann jeder diese Unterschrift bestätigen:',
  'cloud_copy': 'Kopieren',
  'cloud_remove_any_time': 'Du kannst diese gespeicherte Unterschrift jederzeit entfernen.',
  'cloud_remove_stored': 'Gespeicherte Unterschrift entfernen',
  'cloud_blocked_remove_one': 'Du hast deinen {count} kostenlosen Speicherplatz für Unterschriften belegt. Entferne unten eine Unterschrift, um Platz zu schaffen, oder hoste deine eigene Kopie kostenlos selbst.',
  'cloud_blocked_remove_other': 'Du hast alle {count} kostenlosen Speicherplätze für Unterschriften belegt. Entferne unten eine Unterschrift, um Platz zu schaffen, oder hoste deine eigene Kopie kostenlos selbst.',
  'cloud_blocked_selfhost_one': 'Du hast deinen {count} kostenlosen Speicherplatz für Unterschriften belegt. Du kannst deine eigene Kopie kostenlos selbst hosten.',
  'cloud_blocked_selfhost_other': 'Du hast alle {count} kostenlosen Speicherplätze für Unterschriften belegt. Du kannst deine eigene Kopie kostenlos selbst hosten.',
  'cloud_blocked_no_limit': 'Du hast deinen kostenlosen Speicher für Unterschriften aufgebraucht. Du kannst deine eigene Kopie kostenlos selbst hosten.',
  'cloud_self_host': 'Kostenlos selbst hosten',
  'cloud_need_more': 'Brauchst du mehr? Sag es uns',
  'cloud_source': 'Quellcode: {link}',
  'cloud_error_save': 'Speichern fehlgeschlagen.',
  'cloud_error_store': 'Deine Unterschrift konnte nicht gespeichert werden.',
  'cloud_error_remove': 'Entfernen fehlgeschlagen.',

  // ── Your stored signatures ──────────────────────────────────────────────────
  'stored_title': 'Deine gespeicherten Unterschriften',
  'stored_loading': 'Wird geladen…',
  'stored_none': 'Noch keine online gespeichert.',
  'stored_alt': 'Gespeicherte Unterschrift',
  'stored_by_colleague': 'Von einer Kollegin oder einem Kollegen gespeichert',
  'stored_error_load': 'Deine gespeicherten Unterschriften konnten nicht geladen werden.',

  // ── Your main signature ─────────────────────────────────────────────────────
  'main_replace_confirm': 'Deine Universal ID speichert eine Hauptunterschrift. Die aktuelle ersetzen?',
  'main_replace': 'Ersetzen',
  'main_keep': 'Aktuelle behalten',
  'main_is_main': 'Das ist deine Hauptunterschrift ✓',
  'main_save': 'Als meine Hauptunterschrift speichern',
  'main_saved_note': 'In deiner Universal ID gespeichert – verwende sie hier, in Universal PDF und auf jedem Gerät.',
  'main_note': 'Eine pro Universal ID, kostenlos, mit oder ohne Unternehmen. Verwende sie hier, in Universal PDF und auf jedem Gerät.',
  'main_error_save': 'Deine Hauptunterschrift konnte nicht gespeichert werden.',
  'main_error_too_large': 'Dieses Bild der Unterschrift ist zu groß zum Speichern.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_save': 'Melde dich mit deiner Universal ID an, um zu speichern.',
  'error_storage_full': 'Du hast deinen kostenlosen Speicher für Unterschriften aufgebraucht. Entferne eine gespeicherte Unterschrift, um Platz zu schaffen.',
  'error_sign_in_to_record': 'Melde dich mit deiner Universal ID an, um einen überprüfbaren Eintrag zu erstellen.',
  'error_no_company_record': 'Richte unter app.unisim.co.uk in deiner Universal ID ein Unternehmen ein (kostenlos), um einen überprüfbaren Eintrag zu erstellen.',
}

export default save
