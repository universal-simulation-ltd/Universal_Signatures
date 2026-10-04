import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Guarda tu firma',
  'tabs_local': 'Local (temporal)',
  'tabs_online': 'En línea',

  // ── Shared ───────────────────────────────────────────────────────────────────
  'create_first': 'Crea primero una firma',
  'create_first_error': 'Crea primero una firma.',
  'typed_signature': 'Firma escrita',
  'drawn_signature': 'Firma dibujada',
  'style_type': 'escrita',
  'style_draw': 'dibujada',
  'remove': 'Quitar',
  'removing': 'Quitando…',
  'saving': 'Guardando…',

  // ── Save on this device ─────────────────────────────────────────────────────
  'local_title': 'Guardar en este dispositivo',
  'local_no_account': 'Sin cuenta',
  'local_intro': 'Conserva tu firma en este navegador y vuelve a usarla más tarde: gratis y sin iniciar sesión. Se queda en este dispositivo y nunca sale de él.',
  'local_name_placeholder': 'Ponle nombre a esta firma (opcional)',
  'local_saved': '✓ Guardada en este dispositivo',
  'local_save': 'Guardar en este dispositivo',
  'local_saved_alt': 'Firma guardada',
  'local_rename_placeholder': 'Nombre de la firma',
  'local_rename': 'Cambiar nombre',
  'local_in_use': 'En uso ✓',
  'local_use': 'Usar',
  'local_remove_aria': 'Quitar la firma guardada',

  // ── Save a verified signature to the cloud ──────────────────────────────────
  'cloud_title': 'Guardar una firma verificada en la nube',
  'cloud_intro': 'Guarda tu firma en tu Universal ID con un certificado a prueba de manipulaciones, para reutilizarla y verificarla en cualquier lugar.',
  'cloud_checking': 'Comprobando tu cuenta…',
  'cloud_signed_out': 'Crea un {id} para guardar tu firma en línea GRATIS.',
  'cloud_sign_in': 'Crear un Universal ID o iniciar sesión →',
  'cloud_no_company': 'Para guardar más firmas, cada una con su certificado, configura una empresa en tu {id} (es gratis).',
  'cloud_set_up_company': 'Configurar una empresa →',
  'cloud_save': 'Guardar firma verificada ☁',
  'cloud_via_token': 'Guardada en tu Universal ID: puedes quitarla cuando quieras.',
  'cloud_via_subscription': 'Alojamiento en la nube incluido en tu suscripción.',
  'cloud_via_project': 'Alojamiento en la nube incluido en tu proyecto activo.',
  'cloud_usage_one': 'Has usado {used} de tu límite gratuito de {count} firma guardada.',
  'cloud_usage_other': 'Has usado {used} de tu límite gratuito de {count} firmas guardadas.',
  'cloud_saved': '✓ Guardada y verificada',
  'cloud_cert_link': 'Cualquiera puede confirmar esta firma con su enlace de certificado:',
  'cloud_copy': 'Copiar',
  'cloud_remove_any_time': 'Puedes quitar esta firma guardada en cualquier momento.',
  'cloud_remove_stored': 'Quitar la firma guardada',
  'cloud_blocked_remove_one': 'Has usado todo tu límite gratuito de {count} firma guardada. Quita una abajo para hacer sitio o aloja tu propia copia gratis.',
  'cloud_blocked_remove_other': 'Has usado todo tu límite gratuito de {count} firmas guardadas. Quita una abajo para hacer sitio o aloja tu propia copia gratis.',
  'cloud_blocked_selfhost_one': 'Has usado todo tu límite gratuito de {count} firma guardada. Puedes alojar tu propia copia gratis.',
  'cloud_blocked_selfhost_other': 'Has usado todo tu límite gratuito de {count} firmas guardadas. Puedes alojar tu propia copia gratis.',
  'cloud_blocked_no_limit': 'Has agotado tu almacenamiento gratuito de firmas. Puedes alojar tu propia copia gratis.',
  'cloud_self_host': 'Alojar tu copia gratis',
  'cloud_need_more': '¿Necesitas más? Dínoslo',
  'cloud_source': 'Código fuente: {link}',
  'cloud_error_save': 'No se ha podido guardar.',
  'cloud_error_store': 'No se ha podido guardar tu firma.',
  'cloud_error_remove': 'No se ha podido quitar.',

  // ── Your stored signatures ──────────────────────────────────────────────────
  'stored_title': 'Tus firmas guardadas',
  'stored_loading': 'Cargando…',
  'stored_none': 'Aún no hay ninguna guardada en línea.',
  'stored_alt': 'Firma guardada',
  'stored_by_colleague': 'Guardada por un compañero',
  'stored_error_load': 'No se han podido cargar tus firmas guardadas.',

  // ── Your main signature ─────────────────────────────────────────────────────
  'main_replace_confirm': 'Tu Universal ID guarda una sola firma principal. ¿Quieres sustituir la que tienes ahora?',
  'main_replace': 'Sustituirla',
  'main_keep': 'Conservar la actual',
  'main_is_main': 'Esta es tu firma principal ✓',
  'main_save': 'Guardar como mi firma principal',
  'main_saved_note': 'Guardada en tu Universal ID: úsala aquí, en Universal PDF y en cualquier dispositivo.',
  'main_note': 'Una por Universal ID, gratis, con o sin empresa. Úsala aquí, en Universal PDF y en cualquier dispositivo.',
  'main_error_save': 'No se ha podido guardar tu firma principal.',
  'main_error_too_large': 'Esa imagen de firma es demasiado grande para guardarla.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_save': 'Inicia sesión con tu Universal ID para guardar.',
  'error_storage_full': 'Has agotado tu almacenamiento gratuito de firmas. Quita una firma guardada para hacer sitio.',
  'error_sign_in_to_record': 'Inicia sesión con tu Universal ID para crear un registro verificable.',
  'error_no_company_record': 'Configura una empresa en tu Universal ID (es gratis) en app.unisim.co.uk para crear un registro verificable.',
}

export default save
