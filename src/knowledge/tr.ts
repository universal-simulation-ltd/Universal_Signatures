import type { Article } from './types'

const articles: Article[] = [
  {
    id: 'electronic-digital-wet-signatures',
    title: 'Elektronik, dijital ve ıslak imzalar',
    summary: '"İmza" denince kastedilen üç şey ve bu uygulamanın hangisini oluşturduğu.',
    group: 'Temel bilgiler',
    body: `"İmza" kelimesi birbirinden oldukça farklı şeyler için kullanılır. Bunları ayırt edebilmek işinize yarar.

## Islak imza

Geleneksel imzadır: adınızı kâğıda mürekkeple yazarsınız. Adını sayfadaki mürekkebin henüz ıslak olmasından alır.

## Elektronik imza

Elektronik imza, bir belgeyi kabul ettiğinizi göstermenin her türlü elektronik yoludur. Bir PDF'e yerleştirilmiş el yazısı imzanızın görüntüsü, klavyeyle yazılmış bir ad ya da bir web sitesindeki işaretlenmiş bir kutu kadar basit olabilir. Pek çok ülke elektronik imzayı gündelik anlaşmaların geniş bir bölümü için tanır; ancak bazı gayrimenkul, aile veya mahkeme belgeleri gibi belgeler için ek kurallar olabilir.

## Dijital imza

Dijital imza, elektronik imzanın belirli bir teknik türüdür. Belgeyi mühürlemek için kriptografi ve genellikle güvenilir bir kuruluşun verdiği bir sertifika kullanır. Dosya sonradan değiştirilirse PDF okuyucu gibi bir yazılım bunu fark edebilir ve imzayı geçersiz olarak gösterebilir.

## Universal Signatures neyi oluşturur

Universal Signatures **elektronik imza** oluşturur. Çizdiğiniz veya yazdığınız imzanın görüntüsünü bir PDF'in sayfasına yerleştirir. Dosyaya sertifika tabanlı bir dijital imza eklemez.

İmzalama sertifikası eklemeyi seçerseniz ("İmzalama sertifikaları ve doğrulanabilir kayıtlar" makalesine bakın), belgenin parmak izinin bağımsız bir kaydını da alırsınız. Bu kayıt, bir dosyanın imzaladığınız dosya olduğunu daha sonra göstermeye yardımcı olur. Yararlı bir kanıttır, ancak sertifika tabanlı bir dijital imzayla aynı şey değildir.

## Hukuka dair bir not

Bir elektronik imzanın kabul edilip edilmeyeceği bulunduğunuz yere, belgenin türüne ve diğer tarafların neyi kabul ettiğine bağlıdır. Bu bilgiler geneldir ve hukuki tavsiye değildir. Bir belge gerçekten önemliyse alıcının neyi kabul ettiğini kontrol ediniz ya da yetkin bir danışmana başvurunuz.`,
  },
  {
    id: 'signature-image-formats',
    title: 'İmzanız neden şeffaf bir PNG',
    summary: 'Görüntü biçimlerinin açıklaması ve şeffaflığın bir imza için neden önemli olduğu.',
    group: 'Temel bilgiler',
    body: `Bu uygulamada oluşturduğunuz her imza, ister çizilmiş, ister yazılmış, ister telefonda çizilmiş olsun, arka planı şeffaf bir PNG görüntüsüne dönüştürülür. Nedeni şudur.

## Pikseller ve biçimler

Dijital bir görüntü, piksel adı verilen küçük renkli karelerden oluşan bir ızgaradır. Görüntü biçimi ise bu ızgarayı bir dosyada saklamanın üzerinde uzlaşılmış bir yoludur. En yaygın olanlar şunlardır:

- **JPEG** fotoğraflar için tasarlanmıştır. Gözün pek fark etmeyeceği ayrıntıları atarak dosyaları küçültür. Şeffaflığı desteklemez; her pikselin dolu bir rengi vardır, bir imzanın çevresinde genellikle beyazdır.
- **PNG** her pikseli olduğu gibi saklar ("kayıpsız" bir biçimdir) ve şeffaflığı destekler; pikseller tamamen ya da kısmen saydam olabilir.
- **WebP** her iki sıkıştırma türünü de kullanabilen ve şeffaflığı da destekleyen daha yeni bir biçimdir, ancak eski yazılımlar onu her zaman tanımaz.

## Şeffaflık neden önemlidir

Belgeler nadiren tamamen beyazdır. İmza atmak istediğiniz yerde bir imza çizgisi, gölgeli bir kutu, bir form alanı ya da basılı metin olabilir. JPEG bir imza bunların üzerine beyaz bir dikdörtgen olarak oturur ve altındakileri gizler. Şeffaf bir PNG yalnızca mürekkebi bırakır; tıpkı kalemle olduğu gibi, sayfa çizgilerin çevresinden görünmeye devam eder.

## Kayıpsız olmak neden önemlidir

İmzalar keskin kenarlı ince çizgilerden oluşur. JPEG sıkıştırması bu kenarları bulanıklaştırma ve çevresinde hafif lekeler bırakma eğilimindedir. PNG çizgileri net tutar.

## Yazılan imzalar da görüntüye dönüşür

Adınızı yazdığınızda uygulama onu seçtiğiniz el yazısı yazı tipiyle çizer ve sonucu PNG olarak kaydeder. Böylece yazılan bir imza, o yazı tipi yüklü olmasa bile PDF'i açan her bilgisayarda aynı görünür.`,
  },
  {
    id: 'how-signing-works',
    title: 'Bir PDF imzaladığınızda neler olur',
    summary: 'Her şey tarayıcınızda gerçekleşir ve belge hiçbir zaman yüklenmez.',
    group: 'Nasıl çalışır',
    body: `Universal Signatures ile bir PDF imzalamak tamamen web tarayıcınızın içinde, kendi cihazınızda gerçekleşir.

## Adımlar

1. Fare, parmak veya kalemle çizerek, adınızı el yazısı bir yazı tipiyle yazarak ya da telefonunuzda çizerek bir imza oluşturursunuz.
2. Bir PDF seçersiniz. Tarayıcınız dosyayı okur ve sayfalarını gösterir; bunun için dosyayı hiçbir yere göndermez.
3. Sayfayı, konumu ve boyutu seçersiniz. İmzayı bir köşeye, bir kenara ya da ortaya hizalayabilir veya sayfanın önizlemesinde tam bir nokta seçebilirsiniz.
4. Bir ad, tarih veya saat eklediyseniz bunları imzanın altına basabilirsiniz.
5. Uygulama imza görüntüsünü sayfaya yerleştirir ve özgün adın sonuna "-signed" eklenmiş yeni bir dosyayı kaydetmeniz için sunar.

Özgün dosyanız değiştirilmez. İmzalı kopya yeni bir dosyadır.

## Çevrimdışı çalışır

İmzalamak için hiçbir sunucu gerekmediğinden, internet bağlantınız kapalıyken de bir PDF imzalayabilirsiniz. Yalnızca isteğe bağlı özellikler bağlantı gerektirir: imzayı buluta kaydetmek, telefonda imzalamak ve imzalama sertifikası eklemek.

## Neyi yapar, neyi yapmaz

- İmzanızın görüntüsünü belgenin bir sayfasına yerleştirir. Form alanlarını doldurmaz ve birden fazla belgeyi birleştirmez.
- PDF'i kilitlemez. Uygun yazılıma sahip herkes imzalı kopyayı yine de düzenleyebilir. İmzalama sertifikası, imzasız özgün dosyanın parmak izini kaydeder. Bu, daha sonra hangi belgeyi imzaladığınızı göstermeye yarar, ancak imzalı kopyada yapılan değişiklikleri tespit etmez.
- Yazılan imzalar yerleşik el yazısı yazı tiplerinden birini ya da sizin içe aktardığınız bir yazı tipi dosyasını kullanır. İçe aktarılan yazı tipi yalnızca sizin cihazınızda ve o oturum boyunca kullanılır.

## İpuçları

- Kararlı bir çizgiyle imzalayınız. İstediğiniz zaman "Clear" düğmesine basıp yeniden deneyebilirsiniz.
- İmzanın belgeyle orantılı kalması için sayfayı yakınlaştırmak yerine boyut kaydırıcısını kullanınız.
- İmzalama sertifikası eklemeyi düşünüyorsanız imzasız özgün dosyayı saklayınız; sertifikadaki parmak izi o özgün dosyayı tanımlar.`,
  },
  {
    id: 'sign-on-your-phone',
    title: 'Telefonunuzda imzalamak',
    summary: 'QR kodu ve PIN bir imzayı telefonunuzdan bilgisayarınıza nasıl taşır.',
    group: 'Nasıl çalışır',
    body: `Fareyle imza çizmek zahmetlidir. Telefonunuzda imzalamak, belge bilgisayarınızda kalırken dokunmatik ekranda parmağınızı kullanmanızı sağlar.

## Nasıl çalışır

1. Bilgisayarınızda telefon seçeneğini seçiniz. Uygulama bir QR kodu ve 6 haneli bir PIN gösterir.
2. QR kodunu telefonunuzun kamerasıyla tarayınız. Telefonunuzun tarayıcısında bir imza sayfası açılır.
3. PIN'i telefonunuza giriniz ve imzanızı çiziniz.
4. İmza bilgisayarınızda kullanıma hazır olarak görünür.

## İmza nasıl iletilir

Telefonunuz ve bilgisayarınız birbiriyle doğrudan iletişim kuramaz; bu yüzden imza görüntüsü internet üzerinden canlı bir aktarıcıdan geçer. Aktarıcı mesajı gelir gelmez iletir. Mesaj bir veritabanına kaydedilmez ve oturum açmış olsanız da olmasanız da aynı şekilde çalışır.

Bu yolculuğu yalnızca imza görüntüsü yapar. PDF baştan sona bilgisayarınızda kalır.

## Aktarımı ne korur

- QR kodu tahmin edilmesi zor, rastgele ve tek kullanımlık bir kod içerir; böylece doğru sayfayı yalnızca ekranınızı görebilen biri açabilir.
- Bilgisayarınız yalnızca kendi ekranında gösterilen PIN'i taşıyan bir imzayı kabul eder. Diğer her şey yok sayılır.
- Baştan başlamak isterseniz yeni bir QR kodu ve PIN isteyebilirsiniz.

QR kodunu ve PIN'i diğer kısa ömürlü kodlar gibi değerlendiriniz: bunlar görünürken ekranınızın fotoğrafını paylaşmayınız.`,
  },
  {
    id: 'signing-certificates',
    title: 'İmzalama sertifikaları ve doğrulanabilir kayıtlar',
    summary: 'İsteğe bağlı sertifika sayfası ve QR kodunun neyi kaydettiği ve neyi kanıtladığı.',
    group: 'Nasıl çalışır',
    body: `Bir Universal ID ile oturum açtıysanız, imzalamadan önce **Add a signing certificate** (imzalama sertifikası ekle) kutusunu işaretleyebilirsiniz. Bu isteğe bağlı ve ücretsizdir.

## Neler alırsınız

- İmzalı PDF'in sonuna eklenen bir **sertifika sayfası**.
- İmzanızın yanında "Scan to verify" yazılı küçük bir **QR kodu**.
- Sunucularımızda, bağlantıya sahip herkesin görüntüleyebileceği bir **kayıt**.

## Kayıtta neler bulunur

- Universal ID'nize ait e-posta adresi.
- Özgün dosya adı.
- Belgenin, siz imzalamadan önceki hâlinin SHA-256 parmak izi ("hash").
- Kaydın oluşturulduğu zaman; sunucumuzun saatine göre.

Belgenin kendisi hiçbir zaman yüklenmez. Hash, dosyanın içeriğinden hesaplanan kısa bir harf ve rakam dizisidir. Aynı dosya her zaman aynı hash'i verir, tek bir karakteri farklı olan bir dosya tamamen farklı bir hash verir ve dosya hash'inden yeniden oluşturulamaz.

## Sertifika sayfası

Sayfa, sunucumuzun kaydettiği bilgileri (doğrulanmış e-posta adresiniz, zaman ve sertifika kimliği) kendi cihazınızın bildirdiği bilgilerden (saati ve saat dilimi) ayırır. Bir bilgisayarın saati istenen herhangi bir değere ayarlanabildiği için ikinci grup, beyana dayalı olarak işaretlenir. Hiçbir konum bilgisi kaydedilmez.

## Bir belgeyi kontrol etmek

QR kodunu taramak veya sertifika sayfasında basılı bağlantıyı açmak kaydı gösterir: kimin imzaladığı, dosya adı, ne zaman kaydedildiği ve parmak izi. Bir kopyanın imzalanan kopya olduğunu doğrulamak için imzasız özgün dosyanın SHA-256 hash'ini hesaplayıp gösterilenle karşılaştırınız. Eşleşiyorlarsa kayıt tam olarak o dosyaya aittir.

## Neyi kanıtlamaz

Kayıt, belirli bir Universal ID'nin o belgenin parmak izini o anda kaydettiğini gösterir. İmzalayan kişinin kimliğini e-posta adresinin ötesinde doğrulamaz ve kişinin nerede olduğuna dair hiçbir şey kaydetmez.

## Dosya adını düşününüz

Dosya adı gerçek bir bilgidir. "İstifa dilekçesi.pdf" gibi bir ad, içerik cihazınızdan hiç çıkmasa bile bir şey anlatır. Bu önemliyse dosyayı önceden yeniden adlandırınız ya da kutuyu işaretlemeyiniz. İmzalama onsuz da tamamen aynı şekilde çalışır.`,
  },
  {
    id: 'privacy-and-storage',
    title: 'İmzanız nerede saklanır',
    summary: 'Bu cihaza kaydetmek, buluta kaydetmek ve cihazınızdan nelerin çıktığı.',
    group: 'Gizlilik ve güvenlik',
    body: `Universal Signatures'ı hesap açmadan ve imzaladığınız hiçbir şey cihazınızdan çıkmadan kullanabilirsiniz. Neyin nerede saklandığı tam olarak şöyledir.

## Bu cihaza kaydedilenler

Daha sonra yeniden kullanmak için bu tarayıcıda en fazla altı imza saklayabilirsiniz. Bunlar hiçbir hesap gerektirmeden, bu cihazdaki tarayıcınızın kendi depolama alanında tutulur. Bu site için tarayıcı verilerini temizlerseniz silinirler ve başka cihazlara ya da tarayıcılara taşınmazlar.

## Buluta kaydedilenler

Bir Universal ID ile oturum açtıysanız, diğer cihazlarınızda da kullanabilmek için bir imzayı buluta da kaydedebilirsiniz.

- Saklananlar: imza görüntüsü, girdiğiniz ad, çizilip çizilmediği veya yazıldıysa hangi yazı tipiyle yazıldığı, görüntünün SHA-256 parmak izi ve tarih.
- Kimler görebilir: hesabınız ve bir Universal ID kuruluşunu paylaşıyorsanız o kuruluşun diğer üyeleri.
- Kaydedilen bir imza bir sertifika bağlantısı alır. Bu bağlantıya sahip herkes imzalayanın adını, kuruluşun adını, tarihi ve parmak izini görebilir. Bağlantı imza görüntüsünü göstermez.
- Kaydedilen bir imzayı istediğiniz zaman kaldırabilirsiniz. Ücretsiz bir hesapta kaydedilen imza ücretsiz Signatures jetonunuzu kullanır; imzayı kaldırdığınızda jeton size geri verilir.

Bulut depolama **uçtan uca şifreli değildir**. Veriler şifreli bir bağlantı üzerinden iletilir ve erişim kurallarıyla korunur, ancak sistemlerimiz teknik olarak bunları okuyabilir. Bu ödünleşimi yapmak istemiyorsanız bu cihaza kaydediniz.

## Cihazınızdan neler, ne zaman çıkar

- **Hiçbir zaman:** imzaladığınız PDF, bu uygulamanın hiçbir özelliğinde.
- **Telefonda imzaladığınızda:** çizdiğiniz imza görüntüsü; canlı bir aktarıcıdan geçer ve saklanmaz.
- **İmzalama sertifikası eklediğinizde:** e-posta adresiniz, dosya adı ve belgenin parmak izi.
- **Buluta kaydettiğinizde:** imza görüntüsü ve yukarıda sayılan bilgiler.
- **Oturum açtığınızda:** hesabınızın etkinlik sayfası doğru olsun diye uygulamanın açıldığına dair bir not. Belgeleriniz hakkında hiçbir şey içermez.
- **Uygulama açıkken:** uygulamanın kullanımda olduğunu bildiren düzenli bir sinyal; uygulamanın adını, bu cihazda oluşturulan rastgele bir kimliği ve oturum açtıysanız hesabınızı içerir.

Uygulamada reklam veya üçüncü taraf izleme betikleri yoktur.

## Universal ID'niz

Universal ID'niz, UNI·SIM uygulamalarının ortak kullandığı tek hesaptır. Yalnızca isteğe bağlı bulut özellikleri için gerekir. Bir PDF imzalamak hiçbir zaman gerektirmez.`,
  },
]

export default articles
