# 🍽 BabaBala — Kafe & Pəncərə Satışı POS Sistemi

**BabaBala POS**, kafe masalarının və küçə/al-apar ("Pəncərə Satışı") nöqtəsinin gündəlik sifarişlərini, xərclərini, ofisiant dövriyyəsini və kassa hesabatlarını real vaxtda (canlı) idarə etmək üçün hazırlanmış sürətli, mobil-yönümlü (PWA) kassa və idarəetmə sistemidir.

---

## ✨ Əsas Xüsusiyyətlər

### 1. İki Müstəqil Kassa Rejimi (`🍽 Kafe Masaları` və `🪟 Pəncərə Satışı`)
- **🍽 Kafe Masaları Rejimi:**
  - **15 masa** iki qrup altında idarə olunur: **Masalar (1 – 6)** və **Həyət (1 – 9)**.
  - Boş masalar yaşıl, aktiv sifarişi olan masalar isə narıncı/sarı rənglə və cari hesab məbləği ilə fərqlənir.
  - Masanın daxilində **Tez Seçim** bloku (*Sadə Çay* üzərində bir toxunuşla `1 ₼` / `2 ₼` qiymət dəyişmə düyməsi, *Süzmə Pivə NZS 0.5l*, *Süzmə Araq 100 qr*), **7 Menyu Kateqoriyası** və **+ Sərbəst Qiymət** funksiyası mövcuddur.
- **🪟 Pəncərə Satışı (Küçə / Al-Apar) Rejimi:**
  - Kafenin önündəki pəncərədən edilən ayaqüstü satışlar üçün ayrı sürətli kassa ekranı.
  - Pəncərə menyusu (*Ətli qızarmış dürmək*, *Sosisli qızarmış dürmək*, *Böyük peraşki*, *Kiçik peraşki*, *Mini peraşki*).
  - Pəncərə satışı və xərcləri Kafe masalarının kassa hesabından **tamamilə ayrı** hesablanır.

---

### 2. Rol və Təhlükəsizlik Sistemi (Bir Dəfəlik Seçim + PIN Qoruması)
Cihazda tətbiq ilk dəfə açılanda (həm adi brauzerdə, həm də iPhone Safari **"Ana Ekrana Əlavə Et" / PWA** rejimində) rol seçimi və 4 rəqəmli təhlükəsizlik kodu tələb olunur:

| Rol | Səlahiyyət | Gecikməsiz Giriş Kodu |
| :--- | :--- | :---: |
| **👑 Müdir (Admin)** | Tam səlahiyyət: Canlı kassa, Günlük Hesabat, Arxiv, Ofisiant dövriyyəsi, səhv çeklərin/xərclərin silinməsi (`✕`) və günün bağlanması | `2008` |
| **☕ 1-ci Ofisiant** | Masa sifarişləri, hesab bağlama, Pəncərə satışı və xərc əlavə etmə (Kassa rəqəmləri, hesabat və arxiv gizlidir) | `1111` |
| **☕ 2-ci Ofisiant** | Masa sifarişləri, hesab bağlama, Pəncərə satışı və xərc əlavə etmə (Kassa rəqəmləri, hesabat və arxiv gizlidir) | `2222` |

- **Həmişəlik Yaddaş:** Kod bir dəfə düzgün yığıldıqdan sonra cihaz həmin hesabda (`localStorage` daxilində `bababala_user_role` və `bababala_role_verified_v1`) həmişəlik qalır — səhifə yenilənəndə və ya proqram bağlanıb açılanda təkrar kod soruşulmur.
- **Gizli Rol Dəyişmə (Triple-Tap):** Yuxarı sol küncdəki **"BabaBala"** loqosuna ard-arda **3 dəfə toxunduqda** rol seçim pəncərəsi yenidən açılır (digər hesaba keçmək üçün həmin hesabın kodu tələb olunur).

---

### 3. Zero-Config Firebase Firestore Canlı Sinxronizasiya
- Bütün cihazlar heç bir əlavə ayar daxil etmədən birbaşa `bababalakafe` Firebase Firestore bazasına qoşulur (`🟢 Canlı`).
- **İki Ayrı Kolleksiya Sənədi (`bababala_data`):**
  1. `live_shift` — Cari günün açıq masaları, bağlanmış çekləri, pəncərə satışları və xərcləri.
  2. `shift_archive` — Bağlanmış keçmiş iş günlərinin müstəqil arxivi (1 MB sənəd limitinin dolmaması üçün canlı növbədən ayrılıb).
