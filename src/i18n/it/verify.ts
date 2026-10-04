import type { Messages } from '../en'

const verify: Messages['verify'] = {
  // The certificate page (opened from the QR on a signed PDF)
  'title': 'Certificato di firma',
  'certificate_id': 'Certificato {id}',
  'verifying': 'Verifica…',
  'verified_signing': 'Verificato: questo documento è stato firmato con Universal Signatures',
  'verified_signature': 'Verificato: questa è un’autentica firma salvata',
  'verified_request': 'Verificato: questo documento è stato firmato da tutti i destinatari',
  'request_waiting': 'Inviato e ancora in attesa di firma',
  'lookup_failed': 'Impossibile raggiungere il servizio di verifica, quindi questo certificato non è ancora stato controllato. Controlla la connessione e riprova.',
  'try_again': 'Riprova',
  'not_found': '✗ Nessuna registrazione trovata per questo certificato. Il link potrebbe essere errato, oppure la registrazione è stata rimossa.',
  'back_home': '← Universal Signatures',

  // Row labels (label on the left, value on the right)
  'row_signed_by': 'Firmato da',
  'row_waiting_for': 'In attesa di',
  'row_organisation': 'Organizzazione',
  'row_document': 'Documento',
  'row_signed': 'Firmato',
  'row_saved': 'Salvato',
  'row_sent': 'Inviato',
  'row_signer': 'Firmatario',
  'row_original_hash': 'Hash del documento originale (SHA-256)',
  'row_signed_hash': 'Hash della copia firmata (SHA-256)',
  'row_sent_hash': 'Documento come inviato (SHA-256)',
  'row_signature_hash': 'Hash della firma (SHA-256)',

  'hash_note_both': 'Il primo hash è l’impronta del documento {original}, prima che fosse firmato; il secondo, della {signed} esattamente com’è stata prodotta.',
  'hash_note_original_only': 'L’hash qui sopra è l’impronta del documento {original}, prima che venisse aggiunta la firma.',
  'hash_note_original': 'originale',
  'hash_note_signed': 'copia firmata',

  // "Is this the document that was signed?" — checking a PDF against the record
  'check_intro_both': 'Hai la copia firmata o l’originale? Confrontala con questa registrazione: l’impronta viene calcolata nel tuo browser e il file non viene mai caricato.',
  'check_intro_original': 'Hai il PDF originale? Confrontalo con questa registrazione: l’impronta viene calcolata nel tuo browser e il file non viene mai caricato.',
  'check_busy': 'Verifica…',
  'check_button': 'Verifica un PDF',
  'check_match_signed': '✓ {name} è la copia firmata, byte per byte, esattamente com’è stata prodotta. Da allora non è cambiato nulla.',
  'check_match_original': '✓ {name} è il documento originale per cui è stata creata questa registrazione, com’era prima di essere firmato.',
  'check_no_match_both': '✗ {name} non è né la copia firmata né l’originale. Se dovrebbe essere la copia firmata, è stato modificato dopo la firma: conta anche salvarlo di nuovo o stamparlo in PDF.',
  'check_no_match_original': '✗ {name} non corrisponde a questa registrazione. Nemmeno una copia firmata corrisponderebbe, perché la registrazione è l’impronta dell’originale prima della firma: verifica quindi l’originale non firmato.',
  'check_read_error': 'Impossibile leggere quel file.',

  // A document sent to be signed: activity log and download
  'activity': 'Attività',
  'action_opened': 'Aperto',
  'action_verified': 'Ha confermato il proprio indirizzo email',
  'action_signature': 'Firmato',
  'action_annotation': 'Ha aggiunto annotazioni',
  'action_highlight': 'Ha evidenziato',
  'action_text': 'Ha aggiunto testo',
  'action_other': 'Ha apportato altre modifiche',
  'action_completed': 'Completato',
  'download_busy': 'Recupero…',
  'download_button': 'Scarica la copia firmata',
  'download_deleted': 'La copia archiviata è stata rimossa.',
  'download_failed': 'Impossibile recuperare la copia firmata. Riprova tra poco.',

  // "Show it on a website" — the embeddable badge
  'badge_summary': 'Mostralo su un sito web',
  'badge_summary_hint': 'Incorpora un badge che rimanda a questo certificato.',
  'badge_format_aria': 'Formato del badge',
  'badge_tab_live': 'Badge dinamico',
  'badge_tab_image': 'Immagine + link',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Controlla questo certificato ogni volta che la pagina viene visualizzata e solo allora mostra «✓ Firmato e verificato». Richiede una pagina che consenta gli script.',
  'badge_desc_image': 'Per email e siti che non consentono gli script. L’immagine non può controllare nulla da sola, quindi dice «fai clic per verificare»: il controllo avviene su questa pagina.',
  'badge_desc_markdown': 'Per un README o qualsiasi altro posto che accetti Markdown. Un’immagine fissa, come la versione immagine.',
  'badge_preview_aria': 'Anteprima',
  'badge_link_text': 'Verifica questa firma',
  'badge_image_alt': 'Firmato con Universal Signatures: fai clic per verificare',
  'badge_paste_label': 'Incolla questo nella tua pagina',
  'badge_copy': 'Copia',
  'badge_copied': 'Copiato ✓',
}

export default verify
