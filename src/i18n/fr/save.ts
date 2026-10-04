import type { Messages } from '../en'

const save: Messages['save'] = {
  // The "Save your signature" card and its tabs
  'tabs_title': 'Enregistrer votre signature',
  'tabs_local': 'Local (temporaire)',
  'tabs_online': 'En ligne',

  // Shared
  'create_first': 'Créez d’abord une signature',
  'create_first_error': 'Créez d’abord une signature.',
  'typed_signature': 'Signature tapée',
  'drawn_signature': 'Signature dessinée',
  'style_type': 'tapée',
  'style_draw': 'dessinée',
  'remove': 'Retirer',
  'removing': 'Retrait…',
  'saving': 'Enregistrement…',

  // Save on this device
  'local_title': 'Enregistrer sur cet appareil',
  'local_no_account': 'Sans compte',
  'local_intro': 'Conservez votre signature dans ce navigateur pour la réutiliser plus tard — gratuitement, sans connexion. Elle reste sur cet appareil et ne le quitte jamais.',
  'local_name_placeholder': 'Nommer cette signature (facultatif)',
  'local_saved': '✓ Enregistrée sur cet appareil',
  'local_save': 'Enregistrer sur cet appareil',
  'local_saved_alt': 'Signature enregistrée',
  'local_rename_placeholder': 'Nom de la signature',
  'local_rename': 'Renommer',
  'local_in_use': 'Utilisée ✓',
  'local_use': 'Utiliser',
  'local_remove_aria': 'Retirer la signature enregistrée',

  // Save a verified signature to the cloud
  'cloud_title': 'Enregistrer une signature vérifiée dans le cloud',
  'cloud_intro': 'Stockez votre signature dans votre Universal ID avec un certificat qui rend toute falsification détectable, pour la réutiliser et la vérifier partout.',
  'cloud_checking': 'Vérification de votre compte…',
  'cloud_signed_out': 'Créez un {id} pour stocker votre signature en ligne GRATUITEMENT.',
  'cloud_sign_in': 'Créer un Universal ID / se connecter →',
  'cloud_no_company': 'Pour stocker plus de signatures, chacune avec son certificat, créez une entreprise dans votre {id} (c’est gratuit).',
  'cloud_set_up_company': 'Créer une entreprise →',
  'cloud_save': 'Enregistrer la signature vérifiée ☁',
  'cloud_via_token': 'Stockée dans votre Universal ID — vous pouvez la retirer à tout moment.',
  'cloud_via_subscription': 'Hébergement cloud inclus dans votre abonnement.',
  'cloud_via_project': 'Hébergement cloud inclus dans votre projet en cours.',
  'cloud_usage_one': 'Signature stockée gratuite utilisée : {used} sur {count}.',
  'cloud_usage_other': 'Signatures stockées gratuites utilisées : {used} sur {count}.',
  'cloud_saved': '✓ Enregistrée et vérifiée',
  'cloud_cert_link': 'Tout le monde peut confirmer cette signature grâce au lien de son certificat :',
  'cloud_copy': 'Copier',
  'cloud_remove_any_time': 'Vous pouvez retirer cette signature stockée à tout moment.',
  'cloud_remove_stored': 'Retirer la signature stockée',
  'cloud_blocked_remove_one': 'Vous avez atteint la limite de {count} signature stockée gratuite. Retirez-en une ci-dessous pour libérer de la place, ou auto-hébergez gratuitement votre propre copie.',
  'cloud_blocked_remove_other': 'Vous avez atteint la limite de {count} signatures stockées gratuites. Retirez-en une ci-dessous pour libérer de la place, ou auto-hébergez gratuitement votre propre copie.',
  'cloud_blocked_selfhost_one': 'Vous avez atteint la limite de {count} signature stockée gratuite. Vous pouvez auto-héberger gratuitement votre propre copie.',
  'cloud_blocked_selfhost_other': 'Vous avez atteint la limite de {count} signatures stockées gratuites. Vous pouvez auto-héberger gratuitement votre propre copie.',
  'cloud_blocked_no_limit': 'Vous avez utilisé votre espace gratuit de stockage de signatures. Vous pouvez auto-héberger gratuitement votre propre copie.',
  'cloud_self_host': 'Auto-héberger gratuitement',
  'cloud_need_more': 'Besoin de plus ? Dites-le-nous',
  'cloud_source': 'Source : {link}',
  'cloud_error_save': 'Impossible d’enregistrer.',
  'cloud_error_store': 'Impossible de stocker votre signature.',
  'cloud_error_remove': 'Impossible de retirer.',

  // Your stored signatures
  'stored_title': 'Vos signatures stockées',
  'stored_loading': 'Chargement…',
  'stored_none': 'Aucune signature stockée en ligne pour l’instant.',
  'stored_alt': 'Signature stockée',
  'stored_by_colleague': 'Enregistrée par un collègue',
  'stored_error_load': 'Impossible de charger vos signatures stockées.',

  // Your main signature
  'main_replace_confirm': 'Votre Universal ID conserve une seule signature principale. Remplacer celle que vous avez actuellement ?',
  'main_replace': 'La remplacer',
  'main_keep': 'Garder l’actuelle',
  'main_is_main': 'C’est votre signature principale ✓',
  'main_save': 'Enregistrer comme signature principale',
  'main_saved_note': 'Enregistrée dans votre Universal ID — utilisez-la ici, dans Universal PDF et sur n’importe quel appareil.',
  'main_note': 'Une par Universal ID, gratuite, avec ou sans entreprise. Utilisez-la ici, dans Universal PDF et sur n’importe quel appareil.',
  'main_error_save': 'Impossible d’enregistrer votre signature principale.',
  'main_error_too_large': 'Cette image de signature est trop volumineuse pour être stockée.',

  // Errors from saving and records
  'error_sign_in_to_save': 'Connectez-vous avec votre Universal ID pour enregistrer.',
  'error_storage_full': 'Vous avez utilisé votre espace gratuit de stockage de signatures. Retirez une signature stockée pour libérer de la place.',
  'error_sign_in_to_record': 'Connectez-vous avec votre Universal ID pour créer un enregistrement vérifiable.',
  'error_no_company_record': 'Créez une entreprise dans votre Universal ID (c’est gratuit) sur app.unisim.co.uk pour créer un enregistrement vérifiable.',
}

export default save
