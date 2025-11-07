import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export namespace AdminStore {
    export class createDto {
        @ApiProperty({ example: '홍대 뽑기방', description: '매장 이름' })
        @IsNotEmpty()
        @IsString()
        name: string;

        @ApiProperty({ example: '서울특별시 서초구 방배동', description: '주소' })
        @IsNotEmpty()
        @IsString()
        address: string;

        @ApiProperty({ description: '위도' })
        @IsNotEmpty()
        @IsNumber()
        latitude: number;

        @ApiProperty({ description: '경도' })
        @IsNotEmpty()
        @IsNumber()
        longitude: number;

        @ApiProperty({ example: '010-1234-5679', description: '매장 전화번호' })
        @IsOptional()
        @IsPhoneNumber()
        phone?: string;

        @ApiProperty({ example: 1, description: '가게 타입' })
        @IsNotEmpty()
        @IsNumber()
        typeId: number;
    }
}