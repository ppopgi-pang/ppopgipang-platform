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

        @ApiProperty({ example: '위도', description: '192.25' })
        @IsNumber()
        @IsOptional()
        latitude?: number;

        @ApiProperty({ example: '경도', description: '168.36' })
        @IsNumber()
        @IsOptional()
        longitude?: number;

        @ApiProperty({ description: '이미지 이름 목록', example: ['image1.jpg'], required: false })
        @IsOptional()
        images?: string[];
    }
}
