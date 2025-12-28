import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Certification } from './entities/certification.entity';
import { CertificationPhoto } from './entities/certification-photo.entity';
import { LootLike } from './entities/loot-like.entity';
import { CertificationResult } from '@ppopgipang/types';

@Injectable()
export class CertificationsService {
    constructor(
        @InjectRepository(Certification)
        private readonly certificationRepository: Repository<Certification>,
        @InjectRepository(CertificationPhoto)
        private readonly certificationPhotoRepository: Repository<CertificationPhoto>,
        @InjectRepository(LootLike)
        private readonly lootLikeRepository: Repository<LootLike>
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
}
