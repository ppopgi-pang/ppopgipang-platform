import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, QueryRunner, Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { CertificationPhoto } from './entities/certification-photo.entity';
import { LootLike } from './entities/loot-like.entity';
import { LootTag } from './entities/loot-tag.entity';
import { LootCommentPreset } from './entities/loot-comment-preset.entity';
import { CheckinReasonPreset } from './entities/checkin-reason-preset.entity';
import { CertificationInput, CertificationResult } from '@ppopgipang/types';
import { GamificationService } from 'src/gamification/gamification.service';
import { User } from 'src/users/entities/user.entity';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class CertificationsService {
    constructor(
        @InjectRepository(Certification)
        private readonly certificationRepository: Repository<Certification>,
        @InjectRepository(LootLike)
        private readonly lootLikeRepository: Repository<LootLike>,
        @InjectRepository(LootTag)
        private readonly lootTagRepository: Repository<LootTag>,
        @InjectRepository(LootCommentPreset)
        private readonly lootCommentRepository: Repository<LootCommentPreset>,
        @InjectRepository(CheckinReasonPreset)
        private readonly checkinReasonRepository: Repository<CheckinReasonPreset>,
        private readonly gamificationService: GamificationService
    ) { }

    async getLootGallery(storeId: number, sort: 'latest' | 'popular', page: number, size: number, userId?: number) {
        const qb = this.certificationRepository.createQueryBuilder('cert')
            .leftJoinAndSelect('cert.photos', 'photos')
            .leftJoinAndSelect('cert.user', 'user')
            .loadRelationCountAndMap('cert.likesCount', 'cert.likes')
            .where('cert.store.id = :storeId', { storeId })
            .andWhere('cert.type = :type', { type: 'loot' });

        // 정렬
        if (sort === 'latest') {
            qb.orderBy('cert.occurredAt', 'DESC');
        } else {
            // popular: likesCount DESC
            qb.orderBy('cert.likesCount', 'DESC')
                .addOrderBy('cert.occurredAt', 'DESC');
        }

        // 페이지네이션
        const [certifications, total] = await qb
            .skip((page - 1) * size)
            .take(size)
            .getManyAndCount();

        // 로그인한 경우 좋아요 여부 조회
        let likedCertIds = new Set<number>();
        if (userId && certifications.length > 0) {
            const certIds = certifications.map(c => c.id);
            const likes = await this.lootLikeRepository.find({
                where: { userId, certificationId: certIds as any }
            });
            likes.forEach(like => likedCertIds.add(like.certificationId));
        }

        // DTO 변환
        const items = certifications.map(cert => {
            const photos = cert.photos.map(p => new CertificationResult.LootPhotoDto(p.id, p.imageName));
            const user = new CertificationResult.LootUserDto(
                cert.user.id,
                cert.user.nickname,
                cert.user.profileImage
            );
            return new CertificationResult.LootDto(
                cert.id,
                cert.type,
                cert.occurredAt,
                photos,
                (cert as any).likesCount || 0,
                userId ? likedCertIds.has(cert.id) : false,
                user
            );
        });

        return new CertificationResult.LootGalleryDto(items, total, page, size);
    }

    /**
     * 득템 인증 생성
     */
    async createLootCertification(userId: number, queryRunner: QueryRunner, dto: CertificationInput.CreateLootDto): Promise<CertificationResult.CertificationResponseDto> {
        const manager = queryRunner.manager;

        // 0. User 찾기
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) throw new InternalServerErrorException('User가 존재하지 않습니다.');

        // 0-1. Store 찾기
        const store = await manager.findOne(Store, { where: { id: dto.storeId } });
        if (!store) throw new InternalServerErrorException('Store가 존재하지 않습니다.');

        // 1. Certification 레코드 생성
        const certification = manager.create(Certification, {
            user,
            store,
            type: 'loot',
            occurredAt: new Date(),
            latitude: dto.latitude,
            longitude: dto.longitude,
            exp: 50,
            comment: dto.comment,
        });
        const savedCertification = await manager.save(Certification, certification);

        // 2. 사진 저장
        await this.savePhotosWithManager(manager, savedCertification.id, dto.photoFileNames);

        // 3. 태그 연결
        if (dto.tagIds?.length) {
            const tags = await manager.findByIds(LootTag, dto.tagIds);
            savedCertification.tags = tags;
            await manager.save(Certification, savedCertification);
        }

        // 4. 게이미피케이션 처리
        const rewards = await this.gamificationService.processCertification(
            userId,
            dto.storeId,
            'loot',
            50,
            queryRunner
        );

        return new CertificationResult.CertificationResponseDto(savedCertification.id, 'loot', rewards);
    }

    /**
     * 체크인 인증 생성
     */
    async createCheckinCertification(userId: number, queryRunner: QueryRunner, dto: CertificationInput.CreateCheckinDto): Promise<CertificationResult.CertificationResponseDto> {
        const manager = queryRunner.manager;

        // 0. User 찾기
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) throw new InternalServerErrorException('User가 존재하지 않습니다.');

        // 0-1. Store 찾기
        const store = await manager.findOne(Store, { where: { id: dto.storeId } });
        if (!store) throw new InternalServerErrorException('Store가 존재하지 않습니다.');

        // 1. Certification 레코드 생성
        const certification = manager.create(Certification, {
            user,
            store,
            type: 'checkin',
            occurredAt: new Date(),
            latitude: dto.latitude,
            longitude: dto.longitude,
            exp: 10,
            rating: dto.rating,
        });
        const savedCertification = await manager.save(Certification, certification);

        // 2. 이유 연결
        if (dto.reasonIds?.length) {
            const reasons = await manager.findByIds(CheckinReasonPreset, dto.reasonIds);
            savedCertification.reasons = reasons;
            await manager.save(Certification, savedCertification);
        }

        // 3. 게이미피케이션 처리
        const rewards = await this.gamificationService.processCertification(
            userId,
            dto.storeId,
            'checkin',
            10,
            queryRunner
        );

        return new CertificationResult.CertificationResponseDto(savedCertification.id, 'checkin', rewards);
    }

    /**
     * 사진 저장 헬퍼 (트랜잭션 지원)
     */
    private async savePhotosWithManager(
        manager: EntityManager,
        certificationId: number,
        photoFileNames: string[]
    ): Promise<void> {
        const photos = photoFileNames.map((fileName, index) =>
            manager.create(CertificationPhoto, {
                certificationId,
                imageName: fileName,
                sortOrder: index
            })
        );
        await manager.save(CertificationPhoto, photos);
    }

    /**
     * 태그 및 프리셋 조회
     */
    async getPresets(): Promise<CertificationResult.PresetsDto> {
        const tags = await this.lootTagRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' }
        });

        const lootComments = await this.lootCommentRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' }
        });

        const checkinReasons = await this.checkinReasonRepository.find({
            where: { isActive: true },
            order: { sortOrder: 'ASC' }
        });

        const tagDtos = tags.map(t => new CertificationResult.TagDto(t.id, t.name, t.iconName));
        const commentDtos = lootComments.map(c => new CertificationResult.CommentPresetDto(c.id, c.content));
        const reasonDtos = checkinReasons.map(r => new CertificationResult.ReasonPresetDto(r.id, r.content));

        return new CertificationResult.PresetsDto(tagDtos, commentDtos, reasonDtos);
    }
}
