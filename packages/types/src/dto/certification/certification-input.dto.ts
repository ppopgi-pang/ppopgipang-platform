import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsEnum, IsInt, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export namespace CertificationInput {
    /**
     * 득템 인증 생성 Input DTO
     */
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

        @ApiProperty({ description: '업로드된 이미지 파일명 배열 (1~3개)', type: [String] })
        @IsArray()
        @IsString({ each: true })
        @IsNotEmpty()
        photoFileNames: string[];

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

    /**
     * 체크인 인증 생성 Input DTO
     */
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
}
