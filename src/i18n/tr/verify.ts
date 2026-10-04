import type { Messages } from '../en'

const verify: Messages['verify'] = {
  // The certificate page (opened from the QR on a signed PDF)
  'title': 'İmza sertifikası',
  'certificate_id': 'Sertifika {id}',
  'verifying': 'Doğrulanıyor…',
  'verified_signing': 'Doğrulandı — bu belge Universal Signatures ile imzalandı',
  'verified_signature': 'Doğrulandı — bu, kaydedilmiş gerçek bir imza',
  'verified_request': 'Doğrulandı — bu belge, gönderildiği herkes tarafından imzalandı',
  'request_waiting': 'Gönderildi, imzalanması hâlâ bekleniyor',
  'lookup_failed': 'Doğrulama hizmetine ulaşılamadı, bu yüzden bu sertifika henüz kontrol edilmedi. Bağlantınızı kontrol edip yeniden deneyin.',
  'try_again': 'Yeniden dene',
  'not_found': '✗ Bu sertifika için kayıt bulunamadı. Bağlantı yanlış olabilir veya kayıt kaldırılmış olabilir.',
  'back_home': '← Universal Signatures',

  // Row labels
  'row_signed_by': 'İmzalayan',
  'row_waiting_for': 'Beklenen kişi',
  'row_organisation': 'Kuruluş',
  'row_document': 'Belge',
  'row_signed': 'İmzalandı',
  'row_saved': 'Kaydedildi',
  'row_sent': 'Gönderildi',
  'row_signer': 'İmzalayan',
  'row_original_hash': 'Orijinal belge karması (SHA-256)',
  'row_signed_hash': 'İmzalı kopya karması (SHA-256)',
  'row_sent_hash': 'Gönderildiği haliyle belge (SHA-256)',
  'row_signature_hash': 'İmza karması (SHA-256)',

  'hash_note_both': 'İlk karma, {original} belgenin imzalanmadan önceki parmak izidir; ikincisi ise {signed} tam olarak üretildiği haliyle parmak izidir.',
  'hash_note_original_only': 'Yukarıdaki karma, {original} belgenin imza eklenmeden önceki parmak izidir.',
  'hash_note_original': 'orijinal',
  'hash_note_signed': 'imzalı kopyanın',

  // Checking a PDF against the record
  'check_intro_both': 'İmzalı kopya veya orijinal elinizde mi? Bu kayıtla karşılaştırın — parmak izi tarayıcınızda alınır ve asla karşıya yüklenmez.',
  'check_intro_original': 'Orijinal PDF elinizde mi? Bu kayıtla karşılaştırın — parmak izi tarayıcınızda alınır ve asla karşıya yüklenmez.',
  'check_busy': 'Kontrol ediliyor…',
  'check_button': 'PDF kontrol et',
  'check_match_signed': '✓ {name}, üretildiği haliyle bayt bayt imzalı kopyanın ta kendisi. O zamandan beri içinde hiçbir şey değişmedi.',
  'check_match_original': '✓ {name}, bu kaydın oluşturulduğu orijinal belge; imzalanmadan önceki haliyle.',
  'check_no_match_both': '✗ {name} ne imzalı kopya ne de orijinal. İmzalı kopya olması gerekiyorsa, imzalandıktan sonra değiştirilmiş — yeniden kaydetmek veya PDF olarak yazdırmak bile buna dahildir.',
  'check_no_match_original': '✗ {name} bu kayıtla eşleşmiyor. İmzalı bir kopya da eşleşmez — kayıt, imza eklenmeden önceki orijinalin parmak izini tutar — bu yüzden imzasız orijinali kontrol edin.',
  'check_read_error': 'Bu dosya okunamadı.',

  // A document sent to be signed: activity log and download
  'activity': 'Etkinlik',
  'action_opened': 'Açtı',
  'action_verified': 'E-posta adresini onayladı',
  'action_signature': 'İmzaladı',
  'action_annotation': 'İşaret ekledi',
  'action_highlight': 'Vurguladı',
  'action_text': 'Metin ekledi',
  'action_other': 'Başka değişiklikler yaptı',
  'action_completed': 'Tamamlandı',
  'download_busy': 'Getiriliyor…',
  'download_button': 'İmzalı kopyayı indir',
  'download_deleted': 'Saklanan kopya kaldırıldı.',
  'download_failed': 'İmzalı kopya getirilemedi. Biraz sonra yeniden deneyin.',

  // "Show it on a website" — the embeddable badge
  'badge_summary': 'Bir web sitesinde gösterin',
  'badge_summary_hint': 'Bu sertifikaya bağlanan bir rozet yerleştirin.',
  'badge_format_aria': 'Rozet biçimi',
  'badge_tab_live': 'Canlı rozet',
  'badge_tab_image': 'Görsel + bağlantı',
  'badge_tab_markdown': 'Markdown',
  'badge_desc_live': 'Sayfa her görüntülendiğinde bu sertifikayı kontrol eder ve ancak o zaman “✓ İmzalandı ve doğrulandı” gösterir. Betiklere izin veren bir sayfa gerekir.',
  'badge_desc_image': 'E-posta ve betiklere izin vermeyen siteler için. Görsel kendi başına hiçbir şeyi kontrol edemez, bu yüzden “doğrulamak için tıklayın” der — kontrol bu sayfada yapılır.',
  'badge_desc_markdown': 'README veya Markdown kabul eden başka herhangi bir yer için. Görsel sürümü gibi sabit bir resim.',
  'badge_preview_aria': 'Önizleme',
  'badge_link_text': 'Bu imzayı doğrula',
  'badge_image_alt': 'Universal Signatures ile imzalandı — doğrulamak için tıklayın',
  'badge_paste_label': 'Bunu sayfanıza yapıştırın',
  'badge_copy': 'Kopyala',
  'badge_copied': 'Kopyalandı ✓',
}

export default verify
