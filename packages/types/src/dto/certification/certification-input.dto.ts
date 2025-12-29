export namespace CertificationInput {
    /**
     * 득템 인증 생성 Input DTO
     */
    export class CreateLootDto {
        storeId: number;
        latitude?: number;
        longitude?: number;
        photoFileNames: string[];  // 업로드된 파일명 배열 (1~3개)
        tagIds?: number[];
        comment?: string;

        constructor(
            storeId: number,
            photoFileNames: string[],
            latitude?: number,
            longitude?: number,
            tagIds?: number[],
            comment?: string
        ) {
            this.storeId = storeId;
            this.photoFileNames = photoFileNames;
            this.latitude = latitude;
            this.longitude = longitude;
            this.tagIds = tagIds;
            this.comment = comment;
        }
    }

    /**
     * 체크인 인증 생성 Input DTO
     */
    export class CreateCheckinDto {
        storeId: number;
        latitude?: number;
        longitude?: number;
        rating: 'good' | 'normal' | 'bad';
        reasonIds?: number[];

        constructor(
            storeId: number,
            rating: 'good' | 'normal' | 'bad',
            latitude?: number,
            longitude?: number,
            reasonIds?: number[]
        ) {
            this.storeId = storeId;
            this.rating = rating;
            this.latitude = latitude;
            this.longitude = longitude;
            this.reasonIds = reasonIds;
        }
    }
}
