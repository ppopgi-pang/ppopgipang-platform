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

    /**
     * 새로 획득한 스탬프 DTO
     */
    export class NewStampDto {
        id: number;
        imageName: string;
        storeName: string;

        constructor(id: number, imageName: string, storeName: string) {
            this.id = id;
            this.imageName = imageName;
            this.storeName = storeName;
        }
    }

    /**
     * 새로 획득한 배지 DTO
     */
    export class NewBadgeDto {
        id: number;
        code: string;
        name: string;
        description: string;
        badgeImageName: string;

        constructor(id: number, code: string, name: string, description: string, badgeImageName: string) {
            this.id = id;
            this.code = code;
            this.name = name;
            this.description = description;
            this.badgeImageName = badgeImageName;
        }
    }

    /**
     * 인증 보상 DTO
     */
    export class RewardsDto {
        exp: number;
        totalExp: number;
        currentLevel: number;
        levelUp: boolean;
        newLevel?: number;
        expToNextLevel: number;
        newStamp?: NewStampDto;
        newBadges?: NewBadgeDto[];

        constructor(
            exp: number,
            totalExp: number,
            currentLevel: number,
            levelUp: boolean,
            expToNextLevel: number,
            newLevel?: number,
            newStamp?: NewStampDto,
            newBadges?: NewBadgeDto[]
        ) {
            this.exp = exp;
            this.totalExp = totalExp;
            this.currentLevel = currentLevel;
            this.levelUp = levelUp;
            this.expToNextLevel = expToNextLevel;
            this.newLevel = newLevel;
            this.newStamp = newStamp;
            this.newBadges = newBadges;
        }
    }

    /**
     * 인증 생성 응답 DTO
     */
    export class CertificationResponseDto {
        certificationId: number;
        type: 'loot' | 'checkin';
        rewards: RewardsDto;

        constructor(certificationId: number, type: 'loot' | 'checkin', rewards: RewardsDto) {
            this.certificationId = certificationId;
            this.type = type;
            this.rewards = rewards;
        }
    }

    /**
     * 태그 프리셋 DTO
     */
    export class TagDto {
        id: number;
        name: string;
        iconName?: string;

        constructor(id: number, name: string, iconName?: string) {
            this.id = id;
            this.name = name;
            this.iconName = iconName;
        }
    }

    /**
     * 한줄평 프리셋 DTO
     */
    export class CommentPresetDto {
        id: number;
        content: string;

        constructor(id: number, content: string) {
            this.id = id;
            this.content = content;
        }
    }

    /**
     * 체크인 이유 프리셋 DTO
     */
    export class ReasonPresetDto {
        id: number;
        content: string;

        constructor(id: number, content: string) {
            this.id = id;
            this.content = content;
        }
    }

    /**
     * 프리셋 전체 조회 응답 DTO
     */
    export class PresetsDto {
        tags: TagDto[];
        lootComments: CommentPresetDto[];
        checkinReasons: ReasonPresetDto[];

        constructor(tags: TagDto[], lootComments: CommentPresetDto[], checkinReasons: ReasonPresetDto[]) {
            this.tags = tags;
            this.lootComments = lootComments;
            this.checkinReasons = checkinReasons;
        }
    }
}
