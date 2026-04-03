import { ApiProperty } from "@nestjs/swagger"
import { IsEmail, IsString, MinLength } from "class-validator"

export class CreateAdminDto {
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

    @ApiProperty({ description: 'Admin yaratmaq üçün gizli açar' })
    @IsString()
    adminSecretKey: string
}