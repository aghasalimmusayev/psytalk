import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class UpdateUserDto {
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    lastName?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    phone?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatarUrl?: string;

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    bio?: string;

    @ApiPropertyOptional({ type: [String] })
    @IsArray()
    @IsOptional()
    specializations?: string[];

    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    diplomaUrl?: string;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    sessionPrice?: number;

    @ApiPropertyOptional()
    @IsNumber()
    @Min(0)
    @IsOptional()
    experience?: number;
}