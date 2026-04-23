import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from "class-validator"
import { Gender } from "../types"

export class CreatePsychologistDto {
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

    @ApiProperty({ enum: Gender })
    @IsEnum(Gender)
    gender: Gender;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    phone?: string
}