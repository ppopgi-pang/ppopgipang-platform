import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional } from 'class-validator';

export namespace CollectionInput {
    export class SetFeaturedBadgeRequestDto {
        @ApiProperty({
            description: '대표 배지로 설정할 업적 ID (null이면 해제)',
            required: false,
            example: 1,
        })
        @IsOptional()
        @IsInt()
        achievementId?: number | null;
    }
}
