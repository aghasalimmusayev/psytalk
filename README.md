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
| `center` | Psixoloji mərkəz — yalnız admin tərəfindən yaradılır |
| `admin` | Platforma administratoru — yalnız `seed.ts` vasitəsilə yaradılır |

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
├── seed.ts                    # Admin yaratmaq üçün bir dəfəlik script
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
│       ├── accountActivated.hbs
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
│       ├── createUser.dto.ts        # Patient / Psychologist qeydiyyatı
│       ├── registerCenter.dto.ts    # Mərkəz qeydiyyatı (admin only)
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

### 4. Admin yaradın (ilk dəfə)

```bash
npm run seed
```

### 5. Development rejimini başladın

```bash
npm run start:dev
```

### 6. Swagger UI-a daxil olun

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
| `POST` | `/auth/rergister` | Patient/Psychologist qeydiyyatı + email doğrulama linki | ❌ |
| `POST` | `/auth/login` | Giriş — access + refresh token | ❌ |
| `POST` | `/auth/center` | Mərkəz qeydiyyatı | ✅ Admin only |
| `GET`  | `/auth/email-verify?token=` | Email doğrulama | ❌ |
| `POST` | `/auth/forget-password` | Şifrə sıfırlama linki göndər | ❌ |
| `POST` | `/auth/reset-password?token=` | Yeni şifrə təyin et | ❌ |
| `POST` | `/auth/logout` | Çıxış — refresh token ləğv et | ✅ |
| `POST` | `/auth/logoutall` | Bütün cihazlardan çıxış | ✅ |

### 👤 Users (`/users`)

| Metod | Endpoint | Açıqlama | Qorunur? |
|-------|----------|----------|----------|
| `GET` | `/users/all` | Bütün istifadəçiləri gətir | ❌ |
| `GET` | `/users/profile` | Cari istifadəçinin profili | ✅ |
| `PATCH` | `/users/:id` | Profil yeniləmə (yalnız öz profili) | ✅ |
| `PATCH` | `/users/change-password/:id` | Şifrə dəyişmə (yalnız öz profili) | ✅ |
| `DELETE` | `/users/:id` | İstifadəçi sil (yalnız öz profili) | ✅ |
| `PATCH` | `/users/admin-verify/:id` | Psixoloqu aktivləşdir (`isActive: true`) | ✅ Admin only |

---

## 🔑 Auth Sistemi

### Patient / Psychologist qeydiyyat axını

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

### Mərkəz qeydiyyat axını (Admin only)

```
POST /auth/center
  ↓
AuthGuard: JWT access token yoxlanılır
RoleGuard: user.role === 'admin' yoxlanılır
  ↓
role backend-də 'center' olaraq təyin edilir (DTO-dan gəlmir)
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

### Psixoloq aktivləşmə axını (Admin only)

```
PATCH /users/admin-verify/:id
  ↓
AuthGuard: JWT access token yoxlanılır
RoleGuard: user.role === 'admin' yoxlanılır
  ↓
user.role === 'psychologist' yoxlanılır
  ↓
isActive: true → DB-yə yazılır
  ↓
accountActivated email göndərilir
  ↓
{ message: 'Your account has been activated' }
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
| `sendAccountActivated()` | Account aktivlədirilməsi doğrulandıqda | `accountActivated.hbs` |
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

`@Roles()` dekoratoru ilə müəyyən rol tələb edən endpointlər üçün istifadə olunur. Mütləq `AuthGuard`-dan sonra gəlməlidir.

```typescript
@UseGuards(AuthGuard, RoleGuard)
@Roles('admin')
@Post('/center')
registerCenter() { ... }
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

PostgreSQL-ə keçməli olsan, dəyişdirilməli fayllar:

- `common.entity.ts` — `datetime` → `timestamp`
- `user.entity.ts` — `varchar` → `enum`
- `token.entity.ts` — `varchar` → `enum`
- `app.module.ts` — SQLite → PostgreSQL konfigurasiyas


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

**Qeydiyyat zamanı rol məhdudiyyətləri:**

| Endpoint | İcazəli rollar | Necə təyin olunur? |
|----------|---------------|-------------------|
| `POST /auth/rergister` | `patient`, `psychologist` | DTO-dan gəlir, `@IsEnum` ilə məhdudlaşdırılıb |
| `POST /auth/center` | `center` | Backend-də hardcode edilir, DTO-dan gəlmir |
| `seed.ts` | `admin` | Script vasitəsilə birbaşa DB-yə yazılır |

**Qeyd:** Rol əsaslı sahə filtrasiyası **frontend tərəfindən** həyata keçirilir. Backend tək `UpdateUserDto` qəbul edir. Məsələn, psixoloq üçün `diplomaUrl` sahəsi yalnız frontend-də göstərilir.

---

## 🌱 Admin Seed

Admin hesabı heç bir HTTP endpoint vasitəsilə yaradıla bilməz. Yalnız `seed.ts` scripti ilə yaradılır. Bu script serverdə fiziki/SSH girişi olan şəxs tərəfindən run edilir.

```bash
npm run seed
```

Script artıq admin mövcuddursa ikinci dəfə yaratmır:

```
Admin artıq mövcuddur   # əgər varsa
Admin uğurla yaradıldı ✅  # əgər yoxdursa
```

`package.json`-da script:

```json
"seed": "ts-node -r tsconfig-paths/register src/seed.ts"
```

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
- [ ] Real domain alınması — `CLIENT_URL` placeholder əvəzinə
- [ ] Frontend — rol əsaslı şərti rendering (psixoloq/pasiyent profil səhifəsi)

---

### Frontend-də nəzərə alınmalıdır

- "ani logout", frontend tərəfindən şifrə dəyişildikdən sonra sadəcə local storage/cookie-dəki access token silinməlidir. Backend artıq refresh-i bloklayıb.
- İstifadəçi profilində dəyişiklik edərkən Frontend tərəfindən istifadəçi rolu nəzə alınıb, lazım olan bolmələr göstərilməlidir

---

## 👨‍💻 Müəllif

**Agasalim Musayev**  
Full-Stack Developer — PSYTALK layihəsi  
Bakı, Azərbaycan · 2026

---

