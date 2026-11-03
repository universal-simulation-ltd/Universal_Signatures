import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // The "Sign a PDF" card
  'title': 'PDF imzala',
  'mode_group_label': 'Kim imzalıyor',
  'mode_self': 'Kendim imzalayacağım',
  'mode_send': 'İmzaya gönder',
  'intro_self': 'Bir belgeye imzanızı ekleyin — tarayıcınızda işlenir ve asla karşıya yüklenmez.',
  'intro_send': 'Bir belgeyi başka birine imzalatın. Hesap gerekmeden tarayıcısında imzalar ve ikiniz de bir sertifika alırsınız. Bunun için kendi imzanız gerekmez.',

  // The drop circle (keep short)
  'drop_label': 'Bir PDF’i buraya bırakın veya seçmek için tıklayın',
  'drop_label_another': 'Başka bir PDF’i buraya bırakın veya seçmek için tıklayın',
  'drop_pages_one': '{count} sayfa',
  'drop_pages_other': '{count} sayfa',
  'change_pdf': 'PDF’yi değiştir',
  'drop_over': 'Açmak için bırakın',
  'drop_here': 'PDF’i buraya bırakın',
  'drop_stays_local': 'cihazınızda kalır',
  'drop_uploaded_on_send': 'yalnızca gönderdiğinizde yüklenir',
  'drop_browse': 'veya göz atmak için tıklayın',
  'drop_browse_tap': 'veya göz atmak için dokunun',
  'signature_first': 'Önce imzanızı oluşturun, ardından PDF’yi ekleyin.',
  'drop_anywhere_title': 'Herhangi bir yere bırakın',
  'drop_anywhere_hint': 'Bir PDF — bu tarayıcıda imzalanır ve asla karşıya yüklenmez',

  // Errors
  'error_not_pdf': '{name} bir PDF değil.',
  'error_encrypted': '{name} parola korumalı, bu yüzden burada imzalanamaz. Önce parolasını kaldırın, ardından yeniden deneyin.',
  'error_unreadable': '{name} okunamadı. Hasarlı olabilir veya aslında bir PDF olmayabilir.',
  'error_no_email': 'Universal ID’nizde kayıtlı bir e-posta adresi yok, bu yüzden doğrulanabilir bir kayıt oluşturulamaz.',
  'error_record': 'Doğrulanabilir kayıt oluşturulamadı.',
  'error_sign': 'PDF imzalanamadı.',

  // Page, size and position
  'layout_label': 'Nasıl imzalanacak',
  'layout_once': 'Bir kez imzala',
  'layout_once_hint': 'İmzanız tek bir sayfada',
  'layout_every': 'Her sayfayı imzala',
  'layout_every_hint': 'İmzanız her sayfada aynı yerde',
  'layout_initial_once': 'Tüm sayfaları parafla, bir kez imzala',
  'layout_initial_once_hint': 'Parafınız her sayfada, imzanız sonuncuda',
  'layout_initial_every': 'Tüm sayfaları parafla ve imzala',
  'layout_initial_every_hint': 'Parafınız ve imzanız her sayfada',
  'page_label': 'Sayfa',
  'page_option': 'Sayfa {n}',
  'page_option_last': 'Sayfa {n} (son)',
  'size_label': 'Boyut (%{pct})',
  'position_label': 'Konum',
  'position_label_initials': 'İmza konumu (son sayfa)',
  'position_label_every': 'İmza konumu (her sayfa)',
  'position_needs_signature': 'Yerleşimi önizlemek için bir imza oluşturun.',
  'placer_hint': 'İmzanızı gideceği yere sürükleyin ya da oraya taşımak için sayfaya dokunun.',
  'position_reset': 'Köşeye geri al',

  // Options
  'omit_extras': '{bold} — bu belgeyi, “İmzanızı oluşturun” bölümünde eklediklerinizi katmadan yalnızca imzayla imzalayın.',
  'omit_extras_bold': 'Ad, tarih ve saati ekleme',
  'certificate': '{bold} — PDF’e bir sertifika sayfası ve bir QR ekler, ücretsiz ve doğrulanabilir bir kayıt saklar (e-posta adresiniz, dosya adı, imzasız orijinalin karması ve zaman). Sayfada ayrıca cihazınızın saati ve saat dilimi, kullanıcı beyanı olarak işaretlenmiş şekilde gösterilir. Belgenin kendisi asla karşıya yüklenmez.',
  'certificate_bold': 'İmzalama sertifikası ekle',
  'certificate_sign_in': 'Doğrulanabilir kayıtları etkinleştirmek için {link}.',
  'certificate_sign_in_link': 'ücretsiz bir Universal ID ile giriş yapın',

  // Signing
  'signing': 'İmzalanıyor…',
  'button_needs_signature': 'Önce bir imza oluşturun',
  'button_needs_initials': 'Önce parafınızı ekleyin',
  'button_sign': 'İmzala ve PDF’i indir',
  'button_sign_embedded': 'İmzala',
  'signed_as': '✓ İmzalandı — {name} olarak indirildi',
  'record_created': '✓ Doğrulanabilir kayıt oluşturuldu',
  'record_qr_links_here': 'İmzalı PDF, buraya bağlanan bir QR içerir:',
  'record_copy': 'Kopyala',
  'record_copy_hash': 'İmzalı kopyanın parmak izi de kayıtta yer alır; böylece onu gönderdiğiniz herkes, değiştirilmediğini bu sayfada kontrol edebilir.',

  // Position picker (dialog)
  'picker_title': 'İmza konumunu seçin',
  'picker_hint': 'İmzanızı yerleştirmek için sayfaya tıklayın veya sürükleyin ya da ok tuşlarını kullanın.',
  'picker_close': 'Kapat',
  'picker_error': 'Bu sayfa görüntülenemedi.',
  'picker_rendering': 'Sayfa görüntüleniyor…',
  'picker_surface_label': 'Sayfa önizlemesi. İmzayı taşımak için ok tuşlarını kullanın; daha fazla taşımak için Shift’i basılı tutun.',
  'picker_page_alt': 'PDF sayfası',
  'picker_sig_alt': 'İmza önizlemesi',
  'picker_initials_alt': 'Paraf önizlemesi',
  'preview_other_pages': 'Diğer sayfalar: parafınız',
  'picker_live': 'İmzanın merkezi sayfanın soldan %{x}, üstten %{y} konumunda.',
  'picker_cancel': 'İptal',
  'picker_confirm': 'Bu konumu kullan',

  // Stamped into the signed PDF (WinAnsi only: no ı, ğ, ş, İ — falls back to English otherwise)
  'qr_caption': 'Kontrol etmek için okutun · Universal Signatures',
  'attest_heading': 'Telefondan gönderilen imza',
  'attest_line': '{email} tarafından Universal ID ile imzalandı · {time}',
}

export default sign
