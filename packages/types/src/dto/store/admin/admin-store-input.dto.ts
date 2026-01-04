import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export namespace AdminStoreInput {
    export class CreateStoreFacilityDto {
        @ApiProperty({ description: '기계 개수', required: false })
        @IsOptional()
        @IsNumber()
        machineCount?: number;

        @ApiProperty({ description: '결제 수단', required: false, example: ['cash', 'card', 'qr'] })
        @IsOptional()
        @IsString({ each: true })
        paymentMethods?: string[];

        @ApiProperty({ description: '특이사항', required: false })
        @IsOptional()
        @IsString()
        notes?: string;
    }

    export class CreateStoreOpeningHoursDto {
        @ApiProperty({ description: '요일 (0: 일, 1: 월, ... 6: 토)', example: 1 })
        @IsNotEmpty()
        @IsNumber()
        dayOfWeek: number;

        @ApiProperty({ description: '오픈 시간 (HH:MM)', required: false, example: '10:00' })
        @IsOptional()
        @IsString()
        openTime?: string;

        @ApiProperty({ description: '마감 시간 (HH:MM)', required: false, example: '22:00' })
        @IsOptional()
        @IsString()
        closeTime?: string;

        @ApiProperty({ description: '휴무 여부', required: false, default: false })
        @IsOptional()
        isClosed?: boolean;
    }

    export class CreateStorePhotoDto {
        @ApiProperty({ description: '사진 타입', enum: ['cover', 'sign', 'inside', 'roadview'], example: 'cover' })
        @IsNotEmpty()
        @IsString()
        type: 'cover' | 'sign' | 'inside' | 'roadview';

        @ApiProperty({ description: '이미지 파일명 (S3 키 등)', example: 'store_cover.jpg' })
        @IsNotEmpty()
        @IsString()
        imageName: string;
    }

    export class CreateStoreDto {
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

        @ApiProperty({ type: CreateStoreFacilityDto, required: false })
        @IsOptional()
        facilities?: CreateStoreFacilityDto;

        @ApiProperty({ type: [CreateStoreOpeningHoursDto], required: false })
        @IsOptional()
        openingHours?: CreateStoreOpeningHoursDto[];

        @ApiProperty({ type: [CreateStorePhotoDto], required: false })
        @IsOptional()
        photos?: CreateStorePhotoDto[];
    }

    export class UpdateStoreDto {
        @ApiProperty({ example: '홍대 뽑기방', description: '매장 이름', required: false })
        @IsOptional()
        @IsString()
        name?: string;

        @ApiProperty({ example: '서울특별시 서초구 방배동', description: '주소', required: false })
        @IsOptional()
        @IsString()
        address?: string;

        @ApiProperty({ description: '위도', required: false })
        @IsOptional()
        @IsNumber()
        latitude?: number;

        @ApiProperty({ description: '경도', required: false })
        @IsOptional()
        @IsNumber()
        longitude?: number;

        @ApiProperty({ example: '010-1234-5679', description: '매장 전화번호', required: false })
        @IsOptional()
        @IsString()
        phone?: string;

        @ApiProperty({ example: 1, description: '가게 타입', required: false })
        @IsOptional()
        @IsNumber()
        typeId?: number;

        @ApiProperty({ type: CreateStoreFacilityDto, required: false })
        @IsOptional()
        facilities?: CreateStoreFacilityDto;

        @ApiProperty({ type: [CreateStoreOpeningHoursDto], required: false })
        @IsOptional()
        openingHours?: CreateStoreOpeningHoursDto[];

        @ApiProperty({ type: [CreateStorePhotoDto], required: false })
        @IsOptional()
        photos?: CreateStorePhotoDto[];
    }
}