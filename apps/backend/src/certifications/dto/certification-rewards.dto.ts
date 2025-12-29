import { ApiProperty } from '@nestjs/swagger';

export class NewStampDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    imageName: string;

    @ApiProperty()
    storeName: string;

    constructor(id: number, imageName: string, storeName: string) {
        this.id = id;
        this.imageName = imageName;
        this.storeName = storeName;
    }
}

export class NewBadgeDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    code: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    description: string;

    @ApiProperty()
    badgeImageName: string;

    constructor(id: number, code: string, name: string, description: string, badgeImageName: string) {
        this.id = id;
        this.code = code;
        this.name = name;
        this.description = description;
        this.badgeImageName = badgeImageName;
    }
}

export class RewardsDto {
    @ApiProperty({ description: '획득 EXP' })
    exp: number;

    @ApiProperty({ description: '현재 총 EXP' })
    totalExp: number;

    @ApiProperty({ description: '현재 레벨' })
    currentLevel: number;

    @ApiProperty({ description: '레벨업 여부' })
    levelUp: boolean;

    @ApiProperty({ description: '새 레벨 (레벨업 시)', required: false })
    newLevel?: number;

    @ApiProperty({ description: '다음 레벨까지 필요한 EXP' })
    expToNextLevel: number;

    @ApiProperty({ description: '새로 획득한 스탬프', type: NewStampDto, required: false })
    newStamp?: NewStampDto;

    @ApiProperty({ description: '새로 획득한 배지 목록', type: [NewBadgeDto], required: false })
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

export class CertificationResponseDto {
    @ApiProperty({ description: '생성된 인증 ID' })
    certificationId: number;

    @ApiProperty({ description: '인증 유형', enum: ['loot', 'checkin'] })
    type: 'loot' | 'checkin';

    @ApiProperty({ description: '보상 정보', type: RewardsDto })
    rewards: RewardsDto;

    constructor(certificationId: number, type: 'loot' | 'checkin', rewards: RewardsDto) {
        this.certificationId = certificationId;
        this.type = type;
        this.rewards = rewards;
    }
}
