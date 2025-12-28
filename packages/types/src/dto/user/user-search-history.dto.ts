export namespace UserSearchHistory {
    export class SearchHistoryDto {
        id: number;
        keyword: string;
        searchedAt: Date;

        constructor(id: number, keyword: string, searchedAt: Date) {
            this.id = id;
            this.keyword = keyword;
            this.searchedAt = searchedAt;
        }
    }
}
