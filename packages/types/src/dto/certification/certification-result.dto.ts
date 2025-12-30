import { ApiProperty } from "@nestjs/swagger";

export namespace CertificationResult {
    export class LootPhotoDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'image.jpg' })
        imageName: string;

        constructor(id: number, imageName: string) {
            this.id = id;
            this.imageName = imageName;
        }
    }

    export class LootUserDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'ppopgi' })
        nickname: string;
        @ApiProperty({ type: String, example: 'https://example.com/profile.jpg', required: false, nullable: true })
        profileImage?: string | null;

        constructor(id: number, nickname: string, profileImage?: string | null) {
            this.id = id;
            this.nickname = nickname;
            this.profileImage = profileImage;
        }
    }

    export class LootDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, enum: ['loot', 'checkin'], example: 'loot' })
        type: 'loot' | 'checkin';
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        occurredAt: Date;
        @ApiProperty({ type: () => [LootPhotoDto], example: [{ id: 1, imageName: 'image.jpg' }] })
        photos: LootPhotoDto[];
        @ApiProperty({ type: Number, example: 3 })
        likesCount: number;
        @ApiProperty({ type: Boolean, example: true })
        isLikedByMe: boolean;
        @ApiProperty({ type: () => LootUserDto, example: { id: 1, nickname: 'ppopgi', profileImage: 'https://example.com/profile.jpg' } })
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
        @ApiProperty({ type: () => [LootDto], example: [{ id: 1, type: 'loot', occurredAt: '2024-01-01T00:00:00.000Z', photos: [{ id: 1, imageName: 'image.jpg' }], likesCount: 3, isLikedByMe: true, user: { id: 1, nickname: 'ppopgi', profileImage: 'https://example.com/profile.jpg' } }] })
        items: LootDto[];
        @ApiProperty({ type: Number, example: 20 })
        total: number;
        @ApiProperty({ type: Number, example: 1 })
        page: number;
        @ApiProperty({ type: Number, example: 10 })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'image.jpg' })
        imageName: string;
        @ApiProperty({ type: String, example: 'Sample Store' })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'CODE123' })
        code: string;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'Sample description' })
        description: string;
        @ApiProperty({ type: String, example: 'badge.png' })
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
        @ApiProperty({ type: Number, example: 50 })
        exp: number;
        @ApiProperty({ type: Number, example: 500 })
        totalExp: number;
        @ApiProperty({ type: Number, example: 3 })
        currentLevel: number;
        @ApiProperty({ type: Boolean, example: false })
        levelUp: boolean;
        @ApiProperty({ type: Number, example: 3, required: false })
        newLevel?: number;
        @ApiProperty({ type: Number, example: 100 })
        expToNextLevel: number;
        @ApiProperty({ type: () => NewStampDto, example: { id: 1, imageName: 'image.jpg', storeName: 'Sample Store' }, required: false })
        newStamp?: NewStampDto;
        @ApiProperty({ type: () => [NewBadgeDto], example: [{ id: 1, code: 'CODE123', name: 'Sample Name', description: 'Sample description', badgeImageName: 'badge.png' }], required: false })
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
        @ApiProperty({ type: Number, example: 1 })
        certificationId: number;
        @ApiProperty({ type: String, enum: ['loot', 'checkin'], example: 'loot' })
        type: 'loot' | 'checkin';
        @ApiProperty({ type: () => RewardsDto, example: { exp: 50, totalExp: 500, currentLevel: 3, levelUp: false, newLevel: 3, expToNextLevel: 100, newStamp: { id: 1, imageName: 'image.jpg', storeName: 'Sample Store' }, newBadges: [{ id: 1, code: 'CODE123', name: 'Sample Name', description: 'Sample description', badgeImageName: 'badge.png' }] } })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'icon.png', required: false })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample content' })
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
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample content' })
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
        @ApiProperty({ type: () => [TagDto], example: [{ id: 1, name: 'Sample Name', iconName: 'icon.png' }] })
        tags: TagDto[];
        @ApiProperty({ type: () => [CommentPresetDto], example: [{ id: 1, content: 'Sample content' }] })
        lootComments: CommentPresetDto[];
        @ApiProperty({ type: () => [ReasonPresetDto], example: [{ id: 1, content: 'Sample content' }] })
        checkinReasons: ReasonPresetDto[];

        constructor(tags: TagDto[], lootComments: CommentPresetDto[], checkinReasons: ReasonPresetDto[]) {
            this.tags = tags;
            this.lootComments = lootComments;
            this.checkinReasons = checkinReasons;
        }
    }
}
