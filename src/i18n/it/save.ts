import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Salva la tua firma',

  // ── Shared ───────────────────────────────────────────────────────────────────
  'create_first': 'Prima crea una firma',
  'create_first_error': 'Prima crea una firma.',
  'typed_signature': 'Firma scritta',
  'drawn_signature': 'Firma disegnata',
  'style_type': 'scritta',
  'style_draw': 'disegnata',
  'remove': 'Rimuovi',
  'removing': 'Rimozione…',
  'saving': 'Salvataggio…',

  // ── Save on this device ─────────────────────────────────────────────────────
  'local_title': 'Salva su questo dispositivo',
  'local_no_account': 'Senza account',
  'local_intro': 'Conserva la tua firma in questo browser e riusala in seguito: gratis, senza accesso. Non viene caricato nulla. Se cancelli i dati di questo browser, viene eliminata, quindi salvala in un file se vuoi una copia.',
  'local_name_placeholder': 'Dai un nome a questa firma (facoltativo)',
  'local_saved': '✓ Salvata su questo dispositivo',
  'local_save': 'Salva su questo dispositivo',
  'local_saved_alt': 'Firma salvata',
  'local_rename_placeholder': 'Nome della firma',
  'local_rename': 'Rinomina',
  'local_in_use': 'In uso ✓',
  'local_use': 'Usa',
  'local_remove_aria': 'Rimuovi firma salvata',

  // ── Save to a file / Open a file (moves saved signatures between devices) ───
  'file_title': 'Usale su un altro dispositivo',
  'file_intro': 'Salva le tue firme in un file, poi apri quel file qui in un altro browser o su un altro dispositivo. Non viene caricato nulla.',
  'file_password_label': 'Password del file (facoltativa)',
  'file_password_hint': 'Con una password, il file si apre solo con quella. Una password dimenticata non si può recuperare. Usa la stessa casella per aprire un file che ne ha una.',
  'file_save': 'Salva in un file',
  'file_nothing_to_save': 'Ancora nulla di salvato qui',
  'file_open': 'Apri un file',
  'file_opening': 'Apertura…',
  'file_try_again': 'Aprilo',
  'file_saved': '{name} salvato.',
  'file_error_save': 'Impossibile salvare il file.',
  'file_added_one': 'Aggiunta {count} firma dal file.',
  'file_added_other': 'Aggiunte {count} firme dal file.',
  'file_already_here': 'Tutte le firme di questo file sono già qui.',
  'file_none_usable': 'Questo file non contiene firme utilizzabili.',
  'file_not_fit_one': '{count} non è entrata: questo browser ne conserva fino a {max}. Rimuovine una e apri di nuovo il file.',
  'file_not_fit_other': '{count} non sono entrate: questo browser ne conserva fino a {max}. Rimuovine alcune e apri di nuovo il file.',
  'file_skipped_one': '{count} non si poteva usare ed è stata esclusa.',
  'file_skipped_other': '{count} non si potevano usare e sono state escluse.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_record': 'Accedi con il tuo Universal ID per creare una registrazione verificabile.',
  'error_no_company_record': 'Configura un’azienda nel tuo Universal ID (è gratis) su app.unisim.co.uk per creare una registrazione verificabile.',
}

export default save
