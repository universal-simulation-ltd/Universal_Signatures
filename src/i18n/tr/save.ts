import type { Messages } from '../en'

const save: Messages['save'] = {
  // The "Save your signature" card and its tabs
  'tabs_title': 'İmzanızı kaydedin',
  'tabs_local': 'Yerel (geçici)',
  'tabs_online': 'Çevrimiçi',

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
  'local_intro': 'İmzanızı bu tarayıcıda saklayın ve daha sonra yeniden kullanın — ücretsiz, giriş yapmadan. Bu cihazda kalır ve asla dışarı çıkmaz.',
  'local_name_placeholder': 'Bu imzaya ad verin (isteğe bağlı)',
  'local_saved': '✓ Bu cihaza kaydedildi',
  'local_save': 'Bu cihaza kaydet',
  'local_saved_alt': 'Kayıtlı imza',
  'local_rename_placeholder': 'İmza adı',
  'local_rename': 'Yeniden adlandır',
  'local_in_use': 'Kullanımda ✓',
  'local_use': 'Kullan',
  'local_remove_aria': 'Kayıtlı imzayı kaldır',

  // Save a verified signature to the cloud
  'cloud_title': 'Doğrulanmış bir imzayı buluta kaydedin',
  'cloud_intro': 'İmzanızı, kurcalandığında bunu belli eden bir sertifikayla Universal ID’nize bağlı olarak saklayın; böylece her yerde yeniden kullanabilir ve doğrulayabilirsiniz.',
  'cloud_checking': 'Hesabınız kontrol ediliyor…',
  'cloud_signed_out': 'İmzanızı ÜCRETSİZ olarak çevrimiçi saklamak için bir {id} oluşturun.',
  'cloud_sign_in': 'Universal ID oluşturun / giriş yapın →',
  'cloud_no_company': 'Her biri için bir sertifikayla daha fazla imza saklamak için {id} hesabınızda bir şirket kurun (ücretsizdir).',
  'cloud_set_up_company': 'Şirket kurun →',
  'cloud_save': 'Doğrulanmış imzayı kaydet ☁',
  'cloud_via_token': 'Universal ID’nize bağlı olarak saklanır — istediğiniz zaman kaldırabilirsiniz.',
  'cloud_via_subscription': 'Bulut barındırma aboneliğinize dahildir.',
  'cloud_via_project': 'Bulut barındırma etkin projenize dahildir.',
  'cloud_usage_one': '{count} ücretsiz saklanan imza hakkınızın {used} tanesini kullandınız.',
  'cloud_usage_other': '{count} ücretsiz saklanan imza hakkınızın {used} tanesini kullandınız.',
  'cloud_saved': '✓ Kaydedildi ve doğrulandı',
  'cloud_cert_link': 'Herkes bu imzayı sertifika bağlantısıyla doğrulayabilir:',
  'cloud_copy': 'Kopyala',
  'cloud_remove_any_time': 'Saklanan bu imzayı istediğiniz zaman kaldırabilirsiniz.',
  'cloud_remove_stored': 'Saklanan imzayı kaldır',
  'cloud_blocked_remove_one': '{count} ücretsiz saklanan imza hakkınızın tamamını kullandınız. Yer açmak için aşağıdan birini kaldırın veya kendi kopyanızı ücretsiz olarak kendiniz barındırın.',
  'cloud_blocked_remove_other': '{count} ücretsiz saklanan imza hakkınızın tamamını kullandınız. Yer açmak için aşağıdan birini kaldırın veya kendi kopyanızı ücretsiz olarak kendiniz barındırın.',
  'cloud_blocked_selfhost_one': '{count} ücretsiz saklanan imza hakkınızın tamamını kullandınız. Kendi kopyanızı ücretsiz olarak kendiniz barındırabilirsiniz.',
  'cloud_blocked_selfhost_other': '{count} ücretsiz saklanan imza hakkınızın tamamını kullandınız. Kendi kopyanızı ücretsiz olarak kendiniz barındırabilirsiniz.',
  'cloud_blocked_no_limit': 'Ücretsiz imza depolama alanınızı kullandınız. Kendi kopyanızı ücretsiz olarak kendiniz barındırabilirsiniz.',
  'cloud_self_host': 'Ücretsiz kendiniz barındırın',
  'cloud_need_more': 'Daha fazlası mı gerekiyor? Bize bildirin',
  'cloud_source': 'Kaynak: {link}',
  'cloud_error_save': 'Kaydedilemedi.',
  'cloud_error_store': 'İmzanız saklanamadı.',
  'cloud_error_remove': 'Kaldırılamadı.',

  // Your stored signatures
  'stored_title': 'Saklanan imzalarınız',
  'stored_loading': 'Yükleniyor…',
  'stored_none': 'Henüz çevrimiçi saklanan bir şey yok.',
  'stored_alt': 'Saklanan imza',
  'stored_by_colleague': 'Bir iş arkadaşınız kaydetti',
  'stored_error_load': 'Saklanan imzalarınız yüklenemedi.',

  // Your main signature
  'main_replace_confirm': 'Universal ID’niz tek bir ana imza tutar. Mevcut imzanız değiştirilsin mi?',
  'main_replace': 'Değiştir',
  'main_keep': 'Mevcut olanı koru',
  'main_is_main': 'Bu sizin ana imzanız ✓',
  'main_save': 'Ana imzam olarak kaydet',
  'main_saved_note': 'Universal ID’nize kaydedildi — burada, Universal PDF’te ve her cihazda kullanın.',
  'main_note': 'Her Universal ID için bir tane, ücretsiz, şirketli veya şirketsiz. Burada, Universal PDF’te ve her cihazda kullanın.',
  'main_error_save': 'Ana imzanız kaydedilemedi.',
  'main_error_too_large': 'Bu imza görseli saklanamayacak kadar büyük.',

  // Errors from saving and records
  'error_sign_in_to_save': 'Kaydetmek için Universal ID’nizle giriş yapın.',
  'error_storage_full': 'Ücretsiz imza depolama alanınızı kullandınız. Yer açmak için saklanan bir imzayı kaldırın.',
  'error_sign_in_to_record': 'Doğrulanabilir bir kayıt oluşturmak için Universal ID’nizle giriş yapın.',
  'error_no_company_record': 'Doğrulanabilir bir kayıt oluşturmak için app.unisim.co.uk adresinde Universal ID’nizde bir şirket kurun (ücretsizdir).',
}

export default save
