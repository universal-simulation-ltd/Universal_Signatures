import type { Messages } from '../en'

const verify: Messages['verify'] = {
  // The certificate page
  'title': 'Certificado de firma',
  'certificate_id': 'Certificado {id}',
  'verifying': 'Verificando…',
  'verified_signing': 'Verificado: este documento se firmó con Universal Signatures',
  'verified_signature': 'Verificado: es una firma guardada auténtica',
  'verified_request': 'Verificado: este documento lo han firmado todas las personas a las que se envió',
  'request_waiting': 'Enviado y aún pendiente de firma',
  'lookup_failed': 'No se ha podido conectar con el servicio de verificación, así que este certificado aún no se ha comprobado. Comprueba la conexión y vuelve a intentarlo.',
  'try_again': 'Reintentar',
  'not_found': '✗ No hay ningún registro para este certificado. Puede que el enlace sea incorrecto o que el registro se haya eliminado.',
  'back_home': '← Universal Signatures',

  // Row labels
  'row_signed_by': 'Firmado por',
  'row_waiting_for': 'Pendiente de',
  'row_organisation': 'Organización',
  'row_document': 'Documento',
  'row_signed': 'Firmado',
  'row_saved': 'Guardado',
  'row_sent': 'Enviado',
  'row_signer': 'Firmante',
  'row_original_hash': 'Hash del documento original (SHA-256)',
  'row_signed_hash': 'Hash de la copia firmada (SHA-256)',
  'row_sent_hash': 'Documento tal como se envió (SHA-256)',
  'row_signature_hash': 'Hash de la firma (SHA-256)',

  'hash_note_both': 'El primer hash es la huella del documento {original}, antes de firmarlo; el segundo, la de la {signed} tal como se generó.',
  'hash_note_original_only': 'El hash de arriba es la huella del documento {original}, antes de añadir la firma.',
  'hash_note_original': 'original',
  'hash_note_signed': 'copia firmada',

  // Checking a PDF against the record
  'check_intro_both': '¿Tienes la copia firmada o el original? Compruébalo con este registro: se calcula su huella en tu navegador y nunca se sube.',
  'check_intro_original': '¿Tienes el PDF original? Compruébalo con este registro: se calcula su huella en tu navegador y nunca se sube.',
  'check_busy': 'Comprobando…',
  'check_button': 'Comprobar un PDF',
  'check_match_signed': '✓ {name} es la copia firmada, byte a byte, exactamente como se generó. No ha cambiado nada desde entonces.',
  'check_match_original': '✓ {name} es el documento original para el que se creó este registro, tal como era antes de firmarlo.',
  'check_no_match_both': '✗ {name} no es ni la copia firmada ni el original. Si debería ser la copia firmada, se ha modificado después de firmarla: incluso volver a guardarla o imprimirla como PDF cuenta.',
  'check_no_match_original': '✗ {name} no coincide con este registro. Una copia firmada tampoco coincidirá, porque el registro guarda la huella del original antes de añadir la firma, así que comprueba el original sin firmar.',
  'check_read_error': 'No se ha podido leer ese archivo.',

  // Activity log and download
  'activity': 'Actividad',
  'action_opened': 'Abierto',
  'action_verified': 'Dirección de correo confirmada',
  'action_signature': 'Firmado',
  'action_annotation': 'Marcas añadidas',
  'action_highlight': 'Texto resaltado',
  'action_text': 'Texto añadido',
  'action_other': 'Otros cambios',
  'action_completed': 'Completado',
  'download_busy': 'Obteniendo…',
  'download_button': 'Descargar la copia firmada',
  'download_deleted': 'La copia guardada se ha eliminado.',
  'download_failed': 'No se ha podido obtener la copia firmada. Vuelve a intentarlo dentro de un momento.',

  // The embeddable badge
  'badge_summary': 'Mostrarlo en un sitio web',
  'badge_summary_hint': 'Inserta una insignia que enlace a este certificado.',
  'badge_format_aria': 'Formato de la insignia',
  'badge_tab_live': 'Insignia en directo',
  'badge_tab_image': 'Imagen + enlace',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Comprueba este certificado cada vez que se ve la página y solo entonces muestra «✓ Firmado y verificado». Necesita una página que permita scripts.',
  'badge_desc_image': 'Para correos y sitios que no permiten scripts. La imagen no puede comprobar nada por sí sola, así que dice «haz clic para verificar»: la comprobación se hace en esta página.',
  'badge_desc_markdown': 'Para un README o cualquier otro sitio que admita Markdown. Una imagen fija, como la versión de imagen.',
  'badge_preview_aria': 'Vista previa',
  'badge_link_text': 'Verificar esta firma',
  'badge_image_alt': 'Firmado con Universal Signatures: haz clic para verificar',
  'badge_paste_label': 'Pega esto en tu página',
  'badge_copy': 'Copiar',
  'badge_copied': 'Copiado ✓',
}

export default verify
