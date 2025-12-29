import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { CertificationPhoto } from './entities/certification-photo.entity';
import { LootLike } from './entities/loot-like.entity';
import { LootTag } from './entities/loot-tag.entity';
import { LootCommentPreset } from './entities/loot-comment-preset.entity';
import { CheckinReasonPreset } from './entities/checkin-reason-preset.entity';
import { CertificationResult } from '@ppopgipang/types';
import { CreateLootDto } from './dto/create-loot.dto';
import { CreateCheckinDto } from './dto/create-checkin.dto';
import { CertificationResponseDto } from './dto/certification-rewards.dto';
import { GamificationService } from 'src/gamification/gamification.service';

@Injectable()
export class CertificationsService {
    constructor(
        @InjectRepository(Certification)
        private readonly certificationRepository: Repository<Certification>,
        @InjectRepository(CertificationPhoto)
        private readonly certificationPhotoRepository: Repository<CertificationPhoto>,
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
    async createLootCertification(userId: number, dto: CreateLootDto): Promise<CertificationResponseDto> {
        // 1. Certification 레코드 생성
        const certification = await this.certificationRepository.save({
            userId,
            storeId: dto.storeId,
            type: 'loot',
            occurredAt: new Date(),
            latitude: dto.latitude,
            longitude: dto.longitude,
            exp: 50,
            comment: dto.comment,
        });

        // 2. 사진 저장
        await this.savePhotos(certification.id, dto.photoKeys);

        // 3. 태그 연결
        if (dto.tagIds?.length) {
            const tags = await this.lootTagRepository.findByIds(dto.tagIds);
            certification.tags = tags;
            await this.certificationRepository.save(certification);
        }

        // 4. 게이미피케이션 처리
        const rewards = await this.gamificationService.processCertification(
            userId,
            dto.storeId,
            'loot',
            50
        );

        return new CertificationResponseDto(certification.id, 'loot', rewards);
    }

    /**
     * 체크인 인증 생성
     */
    async createCheckinCertification(userId: number, dto: CreateCheckinDto): Promise<CertificationResponseDto> {
        // 1. Certification 레코드 생성
        const certification = await this.certificationRepository.save({
            userId,
            storeId: dto.storeId,
            type: 'checkin',
            occurredAt: new Date(),
            latitude: dto.latitude,
            longitude: dto.longitude,
            exp: 10,
            rating: dto.rating,
        });

        // 2. 이유 연결
        if (dto.reasonIds?.length) {
            const reasons = await this.checkinReasonRepository.findByIds(dto.reasonIds);
            certification.reasons = reasons;
            await this.certificationRepository.save(certification);
        }

        // 3. 게이미피케이션 처리
        const rewards = await this.gamificationService.processCertification(
            userId,
            dto.storeId,
            'checkin',
            10
        );

        return new CertificationResponseDto(certification.id, 'checkin', rewards);
    }

    /**
     * 사진 저장 헬퍼
     */
    private async savePhotos(certificationId: number, photoKeys: string[]): Promise<void> {
        const photos = photoKeys.map((key, index) => ({
            certificationId,
            imageName: key,
            sortOrder: index
        }));

        await this.certificationPhotoRepository.save(photos);
    }

    /**
     * 태그 및 프리셋 조회
     */
    async getPresets() {
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

        return {
            tags: tags.map(t => ({ id: t.id, name: t.name, iconName: t.iconName })),
            lootComments: lootComments.map(c => ({ id: c.id, content: c.content })),
            checkinReasons: checkinReasons.map(r => ({ id: r.id, content: r.content }))
        };
    }
}
