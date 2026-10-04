import type { Messages } from '../en'

const verify: Messages['verify'] = {
  // The certificate page (opened from the QR on a signed PDF)
  'title': 'Signaturzertifikat',
  'certificate_id': 'Zertifikat {id}',
  'verifying': 'Wird verifiziert…',
  'verified_signing': 'Verifiziert – dieses Dokument wurde mit Universal Signatures unterschrieben',
  'verified_signature': 'Verifiziert – dies ist eine echte gespeicherte Unterschrift',
  'verified_request': 'Verifiziert – dieses Dokument wurde von allen unterschrieben, an die es gesendet wurde',
  'request_waiting': 'Gesendet, wartet noch auf die Unterschrift',
  'lookup_failed': 'Der Verifizierungsdienst ist nicht erreichbar, daher wurde dieses Zertifikat noch nicht geprüft. Prüfe deine Verbindung und versuche es erneut.',
  'try_again': 'Erneut versuchen',
  'not_found': '✗ Zu diesem Zertifikat wurde kein Eintrag gefunden. Der Link ist vielleicht falsch, oder der Eintrag wurde entfernt.',
  'back_home': '← Universal Signatures',

  // Row labels (label on the left, value on the right)
  'row_signed_by': 'Unterschrieben von',
  'row_waiting_for': 'Ausstehend bei',
  'row_organisation': 'Organisation',
  'row_document': 'Dokument',
  'row_signed': 'Unterschrieben',
  'row_saved': 'Gespeichert',
  'row_sent': 'Gesendet',
  'row_signer': 'Unterschreibende Person',
  'row_original_hash': 'Hash des Originaldokuments (SHA-256)',
  'row_signed_hash': 'Hash der unterschriebenen Kopie (SHA-256)',
  'row_sent_hash': 'Dokument wie gesendet (SHA-256)',
  'row_signature_hash': 'Hash der Unterschrift (SHA-256)',

  'hash_note_both': 'Der erste Hash ist der Fingerabdruck des {original} Dokuments vor dem Unterschreiben, der zweite der {signed}, genau wie sie erstellt wurde.',
  'hash_note_original_only': 'Der Hash oben ist der Fingerabdruck des {original} Dokuments, bevor die Unterschrift hinzugefügt wurde.',
  'hash_note_original': 'ursprünglichen',
  'hash_note_signed': 'unterschriebenen Kopie',

  // "Is this the document that was signed?" — checking a PDF against the record
  'check_intro_both': 'Hast du die unterschriebene Kopie oder das Original? Prüfe es mit diesem Eintrag – der Fingerabdruck wird in deinem Browser berechnet, nichts wird hochgeladen.',
  'check_intro_original': 'Hast du das Original-PDF? Prüfe es mit diesem Eintrag – der Fingerabdruck wird in deinem Browser berechnet, nichts wird hochgeladen.',
  'check_busy': 'Wird geprüft…',
  'check_button': 'PDF prüfen',
  'check_match_signed': '✓ {name} ist die unterschriebene Kopie, Byte für Byte genau so, wie sie erstellt wurde. Seitdem wurde nichts daran verändert.',
  'check_match_original': '✓ {name} ist das Originaldokument, für das dieser Eintrag erstellt wurde, so wie es vor dem Unterschreiben war.',
  'check_no_match_both': '✗ {name} ist weder die unterschriebene Kopie noch das Original. Wenn es die unterschriebene Kopie sein soll, wurde sie seit dem Unterschreiben verändert – schon erneutes Speichern oder Drucken als PDF zählt dazu.',
  'check_no_match_original': '✗ {name} passt nicht zu diesem Eintrag. Auch eine unterschriebene Kopie passt nicht – der Eintrag enthält den Fingerabdruck des Originals, bevor die Unterschrift hinzukam –, prüfe also das nicht unterschriebene Original.',
  'check_read_error': 'Diese Datei konnte nicht gelesen werden.',

  // A document sent to be signed: activity log and download
  'activity': 'Aktivität',
  'action_opened': 'Geöffnet',
  'action_verified': 'E-Mail-Adresse bestätigt',
  'action_signature': 'Unterschrieben',
  'action_annotation': 'Markierungen hinzugefügt',
  'action_highlight': 'Hervorgehoben',
  'action_text': 'Text hinzugefügt',
  'action_other': 'Andere Änderungen vorgenommen',
  'action_completed': 'Abgeschlossen',
  'download_busy': 'Wird abgerufen…',
  'download_button': 'Unterschriebene Kopie herunterladen',
  'download_deleted': 'Die gespeicherte Kopie wurde entfernt.',
  'download_failed': 'Die unterschriebene Kopie konnte nicht abgerufen werden. Versuche es gleich noch einmal.',

  // "Show it on a website" — the embeddable badge
  'badge_summary': 'Auf einer Website zeigen',
  'badge_summary_hint': 'Bette ein Abzeichen ein, das auf dieses Zertifikat verlinkt.',
  'badge_format_aria': 'Format des Abzeichens',
  'badge_tab_live': 'Live-Abzeichen',
  'badge_tab_image': 'Bild + Link',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Prüft dieses Zertifikat bei jedem Seitenaufruf und zeigt erst dann „✓ Unterschrieben und verifiziert“. Braucht eine Seite, die Skripte erlaubt.',
  'badge_desc_image': 'Für E-Mails und Websites, die keine Skripte erlauben. Das Bild kann selbst nichts prüfen, deshalb steht darauf „zum Prüfen klicken“ – die Prüfung findet auf dieser Seite statt.',
  'badge_desc_markdown': 'Für eine README oder alles andere, was Markdown akzeptiert. Ein festes Bild, wie die Bildversion.',
  'badge_preview_aria': 'Vorschau',
  'badge_link_text': 'Diese Unterschrift verifizieren',
  'badge_image_alt': 'Unterschrieben mit Universal Signatures – zum Prüfen klicken',
  'badge_paste_label': 'Füge dies in deine Seite ein',
  'badge_copy': 'Kopieren',
  'badge_copied': 'Kopiert ✓',
}

export default verify
