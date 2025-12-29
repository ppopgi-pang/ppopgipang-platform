import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsString, Max, Min } from 'class-validator';

export class GenerateUploadUrlsDto {
    @ApiProperty({
        description: '업로드할 파일 수 (1~3)',
        minimum: 1,
        maximum: 3,
        example: 2
    })
    @IsInt()
    @Min(1)
    @Max(3)
    fileCount: number;

    @ApiProperty({
        description: '파일 Content-Type 배열',
        type: [String],
        example: ['image/jpeg', 'image/png']
    })
    @IsArray()
    @IsString({ each: true })
    contentTypes: string[];
}
