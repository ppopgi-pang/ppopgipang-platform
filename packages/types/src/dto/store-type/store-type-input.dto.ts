import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export namespace StoreTypeInput {
    export class createStoreTypeDto {
        @ApiProperty({ example: '뽑기방', description: '가게 타입' })
        @IsNotEmpty()
        @IsString()
        name: string;

        @ApiProperty({ description: '가게 타입 설명' })
        @IsOptional()
        @IsString()
        description?: string;
    }
}