import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator"
import { UserRole } from "../types"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string

    @ApiProperty()
    @IsString()
    @MinLength(8)
    password: string

    @ApiProperty()
    @IsString()
    firstName: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastName?: string

    @ApiProperty({ enum: [UserRole.PATIENT, UserRole.PSYCHOLOGIST] })
    @IsEnum([UserRole.PATIENT, UserRole.PSYCHOLOGIST], {
        message: 'Role yalnız patient və ya psychologist ola bilər'
    })
    role: UserRole
    
    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string

}