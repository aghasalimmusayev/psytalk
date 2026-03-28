import { Column, Entity, OneToMany } from "typeorm";
import { AuthProvider, UserRole } from "../types";
import { CommonEntity } from "./common.entity";
import { TokenEntity } from "./token.entity";

@Entity('users')
export class User extends CommonEntity {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })          // Google login-də null ola bilər
    password: string;

    //! @Column({ type: 'enum', enum: UserRole })
    @Column({ type: 'varchar' })
    role: UserRole;

    //! @Column({ type: 'enum', enum: AuthProvider, default: AuthProvider.LOCAL })
    @Column({ type: 'varchar', default: AuthProvider.LOCAL })
    authProvider: AuthProvider;

    @Column()
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ nullable: true })
    phone: string;

    @Column({ nullable: true })
    dateOfBirth: Date;

    //! @Column({ nullable: true, type: 'enum', enum: ['male', 'female'] })
    @Column({ type: 'text', nullable: true })
    gender: 'male' | 'female';

    @Column({ nullable: true })
    avatarUrl: string;

    @Column({ nullable: true })
    googleId: string;                    // Google OAuth üçün

    @Column({ default: false })
    isEmailVerified: boolean;

    @Column({ default: false })
    isVerified: boolean;                 // Admin tərəfindən (psixoloq/mərkəz üçün)

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isAnonymous: boolean;               // Biznes planında anonimlik var

    @Column({ type: 'decimal', default: 0 })
    walletBalance: number;

    @Column({ nullable: true })
    emailVerificationToken: string;

    @Column({ nullable: true })
    passwordResetToken: string;

    @Column({ nullable: true })
    passwordResetExpires: Date;

    @Column({ nullable: true, type: 'text' })
    bio: string;

    @Column('simple-array', { nullable: true })
    specializations: string[];          // Anxiety, Depression, Family...

    @Column({ nullable: true })
    diplomaUrl: string;                 // Diplom yoxlanışı

    @Column({ default: false })
    isDiplomaVerified: boolean;

    @Column({ type: 'decimal', nullable: true })
    sessionPrice: number;

    @Column({ nullable: true })
    experience: number;                 // İl sayı

    @OneToMany(() => TokenEntity, (tokens) => tokens.user)
    tokens: TokenEntity[]
}