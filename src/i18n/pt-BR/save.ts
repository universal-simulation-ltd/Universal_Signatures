import type { Messages } from '../en'
const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Salve sua assinatura',

  // ── Shared ───────────────────────────────────────────────────────────────────
  'create_first': 'Crie uma assinatura primeiro',
  'create_first_error': 'Crie uma assinatura primeiro.',
  'typed_signature': 'Assinatura digitada',
  'drawn_signature': 'Assinatura desenhada',
  'style_type': 'digitada',
  'style_draw': 'desenhada',
  'remove': 'Remover',
  'removing': 'Removendo…',
  'saving': 'Salvando…',

  // ── Save on this device ─────────────────────────────────────────────────────
  'local_title': 'Salvar neste dispositivo',
  'local_no_account': 'Sem conta',
  'local_intro': 'Guarde sua assinatura neste navegador e use-a de novo depois — de graça, sem entrar. Nada é enviado. Ao limpar os dados deste navegador, ela é apagada, então salve-a em um arquivo se quiser uma cópia.',
  'local_name_placeholder': 'Dê um nome a esta assinatura (opcional)',
  'local_saved': '✓ Salva neste dispositivo',
  'local_save': 'Salvar neste dispositivo',
  'local_saved_alt': 'Assinatura salva',
  'local_rename_placeholder': 'Nome da assinatura',
  'local_rename': 'Renomear',
  'local_in_use': 'Em uso ✓',
  'local_use': 'Usar',
  'local_remove_aria': 'Remover a assinatura salva',

  // ── Save to a file / Open a file (moves saved signatures between devices) ───
  'file_title': 'Use-as em outro dispositivo',
  'file_intro': 'Salve suas assinaturas em um arquivo e depois abra esse arquivo aqui em outro navegador ou em outro dispositivo. Nada é enviado.',
  'file_password_label': 'Senha do arquivo (opcional)',
  'file_password_hint': 'Com uma senha, o arquivo só abre com ela. Uma senha esquecida não pode ser recuperada. Use o mesmo campo para abrir um arquivo que tenha senha.',
  'file_save': 'Salvar em um arquivo',
  'file_nothing_to_save': 'Nada salvo aqui ainda',
  'file_open': 'Abrir um arquivo',
  'file_opening': 'Abrindo…',
  'file_try_again': 'Abrir',
  'file_saved': '{name} salvo.',
  'file_error_save': 'Não foi possível salvar o arquivo.',
  'file_added_one': '{count} assinatura adicionada do arquivo.',
  'file_added_other': '{count} assinaturas adicionadas do arquivo.',
  'file_already_here': 'Todas as assinaturas deste arquivo já estão aqui.',
  'file_none_usable': 'Este arquivo não tem assinaturas que possam ser usadas.',
  'file_not_fit_one': '{count} não coube: este navegador guarda até {max}. Remova uma e abra o arquivo de novo.',
  'file_not_fit_other': '{count} não couberam: este navegador guarda até {max}. Remova algumas e abra o arquivo de novo.',
  'file_skipped_one': '{count} não pôde ser usada e ficou de fora.',
  'file_skipped_other': '{count} não puderam ser usadas e ficaram de fora.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_record': 'Entre com seu Universal ID para criar um registro verificável.',
  'error_no_company_record': 'Configure uma empresa no seu Universal ID (é grátis) em app.unisim.co.uk para criar um registro verificável.',
}
export default save
