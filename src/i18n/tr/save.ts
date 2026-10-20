import type { Messages } from '../en'

const save: Messages['save'] = {
  // The "Save your signature" card and its tabs
  'tabs_title': 'İmzanızı kaydedin',

  // Shared
  'create_first': 'Önce bir imza oluşturun',
  'create_first_error': 'Önce bir imza oluşturun.',
  'typed_signature': 'Yazılı imza',
  'drawn_signature': 'Çizilmiş imza',
  'style_type': 'yazılı',
  'style_draw': 'çizim',
  'remove': 'Kaldır',
  'removing': 'Kaldırılıyor…',
  'saving': 'Kaydediliyor…',

  // Save on this device
  'local_title': 'Bu cihaza kaydet',
  'local_no_account': 'Hesap gerekmez',
  'local_intro': 'İmzanızı bu tarayıcıda saklayın ve daha sonra yeniden kullanın — ücretsiz, giriş yapmadan. Hiçbir şey yüklenmez. Bu tarayıcının verileri temizlenirse silinir; bir kopyasını istiyorsanız bir dosyaya kaydedin.',
  'local_name_placeholder': 'Bu imzaya ad verin (isteğe bağlı)',
  'local_saved': '✓ Bu cihaza kaydedildi',
  'local_save': 'Bu cihaza kaydet',
  'local_saved_alt': 'Kayıtlı imza',
  'local_rename_placeholder': 'İmza adı',
  'local_rename': 'Yeniden adlandır',
  'local_in_use': 'Kullanımda ✓',
  'local_use': 'Kullan',
  'local_remove_aria': 'Kayıtlı imzayı kaldır',

  // Save to a file / Open a file (moves saved signatures between devices)
  'file_title': 'Başka bir cihazda kullanın',
  'file_intro': 'İmzalarınızı bir dosyaya kaydedin, ardından o dosyayı başka bir tarayıcıda veya başka bir cihazda burada açın. Hiçbir şey yüklenmez.',
  'file_password_label': 'Dosya parolası (isteğe bağlı)',
  'file_password_hint': 'Parola koyarsanız dosya yalnızca onunla açılır. Unutulan bir parola kurtarılamaz. Parolalı bir dosyayı açmak için de aynı kutuyu kullanın.',
  'file_save': 'Dosyaya kaydet',
  'file_nothing_to_save': 'Burada henüz kayıtlı bir şey yok',
  'file_open': 'Dosya aç',
  'file_opening': 'Açılıyor…',
  'file_try_again': 'Aç',
  'file_saved': '{name} kaydedildi.',
  'file_error_save': 'Dosya kaydedilemedi.',
  'file_added_one': 'Dosyadan {count} imza eklendi.',
  'file_added_other': 'Dosyadan {count} imza eklendi.',
  'file_already_here': 'Bu dosyadaki tüm imzalar zaten burada.',
  'file_none_usable': 'Bu dosyada kullanılabilecek imza yok.',
  'file_not_fit_one': '{count} imza sığmadı: bu tarayıcı en fazla {max} imza saklar. Birini kaldırıp dosyayı yeniden açın.',
  'file_not_fit_other': '{count} imza sığmadı: bu tarayıcı en fazla {max} imza saklar. Birkaçını kaldırıp dosyayı yeniden açın.',
  'file_skipped_one': '{count} imza kullanılamadı ve dışarıda bırakıldı.',
  'file_skipped_other': '{count} imza kullanılamadı ve dışarıda bırakıldı.',

  // Errors from saving and records
  'error_sign_in_to_record': 'Doğrulanabilir bir kayıt oluşturmak için Universal ID’nizle giriş yapın.',
  'error_no_company_record': 'Doğrulanabilir bir kayıt oluşturmak için app.unisim.co.uk adresinde Universal ID’nizde bir şirket kurun (ücretsizdir).',
}

export default save
