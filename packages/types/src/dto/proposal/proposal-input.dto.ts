import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export namespace ProposalInput {
    export class CreateProposalDto {
        @ApiProperty({ example: '강남역 뽑기방', description: '가게 이름' })
        @IsString()
        @IsNotEmpty()
        storeName: string;

        @ApiProperty({ example: '인천광역시 부평구 부평대로...', description: '가게 주소' })
        @IsString()
        @IsNotEmpty()
        address: string;

        @ApiProperty({ example: 192.16, description: '위도' })
        @IsNumber()
        @IsOptional()
        latitude?: number;

        @ApiProperty({ example: 168.26, description: '경도' })
        @IsNumber()
        @IsOptional()
        longitude?: number;

        @ApiProperty({ description: '이미지 이름 목록', example: ['image1.jpg'], required: false })
        @IsOptional()
        images?: string[];
    }
}
