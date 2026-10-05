import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // The "Sign a PDF" card
  'title': 'Signer un PDF',
  'mode_group_label': 'Qui signe',
  'mode_self': 'Le signer moi-même',
  'mode_send': 'Envoyer pour signature',
  'intro_self': 'Ajoutez votre signature à un document — il est traité dans votre navigateur et n’est jamais envoyé en ligne.',
  'intro_send': 'Demandez à quelqu’un d’autre de signer un document. Il signe dans son navigateur, sans compte, et vous recevez tous deux un certificat. Vous n’avez pas besoin de votre propre signature pour cela.',

  // The drop circle (keep short)
  'drop_label': 'Déposez un PDF ici ou cliquez pour en choisir un',
  'drop_label_another': 'Déposez un autre PDF ici ou cliquez pour en choisir un',
  'drop_pages_one': '{count} page',
  'drop_pages_other': '{count} pages',
  'drop_change': 'déposez-en un autre ou cliquez pour changer',
  'drop_over': 'Déposez pour ouvrir',
  'drop_here': 'Déposez un PDF ici',
  'drop_stays_local': 'il reste sur votre appareil',
  'drop_uploaded_on_send': 'envoyé en ligne seulement à l’envoi',
  'drop_browse': 'ou cliquez pour parcourir',
  'drop_browse_tap': 'ou touchez pour parcourir',
  'drop_anywhere_title': 'Déposez-le n’importe où',
  'drop_anywhere_hint': 'Un PDF — il est signé dans ce navigateur et n’est jamais envoyé en ligne',

  // Errors
  'error_not_pdf': '{name} n’est pas un PDF.',
  'error_encrypted': '{name} est protégé par mot de passe et ne peut donc pas être signé ici. Retirez d’abord son mot de passe, puis réessayez.',
  'error_unreadable': 'Impossible de lire {name}. Il est peut-être endommagé, ou ce n’est pas vraiment un PDF.',
  'error_no_email': 'Votre Universal ID n’a pas d’adresse e-mail enregistrée : impossible de créer un enregistrement vérifiable.',
  'error_record': 'Impossible de créer l’enregistrement vérifiable.',
  'error_sign': 'Impossible de signer le PDF.',

  // Page, size and position
  'page_label': 'Page',
  'page_option': 'Page {n}',
  'page_option_last': 'Page {n} (dernière)',
  'page_every': 'Toutes les pages ({count})',
  'page_initial_each': 'Parapher chaque page, signer la dernière',
  'size_label': 'Taille ({pct} %)',
  'position_label': 'Position',
  'position_label_initials': 'Position de la signature (dernière page)',
  'position_group_label': 'Position sur la page',
  'anchor_top_left': 'En haut à gauche',
  'anchor_top_center': 'En haut au centre',
  'anchor_top_right': 'En haut à droite',
  'anchor_mid_left': 'Au milieu à gauche',
  'anchor_mid_center': 'Centre',
  'anchor_mid_right': 'Au milieu à droite',
  'anchor_bottom_left': 'En bas à gauche',
  'anchor_bottom_center': 'En bas au centre',
  'anchor_bottom_right': 'En bas à droite',
  'position_custom': 'Position personnalisée',
  'position_choose': 'Choisir la position…',
  'position_custom_set': '✓ Position personnalisée définie',
  'position_use_grid': 'Utiliser la grille',
  'position_needs_signature': 'Créez une signature pour prévisualiser son emplacement.',

  // Options
  'omit_extras': '{bold} — signer ce document avec la signature seule, sans ce que vous avez ajouté dans « Créez votre signature ».',
  'omit_extras_bold': 'Ne pas inclure le nom, la date et l’heure',
  'certificate': '{bold} — ajoute au PDF une page de certificat et un code QR, et enregistre un enregistrement vérifiable gratuit (votre adresse e-mail, le nom du fichier, une empreinte de l’original non signé et l’heure). La page indique aussi l’horloge et le fuseau horaire de votre appareil, signalés comme déclarés par vous. Le document lui-même n’est jamais envoyé en ligne.',
  'certificate_bold': 'Ajouter un certificat de signature',
  'certificate_sign_in': '{link} pour activer les enregistrements vérifiables.',
  'certificate_sign_in_link': 'Connectez-vous avec un Universal ID gratuit',

  // Signing
  'signing': 'Signature…',
  'button_needs_signature': 'Créez d’abord une signature',
  'button_needs_initials': 'Ajoutez d’abord vos initiales',
  'button_sign': 'Signer et télécharger le PDF',
  'signed_as': '✓ Signé — téléchargé sous le nom {name}',
  'record_created': '✓ Enregistrement vérifiable créé',
  'record_qr_links_here': 'Le PDF signé porte un code QR qui renvoie ici :',
  'record_copy': 'Copier',
  'record_copy_hash': 'L’empreinte de la copie signée figure aussi dans l’enregistrement : toute personne à qui vous l’envoyez peut vérifier sur cette page qu’elle n’a pas été modifiée.',

  // Position picker (dialog)
  'picker_title': 'Choisir la position de la signature',
  'picker_hint': 'Cliquez ou faites glisser sur la page pour placer votre signature, ou utilisez les touches fléchées.',
  'picker_close': 'Fermer',
  'picker_error': 'Impossible d’afficher cette page.',
  'picker_rendering': 'Affichage de la page…',
  'picker_surface_label': 'Aperçu de la page. Utilisez les touches fléchées pour déplacer la signature ; maintenez Maj pour la déplacer plus loin.',
  'picker_page_alt': 'Page du PDF',
  'picker_sig_alt': 'Aperçu de la signature',
  'picker_live': 'Centre de la signature à {x} % de la largeur et {y} % de la hauteur de la page.',
  'picker_cancel': 'Annuler',
  'picker_confirm': 'Utiliser cette position',

  // Stamped into the signed PDF
  'qr_caption': 'Scannez pour vérifier · Universal Signatures',
}

export default sign
