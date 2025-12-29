import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCheckinDto {
    @ApiProperty({ description: '가게 ID' })
    @IsInt()
    @IsNotEmpty()
    storeId: number;

    @ApiProperty({ description: '위도 (인증 당시 GPS)', required: false })
    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @ApiProperty({ description: '경도 (인증 당시 GPS)', required: false })
    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @ApiProperty({ description: '상태 평가', enum: ['good', 'normal', 'bad'] })
    @IsEnum(['good', 'normal', 'bad'])
    @IsNotEmpty()
    rating: 'good' | 'normal' | 'bad';

    @ApiProperty({ description: '선택한 이유 ID 배열', type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    reasonIds?: number[];
}
