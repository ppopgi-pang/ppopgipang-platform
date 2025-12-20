import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from "class-validator";

export namespace ReviewInput {
    export class CreateReviewDto {
        @ApiProperty({ example: 4.5, description: '별점' })
        @Min(0)
        @Max(5)
        @IsNotEmpty()
        rating: number;

        @ApiProperty({ description: '리뷰 내용' })
        @IsOptional()
        @IsString()
        content?: string;

        @ApiProperty({ description: '이미지 이름 배열' })
        @IsOptional()
        @IsArray()
        images?: string[];

        @ApiProperty({ description: '가게 ID' })
        @IsNotEmpty()
        @IsNumber()
        storeId: number;


    }
}