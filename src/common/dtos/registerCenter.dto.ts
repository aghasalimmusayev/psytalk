import { IsEmail, IsOptional, IsString, MinLength } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CreateCenterDto {
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
    @IsOptional()
    @IsString()
    phone?: string

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    bio?: string
}