import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // ── The "Sign a PDF" card ────────────────────────────────────────────────
  'title': 'Assinar um PDF',
  'mode_group_label': 'Quem assina',
  'mode_self': 'Assinar pessoalmente',
  'mode_send': 'Enviar para assinatura',
  'intro_self': 'Adicione a sua assinatura a um documento — é processado no navegador e nunca é carregado.',
  'intro_send': 'Peça a outra pessoa que assine um documento. Assina no navegador, sem conta, e ambos recebem um certificado. Para isso, não é necessária uma assinatura própria.',

  // ── The drop circle (small round area — keep these short) ────────────────
  'drop_label': 'Largue um PDF aqui ou clique para escolher um',
  'drop_label_another': 'Largue outro PDF aqui ou clique para escolher um',
  'drop_pages_one': '{count} página',
  'drop_pages_other': '{count} páginas',
  'change_pdf': 'Mudar de PDF',
  'drop_over': 'Largue para abrir',
  'drop_here': 'Largue um PDF aqui',
  'drop_stays_local': 'fica no seu dispositivo',
  'drop_uploaded_on_send': 'só é carregado quando o enviar',
  'drop_browse': 'ou clique para procurar',
  'drop_browse_tap': 'ou toque para procurar',
  'drop_anywhere_title': 'Largue em qualquer lado',
  'drop_anywhere_hint': 'Um PDF — é assinado neste navegador e nunca é carregado',

  // ── Errors ───────────────────────────────────────────────────────────────
  'error_not_pdf': '{name} não é um PDF.',
  'error_encrypted': '{name} está protegido por palavra-passe, por isso não pode ser assinado aqui. Remova primeiro a palavra-passe e tente novamente.',
  'error_unreadable': 'Não foi possível ler {name}. Pode estar danificado ou não ser realmente um PDF.',
  'error_no_email': 'O seu Universal ID não tem email registado, por isso não é possível criar um registo verificável.',
  'error_record': 'Não foi possível criar o registo verificável.',
  'error_sign': 'Não foi possível assinar o PDF.',

  // ── Page, size and position ──────────────────────────────────────────────
  'layout_label': 'Como assinar',
  'layout_once': 'Assinar uma vez',
  'layout_once_hint': 'A sua assinatura numa página',
  'layout_every': 'Assinar todas as páginas',
  'layout_every_hint': 'A sua assinatura no mesmo sítio em cada página',
  'layout_initial_once': 'Rubricar todas, assinar uma vez',
  'layout_initial_once_hint': 'A sua rubrica em cada página, a assinatura na última',
  'layout_initial_every': 'Rubricar e assinar todas',
  'layout_initial_every_hint': 'A sua rubrica e a sua assinatura em cada página',
  'page_label': 'Página',
  'page_option': 'Página {n}',
  'page_option_last': 'Página {n} (última)',
  'size_label': 'Tamanho ({pct}%)',
  'position_label': 'Posição',
  'position_label_initials': 'Posição da assinatura (última página)',
  'position_label_every': 'Posição da assinatura (todas as páginas)',
  'position_needs_signature': 'Crie uma assinatura para pré-visualizar a colocação.',
  'placer_hint': 'Arraste a sua assinatura para o sítio certo, ou toque na página para a mover para lá.',
  'position_reset': 'Voltar ao canto',

  // ── Options ──────────────────────────────────────────────────────────────
  'omit_extras': '{bold} — assinar este documento só com a assinatura, sem o que adicionou em «Criar a sua assinatura».',
  'omit_extras_bold': 'Omitir o nome, a data e a hora',
  'certificate': '{bold} — acrescenta ao PDF uma página de certificado e um QR, e guarda um registo verificável gratuito (o seu email, o nome do ficheiro, um hash do original não assinado e a hora). A página mostra também o relógio e o fuso horário do seu dispositivo, assinalados como autodeclarados. O documento em si nunca é carregado.',
  'certificate_bold': 'Adicionar um certificado de assinatura',
  'certificate_sign_in': '{link} para ativar os registos verificáveis.',
  'certificate_sign_in_link': 'Inicie sessão com um Universal ID gratuito',

  // ── Signing ──────────────────────────────────────────────────────────────
  'signing': 'A assinar…',
  'button_needs_signature': 'Crie primeiro uma assinatura',
  'button_needs_initials': 'Adicione primeiro as suas iniciais',
  'button_sign': 'Assinar e transferir PDF',
  'button_sign_embedded': 'Assinar',
  'signed_as': '✓ Assinado — transferido como {name}',
  'record_created': '✓ Registo verificável criado',
  'record_qr_links_here': 'O PDF assinado tem um QR com ligação para aqui:',
  'record_copy': 'Copiar',
  'record_copy_hash': 'A impressão digital da cópia assinada também fica no registo, para que qualquer pessoa a quem a envie possa confirmar nessa página que não foi alterada.',

  // ── Position picker (dialog) ─────────────────────────────────────────────
  'picker_title': 'Escolher a posição da assinatura',
  'picker_hint': 'Clique ou arraste na página para colocar a assinatura, ou use as teclas de seta.',
  'picker_close': 'Fechar',
  'picker_error': 'Não foi possível apresentar esta página.',
  'picker_rendering': 'A apresentar a página…',
  'picker_surface_label': 'Pré-visualização da página. Use as teclas de seta para mover a assinatura; mantenha Shift premido para a mover mais.',
  'picker_page_alt': 'Página do PDF',
  'picker_sig_alt': 'Pré-visualização da assinatura',
  'picker_live': 'Centro da assinatura a {x}% da margem esquerda e a {y}% do topo da página.',
  'picker_cancel': 'Cancelar',
  'picker_confirm': 'Usar esta posição',

  // ── Stamped into the signed PDF ──────────────────────────────────────────
  'qr_caption': 'Leia para verificar · Universal Signatures',
  'attest_heading': 'Assinatura enviada de um telemóvel',
  'attest_line': 'Assinado por {email} através do Universal ID · {time}',
}

export default sign
