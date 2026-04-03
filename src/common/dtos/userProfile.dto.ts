import { Expose } from "class-transformer"

export class UserProfileDto {
    @Expose() id: number
    @Expose() email: string
    @Expose() firstName: string
    @Expose() lastName: string
    @Expose() role: string
    @Expose() phone: string
    @Expose() bio: string
    @Expose() dateOfBirth: Date
    @Expose() gender: string
    @Expose() avatarUrl: string
    @Expose() isEmailVerified: boolean
    @Expose() isActive: boolean
    @Expose() walletBalance: number
    @Expose() createdAt: Date

    // Psixoloq fieldləri — patient üçün null gələcək, frontend ignore edər
    @Expose() specializations: string[]
    @Expose() sessionPrice: number
    @Expose() experience: number
    @Expose() diplomaUrl: string
    @Expose() isDiplomaVerified: boolean
}