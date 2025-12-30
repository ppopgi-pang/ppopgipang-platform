import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { EntityManager, QueryRunner, Repository } from 'typeorm';
import { ProposalInput, ProposalResult } from '@ppopgipang/types';
import { User } from 'src/users/entities/user.entity';
import { UserProgress } from 'src/gamification/entities/user-progress.entity';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class ProposalsService {
    constructor(
        @InjectRepository(Proposal)
        private readonly proposalRepository: Repository<Proposal>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserProgress)
        private readonly userProgressRepository: Repository<UserProgress>,
        @InjectRepository(Store)
        private readonly storeRepository: Repository<Store>
    ) { }

    /**
     * 신규 제보 생성 (트랜잭션 적용)
     */
    async createProposal(
        userId: number,
        queryRunner: QueryRunner,
        dto: ProposalInput.CreateProposalDto
    ): Promise<ProposalResult.CreateProposalResultDto> {
        const manager = queryRunner.manager;

        // 0. User 찾기
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) throw new BadRequestException('User not found');

        // 1. Proposal 생성
        const proposal = manager.create(Proposal, {
            name: dto.title,
            address: dto.message,
            latitude: dto.latitude || 0,
            longitude: dto.longitude || 0,
            status: 'pending',
            user
        });
        const savedProposal = await manager.save(Proposal, proposal);

        // 2. 경험치 증가 로직 (제보 당 50 exp)
        const expGained = 50;
        let userProgress = await manager.findOne(UserProgress, { where: { userId } });

        if (!userProgress) {
            // UserProgress가 없으면 생성
            userProgress = manager.create(UserProgress, {
                userId,
                level: 1,
                exp: expGained,
                streakDays: 0,
                lastActivityAt: new Date()
            });
        } else {
            userProgress.exp += expGained;
            userProgress.lastActivityAt = new Date();

            // 레벨업 체크 (간단한 공식: 다음 레벨 = 현재 레벨 * 100)
            const expForNextLevel = userProgress.level * 100;
            if (userProgress.exp >= expForNextLevel) {
                userProgress.level += 1;
            }
        }

        await manager.save(UserProgress, userProgress);

        return new ProposalResult.CreateProposalResultDto(
            savedProposal.id,
            'pending',
            expGained
        );
    }

    /**
     * 내 제보 내역 조회 (트랜잭션 불필요 - 읽기 전용)
     */
    async getMyProposals(
        userId: number,
        status?: 'pending' | 'approved' | 'rejected',
        page: number = 1,
        size: number = 20
    ): Promise<ProposalResult.MyProposalsDto> {
        const qb = this.proposalRepository.createQueryBuilder('proposal')
            .leftJoinAndSelect('proposal.store', 'store')
            .where('proposal.user.id = :userId', { userId });

        if (status) {
            qb.andWhere('proposal.status = :status', { status });
        }

        const [proposals, total] = await qb
            .orderBy('proposal.createdAt', 'DESC')
            .skip((page - 1) * size)
            .take(size)
            .getManyAndCount();

        const items = proposals.map(p => {
            let storeInfo: ProposalResult.StoreInfoDto | null = null;
            if (p.store) {
                storeInfo = new ProposalResult.StoreInfoDto(p.store.id, p.store.name);
            }
            return new ProposalResult.ProposalDto(
                p.id,
                p.name,
                p.address,
                Number(p.latitude),
                Number(p.longitude),
                p.status,
                p.createdAt,
                storeInfo
            );
        });

        return new ProposalResult.MyProposalsDto(items, total, page, size);
    }
}
