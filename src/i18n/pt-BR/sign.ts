import type { Messages } from '../en'
const sign: Messages['sign'] = {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'Assinar um PDF',
  'mode_group_label': 'Quem assina',
  'mode_self': 'Eu mesmo assino',
  'mode_send': 'Enviar para assinatura',
  'intro_self': 'Adicione sua assinatura a um documento — ele é processado no seu navegador e nunca é enviado.',
  'intro_send': 'Peça a outra pessoa para assinar um documento. Ela assina no navegador, sem conta, e vocês dois recebem um certificado. Para isso, não é preciso ter a sua própria assinatura.',

  // ── The drop circle (small round area — keep these short) ────────────────
  'drop_label': 'Solte um PDF aqui ou clique para escolher um',
  'drop_label_another': 'Solte outro PDF aqui ou clique para escolher um',
  'drop_pages_one': '{count} página',
  'drop_pages_other': '{count} páginas',
  'drop_change': 'solte outro ou clique para trocar',
  'drop_over': 'Solte para abrir',
  'drop_here': 'Solte um PDF aqui',
  'drop_stays_local': 'ele fica no seu dispositivo',
  'drop_uploaded_on_send': 'só é enviado quando você o mandar',
  'drop_browse': 'ou clique para procurar',
  'drop_browse_tap': 'ou toque para procurar',
  'drop_anywhere_title': 'Solte em qualquer lugar',
  'drop_anywhere_hint': 'Um PDF — ele é assinado neste navegador e nunca é enviado',

  // ── Errors ───────────────────────────────────────────────────────────────
  'error_not_pdf': '{name} não é um PDF.',
  'error_encrypted': '{name} está protegido por senha, então não pode ser assinado aqui. Remova a senha primeiro e tente novamente.',
  'error_unreadable': 'Não foi possível ler {name}. Ele pode estar danificado ou não ser realmente um PDF.',
  'error_no_email': 'Seu Universal ID não tem e-mail cadastrado, então não é possível criar um registro verificável.',
  'error_record': 'Não foi possível criar o registro verificável.',
  'error_sign': 'Não foi possível assinar o PDF.',

  // ── Page, size and position ──────────────────────────────────────────────
  'page_label': 'Página',
  'page_option': 'Página {n}',
  'page_option_last': 'Página {n} (última)',
  'page_every': 'Todas as páginas ({count})',
  'page_initial_each': 'Rubricar cada página, assinar a última',
  'size_label': 'Tamanho ({pct}%)',
  'position_label': 'Posição',
  'position_label_initials': 'Posição da assinatura (última página)',
  'position_group_label': 'Posição na página',
  'anchor_top_left': 'Superior esquerdo',
  'anchor_top_center': 'Superior central',
  'anchor_top_right': 'Superior direito',
  'anchor_mid_left': 'Meio à esquerda',
  'anchor_mid_center': 'Centro',
  'anchor_mid_right': 'Meio à direita',
  'anchor_bottom_left': 'Inferior esquerdo',
  'anchor_bottom_center': 'Inferior central',
  'anchor_bottom_right': 'Inferior direito',
  'position_custom': 'Posição personalizada',
  'position_choose': 'Escolher posição…',
  'position_custom_set': '✓ Posição personalizada definida',
  'position_use_grid': 'Usar grade',
  'position_needs_signature': 'Crie uma assinatura para visualizar o posicionamento.',

  // ── Options ──────────────────────────────────────────────────────────────
  'omit_extras': '{bold} — assine este documento só com a assinatura, sem o que você adicionou em “Crie sua assinatura”.',
  'omit_extras_bold': 'Deixar de fora o nome, a data e a hora',
  'certificate': '{bold} — acrescenta ao PDF uma página de certificado e um QR, e salva um registro verificável gratuito (seu e-mail, o nome do arquivo, um hash do original não assinado e a hora). A página também mostra o relógio e o fuso horário do seu dispositivo, marcados como informados pelo próprio dispositivo. O documento em si nunca é enviado.',
  'certificate_bold': 'Adicionar um certificado de assinatura',
  'certificate_sign_in': '{link} para ativar os registros verificáveis.',
  'certificate_sign_in_link': 'Entre com um Universal ID gratuito',

  // ── Signing ──────────────────────────────────────────────────────────────
  'signing': 'Assinando…',
  'button_needs_signature': 'Crie uma assinatura primeiro',
  'button_needs_initials': 'Adicione suas iniciais primeiro',
  'button_sign': 'Assinar e baixar o PDF',
  'signed_as': '✓ Assinado — baixado como {name}',
  'record_created': '✓ Registro verificável criado',
  'record_qr_links_here': 'O PDF assinado traz um QR com link para cá:',
  'record_copy': 'Copiar',
  'record_copy_hash': 'A impressão digital da cópia assinada também está no registro, então qualquer pessoa a quem você a enviar pode conferir nessa página que ela não foi alterada.',

  // ── Position picker (dialog) ─────────────────────────────────────────────
  'picker_title': 'Escolha a posição da assinatura',
  'picker_hint': 'Clique ou arraste na página para posicionar sua assinatura, ou use as teclas de seta.',
  'picker_close': 'Fechar',
  'picker_error': 'Não foi possível exibir esta página.',
  'picker_rendering': 'Exibindo a página…',
  'picker_surface_label': 'Visualização da página. Use as teclas de seta para mover a assinatura; segure Shift para movê-la mais longe.',
  'picker_page_alt': 'Página do PDF',
  'picker_sig_alt': 'Visualização da assinatura',
  'picker_live': 'Centro da assinatura a {x}% na horizontal e {y}% na vertical da página.',
  'picker_cancel': 'Cancelar',
  'picker_confirm': 'Usar esta posição',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Escaneie para verificar · Universal Signatures',
}
export default sign
