import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Guarda tu firma',

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
  'local_intro': 'Conserva tu firma en este navegador y vuelve a usarla más tarde: gratis y sin iniciar sesión. No se sube nada. Si borras los datos de este navegador, se elimina, así que guárdala en un archivo si quieres una copia.',
  'local_name_placeholder': 'Ponle nombre a esta firma (opcional)',
  'local_saved': '✓ Guardada en este dispositivo',
  'local_save': 'Guardar en este dispositivo',
  'local_saved_alt': 'Firma guardada',
  'local_rename_placeholder': 'Nombre de la firma',
  'local_rename': 'Cambiar nombre',
  'local_in_use': 'En uso ✓',
  'local_use': 'Usar',
  'local_remove_aria': 'Quitar la firma guardada',

  // ── Save to a file / Open a file (moves saved signatures between devices) ───
  'file_title': 'Úsalas en otro dispositivo',
  'file_intro': 'Guarda tus firmas en un archivo y luego abre ese archivo aquí en otro navegador o en otro dispositivo. No se sube nada.',
  'file_password_label': 'Contraseña del archivo (opcional)',
  'file_password_hint': 'Con contraseña, el archivo solo se abre con ella. Una contraseña olvidada no se puede recuperar. Usa la misma casilla para abrir un archivo que tenga una.',
  'file_save': 'Guardar en un archivo',
  'file_nothing_to_save': 'Aún no hay nada guardado aquí',
  'file_open': 'Abrir un archivo',
  'file_opening': 'Abriendo…',
  'file_try_again': 'Abrirlo',
  'file_saved': 'Se guardó {name}.',
  'file_error_save': 'No se pudo guardar el archivo.',
  'file_added_one': 'Se añadió {count} firma del archivo.',
  'file_added_other': 'Se añadieron {count} firmas del archivo.',
  'file_already_here': 'Todas las firmas de este archivo ya están aquí.',
  'file_none_usable': 'Este archivo no tiene firmas que se puedan usar.',
  'file_not_fit_one': '{count} no cabía: este navegador guarda hasta {max}. Quita una y vuelve a abrir el archivo.',
  'file_not_fit_other': '{count} no cabían: este navegador guarda hasta {max}. Quita algunas y vuelve a abrir el archivo.',
  'file_skipped_one': '{count} no se pudo usar y se dejó fuera.',
  'file_skipped_other': '{count} no se pudieron usar y se dejaron fuera.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_record': 'Inicia sesión con tu Universal ID para crear un registro verificable.',
  'error_no_company_record': 'Configura una empresa en tu Universal ID (es gratis) en app.unisim.co.uk para crear un registro verificable.',
}

export default save