- **İlkin Sinxronizasiya Qoruması (`isInitialSyncDone`):** Yeni açılan cihaz bazadan ilk canlı məlumatı (`onSnapshot`) oxuyana qədər bazaya yazma əməliyyatı etmir; beləliklə köhnə keşin canlı məlumatları silməsinin qarşısı alınır.
- **Echo (Əks-Səda) Qoruması:** Cihazın öz göndərdiyi yeniləmə paketləri (`CLIENT_ID`) öz üzərinə təkrar yazılmır, sürətli toxunuşlarda sifariş itkisi baş vermir.

---

### 4. Xərc İdarəetməsi və Dinamik Hazır Seçimlər
- Həm Admin, həm də Ofisiantlar alt paneldəki yığcam **Xərc Əlavə Et (-)** düyməsi ilə xərc qeyd edə bilər (Ofisiantlarda ümumi xərc siyahısı və cəmi məbləğ gizlidir).
- Seçilən xərc növünə görə hazır çip düymələri dinamik dəyişir:
  - **🍽 Kafe Xərci:** `Çörək`, `Araq`, `Pivə`, `Xiyar & Pomidor`
  - **🪟 Pəncərə Xərci:** `Un`, `Lavaş`, `Kartof`, `Droj`

---

### 5. Səhv Çeklərin Silinməsi (`✕`) və Müstəqil Arxiv (`📅 Arxiv`)
- **Səhv və ya Test Qeydlərinin Silinməsi (Yalnız Admin):**
  - Həm masanın daxilindəki *"Bu Masada Əvvəl Bağlananlar"* siyahısında, həm də *Günlük Hesabat* pəncərəsində hər çekin, xərcin və pəncərə satışının yanında qırmızı `✕` düyməsi var.
  - Çek silindikdə məbləği dərhal ümumi kassadan, içindəki məhsulların sayı isə satılan məhsullar (inventar) siyahısından avtomatik çıxılır.
- **Ofisiant Statistikası:** Günlük hesabatda və arxivdə 1-ci və 2-ci Ofisiantın gün ərzində neçə masa bağladığı və nə qədər dövriyyə (`₼`) etdiyi ayrı-ayrılıqda göstərilir.
- **📅 Arxiv Pəncərəsi:** Keçmiş günlərin hər birinə toxunaraq həmin günün Kafe və Pəncərə xalis qazancına, ofisiant dövriyyəsinə, satılmış hər bir yemək/içki/dürmək/peraşki sayına və xərclərinə detallı baxmaq, yaxud test günlərini `✕` ilə silmək mümkündür.

---

### 6. Qaranlıq Rejim (Dark Mode) və Mobil PWA Uyğunluğu
- Yuxarı başlıqdakı `🌙 / ☀️` düyməsi ilə gecə növbəsi üçün gözü yormayan `#121212` tünd rejimə keçid edilir və seçim yadda saxlanılır.
- `manifest.json` iOS Safari və Android Chrome-da tam ekran ("Ana Ekrana Əlavə Et") PWA rejimi üçün optimallaşdırılıb.

---

## 📁 Layihənin Fayl Strukturu

```text
├── index.html      # Əsas ekran, Masa paneli, Pəncərə satışı, Hesabat, Arxiv və Rol/PIN modalları
├── style.css       # Mobil-ilk (iOS/Android) dizayn, Qaranlıq rejim (#121212) və rol görünüş qaydaları
├── app.js          # POS məntiqi, menyu kataloqu, rol/PIN idarəetməsi və Firebase Firestore sinxronizasiyası
├── manifest.json   # PWA (Ana Ekrana Əlavə Et) konfiqurasiyası
└── README.md       # Sistem sənədləşməsi
```

---

## 🚀 Quraşdırma və İstifadə

1. Repozitoriyanı klonlayın və ya Vercel / GitHub Pages üzərindən birbaşa yayınlayın:
   ```bash
   git clone https://github.com/nihathamidoff-debug/bababalapos.git
   ```
2. `index.html` faylını brauzerdə açın və ya Vercel linkini telefonunuzda (Safari / Chrome) açaraq **"Ana Ekrana Əlavə Et" (Add to Home Screen)** seçin.
3. İlk açılışda cihazın rolunu seçin və müvafiq 4 rəqəmli kodu (`2008`, `1111` və ya `2222`) daxil edin.
