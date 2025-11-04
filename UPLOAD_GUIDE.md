# 📤 GitHub'a Yükleme Rehberi

## ⚠️ YÜKLEMEDEN ÖNCE MUTLAKA KONTROL ET!

### 🔴 ASLA YÜKLEME - Hassas Dosyalar

Bu dosyaları GitHub'a **ASLA** yükleme:

#### Backend
```
❌ backend/.env                    (AIR Kit credential'lar içeriyor)
❌ backend/keys/private.key        (RSA private key)
❌ backend/keys/public.key         (RSA public key)
❌ backend/keys/jwks.json          (JSON Web Key Set)
❌ backend/*.log                   (Log dosyaları)
❌ backend/node_modules/           (Bağımlılıklar)
```

#### Frontend
```
❌ frontend/.env                   (AIR Kit credential'lar içeriyor)
❌ frontend/*.log                  (Log dosyaları)
❌ frontend/node_modules/          (Bağımlılıklar)
❌ frontend/dist/                  (Build dosyaları)
```

### ✅ YÜKLE - Güvenli Dosyalar

Bu dosyaları yükleyebilirsin:

```
✅ backend/src/*.js                (Kaynak kodlar)
✅ backend/tests/*.js              (Test dosyaları)
✅ backend/package.json            (Bağımlılık listesi)
✅ backend/.env.example            (Örnek environment dosyası)
✅ backend/README.md

✅ frontend/src/**/*.jsx           (React component'ler)
✅ frontend/src/**/*.css           (Stiller)
✅ frontend/src/assets/*           (Görseller)
✅ frontend/package.json           (Bağımlılık listesi)
✅ frontend/.env.example           (Örnek environment dosyası)
✅ frontend/index.html
✅ frontend/vite.config.js
✅ frontend/README.md

✅ README.md                       (Ana readme)
✅ SECURITY.md                     (Güvenlik rehberi)
✅ MOCA_REQUIREMENTS.md            (Moca istekleri)
✅ LICENSE                         (Lisans)
✅ .gitignore                      (Git ignore kuralları)
```

---

## 🚀 GitHub'a Yükleme Adımları

### 1. GitHub'da Yeni Repo Oluştur

