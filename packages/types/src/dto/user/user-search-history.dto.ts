import { ApiProperty } from "@nestjs/swagger";

export namespace UserSearchHistory {
    export class SearchHistoryDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'keyword' })
        keyword: string;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        searchedAt: Date;

        constructor(id: number, keyword: string, searchedAt: Date) {
            this.id = id;
            this.keyword = keyword;
            this.searchedAt = searchedAt;
        }
    }
}
