import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Salva la tua firma',
  'tabs_local': 'Su questo dispositivo',
  'tabs_online': 'Online',

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
  'local_intro': 'Conserva la tua firma in questo browser e riusala in seguito: gratis, senza accesso. Resta su questo dispositivo e non lo lascia mai. Se cancelli i dati di questo browser, viene eliminata.',
  'local_name_placeholder': 'Dai un nome a questa firma (facoltativo)',
  'local_saved': '✓ Salvata su questo dispositivo',
  'local_save': 'Salva su questo dispositivo',
  'local_saved_alt': 'Firma salvata',
  'local_rename_placeholder': 'Nome della firma',
  'local_rename': 'Rinomina',
  'local_in_use': 'In uso ✓',
  'local_use': 'Usa',
  'local_remove_aria': 'Rimuovi firma salvata',

  // ── Save a verified signature to the cloud ──────────────────────────────────
  'cloud_title': 'Salva una firma verificata nel cloud',
  'cloud_intro': 'Archivia la tua firma nel tuo Universal ID con un certificato a prova di manomissione, così puoi riusarla e verificarla ovunque.',
  'cloud_checking': 'Controllo dell’account…',
  'cloud_signed_out': 'Crea un {id} per archiviare la tua firma online GRATIS.',
  'cloud_sign_in': 'Crea un Universal ID o accedi →',
  'cloud_no_company': 'Per archiviare più firme, ciascuna con un certificato, configura un’azienda nel tuo {id} (è gratis).',
  'cloud_set_up_company': 'Configura un’azienda →',
  'cloud_save': 'Salva firma verificata ☁',
  'cloud_via_token': 'Archiviata nel tuo Universal ID: puoi rimuoverla quando vuoi.',
  'cloud_via_subscription': 'Hosting cloud incluso nel tuo abbonamento.',
  'cloud_via_project': 'Hosting cloud incluso nel tuo progetto attivo.',
  'cloud_usage_one': 'Hai usato {used} su {count} firma archiviata gratuita.',
  'cloud_usage_other': 'Hai usato {used} delle tue {count} firme archiviate gratuite.',
  'cloud_saved': '✓ Salvata e verificata',
  'cloud_cert_link': 'Chiunque può confermare questa firma con il link al suo certificato:',
  'cloud_copy': 'Copia',
  'cloud_remove_any_time': 'Puoi rimuovere questa firma archiviata in qualsiasi momento.',
  'cloud_remove_stored': 'Rimuovi firma archiviata',
  'cloud_blocked_remove_one': 'Hai esaurito il limite di {count} firma archiviata gratuita. Rimuovine una qui sotto per fare spazio, oppure ospita gratis la tua copia.',
  'cloud_blocked_remove_other': 'Hai usato tutte le {count} firme archiviate gratuite. Rimuovine una qui sotto per fare spazio, oppure ospita gratis la tua copia.',
  'cloud_blocked_selfhost_one': 'Hai esaurito il limite di {count} firma archiviata gratuita. Puoi ospitare gratis la tua copia.',
  'cloud_blocked_selfhost_other': 'Hai usato tutte le {count} firme archiviate gratuite. Puoi ospitare gratis la tua copia.',
  'cloud_blocked_no_limit': 'Hai esaurito lo spazio gratuito per le firme. Puoi ospitare gratis la tua copia.',
  'cloud_self_host': 'Ospitala gratis',
  'cloud_need_more': 'Ti serve di più? Scrivici',
  'cloud_source': 'Codice sorgente: {link}',
  'cloud_error_save': 'Impossibile salvare.',
  'cloud_error_store': 'Impossibile archiviare la tua firma.',
  'cloud_error_remove': 'Impossibile rimuovere.',

  // ── Your stored signatures ──────────────────────────────────────────────────
  'stored_title': 'Le tue firme archiviate',
  'stored_loading': 'Caricamento…',
  'stored_none': 'Ancora nessuna firma archiviata online.',
  'stored_alt': 'Firma archiviata',
  'stored_by_colleague': 'Salvata da un collega',
  'stored_error_load': 'Impossibile caricare le tue firme archiviate.',

  // ── Your main signature ─────────────────────────────────────────────────────
  'main_replace_confirm': 'Il tuo Universal ID conserva una sola firma principale. Vuoi sostituire quella attuale?',
  'main_replace': 'Sostituiscila',
  'main_keep': 'Mantieni quella attuale',
  'main_is_main': 'Questa è la tua firma principale ✓',
  'main_save': 'Salva come firma principale',
  'main_saved_note': 'Salvata nel tuo Universal ID: usala qui, in Universal PDF e su qualsiasi dispositivo.',
  'main_note': 'Una per Universal ID, gratis, con o senza azienda. Usala qui, in Universal PDF e su qualsiasi dispositivo.',
  'main_error_save': 'Impossibile salvare la tua firma principale.',
  'main_error_too_large': 'L’immagine della firma è troppo grande per essere archiviata.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_save': 'Accedi con il tuo Universal ID per salvare.',
  'error_storage_full': 'Hai esaurito lo spazio gratuito per le firme. Rimuovi una firma archiviata per fare spazio.',
  'error_sign_in_to_record': 'Accedi con il tuo Universal ID per creare una registrazione verificabile.',
  'error_no_company_record': 'Configura un’azienda nel tuo Universal ID (è gratis) su app.unisim.co.uk per creare una registrazione verificabile.',
}

export default save