1. GitHub'a git: https://github.com
2. "New repository" butonuna tıkla
3. **Repository name:** `carbonchain` veya `carbonchain-marketplace`
4. **Description:** "Carbon credit marketplace with AIR Kit verification - Built for Moca Network"
5. **Visibility:** 
   - 🔒 **Private** (önerilen - credential'lar için)
   - 🌐 **Public** (eğer showcase etmek istersen)
6. ✅ "Add a README file" kutucuğunu **TIKLA**
7. ✅ "Add .gitignore" > "Node" seç
8. ✅ "Choose a license" > "MIT License" seç
9. "Create repository" butonuna tıkla

### 2. Yerel Bilgisayarında Proje Klasörünü Hazırla

Bu zip dosyasını indir ve çıkar:
```
carbonchain-github.zip
```

Çıkarılan klasör yapısı:
```
carbonchain-github/
├── backend/
├── frontend/
├── README.md
├── .gitignore
└── diğer dosyalar...
```

### 3. Terminal/Command Prompt Aç

Windows:
- `Win + R` > `cmd` > Enter

Mac/Linux:
- `Cmd + Space` > "Terminal" yaz > Enter

### 4. Proje Klasörüne Git

```bash
cd path/to/carbonchain-github
```

Örnek:
```bash
# Windows
cd C:\Users\YourName\Downloads\carbonchain-github

# Mac/Linux
cd ~/Downloads/carbonchain-github
```

### 5. Git Başlat

```bash
git init
git add .
git commit -m "Initial commit - CarbonChain marketplace"
```

### 6. GitHub Repo'na Bağlan

GitHub'da oluşturduğun repo sayfasında "Code" butonuna tıkla ve URL'yi kopyala.

```bash
git remote add origin https://github.com/KULLANICIADIN/carbonchain.git
```

**ÖNEMLİ:** `KULLANICIADIN` yerine kendi GitHub kullanıcı adını yaz!

### 7. Push Et

```bash
git branch -M main
git push -u origin main
```

**Not:** GitHub ilk push'ta kullanıcı adı ve şifre/token isteyecek:
- Username: GitHub kullanıcı adın
- Password: Personal Access Token (PAT) gerekiyor

---

## 🔑 Personal Access Token (PAT) Oluşturma

Eğer şifre isterse:

1. GitHub'a git: https://github.com/settings/tokens
2. "Generate new token (classic)" tıkla
3. **Note:** "CarbonChain Upload"
4. **Expiration:** 90 days
5. **Select scopes:**
   - ✅ `repo` (tüm kutucukları işaretle)
6. "Generate token" butonuna tıkla
7. **Token'ı kopyala ve GÜVENLİ bir yere kaydet!** (Bir daha gösterilmeyecek)
8. Terminal'de "Password:" sorusunda bu token'ı yapıştır

---

## ✅ Yükleme Sonrası Kontrol

GitHub repo sayfana git ve kontrol et:

### ✅ Görünmesi Gerekenler
- [x] `README.md` - Ana açıklama
- [x] `backend/` klasörü
- [x] `frontend/` klasörü
- [x] `.gitignore` dosyası
- [x] `LICENSE` dosyası
- [x] `SECURITY.md`
- [x] `MOCA_REQUIREMENTS.md`

### ❌ GÖRÜNMEMESİ Gerekenler
- [x] `.env` dosyaları
- [x] `keys/` klasörü
- [x] `node_modules/` klasörleri
- [x] `.log` dosyaları

**Eğer `.env` veya `keys/` görünüyorsa:**
```bash
# Hemen sil!
git rm --cached backend/.env
git rm --cached -r backend/keys/
git commit -m "Remove sensitive files"
git push
```

---

## 📝 README Güncelleme

GitHub'da README.md'yi düzenle:

1. README.md'ye tıkla
2. Kalem ikonuna (✏️) tıkla
3. Şu kısmı güncelle:
   ```markdown
   **Live Demo:** [https://carbonchain.coinsspor.com/](https://carbonchain.coinsspor.com/)
   
   Project Link: [https://github.com/KULLANICIADIN/carbonchain](https://github.com/KULLANICIADIN/carbonchain)
   ```
4. "Commit changes" butonuna tıkla

---

## 🎯 Repo'yu Moca'ya Gönderme

Discord'da Moca Network'e gönder:

```
Hey @Laisha | Moca Network! 👋

CarbonChain projesini GitHub'a yükledim:
🔗 GitHub: https://github.com/KULLANICIADIN/carbonchain
🌐 Live Demo: https://carbonchain.coinsspor.com/

📋 Tamamlanan Özellikler:
✅ Full backend API (15+ endpoint)
✅ Complete frontend (7 sayfa)
✅ AIR Kit entegrasyonu
✅ Secondary market
✅ JWT authentication

🔄 Devam Eden:
- 5,634 karbon kredisi datasını yükleme
- Gerçek AIR Credential sistemi
- Blockchain entegrasyonu

README.md'de projenin detaylı durumu ve eksik kısımlar var.
Backend entegrasyonu için call'a hazırım! 🚀
```

---

## 🔧 Sonradan Değişiklik Yapmak

Eğer dosyalarda değişiklik yaparsan:

```bash
git add .
git commit -m "Açıklama mesajı"
git push
```

Örnek:
```bash
git add .
git commit -m "Add real carbon credit data"
git push
```

---

## ⚠️ Sorun Giderme

### Sorun 1: "Permission denied"
**Çözüm:** Personal Access Token kullan (yukarıda açıklandı)

### Sorun 2: "Repository not found"
**Çözüm:** URL'yi kontrol et:
```bash
git remote -v
# Yanlışsa düzelt:
git remote set-url origin https://github.com/DOGRUKULLANICIADI/carbonchain.git
```

### Sorun 3: ".env dosyası yüklendi"
**Çözüm:**
```bash
git rm --cached backend/.env frontend/.env
echo "backend/.env" >> .gitignore
echo "frontend/.env" >> .gitignore
git commit -m "Remove .env files and update .gitignore"
git push --force
```

### Sorun 4: "Large files warning"
**Çözüm:** node_modules yüklenmiş olabilir:
```bash
git rm -r --cached backend/node_modules frontend/node_modules
git commit -m "Remove node_modules"
git push
```

---

## 🎉 Başarı Kontrol Listesi

Yükleme başarılıysa:

- ✅ GitHub repo'sunda dosyalar görünüyor
- ✅ `.env` dosyası YOK
- ✅ `keys/` klasörü YOK
- ✅ `node_modules/` klasörü YOK
- ✅ README.md düzgün görünüyor
- ✅ Kod syntax highlight'lanmış
- ✅ Live demo linki çalışıyor

---

## 📞 Yardım

Sorun yaşarsan:
1. SECURITY.md dosyasını oku
2. GitHub docs: https://docs.github.com
3. Discord'da Moca ekibine sor

**Kolay gelsin! 🚀**
