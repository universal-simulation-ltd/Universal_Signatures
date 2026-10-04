import type { Messages } from '../en'

const sign: Messages['sign'] = {
  // The "Sign a PDF" card
  'title': 'PDF imzala',
  'mode_group_label': 'Kim imzalıyor',
  'mode_self': 'Kendim imzalayacağım',
  'mode_send': 'İmzaya gönder',
  'intro_self': 'Bir belgeye imzanızı ekleyin — tarayıcınızda işlenir ve asla karşıya yüklenmez.',
  'intro_send': 'Bir belgeyi başka birine imzalatın. Hesap gerekmeden tarayıcısında imzalar ve ikiniz de bir sertifika alırsınız.',

  // The drop circle (keep short)
  'drop_label': 'Bir PDF’i buraya bırakın veya seçmek için tıklayın',
  'drop_label_another': 'Başka bir PDF’i buraya bırakın veya seçmek için tıklayın',
  'drop_pages_one': '{count} sayfa',
  'drop_pages_other': '{count} sayfa',
  'drop_change': 'başkasını bırakın veya değiştirmek için tıklayın',
  'drop_over': 'Açmak için bırakın',
  'drop_here': 'PDF’i buraya bırakın',
  'drop_stays_local': 'cihazınızda kalır',
  'drop_uploaded_on_send': 'yalnızca gönderdiğinizde yüklenir',
  'drop_browse': 'veya göz atmak için tıklayın',
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
  'page_label': 'Sayfa',
  'page_option': 'Sayfa {n}',
  'page_option_last': 'Sayfa {n} (son)',
  'page_every': 'Her sayfa ({count})',
  'page_initial_each': 'Her sayfayı parafla, sonuncuyu imzala',
  'size_label': 'Boyut (%{pct})',
  'position_label': 'Konum',
  'position_label_initials': 'İmza konumu (son sayfa)',
  'position_group_label': 'Sayfadaki konum',
  'anchor_top_left': 'Sol üst',
  'anchor_top_center': 'Orta üst',
  'anchor_top_right': 'Sağ üst',
  'anchor_mid_left': 'Sol orta',
  'anchor_mid_center': 'Orta',
  'anchor_mid_right': 'Sağ orta',
  'anchor_bottom_left': 'Sol alt',
  'anchor_bottom_center': 'Orta alt',
  'anchor_bottom_right': 'Sağ alt',
  'position_custom': 'Özel konum',
  'position_choose': 'Konum seçin…',
  'position_custom_set': '✓ Özel konum ayarlandı',
  'position_use_grid': 'Izgarayı kullan',
  'position_needs_signature': 'Yerleşimi önizlemek için bir imza oluşturun.',

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
  'picker_live': 'İmzanın merkezi sayfanın soldan %{x}, üstten %{y} konumunda.',
  'picker_cancel': 'İptal',
  'picker_confirm': 'Bu konumu kullan',

  // Stamped into the signed PDF (WinAnsi only: no ı, ğ, ş, İ — falls back to English otherwise)
  'qr_caption': 'Kontrol etmek için okutun · Universal Signatures',
}

export default sign
