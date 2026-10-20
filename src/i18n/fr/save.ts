import type { Messages } from '../en'

const save: Messages['save'] = {
  // The "Save your signature" card and its tabs
  'tabs_title': 'Enregistrer votre signature',

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
  'local_intro': 'Conservez votre signature dans ce navigateur pour la réutiliser plus tard — gratuitement, sans connexion. Rien n’est envoyé en ligne. Effacer les données de ce navigateur la supprime : enregistrez-la dans un fichier si vous voulez en garder une copie.',
  'local_name_placeholder': 'Nommer cette signature (facultatif)',
  'local_saved': '✓ Enregistrée sur cet appareil',
  'local_save': 'Enregistrer sur cet appareil',
  'local_saved_alt': 'Signature enregistrée',
  'local_rename_placeholder': 'Nom de la signature',
  'local_rename': 'Renommer',
  'local_in_use': 'Utilisée ✓',
  'local_use': 'Utiliser',
  'local_remove_aria': 'Retirer la signature enregistrée',

  // Save to a file / Open a file (moves saved signatures between devices)
  'file_title': 'Les utiliser sur un autre appareil',
  'file_intro': 'Enregistrez vos signatures dans un fichier, puis ouvrez ce fichier ici dans un autre navigateur ou sur un autre appareil. Rien n’est envoyé en ligne.',
  'file_password_label': 'Mot de passe du fichier (facultatif)',
  'file_password_hint': 'Avec un mot de passe, le fichier ne s’ouvre qu’avec celui-ci. Un mot de passe oublié ne peut pas être récupéré. Utilisez le même champ pour ouvrir un fichier qui en a un.',
  'file_save': 'Enregistrer dans un fichier',
  'file_nothing_to_save': 'Rien d’enregistré ici pour l’instant',
  'file_open': 'Ouvrir un fichier',
  'file_opening': 'Ouverture…',
  'file_try_again': 'L’ouvrir',
  'file_saved': '{name} enregistré.',
  'file_error_save': 'Impossible d’enregistrer le fichier.',
  'file_added_one': '{count} signature ajoutée depuis le fichier.',
  'file_added_other': '{count} signatures ajoutées depuis le fichier.',
  'file_already_here': 'Toutes les signatures de ce fichier sont déjà ici.',
  'file_none_usable': 'Ce fichier ne contient aucune signature utilisable.',
  'file_not_fit_one': '{count} n’a pas pu être ajoutée : ce navigateur en garde {max} au maximum. Retirez-en une et ouvrez à nouveau le fichier.',
  'file_not_fit_other': '{count} n’ont pas pu être ajoutées : ce navigateur en garde {max} au maximum. Retirez-en quelques-unes et ouvrez à nouveau le fichier.',
  'file_skipped_one': '{count} n’a pas pu être utilisée et a été laissée de côté.',
  'file_skipped_other': '{count} n’ont pas pu être utilisées et ont été laissées de côté.',

  // Errors from saving and records
  'error_sign_in_to_record': 'Connectez-vous avec votre Universal ID pour créer un enregistrement vérifiable.',
  'error_no_company_record': 'Créez une entreprise dans votre Universal ID (c’est gratuit) sur app.unisim.co.uk pour créer un enregistrement vérifiable.',
}

export default save
