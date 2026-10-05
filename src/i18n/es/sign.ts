import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'Firmar un PDF',
  'mode_group_label': 'Quién firma',
  'mode_self': 'Firmarlo yo',
  'mode_send': 'Enviar para firmar',
  'intro_self': 'Añade tu firma a un documento: se procesa en tu navegador y nunca se sube.',
  'intro_send': 'Pide a otra persona que firme un documento. Firma en su navegador, sin cuenta, y cada uno recibe un certificado. Para esto no necesitas tu propia firma.',

  // ── The drop circle ──────────────────────────────────────────────────────
  'drop_label': 'Suelta un PDF aquí o haz clic para elegir uno',
  'drop_label_another': 'Suelta otro PDF aquí o haz clic para elegir uno',
  'drop_pages_one': '{count} página',
  'drop_pages_other': '{count} páginas',
  'drop_change': 'suelta otro o haz clic para cambiarlo',
  'drop_over': 'Suelta para abrir',
  'drop_here': 'Suelta un PDF aquí',
  'drop_stays_local': 'se queda en tu dispositivo',
  'drop_uploaded_on_send': 'solo se sube cuando lo envías',
  'drop_browse': 'o haz clic para buscarlo',
  'drop_browse_tap': 'o toca para buscarlo',
  'drop_anywhere_title': 'Suéltalo en cualquier sitio',
  'drop_anywhere_hint': 'Un PDF: se firma en este navegador y nunca se sube',

  // ── Errors ───────────────────────────────────────────────────────────────
  'error_not_pdf': '{name} no es un PDF.',
  'error_encrypted': '{name} está protegido con contraseña, así que no se puede firmar aquí. Quítale la contraseña y vuelve a intentarlo.',
  'error_unreadable': 'No se ha podido leer {name}. Puede que esté dañado o que no sea realmente un PDF.',
  'error_no_email': 'Tu Universal ID no tiene ningún correo registrado, así que no se puede crear un registro verificable.',
  'error_record': 'No se ha podido crear el registro verificable.',
  'error_sign': 'No se ha podido firmar el PDF.',

  // ── Page, size and position ──────────────────────────────────────────────
  'page_label': 'Página',
  'page_option': 'Página {n}',
  'page_option_last': 'Página {n} (última)',
  'page_every': 'Todas las páginas ({count})',
  'page_initial_each': 'Iniciales en cada página, firma en la última',
  'size_label': 'Tamaño ({pct}%)',
  'position_label': 'Posición',
  'position_label_initials': 'Posición de la firma (última página)',
  'position_group_label': 'Posición en la página',
  'anchor_top_left': 'Arriba a la izquierda',
  'anchor_top_center': 'Arriba en el centro',
  'anchor_top_right': 'Arriba a la derecha',
  'anchor_mid_left': 'En medio a la izquierda',
  'anchor_mid_center': 'Centro',
  'anchor_mid_right': 'En medio a la derecha',
  'anchor_bottom_left': 'Abajo a la izquierda',
  'anchor_bottom_center': 'Abajo en el centro',
  'anchor_bottom_right': 'Abajo a la derecha',
  'position_custom': 'Posición personalizada',
  'position_choose': 'Elegir posición…',
  'position_custom_set': '✓ Posición personalizada fijada',
  'position_use_grid': 'Usar cuadrícula',
  'position_needs_signature': 'Crea una firma para ver dónde se coloca.',

  // ── Options ──────────────────────────────────────────────────────────────
  'omit_extras': '{bold}: firma este documento solo con la firma, sin lo que añadiste en «Crea tu firma».',
  'omit_extras_bold': 'Quitar el nombre, la fecha y la hora',
  'certificate': '{bold}: añade al PDF una página de certificado y un QR, y guarda un registro verificable gratuito (tu correo, el nombre del archivo, un hash del original sin firmar y la hora). La página también muestra el reloj y la zona horaria de tu dispositivo, marcados como autodeclarados. El documento en sí nunca se sube.',
  'certificate_bold': 'Añadir un certificado de firma',
  'certificate_sign_in': '{link} para activar los registros verificables.',
  'certificate_sign_in_link': 'Inicia sesión con un Universal ID gratuito',

  // ── Signing ──────────────────────────────────────────────────────────────
  'signing': 'Firmando…',
  'button_needs_signature': 'Crea primero una firma',
  'button_needs_initials': 'Añade primero tus iniciales',
  'button_sign': 'Firmar y descargar PDF',
  'signed_as': '✓ Firmado: descargado como {name}',
  'record_created': '✓ Registro verificable creado',
  'record_qr_links_here': 'El PDF firmado lleva un QR que enlaza aquí:',
  'record_copy': 'Copiar',
  'record_copy_hash': 'La huella de la copia firmada también figura en el registro, así que cualquiera a quien se la envíes puede comprobar en esa página que no se ha modificado.',

  // ── Position picker (dialog) ─────────────────────────────────────────────
  'picker_title': 'Elegir la posición de la firma',
  'picker_hint': 'Haz clic o arrastra en la página para colocar tu firma, o usa las teclas de flecha.',
  'picker_close': 'Cerrar',
  'picker_error': 'No se ha podido mostrar esta página.',
  'picker_rendering': 'Mostrando la página…',
  'picker_surface_label': 'Vista previa de la página. Usa las teclas de flecha para mover la firma; mantén pulsada Mayús para moverla más.',
  'picker_page_alt': 'Página del PDF',
  'picker_sig_alt': 'Vista previa de la firma',
  'picker_live': 'Centro de la firma: {x}% desde la izquierda y {y}% desde arriba de la página.',
  'picker_cancel': 'Cancelar',
  'picker_confirm': 'Usar esta posición',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Escanear para verificar · Universal Signatures',
}

export default sign
