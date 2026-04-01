import { ApiProperty } from "@nestjs/swagger";
import { IsString, MinLength } from "class-validator";

export class ResetPassword {
    @ApiProperty()
    @IsString()
    @MinLength(8)
    newPassword: string
}