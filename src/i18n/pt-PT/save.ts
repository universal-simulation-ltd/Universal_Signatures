import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Guardar a sua assinatura',

  // ── Shared ───────────────────────────────────────────────────────────────────
  'create_first': 'Crie primeiro uma assinatura',
  'create_first_error': 'Crie primeiro uma assinatura.',
  'typed_signature': 'Assinatura escrita',
  'drawn_signature': 'Assinatura desenhada',
  'style_type': 'escrita',
  'style_draw': 'desenho',
  'remove': 'Remover',
  'removing': 'A remover…',
  'saving': 'A guardar…',

  // ── Save on this device ─────────────────────────────────────────────────────
  'local_title': 'Guardar neste dispositivo',
  'local_no_account': 'Sem conta',
  'local_intro': 'Guarde a sua assinatura neste navegador e reutilize-a mais tarde — gratuitamente, sem iniciar sessão. Nada é enviado. Ao limpar os dados deste navegador, é eliminada, por isso guarde-a num ficheiro se quiser uma cópia.',
  'local_name_placeholder': 'Nome desta assinatura (opcional)',
  'local_saved': '✓ Guardada neste dispositivo',
  'local_save': 'Guardar neste dispositivo',
  'local_saved_alt': 'Assinatura guardada',
  'local_rename_placeholder': 'Nome da assinatura',
  'local_rename': 'Mudar o nome',
  'local_in_use': 'Em uso ✓',
  'local_use': 'Usar',
  'local_remove_aria': 'Remover assinatura guardada',

  // ── Save to a file / Open a file (moves saved signatures between devices) ───
  'file_title': 'Use-as noutro dispositivo',
  'file_intro': 'Guarde as suas assinaturas num ficheiro e depois abra esse ficheiro aqui noutro navegador ou noutro dispositivo. Nada é enviado.',
  'file_password_label': 'Palavra-passe do ficheiro (opcional)',
  'file_password_hint': 'Com uma palavra-passe, o ficheiro só abre com ela. Uma palavra-passe esquecida não pode ser recuperada. Use a mesma caixa para abrir um ficheiro que tenha uma.',
  'file_save': 'Guardar num ficheiro',
  'file_nothing_to_save': 'Ainda nada guardado aqui',
  'file_open': 'Abrir um ficheiro',
  'file_opening': 'A abrir…',
  'file_try_again': 'Abrir',
  'file_saved': '{name} guardado.',
  'file_error_save': 'Não foi possível guardar o ficheiro.',
  'file_added_one': '{count} assinatura adicionada a partir do ficheiro.',
  'file_added_other': '{count} assinaturas adicionadas a partir do ficheiro.',
  'file_already_here': 'Todas as assinaturas deste ficheiro já estão aqui.',
  'file_none_usable': 'Este ficheiro não tem assinaturas que possam ser usadas.',
  'file_not_fit_one': '{count} não coube: este navegador guarda até {max}. Remova uma e abra o ficheiro novamente.',
  'file_not_fit_other': '{count} não couberam: este navegador guarda até {max}. Remova algumas e abra o ficheiro novamente.',
  'file_skipped_one': '{count} não pôde ser usada e ficou de fora.',
  'file_skipped_other': '{count} não puderam ser usadas e ficaram de fora.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_record': 'Inicie sessão com o seu Universal ID para criar um registo verificável.',
  'error_no_company_record': 'Configure uma empresa no seu Universal ID (é gratuito) em app.unisim.co.uk para criar um registo verificável.',
}

export default save
