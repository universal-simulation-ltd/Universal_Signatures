import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'Firma un PDF',
  'mode_group_label': 'Chi firma',
  'mode_self': 'Lo firmo io',
  'mode_send': 'Invia per la firma',
  'intro_self': 'Aggiungi la tua firma a un documento: viene elaborato nel tuo browser e non viene mai caricato.',
  'intro_send': 'Chiedi a qualcun altro di firmare un documento. Firmerà nel proprio browser, senza account, e riceverete entrambi un certificato. Per questo non ti serve una tua firma.',

  // ── The drop circle (small round area — keep these short) ────────────────
  'drop_label': 'Trascina qui un PDF o fai clic per sceglierne uno',
  'drop_label_another': 'Trascina qui un altro PDF o fai clic per sceglierne uno',
  'drop_pages_one': '{count} pagina',
  'drop_pages_other': '{count} pagine',
  'change_pdf': 'Cambia PDF',
  'drop_over': 'Rilascia per aprire',
  'drop_here': 'Trascina qui un PDF',
  'drop_stays_local': 'resta sul tuo dispositivo',
  'drop_uploaded_on_send': 'caricato solo quando lo invii',
  'drop_browse': 'o fai clic per sfogliare',
  'drop_browse_tap': 'o tocca per sfogliare',
  'signature_first': 'Crea prima la tua firma, poi aggiungi il PDF.',
  'drop_anywhere_title': 'Rilascialo ovunque',
  'drop_anywhere_hint': 'Un PDF: viene firmato in questo browser e non viene mai caricato',

  // ── Errors ───────────────────────────────────────────────────────────────
  'error_not_pdf': '{name} non è un PDF.',
  'error_encrypted': '{name} è protetto da password, quindi non può essere firmato qui. Rimuovi prima la password, poi riprova.',
  'error_unreadable': 'Impossibile leggere {name}. Potrebbe essere danneggiato o non essere davvero un PDF.',
  'error_no_email': 'Il tuo Universal ID non ha un indirizzo email registrato, quindi non è possibile creare una registrazione verificabile.',
  'error_record': 'Impossibile creare la registrazione verificabile.',
  'error_sign': 'Impossibile firmare il PDF.',

  // ── Page, size and position ──────────────────────────────────────────────
  'layout_label': 'Come firmare',
  'layout_once': 'Firma una volta',
  'layout_once_hint': 'La tua firma su una pagina',
  'layout_every': 'Firma ogni pagina',
  'layout_every_hint': 'La tua firma nello stesso punto di ogni pagina',
  'layout_initial_once': 'Iniziali su tutte, firma una volta',
  'layout_initial_once_hint': 'Le tue iniziali su ogni pagina, la firma sull’ultima',
  'layout_initial_every': 'Iniziali e firma su tutte',
  'layout_initial_every_hint': 'Le tue iniziali e la tua firma su ogni pagina',
  'page_label': 'Pagina',
  'page_option': 'Pagina {n}',
  'page_option_last': 'Pagina {n} (ultima)',
  'size_label': 'Dimensione ({pct}%)',
  'position_label': 'Posizione',
  'position_label_initials': 'Posizione della firma (ultima pagina)',
  'position_label_every': 'Posizione della firma (ogni pagina)',
  'position_needs_signature': 'Crea una firma per vedere l’anteprima della posizione.',
  'placer_hint': 'Trascina la firma dove deve andare, oppure tocca la pagina per spostarla lì.',
  'position_reset': 'Torna nell’angolo',

  // ── Options ──────────────────────────────────────────────────────────────
  'omit_extras': '{bold}: firma questo documento solo con la firma, senza ciò che hai aggiunto in «Crea la tua firma».',
  'omit_extras_bold': 'Ometti nome, data e ora',
  'certificate': '{bold}: aggiunge al PDF una pagina di certificato e un codice QR, e salva una registrazione verificabile gratuita (la tua email, il nome del file, un hash dell’originale non firmato e l’ora). La pagina mostra anche l’orologio e il fuso orario del tuo dispositivo, indicati come autodichiarati. Il documento stesso non viene mai caricato.',
  'certificate_bold': 'Aggiungi un certificato di firma',
  'certificate_sign_in': '{link} per attivare le registrazioni verificabili.',
  'certificate_sign_in_link': 'Accedi con un Universal ID gratuito',

  // ── Signing ──────────────────────────────────────────────────────────────
  'signing': 'Firma in corso…',
  'button_needs_signature': 'Prima crea una firma',
  'button_needs_initials': 'Prima aggiungi le iniziali',
  'button_sign': 'Firma e scarica il PDF',
  'button_sign_embedded': 'Firma',
  'signed_as': '✓ Firmato: scaricato come {name}',
  'record_created': '✓ Registrazione verificabile creata',
  'record_qr_links_here': 'Il PDF firmato contiene un codice QR che rimanda qui:',
  'record_copy': 'Copia',
  'record_copy_hash': 'Anche l’impronta della copia firmata è nella registrazione, così chiunque la riceva può verificare su quella pagina che non sia stata modificata.',

  // ── Position picker (dialog) ─────────────────────────────────────────────
  'picker_title': 'Scegli la posizione della firma',
  'picker_hint': 'Fai clic o trascina sulla pagina per posizionare la firma, oppure usa i tasti freccia.',
  'picker_close': 'Chiudi',
  'picker_error': 'Impossibile visualizzare questa pagina.',
  'picker_rendering': 'Visualizzazione della pagina…',
  'picker_surface_label': 'Anteprima della pagina. Usa i tasti freccia per spostare la firma; tieni premuto Maiusc per spostarla di più.',
  'picker_page_alt': 'Pagina del PDF',
  'picker_sig_alt': 'Anteprima della firma',
  'picker_live': 'Centro della firma al {x}% in orizzontale e al {y}% in verticale nella pagina.',
  'picker_cancel': 'Annulla',
  'picker_confirm': 'Usa questa posizione',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Scansiona per verificare · Universal Signatures',
  'attest_heading': 'Firma inviata da un telefono',
  'attest_line': 'Firmato da {email} tramite Universal ID · {time}',
}

export default sign
