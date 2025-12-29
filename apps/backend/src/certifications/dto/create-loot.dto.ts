import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateLootDto {
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

    @ApiProperty({ description: 'S3 업로드된 이미지 키 배열 (1~3개)', type: [String] })
    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    photoKeys: string[];

    @ApiProperty({ description: '선택한 태그 ID 배열', type: [Number], required: false })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    tagIds?: number[];

    @ApiProperty({ description: '한줄평 (프리셋 또는 직접 입력)', required: false })
    @IsOptional()
    @IsString()
    @MaxLength(200)
    comment?: string;
}
