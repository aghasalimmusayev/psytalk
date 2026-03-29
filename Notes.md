Postgresql-de deyisilesi yerler
   - CommonEntity
   - app.module
   - user.entity
   - token.entity

📧 emailVerificationToken
1. User qeydiyyatdan keçir
2. Sistem random token yaradır → "abc123xyz"
3. Bu token tokenEntity-də tokenHash-a EMAIL_VERIFY type olaraq yazılır
4. Eyni token email-ə link kimi göndərilir:
   "https://psytalk.az/verify-email?token=abc123xyz"
5. User linkə basır
6. Backend yoxlayır: DB-dəki token === linkdəki token?
7. Bəli → userEntity-de isEmailVerified: true olur
      User emaildəki linkə basır
            ↓
      Link açılır: http://localhost:3000/verify-email?token=abc123
            ↓
      ⚠️ Frontend bu səhifəni render edəndə
         özü-özünə backend-ə sorğu atmalıdır
            ↓
      GET http://localhost:4014/auth/email-verify?token=abc123
            ↓
      Backend: token tap → isRevoked=true → isEmailVerified=true
            ↓
      Frontend: "Email təsdiqləndi!" mesajı göstərir
      Yəni frontend-də verify-email route-unda belə bir şey olmalıdır:
         React — /verify-email?token=abc123 səhifəsi
         useEffect(() => {
            const token = searchParams.get('token')
            
            fetch(`/auth/email-verify?token=${token}`)
               .then(res => res.json())
               .then(() => {
                     // "Email təsdiqləndi!" göstər
               })
               .catch(() => {
                     // "Link etibarsız və ya müddəti keçib" göstər
               })
         }, [])
      User sadəcə linkə basır, heç bir şey doldurmamalı deyil — səhifə açılan kimi useEffect işə düşür, 
      sorğu atılır, nəticə göstərilir. İstifadəçi baxımından tamamilə avtomatikdir. ✅

🔑 passwordResetToken + passwordResetExpires
1. User "Şifrəmi unutdum" basır
2. Sistem random token yaradır → "reset456abc"
3. Bu token DB-də passwordResetToken-a yazılır
4. Expire vaxtı yazılır → passwordResetExpires: "15 dəqiqə sonra"
5. Email-ə link göndərilir:
   "https://psytalk.az/reset-password?token=reset456abc"
6. User linkə basıb yeni şifrə yazır
7. Backend yoxlayır:
   - DB-dəki token === linkdəki token?
   - passwordResetExpires < new Date()? (vaxtı keçibmi?)
8. Hər şey OK → şifrə yenilənir, token silinir

Commit2
* psytalk_db database created
   - auth.module created
   - users.module created
Commit3
* new methods, services
   - register method created
   - login method created
   - refreshToken method created
   - serializer added
   - rateLimit added
   - cleanup.service created
Commit4
* New methods
   - Sqlite3 integration for development
   - GetAllUsers
   - DeleteUser
   - all routes were tested
Commit5
New methods and functions
   - AuthGuard
   - RoleGuard
   - CurrentUser decorator
   - Role decorator
Commit6
MailService
