export namespace CertificationResult {
    export class LootPhotoDto {
        id: number;
        imageName: string;

        constructor(id: number, imageName: string) {
            this.id = id;
            this.imageName = imageName;
        }
    }

    export class LootUserDto {
        id: number;
        nickname: string;
        profileImage?: string | null;

        constructor(id: number, nickname: string, profileImage?: string | null) {
            this.id = id;
            this.nickname = nickname;
            this.profileImage = profileImage;
        }
    }

    export class LootDto {
        id: number;
        type: 'loot' | 'checkin';
        occurredAt: Date;
        photos: LootPhotoDto[];
        likesCount: number;
        isLikedByMe: boolean;
        user: LootUserDto;

        constructor(
            id: number,
            type: 'loot' | 'checkin',
            occurredAt: Date,
            photos: LootPhotoDto[],
            likesCount: number,
            isLikedByMe: boolean,
            user: LootUserDto
        ) {
            this.id = id;
            this.type = type;
            this.occurredAt = occurredAt;
            this.photos = photos;
            this.likesCount = likesCount;
            this.isLikedByMe = isLikedByMe;
            this.user = user;
        }
    }

    export class LootGalleryDto {
        items: LootDto[];
        total: number;
        page: number;
        size: number;

        constructor(items: LootDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }
}
