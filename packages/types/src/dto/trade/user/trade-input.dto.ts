import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export namespace TradeInput {
    export class CreateTradeDto {
        @ApiProperty({ description: '제목', example: '중고 닌텐도 스위치 팝니다' })
        @IsString()
        @IsNotEmpty()
        title: string;

        @ApiProperty({ description: '상세 설명', example: '상태 깨끗합니다. 박스 풀셋.' })
        @IsString()
        @IsNotEmpty()
        description: string;

        @ApiProperty({ description: '이미지 이름 목록', example: ['image1.jpg'], required: false })
        @IsOptional()
        images?: string[];

        @ApiProperty({ description: '가격', example: 250000, required: false })
        @IsInt()
        @IsOptional()
        price?: number;

        @ApiProperty({ description: '거래 타입 (sale: 판매, exchange: 교환)', enum: ['sale', 'exchange'], default: 'sale' })
        @IsEnum(['sale', 'exchange'])
        @IsOptional()
        type?: 'sale' | 'exchange';
    }

    export class UpdateTradeDto {
        @ApiProperty({ description: '제목', example: '중고 닌텐도 스위치 팝니다', required: false })
        @IsString()
        @IsOptional()
        title?: string;

        @ApiProperty({ description: '상세 설명', example: '상태 깨끗합니다. 박스 풀셋.', required: false })
        @IsString()
        @IsOptional()
        description?: string;

        @ApiProperty({ description: '이미지 이름 목록', example: ['image1.jpg'], required: false })
        @IsOptional()
        images?: string[];

        @ApiProperty({ description: '가격', example: 250000, required: false })
        @IsInt()
        @IsOptional()
        price?: number;

        @ApiProperty({ description: '거래 타입 (sale: 판매, exchange: 교환)', enum: ['sale', 'exchange'], required: false })
        @IsEnum(['sale', 'exchange'])
        @IsOptional()
        type?: 'sale' | 'exchange';

        @ApiProperty({ description: '거래 상태 (active: 진행중, completed: 완료, cancelled: 취소)', enum: ['active', 'completed', 'cancelled'], required: false })
        @IsEnum(['active', 'completed', 'cancelled'])
        @IsOptional()
        status?: 'active' | 'completed' | 'cancelled';
    }
}
