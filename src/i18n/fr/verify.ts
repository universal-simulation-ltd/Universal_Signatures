import type { Messages } from '../en'

const verify: Messages['verify'] = {
  // The certificate page
  'title': 'Certificat de signature',
  'certificate_id': 'Certificat {id}',
  'verifying': 'Vérification…',
  'verified_signing': 'Vérifié — ce document a été signé avec Universal Signatures',
  'verified_signature': 'Vérifié — il s’agit d’une signature enregistrée authentique',
  'verified_request': 'Vérifié — ce document a été signé par tous ses destinataires',
  'request_waiting': 'Envoyé, toujours en attente de signature',
  'lookup_failed': 'Impossible de joindre le service de vérification : ce certificat n’a donc pas encore été vérifié. Vérifiez votre connexion et réessayez.',
  'try_again': 'Réessayer',
  'not_found': '✗ Aucun enregistrement trouvé pour ce certificat. Le lien est peut-être erroné, ou l’enregistrement a été supprimé.',
  'back_home': '← Universal Signatures',

  // Row labels
  'row_signed_by': 'Signé par',
  'row_waiting_for': 'En attente de',
  'row_organisation': 'Organisation',
  'row_document': 'Document',
  'row_signed': 'Signé le',
  'row_saved': 'Enregistré le',
  'row_sent': 'Envoyé le',
  'row_signer': 'Signataire',
  'row_original_hash': 'Empreinte du document original (SHA-256)',
  'row_signed_hash': 'Empreinte de la copie signée (SHA-256)',
  'row_sent_hash': 'Document tel qu’envoyé (SHA-256)',
  'row_signature_hash': 'Empreinte de la signature (SHA-256)',

  'hash_note_both': 'La première empreinte identifie le document {original}, avant sa signature ; la seconde, la {signed} exactement telle qu’elle a été produite.',
  'hash_note_original_only': 'L’empreinte ci-dessus identifie le document {original}, avant l’ajout de la signature.',
  'hash_note_original': 'original',
  'hash_note_signed': 'copie signée',

  // Checking a PDF against the record
  'check_intro_both': 'Vous avez la copie signée, ou l’original ? Comparez-le à cet enregistrement — son empreinte est calculée dans votre navigateur et il n’est jamais envoyé en ligne.',
  'check_intro_original': 'Vous avez le PDF original ? Comparez-le à cet enregistrement — son empreinte est calculée dans votre navigateur et il n’est jamais envoyé en ligne.',
  'check_busy': 'Vérification…',
  'check_button': 'Vérifier un PDF',
  'check_match_signed': '✓ {name} est la copie signée, octet pour octet, exactement telle qu’elle a été produite. Rien n’y a été modifié depuis.',
  'check_match_original': '✓ {name} est le document original pour lequel cet enregistrement a été créé, tel qu’il était avant d’être signé.',
  'check_no_match_both': '✗ {name} n’est ni la copie signée ni l’original. S’il s’agit censément de la copie signée, elle a été modifiée depuis sa signature — même un nouvel enregistrement ou une impression en PDF compte.',
  'check_no_match_original': '✗ {name} ne correspond pas à cet enregistrement. Une copie signée ne correspondra pas non plus — l’enregistrement identifie l’original avant l’ajout de la signature — vérifiez donc l’original non signé.',
  'check_read_error': 'Impossible de lire ce fichier.',

  // Activity log and download
  'activity': 'Activité',
  'action_opened': 'Ouvert',
  'action_verified': 'Adresse e-mail confirmée',
  'action_signature': 'Signé',
  'action_annotation': 'Annotations ajoutées',
  'action_highlight': 'Surlignage ajouté',
  'action_text': 'Texte ajouté',
  'action_other': 'Autres modifications',
  'action_completed': 'Terminé',
  'download_busy': 'Récupération…',
  'download_button': 'Télécharger la copie signée',
  'download_deleted': 'La copie stockée a été supprimée.',
  'download_failed': 'Impossible de récupérer la copie signée. Réessayez dans un instant.',

  // The embeddable badge
  'badge_summary': 'L’afficher sur un site web',
  'badge_summary_hint': 'Intégrez un badge qui renvoie vers ce certificat.',
  'badge_format_aria': 'Format du badge',
  'badge_tab_live': 'Badge dynamique',
  'badge_tab_image': 'Image + lien',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Vérifie ce certificat à chaque affichage de la page et n’affiche qu’ensuite « ✓ Signé et vérifié ». Nécessite une page qui autorise les scripts.',
  'badge_desc_image': 'Pour les e-mails et les sites qui n’autorisent pas les scripts. L’image ne peut rien vérifier elle-même : elle indique donc « cliquez pour vérifier » — la vérification se fait sur cette page.',
  'badge_desc_markdown': 'Pour un README ou tout autre endroit qui accepte le Markdown. Une image fixe, comme la version image.',
  'badge_preview_aria': 'Aperçu',
  'badge_link_text': 'Vérifier cette signature',
  'badge_image_alt': 'Signé avec Universal Signatures — cliquez pour vérifier',
  'badge_paste_label': 'Collez ceci dans votre page',
  'badge_copy': 'Copier',
  'badge_copied': 'Copié ✓',
}

export default verify
