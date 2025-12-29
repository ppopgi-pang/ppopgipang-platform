import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEmail, IsMobilePhone, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export namespace CareerInput {
    export class CreateJobPostingDto {
        @ApiProperty({ description: '모집 공고 제목', example: '백엔드 개발자 모집' })
        @IsString()
        @IsNotEmpty()
        title: string;

        @ApiProperty({ description: '상세 설명', example: '서비스 확장을 위한 백엔드 개발자를 모집합니다.', required: false })
        @IsOptional()
        @IsString()
        description?: string;

        @ApiProperty({ description: '부서', example: '개발팀', required: false })
        @IsOptional()
        @IsString()
        department?: string;

        @ApiProperty({ description: '직무 유형', example: '정규직', required: false })
        @IsOptional()
        @IsString()
        positionType?: string;

        @ApiProperty({ description: '근무지', example: '서울', required: false })
        @IsOptional()
        @IsString()
        location?: string;
    }

    export class UpdateJobPostingDto {
        @ApiProperty({ description: '모집 공고 제목', example: '백엔드 개발자 모집', required: false })
        @IsOptional()
        @IsString()
        title?: string;

        @ApiProperty({ description: '상세 설명', example: '서비스 확장을 위한 백엔드 개발자를 모집합니다.', required: false })
        @IsOptional()
        @IsString()
        description?: string;

        @ApiProperty({ description: '부서', example: '개발팀', required: false })
        @IsOptional()
        @IsString()
        department?: string;

        @ApiProperty({ description: '직무 유형', example: '정규직', required: false })
        @IsOptional()
        @IsString()
        positionType?: string;

        @ApiProperty({ description: '근무지', example: '서울', required: false })
        @IsOptional()
        @IsString()
        location?: string;

        @ApiProperty({ description: '활성 여부', example: true, required: false })
        @IsOptional()
        @IsBoolean()
        isActive?: boolean;
    }

    export class CreateApplicationDto {
        @ApiProperty({ description: '모집 공고 ID', example: 1 })
        @IsNumber()
        @IsNotEmpty()
        jobPostingId: number;

        @ApiProperty({ description: '지원자 이름', example: '홍길동' })
        @IsString()
        @IsNotEmpty()
        name: string;

        @ApiProperty({ description: '지원자 이메일', example: 'applicant@example.com' })
        @IsEmail()
        @IsNotEmpty()
        email: string;

        @ApiProperty({ description: '지원자 연락처', example: '010-1234-5678', required: false })
        @IsOptional()
        @IsString()
        phone?: string;

        @ApiProperty({ description: '이력서 파일명', example: 'resume.pdf', required: false })
        @IsOptional()
        @IsString()
        resumeName?: string;

        @ApiProperty({ description: '메모', example: '포트폴리오 링크 포함', required: false })
        @IsOptional()
        @IsString()
        memo?: string;
    }
}
