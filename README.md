# 🧠 PSYTALK — Backend API

> Psixoloji mərkəzlər və fərdi psixoloqlar üçün onlayn seans platformasının REST API-si

---

## 📋 Mündəricat

- [Layihə haqqında](#-layihə-haqqında)
- [Texnologiyalar](#-texnologiyalar)
- [Qovluq strukturu](#-qovluq-strukturu)
- [Başlamaq](#-başlamaq)
- [Mühit dəyişənləri (.env)](#-mühit-dəyişənləri-env)
- [API Endpointləri](#-api-endpointləri)
- [Auth Sistemi](#-auth-sistemi)
- [Token Arxitekturası](#-token-arxitekturası)
- [Email Sistemi](#-email-sistemi)
- [Serialization](#-serialization)
- [Guard-lar](#-guard-lar)
- [Verilənlər bazası](#-verilənlər-bazası)
- [Cron Job](#-cron-job)
- [Rol sistemi](#-rol-sistemi)
- [Swagger](#-swagger)
- [Əlaqəli qeydlər](#-əlaqəli-qeydlər)

---

## 🌐 Layihə haqqında

**PSYTALK** — psixoloji xidmətlər üçün B2B2C onlayn platforma. Mərkəzlər və fərdi psixoloqlar öz xidmətlərini təqdim edir, pasiyentlər isə platforma vasitəsilə onlarla əlaqə qura bilər.

**İstifadəçi rolları:**

| Rol | Açıqlama |
|-----|----------|
| `patient` | Platforma istifadəçisi — psixoloq seçib seans keçirən şəxs |
| `psychologist` | Fərdi psixoloq — qeydiyyatdan keçir, diplom yükləyir, admin təsdiqini gözləyir |
| `center` | Psixoloji mərkəz profili |
| `admin` | Platforma administratoru — psixoloqları təsdiqləyir |

---

## 🛠 Texnologiyalar

| Texnologiya | Versiya | İstifadə məqsədi |
|-------------|---------|------------------|
| **Node.js** | v24+ | Runtime mühiti |
| **NestJS** | v11 | Backend framework |
| **TypeORM** | v0.3 | ORM — verilənlər bazası ilə işləmək |
| **SQLite** | — | Development verilənlər bazası |
| **PostgreSQL** | — | Production verilənlər bazası |
| **JWT** | — | Access + Refresh token autentifikasiyası |
| **bcrypt** | v6 | Şifrə hashing |
| **nodemailer** | v8 | Email göndərmə |
| **Handlebars** | v4 | Email şablonları |
| **Swagger** | v11 | API sənədləşmə |
| **class-validator** | v0.14 | DTO validasiya |
| **@nestjs/throttler** | v6 | Rate limiting |
| **@nestjs/schedule** | v6 | Cron job-lar |

---

## 📁 Qovluq strukturu

```
src/
├── app.module.ts              # Əsas modul — bütün modulları birləşdirir
├── main.ts                    # Tətbiqin giriş nöqtəsi
│
├── auth/                      # Autentifikasiya modulu
│   ├── auth.controller.ts     # Register, login, logout, token yenilənmə
│   └── auth.service.ts        # Auth biznes məntiqi
│
├── users/                     # İstifadəçi modulu
│   ├── users.controller.ts    # Profil, yeniləmə, şifrə dəyişmə
│   └── users.service.ts       # İstifadəçi CRUD əməliyyatları
│
├── mail/                      # Email modulu
│   ├── mail.service.ts        # Email göndərmə funksiyaları
│   └── templates/             # Handlebars email şablonları
│       ├── welcome.hbs
│       ├── emailVerified.hbs
│       ├── passwordReset.hbs
│       └── passwordChanged.hbs
│
├── cleanup/                   # Token təmizləmə modulu
│   └── cleanup.service.ts     # Cron job — köhnə tokenları sil
│
├── common/                    # Ümumi paylaşılan fayllar
│   ├── types.ts               # Enum-lar: UserRole, TokenType, AuthProvider
│   ├── jwtToken.ts            # Access/Refresh token generasiyası
│   ├── entities/
│   │   ├── common.entity.ts   # id, createdAt, updatedAt baza entity
│   │   ├── user.entity.ts     # İstifadəçi cədvəli
│   │   └── token.entity.ts    # Token cədvəli
│   └── dtos/
│       ├── createUser.dto.ts
│       ├── login.dto.ts
│       ├── updateUser.dto.ts
│       ├── updatePassword.dto.ts
│       ├── forgetPassword.dto.ts
│       ├── resetPassword.dto.ts
│       ├── user.dto.ts        # Auth cavabı üçün minimal DTO
│       ├── userProfile.dto.ts # Tam profil DTO
│       └── authResponse.dto.ts
│
├── decorators/
│   ├── currentUser.decorator.ts  # JWT-dən cari user-i alır
│   └── role.decorator.ts         # @Roles() dekoratoru
│
├── guards/
│   ├── auth.guard.ts          # JWT token yoxlaması
│   └── role.guard.ts          # Rol əsaslı giriş kontrolu
│
└── interceptors/
    └── serielize.interceptor.ts  # @Serialize() — DTO filter
```

---

## 🚀 Başlamaq

### 1. Layihəni klonlayın

```bash
git clone https://github.com/aghasalimmusayev/psytalk.git
cd psytalk
```

### 2. Asılılıqları quraşdırın

```bash
npm install
```

### 3. `.env` faylını yaradın

```bash
cp .env.example .env
# Dəyərləri doldurun (aşağıya baxın)
```

### 4. Development rejimini başladın

```bash
npm run start:dev
```

### 5. Swagger UI-a daxil olun

```
http://localhost:4014/api
```

---

## ⚙️ Mühit dəyişənləri (.env)

```env
# Server
PORT=4014
NODE_ENV=development

# Client URL (email linklərində istifadə olunur)
CLIENT_URL=http://localhost:3000

# JWT - Access Token
JWT_ACCESS_SECRET=your_access_secret_here
JWT_ACCESS_TIME=15m

# JWT - Refresh Token
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_REFRESH_TIME=7d

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password
MAIL_FROM=noreply@psytalk.az
```

> ⚠️ `.env` faylını heç vaxt Git-ə push etməyin. `.gitignore`-a əlavə edin.

---

## 📡 API Endpointləri

### 🔐 Auth (`/auth`)

| Metod | Endpoint | Açıqlama | Qorunur? |
|-------|----------|----------|----------|
| `POST` | `/auth/rergister` | Qeydiyyat + email doğrulama linki | ❌ |
| `POST` | `/auth/login` | Giriş — access + refresh token | ❌ |
| `GET` | `/auth/email-verify?token=` | Email doğrulama | ❌ |
| `POST` | `/auth/forget-password` | Şifrə sıfırlama linki göndər | ❌ |
| `POST` | `/auth/reset-password?token=` | Yeni şifrə təyin et | ❌ |
| `POST` | `/auth/logout` | Çıxış — refresh token ləğv et | ✅ |
| `POST` | `/auth/logoutall` | Bütün cihazlardan çıxış | ✅ |

### 👤 Users (`/users`)

| Metod | Endpoint | Açıqlama | Qorunur? |
|-------|----------|----------|----------|
| `GET` | `/users/all` | Bütün istifadəçiləri gətir | ❌ |
| `GET` | `/users/profile` | Cari istifadəçinin profili | ✅ |
| `PATCH` | `/users/:id` | Profil yeniləmə | ✅ |
| `PATCH` | `/users/change-password/:id` | Şifrə dəyişmə | ✅ |
| `DELETE` | `/users/:id` | İstifadəçi sil | ✅ |

---

## 🔑 Auth Sistemi

### Qeydiyyat axını

```
POST /auth/rergister
  ↓
Şifrə hash-lanır (bcrypt)
  ↓
User DB-yə yazılır
  ↓
EMAIL_VERIFY token yaranır → TokenEntity-ə yazılır
  ↓
Welcome email göndərilir (doğrulama linki ilə)
  ↓
Refresh token → httpOnly cookie-yə yazılır
Access token → response body-sində qaytarılır
```

### Login axını

```
POST /auth/login
  ↓
Email + şifrə yoxlanılır
  ↓
Access token (15 dəq) + Refresh token (7 gün) yaranır
  ↓
Refresh token → httpOnly cookie-yə yazılır
Access token → response body-sində qaytarılır
```

### Şifrə sıfırlama axını

```
POST /auth/forget-password  →  Köhnə PASSWORD_RESET tokenlar ləğv edilir
                            →  Yeni token yaranır (15 dəq etibarlı)
                            →  Email göndərilir

POST /auth/reset-password?token=xxx
                            →  Token yoxlanılır
                            →  Eyni şifrə olub-olmadığı yoxlanılır
                            →  Şifrə yenilənir
                            →  Bütün REFRESH tokenlar ləğv edilir
                            →  "Şifrə dəyişdirildi" email göndərilir
```

---

## 🔐 Token Arxitekturası

Bütün tokenlər `TokenEntity` cədvəlində saxlanılır. İstifadəçi entity-sindəki köhnə `passwordResetToken` sahəsi artıq istifadə edilmir.

### TokenEntity sahələri

| Sahə | Tip | Açıqlama |
|------|-----|----------|
| `jti` | `string` (unique) | Token identifikatoru |
| `tokenHash` | `string` | bcrypt ilə hash edilmiş token |
| `type` | `TokenType` enum | `REFRESH`, `EMAIL_VERIFY`, `PASSWORD_RESET` |
| `expiresAt` | `Date` | Token bitmə tarixi |
| `isRevoked` | `boolean` | Ləğv olunub-olmadığı |
| `user` | `User` | Sahibi olan istifadəçi (ManyToOne) |

### Token növləri

```typescript
enum TokenType {
  REFRESH = 'refresh',           // Login/Register zamanı — .env-dəki JWT_REFRESH_TIME (default: `7d`)
  EMAIL_VERIFY = 'email_verify', // Qeydiyyat zamanı — 24 saat (auth.service.ts-də hardcode)
  PASSWORD_RESET = 'password_reset' // Şifrə sıfırlama — 15 dəqiqə (auth.service.ts-də hardcode)
}
```

### Refresh token strategiyası

- **Rotation**: Hər `/auth/refresh` sorğusunda köhnə token ləğv edilir, yeni yaranır
- **Revoke + Cron cleanup**: Ləğv edilmiş və müddəti bitmiş tokenlər hər həftə silinir
- **httpOnly cookie**: Refresh token brauzer JS-i tərəfindən oxuna bilmir

---

## 📧 Email Sistemi

### Email funksiyaları

| Funksiya | Tetikleyici | Şablon |
|----------|-------------|--------|
| `sendWelcome()` | Qeydiyyat | `welcome.hbs` |
| `sendEmailVerified()` | Email doğrulandıqda | `emailVerified.hbs` |
| `sendResetLink()` | Şifrə sıfırlama sorğusu | `passwordReset.hbs` |
| `sendPasswordChanged()` | Şifrə dəyişdirildikdə | `passwordChanged.hbs` |

### Email şablonları

Şablonlar Azərbaycan dilindədir və `src/mail/templates/` qovluğunda yerləşir. `nest-cli.json` bu şablonları `dist/` qovluğuna avtomatik kopyalayır.

```json
"assets": [
  { "include": "mail/templates/**/*", "watchAssets": true }
]
```

---

## 🗃 Serialization

`@Serialize()` dekoratoru ilə həssas sahələr API cavabından avtomatik çıxarılır.

```typescript
// Yalnız bu iki DTO istifadə olunur:
UserDto          // Auth cavabları üçün (minimal məlumat)
UserProfileDto   // GET /profile və PATCH /:id üçün (tam profil)
```

**Heç vaxt response-da görünməyən sahələr:**
- `password` — bcrypt hash
- `googleId` — OAuth identifikatoru
- `passwordResetToken` — köhnəlmiş sahə

---

## 🛡 Guard-lar

### AuthGuard

`Authorization: Bearer <access_token>` headerini yoxlayır. Token etibarlıdırsa, `request.user`-ə JWT payload yazılır.

```typescript
@UseGuards(AuthGuard)
@Get('/profile')
getProfile(@CurrentUser() user: JwtPayload) { ... }
```

### RoleGuard

`@Roles()` dekoratoru ilə müəyyən rol tələb edən endpointlər üçün istifadə olunur.

```typescript
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin')
@Get('/admin-panel')
adminPanel() { ... }
```

### CurrentUser Dekoratoru

JWT payload-dan cari istifadəçi məlumatını alır.

```typescript
@CurrentUser() user: JwtPayload
// { id, email, firstName, role }
```

---

## 🗄 Verilənlər bazası

### Development (SQLite)

```typescript
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'psytalk_dev.db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,  // Schema avtomatik yaranır
})
```

SQLite development üçün seçilmişdir çünki:
- PostgreSQL `synchronize: true` zamanı paralel dəyişikliklərdə ziddiyyət yarada bilər
- Sürətli schema iterasiyasına imkan verir
- Əlavə server quraşdırması tələb etmir

### Production (PostgreSQL)

`app.module.ts`-də şərh edilmiş bloku aktiv edin:

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: 'psytalk_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Production-da MÜTLƏQ false olmalıdır
})
```

PostgreSQL-ə keçiddə dəyişdirilməli fayllar:

- `common.entity.ts` — `datetime` → `timestamp`
- `user.entity.ts` — `varchar` → `enum`
- `token.entity.ts` — `varchar` → `enum`
- `app.module.ts` — SQLite → PostgreSQL konfigurasiyas

---

## ⏰ Cron Job

`CleanupService` hər həftə işə düşür və köhnəlmiş tokenləri silir:

```typescript
@Cron(CronExpression.EVERY_WEEK)
async cleanTokens() {
  await this.tokenRepo.delete({ isRevoked: true })         // Ləğv edilmiş
  await this.tokenRepo.delete({ expiresAt: LessThan(new Date()) }) // Müddəti bitmiş
}
```

---

## 👥 Rol sistemi

```typescript
enum UserRole {
  PATIENT = 'patient',
  PSYCHOLOGIST = 'psychologist',
  CENTER = 'center',
  ADMIN = 'admin'
}
```

**Qeyd:** Rol əsaslı sahə filtrasiyası **frontend tərəfindən** həyata keçirilir. Backend tək `UpdateUserDto` qəbul edir, rol yoxlaması etmir. Məsələn, psixoloq üçün `diplomaUrl` sahəsi yalnız frontend-də göstərilir.

---

## 📄 Swagger

Tətbiq işə düşdükdən sonra Swagger UI-a daxil ola bilərsiniz:

```
http://localhost:4014/api
```

Qorunan endpointləri test etmək üçün:
1. `/auth/login` ilə access token alın
2. Swagger-də "Authorize" düyməsini klikləyin
3. `Bearer <token>` formatında daxil edin

---

## 📝 Əlaqəli qeydlər

### Növbəti addımlar

- [ ] SQLite → PostgreSQL miqrasiyası (schema sabitləşdikdən sonra)
- [ ] Admin endpointləri — psixoloq diplom təsdiqləmə (`isDiplomaVerified`, `isActive`)
- [ ] Real domain alınması — `CLIENT_URL` placeholder əvəzinə
- [ ] Frontend — rol əsaslı şərti rendering (psixoloq/pasiyent profil səhifəsi)

---

## 👨‍💻 Müəllif

**Agasalim Musayev**  
Full-Stack Developer — PSYTALK layihəsi  
Bakı, Azərbaycan · 2026

---

