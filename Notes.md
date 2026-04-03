<!--Todo * Admin terefinden verifyDiploma yazilmalidir -->
<!--Todo * Admin terefinden isActived yazilmalidir -->
<!--Todo * Admin butun user-leri sile bilsin -->
<!--! googleId meselesi barede hec bir is gorulmedi -->

<!--Todo * Postgresql-de deyisilesi yerler -->
   - CommonEntity
   - app.module
   - user.entity
   - token.entity
<!--Todo * EmailVerification - Frontendde nezerden kecirilmelidir -->
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

<!--Todo * "ani logout", frontend tərəfindən şifrə dəyişildikdən sonra sadəcə local storage/cookie-dəki access token-i silmək kifayətdir. Backend artıq refresh-i bloklayıb. -->
<!--Todo * UpdateUser => Which fields can update, it has to be shown for the user`s role in Frontend -->

Commit1
* PsyTalk project created

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
* New methods and functions
   - AuthGuard
   - RoleGuard
   - CurrentUser decorator
   - Role decorator

Commit6
* MailService

Commit7
* New methods - Not Tested
   - UpdateUser
   - ChangePassword
   - GetProfile

Commit8
* ResetPassword method

Commit9
* All routes tested

Commit10
* New methods & file
   - CreateCenter
   - seed.ts => admin.create
   - Checking CurrentUser in deleting user