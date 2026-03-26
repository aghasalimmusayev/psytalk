

📧 emailVerificationToken
1. User qeydiyyatdan keçir
2. Sistem random token yaradır → "abc123xyz"
3. Bu token DB-də emailVerificationToken-a yazılır
4. Eyni token email-ə link kimi göndərilir:
   "https://psytalk.az/verify-email?token=abc123xyz"
5. User linkə basır
6. Backend yoxlayır: DB-dəki token === linkdəki token?
7. Bəli → isEmailVerified: true olur

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