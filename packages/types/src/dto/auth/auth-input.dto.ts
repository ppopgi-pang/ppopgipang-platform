import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export namespace AuthInput {

    export class CreateAdminUserDto {
        @ApiProperty({ example: 'admin@gmail.com', description: '이메일' })
        @IsEmail()
        @IsNotEmpty()
        email: string;

        @ApiProperty({ example: 'admin', description: '닉네임' })
        @IsNotEmpty()
        nickname: string;

        @ApiProperty({ example: '1q2w3e4r!', description: '비밀번호' })
        @IsNotEmpty()
        password: string;
    }

    export class AdminLoginDto {
        @ApiProperty({ example: 'admin@gmail.com', description: '이메일' })
        @IsEmail()
        @IsNotEmpty()
        email: string;

        @ApiProperty({ example: '1q2w3e4r', description: '비밀번호' })
        @IsNotEmpty()
        password: string;
    }
}