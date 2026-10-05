import type { Messages } from '../en'

const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Guardar a sua assinatura',
  'tabs_local': 'Neste dispositivo',
  'tabs_online': 'Online',

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
  'local_intro': 'Guarde a sua assinatura neste navegador e reutilize-a mais tarde — gratuitamente, sem iniciar sessão. Fica neste dispositivo e nunca sai dele. Ao limpar os dados deste navegador, é eliminada.',
  'local_name_placeholder': 'Nome desta assinatura (opcional)',
  'local_saved': '✓ Guardada neste dispositivo',
  'local_save': 'Guardar neste dispositivo',
  'local_saved_alt': 'Assinatura guardada',
  'local_rename_placeholder': 'Nome da assinatura',
  'local_rename': 'Mudar o nome',
  'local_in_use': 'Em uso ✓',
  'local_use': 'Usar',
  'local_remove_aria': 'Remover assinatura guardada',

  // ── Save a verified signature to the cloud ──────────────────────────────────
  'cloud_title': 'Guardar uma assinatura verificada na nuvem',
  'cloud_intro': 'Guarde a sua assinatura no seu Universal ID com um certificado que denuncia qualquer adulteração, para a poder reutilizar e verificar em qualquer lado.',
  'cloud_checking': 'A verificar a sua conta…',
  'cloud_signed_out': 'Crie um {id} para guardar a sua assinatura online GRATUITAMENTE.',
  'cloud_sign_in': 'Criar / iniciar sessão com o Universal ID →',
  'cloud_no_company': 'Para guardar mais assinaturas, cada uma com um certificado, configure uma empresa no seu {id} (é gratuito).',
  'cloud_set_up_company': 'Configurar uma empresa →',
  'cloud_save': 'Guardar assinatura verificada ☁',
  'cloud_via_token': 'Guardada no seu Universal ID — pode removê-la a qualquer momento.',
  'cloud_via_subscription': 'Alojamento na nuvem incluído na sua subscrição.',
  'cloud_via_project': 'Alojamento na nuvem incluído no seu projeto ativo.',
  'cloud_usage_one': 'Já usou {used} de {count} assinatura guardada gratuita.',
  'cloud_usage_other': 'Já usou {used} de {count} assinaturas guardadas gratuitas.',
  'cloud_saved': '✓ Guardada e verificada',
  'cloud_cert_link': 'Qualquer pessoa pode confirmar esta assinatura com a ligação do certificado:',
  'cloud_copy': 'Copiar',
  'cloud_remove_any_time': 'Pode remover esta assinatura guardada a qualquer momento.',
  'cloud_remove_stored': 'Remover assinatura guardada',
  'cloud_blocked_remove_one': 'Já usou o seu limite de {count} assinatura guardada gratuita. Remova uma abaixo para libertar espaço ou aloje gratuitamente a sua própria cópia.',
  'cloud_blocked_remove_other': 'Já usou todas as {count} assinaturas guardadas gratuitas. Remova uma abaixo para libertar espaço ou aloje gratuitamente a sua própria cópia.',
  'cloud_blocked_selfhost_one': 'Já usou o seu limite de {count} assinatura guardada gratuita. Pode alojar gratuitamente a sua própria cópia.',
  'cloud_blocked_selfhost_other': 'Já usou todas as {count} assinaturas guardadas gratuitas. Pode alojar gratuitamente a sua própria cópia.',
  'cloud_blocked_no_limit': 'Já usou o armazenamento gratuito de assinaturas. Pode alojar gratuitamente a sua própria cópia.',
  'cloud_self_host': 'Alojar gratuitamente',
  'cloud_need_more': 'Precisa de mais? Diga-nos',
  'cloud_source': 'Código-fonte: {link}',
  'cloud_error_save': 'Não foi possível guardar.',
  'cloud_error_store': 'Não foi possível guardar a sua assinatura.',
  'cloud_error_remove': 'Não foi possível remover.',

  // ── Your stored signatures ──────────────────────────────────────────────────
  'stored_title': 'As suas assinaturas guardadas',
  'stored_loading': 'A carregar…',
  'stored_none': 'Ainda não há nenhuma guardada online.',
  'stored_alt': 'Assinatura guardada',
  'stored_by_colleague': 'Guardada por um colega',
  'stored_error_load': 'Não foi possível carregar as suas assinaturas guardadas.',

  // ── Your main signature ─────────────────────────────────────────────────────
  'main_replace_confirm': 'O seu Universal ID guarda uma assinatura principal. Substituir a que tem agora?',
  'main_replace': 'Substituir',
  'main_keep': 'Manter a atual',
  'main_is_main': 'Esta é a sua assinatura principal ✓',
  'main_save': 'Guardar como assinatura principal',
  'main_saved_note': 'Guardada no seu Universal ID — use-a aqui, no Universal PDF e em qualquer dispositivo.',
  'main_note': 'Uma por Universal ID, gratuita, com ou sem empresa. Use-a aqui, no Universal PDF e em qualquer dispositivo.',
  'main_error_save': 'Não foi possível guardar a sua assinatura principal.',
  'main_error_too_large': 'Essa imagem de assinatura é demasiado grande para ser guardada.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_save': 'Inicie sessão com o seu Universal ID para guardar.',
  'error_storage_full': 'Já usou o armazenamento gratuito de assinaturas. Remova uma assinatura guardada para libertar espaço.',
  'error_sign_in_to_record': 'Inicie sessão com o seu Universal ID para criar um registo verificável.',
  'error_no_company_record': 'Configure uma empresa no seu Universal ID (é gratuito) em app.unisim.co.uk para criar um registo verificável.',
}

export default save
