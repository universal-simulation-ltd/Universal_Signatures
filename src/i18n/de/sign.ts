import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'PDF unterschreiben',
  'mode_group_label': 'Wer unterschreibt',
  'mode_self': 'Selbst unterschreiben',
  'mode_send': 'Zum Unterschreiben senden',
  'intro_self': 'Füge einem Dokument deine Unterschrift hinzu – es wird in deinem Browser verarbeitet und nie hochgeladen.',
  'intro_send': 'Bitte jemand anderen, ein Dokument zu unterschreiben. Die Person unterschreibt ohne Konto im Browser, und ihr bekommt beide ein Zertifikat. Dafür brauchst du keine eigene Unterschrift.',

  // ── The drop circle (small round area — keep these short) ────────────────
  'drop_label': 'PDF hier ablegen oder klicken, um eins auszuwählen',
  'drop_label_another': 'Weiteres PDF hier ablegen oder klicken, um eins auszuwählen',
  'drop_pages_one': '{count} Seite',
  'drop_pages_other': '{count} Seiten',
  'change_pdf': 'PDF ändern',
  'drop_over': 'Zum Öffnen ablegen',
  'drop_here': 'PDF hier ablegen',
  'drop_stays_local': 'es bleibt auf deinem Gerät',
  'drop_uploaded_on_send': 'erst beim Senden hochgeladen',
  'drop_browse': 'oder zum Durchsuchen klicken',
  'drop_browse_tap': 'oder zum Durchsuchen tippen',
  'signature_first': 'Erstellen Sie zuerst Ihre Unterschrift, dann fügen Sie das PDF hinzu.',
  'drop_anywhere_title': 'Irgendwo ablegen',
  'drop_anywhere_hint': 'Ein PDF – es wird in diesem Browser unterschrieben und nie hochgeladen',

  // ── Errors ───────────────────────────────────────────────────────────────
  'error_not_pdf': '{name} ist kein PDF.',
  'error_encrypted': '{name} ist passwortgeschützt und kann deshalb hier nicht unterschrieben werden. Entferne zuerst das Passwort und versuche es dann erneut.',
  'error_unreadable': '{name} konnte nicht gelesen werden. Die Datei ist vielleicht beschädigt oder gar kein PDF.',
  'error_no_email': 'Zu deiner Universal ID ist keine E-Mail-Adresse hinterlegt, daher kann kein überprüfbarer Eintrag erstellt werden.',
  'error_record': 'Der überprüfbare Eintrag konnte nicht erstellt werden.',
  'error_sign': 'Das PDF konnte nicht unterschrieben werden.',

  // ── Page, size and position ──────────────────────────────────────────────
  'layout_label': 'Wie unterschreiben',
  'layout_once': 'Einmal unterschreiben',
  'layout_every': 'Jede Seite unterschreiben',
  'layout_initial_once': 'Alle Seiten mit Initialen, einmal unterschreiben',
  'layout_initial_every': 'Alle Seiten mit Initialen und Unterschrift',
  'viewer_page': 'Seite {n} von {total}',
  'viewer_sig_label': 'Ihre Unterschrift: ziehen oder mit den Pfeiltasten verschieben; + und − ändern die Größe',
  'viewer_prev': 'Vorherige Seite',
  'viewer_next': 'Nächste Seite',
  'viewer_hint': 'Blättern Sie durch die Seiten und tippen Sie dorthin, wo Ihre Unterschrift hingehört. Danach ziehen Sie sie zum Verschieben, oder tippen Sie sie an und ziehen Sie an ihrer Ecke, um die Größe zu ändern.',
  'size_label': 'Größe ({pct} %)',
  'position_needs_signature': 'Erstelle eine Unterschrift, um die Platzierung in der Vorschau zu sehen.',

  // ── Options ──────────────────────────────────────────────────────────────
  'omit_extras': '{bold} – unterschreibe dieses Dokument nur mit der Unterschrift, ohne das, was du unter „Erstelle deine Unterschrift“ hinzugefügt hast.',
  'omit_extras_bold': 'Name, Datum & Uhrzeit weglassen',
  'certificate': '{bold} – hängt eine Zertifikatsseite und einen QR-Code an das PDF an und speichert einen kostenlosen, überprüfbaren Eintrag (deine E-Mail-Adresse, den Dateinamen, einen Hash des nicht unterschriebenen Originals und den Zeitpunkt). Die Seite zeigt außerdem Uhrzeit und Zeitzone deines Geräts, als Selbstauskunft gekennzeichnet. Das Dokument selbst wird nie hochgeladen.',
  'certificate_bold': 'Signaturzertifikat hinzufügen',
  'certificate_sign_in': '{link}, um überprüfbare Einträge zu aktivieren.',
  'certificate_sign_in_link': 'Melde dich mit einer kostenlosen Universal ID an',

  // ── Signing ──────────────────────────────────────────────────────────────
  'signing': 'Wird unterschrieben…',
  'button_needs_signature': 'Erstelle zuerst eine Unterschrift',
  'button_needs_initials': 'Füge zuerst deine Initialen hinzu',
  'button_sign': 'Unterschreiben & PDF herunterladen',
  'button_sign_embedded': 'Unterschreiben',
  'signed_as': '✓ Unterschrieben – heruntergeladen als {name}',
  'record_created': '✓ Überprüfbarer Eintrag erstellt',
  'record_qr_links_here': 'Das unterschriebene PDF trägt einen QR-Code, der hierher verlinkt:',
  'record_copy': 'Kopieren',
  'record_copy_hash': 'Auch der Fingerabdruck der unterschriebenen Kopie steht im Eintrag. So kann jeder, dem du sie schickst, auf dieser Seite prüfen, dass sie nicht verändert wurde.',

  // ── Position picker (dialog) ─────────────────────────────────────────────
  'picker_title': 'Position der Unterschrift wählen',
  'picker_hint': 'Klicke auf die Seite, um deine Unterschrift zu platzieren, und ziehe sie dann zum Verschieben, oder verwende die Pfeiltasten.',
  'picker_close': 'Schließen',
  'picker_error': 'Diese Seite konnte nicht dargestellt werden.',
  'picker_rendering': 'Seite wird dargestellt…',
  'picker_surface_label': 'Seitenvorschau. Verschiebe die Unterschrift mit den Pfeiltasten; halte die Umschalttaste gedrückt, um sie weiter zu verschieben.',
  'picker_page_alt': 'PDF-Seite',
  'picker_sig_alt': 'Vorschau der Unterschrift',
  'picker_initials_alt': 'Vorschau der Initialen',
  'picker_live': 'Mitte der Unterschrift bei {x} % von links, {y} % von oben.',
  'picker_cancel': 'Abbrechen',
  'picker_confirm': 'Diese Position verwenden',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Zum Prüfen scannen · Universal Signatures',
  'attest_heading': 'Unterschrift vom Handy gesendet',
  'attest_line': 'Unterschrieben von {email} über die Universal ID · {time}',
}

export default sign
