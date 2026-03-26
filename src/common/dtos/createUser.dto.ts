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
    firstname: string

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastname?: string

    @ApiProperty()
    @IsEnum(UserRole)
    role: UserRole

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string

}