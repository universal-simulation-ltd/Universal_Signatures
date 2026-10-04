import type { Messages } from '../en'

const verify: Messages['verify'] = {
  // The certificate page (opened from the QR on a signed PDF)
  'title': 'Certificado de assinatura',
  'certificate_id': 'Certificado {id}',
  'verifying': 'A verificar…',
  'verified_signing': 'Verificado — este documento foi assinado através do Universal Signatures',
  'verified_signature': 'Verificado — esta é uma assinatura guardada genuína',
  'verified_request': 'Verificado — este documento foi assinado por todas as pessoas a quem foi enviado',
  'request_waiting': 'Enviado e ainda a aguardar assinatura',
  'lookup_failed': 'Não foi possível contactar o serviço de verificação, por isso este certificado ainda não foi verificado. Verifique a ligação e tente novamente.',
  'try_again': 'Tentar novamente',
  'not_found': '✗ Não foi encontrado nenhum registo para este certificado. A ligação pode estar errada ou o registo foi removido.',
  'back_home': '← Universal Signatures',

  // Row labels (label on the left, value on the right)
  'row_signed_by': 'Assinado por',
  'row_waiting_for': 'A aguardar',
  'row_organisation': 'Organização',
  'row_document': 'Documento',
  'row_signed': 'Assinado',
  'row_saved': 'Guardado',
  'row_sent': 'Enviado',
  'row_signer': 'Signatário',
  'row_original_hash': 'Hash do documento original (SHA-256)',
  'row_signed_hash': 'Hash da cópia assinada (SHA-256)',
  'row_sent_hash': 'Documento tal como enviado (SHA-256)',
  'row_signature_hash': 'Hash da assinatura (SHA-256)',

  'hash_note_both': 'O primeiro hash é a impressão digital do documento {original}, antes de ser assinado; o segundo, da {signed} exatamente como foi produzida.',
  'hash_note_original_only': 'O hash acima é a impressão digital do documento {original}, antes de a assinatura ser adicionada.',
  'hash_note_original': 'original',
  'hash_note_signed': 'cópia assinada',

  // "Is this the document that was signed?" — checking a PDF against the record
  'check_intro_both': 'Tem a cópia assinada ou o original? Compare-o com este registo — a impressão digital é calculada no navegador e o ficheiro nunca é carregado.',
  'check_intro_original': 'Tem o PDF original? Compare-o com este registo — a impressão digital é calculada no navegador e o ficheiro nunca é carregado.',
  'check_busy': 'A verificar…',
  'check_button': 'Verificar um PDF',
  'check_match_signed': '✓ {name} é a cópia assinada, byte a byte, exatamente como foi produzida. Nada foi alterado desde então.',
  'check_match_original': '✓ {name} é o documento original para o qual este registo foi criado, tal como estava antes de ser assinado.',
  'check_no_match_both': '✗ {name} não é nem a cópia assinada nem o original. Se devia ser a cópia assinada, foi alterado depois de assinado — até voltar a guardá-lo ou imprimi-lo para PDF conta como alteração.',
  'check_no_match_original': '✗ {name} não corresponde a este registo. Uma cópia assinada também não vai corresponder — o registo guarda a impressão digital do original antes de a assinatura ser colocada — por isso verifique o original não assinado.',
  'check_read_error': 'Não foi possível ler esse ficheiro.',

  // A document sent to be signed: activity log and download
  'activity': 'Atividade',
  'action_opened': 'Abriu',
  'action_verified': 'Confirmou o endereço de email',
  'action_signature': 'Assinou',
  'action_annotation': 'Adicionou marcas',
  'action_highlight': 'Destacou',
  'action_text': 'Adicionou texto',
  'action_other': 'Fez outras alterações',
  'action_completed': 'Concluído',
  'download_busy': 'A obter…',
  'download_button': 'Transferir a cópia assinada',
  'download_deleted': 'A cópia guardada foi removida.',
  'download_failed': 'Não foi possível obter a cópia assinada. Tente novamente daqui a pouco.',

  // "Show it on a website" — the embeddable badge
  'badge_summary': 'Mostrar num site',
  'badge_summary_hint': 'Incorpore um distintivo com ligação para este certificado.',
  'badge_format_aria': 'Formato do distintivo',
  'badge_tab_live': 'Distintivo dinâmico',
  'badge_tab_image': 'Imagem + ligação',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Verifica este certificado sempre que a página é vista e só então mostra «✓ Assinado e verificado». Requer uma página que permita scripts.',
  'badge_desc_image': 'Para email e sites que não permitem scripts. A imagem não consegue verificar nada sozinha, por isso diz «clique para verificar» — a verificação é feita nesta página.',
  'badge_desc_markdown': 'Para um README ou qualquer outro sítio que aceite Markdown. Uma imagem fixa, tal como a versão em imagem.',
  'badge_preview_aria': 'Pré-visualização',
  'badge_link_text': 'Verificar esta assinatura',
  'badge_image_alt': 'Assinado com o Universal Signatures — clique para verificar',
  'badge_paste_label': 'Cole isto na sua página',
  'badge_copy': 'Copiar',
  'badge_copied': 'Copiado ✓',
}

export default verify
