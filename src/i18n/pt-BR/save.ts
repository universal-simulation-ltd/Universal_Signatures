import type { Messages } from '../en'
const save: Messages['save'] = {
  // ── The "Save your signature" card and its tabs ─────────────────────────────
  'tabs_title': 'Salve sua assinatura',
  'tabs_local': 'Neste dispositivo',
  'tabs_online': 'On-line',

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
  'local_intro': 'Guarde sua assinatura neste navegador e use-a de novo depois — de graça, sem entrar. Ela fica neste dispositivo e nunca sai dele. Ao limpar os dados deste navegador, ela é apagada.',
  'local_name_placeholder': 'Dê um nome a esta assinatura (opcional)',
  'local_saved': '✓ Salva neste dispositivo',
  'local_save': 'Salvar neste dispositivo',
  'local_saved_alt': 'Assinatura salva',
  'local_rename_placeholder': 'Nome da assinatura',
  'local_rename': 'Renomear',
  'local_in_use': 'Em uso ✓',
  'local_use': 'Usar',
  'local_remove_aria': 'Remover a assinatura salva',

  // ── Save a verified signature to the cloud ──────────────────────────────────
  'cloud_title': 'Salve uma assinatura verificada na nuvem',
  'cloud_intro': 'Guarde sua assinatura no seu Universal ID com um certificado à prova de adulteração, para usá-la de novo e verificá-la em qualquer lugar.',
  'cloud_checking': 'Verificando sua conta…',
  'cloud_signed_out': 'Crie um {id} para guardar sua assinatura on-line GRATUITAMENTE.',
  'cloud_sign_in': 'Criar / entrar com o Universal ID →',
  'cloud_no_company': 'Para guardar mais assinaturas, cada uma com um certificado, configure uma empresa no seu {id} (é grátis).',
  'cloud_set_up_company': 'Configurar uma empresa →',
  'cloud_save': 'Salvar assinatura verificada ☁',
  'cloud_via_token': 'Guardada no seu Universal ID — remova quando quiser.',
  'cloud_via_subscription': 'Hospedagem na nuvem incluída no seu plano.',
  'cloud_via_project': 'Hospedagem na nuvem incluída no seu projeto ativo.',
  'cloud_usage_one': 'Você usou {used} de {count} assinatura guardada gratuita.',
  'cloud_usage_other': 'Você usou {used} de {count} assinaturas guardadas gratuitas.',
  'cloud_saved': '✓ Salva e verificada',
  'cloud_cert_link': 'Qualquer pessoa pode confirmar esta assinatura pelo link do certificado:',
  'cloud_copy': 'Copiar',
  'cloud_remove_any_time': 'Você pode remover esta assinatura guardada a qualquer momento.',
  'cloud_remove_stored': 'Remover assinatura guardada',
  'cloud_blocked_remove_one': 'Você já usou {count} assinatura guardada gratuita — seu limite. Remova uma abaixo para liberar espaço ou hospede sua própria cópia gratuitamente.',
  'cloud_blocked_remove_other': 'Você já usou todas as suas {count} assinaturas guardadas gratuitas. Remova uma abaixo para liberar espaço ou hospede sua própria cópia gratuitamente.',
  'cloud_blocked_selfhost_one': 'Você já usou {count} assinatura guardada gratuita — seu limite. Você pode hospedar sua própria cópia gratuitamente.',
  'cloud_blocked_selfhost_other': 'Você já usou todas as suas {count} assinaturas guardadas gratuitas. Você pode hospedar sua própria cópia gratuitamente.',
  'cloud_blocked_no_limit': 'Você já usou seu armazenamento gratuito de assinaturas. Você pode hospedar sua própria cópia gratuitamente.',
  'cloud_self_host': 'Hospede de graça',
  'cloud_need_more': 'Precisa de mais? Fale com a gente',
  'cloud_source': 'Código-fonte: {link}',
  'cloud_error_save': 'Não foi possível salvar.',
  'cloud_error_store': 'Não foi possível guardar sua assinatura.',
  'cloud_error_remove': 'Não foi possível remover.',

  // ── Your stored signatures ──────────────────────────────────────────────────
  'stored_title': 'Suas assinaturas guardadas',
  'stored_loading': 'Carregando…',
  'stored_none': 'Nenhuma guardada on-line ainda.',
  'stored_alt': 'Assinatura guardada',
  'stored_by_colleague': 'Salva por um colega',
  'stored_error_load': 'Não foi possível carregar suas assinaturas guardadas.',

  // ── Your main signature ─────────────────────────────────────────────────────
  'main_replace_confirm': 'Seu Universal ID guarda uma assinatura principal. Substituir a que você tem agora?',
  'main_replace': 'Substituir',
  'main_keep': 'Manter a atual',
  'main_is_main': 'Esta é sua assinatura principal ✓',
  'main_save': 'Salvar como minha assinatura principal',
  'main_saved_note': 'Salva no seu Universal ID — use-a aqui, no Universal PDF e em qualquer dispositivo.',
  'main_note': 'Uma por Universal ID, grátis, com ou sem empresa. Use-a aqui, no Universal PDF e em qualquer dispositivo.',
  'main_error_save': 'Não foi possível salvar sua assinatura principal.',
  'main_error_too_large': 'Essa imagem de assinatura é grande demais para ser guardada.',

  // ── Errors from saving and records ──────────────────────────────────────────
  'error_sign_in_to_save': 'Entre com seu Universal ID para salvar.',
  'error_storage_full': 'Você já usou seu armazenamento gratuito de assinaturas. Remova uma assinatura guardada para liberar espaço.',
  'error_sign_in_to_record': 'Entre com seu Universal ID para criar um registro verificável.',
  'error_no_company_record': 'Configure uma empresa no seu Universal ID (é grátis) em app.unisim.co.uk para criar um registro verificável.',
}
export default save
