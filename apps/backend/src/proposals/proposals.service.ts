import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { Repository } from 'typeorm';
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

    async createProposal(userId: number, dto: ProposalInput.CreateProposalDto) {
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) throw new BadRequestException('User not found');

        const proposal = this.proposalRepository.create({
            name: dto.title,
            address: dto.message,
            latitude: dto.latitude || 0,
            longitude: dto.longitude || 0,
            status: 'pending',
            user
        });

        const savedProposal = await this.proposalRepository.save(proposal);

        // 경험치 증가 로직 (제보 당 50 exp)
        const expGained = 50;
        let userProgress = await this.userProgressRepository.findOne({ where: { userId } });

        if (!userProgress) {
            // UserProgress가 없으면 생성
            userProgress = this.userProgressRepository.create({
                userId,
                level: 1,
                exp: expGained,
                lastActivityAt: new Date()
            });
        } else {
            userProgress.exp += expGained;
            userProgress.lastActivityAt = new Date();

            // 레벨업 체크 (간단한 공식: 다음 레벨 = 현재 레벨 * 100)
            const expForNextLevel = userProgress.level * 100;
            if (userProgress.exp >= expForNextLevel) {
                userProgress.level += 1;
                // 레벨업 알림 생성 (선택 사항)
            }
        }

        await this.userProgressRepository.save(userProgress);

        return new ProposalResult.CreateProposalResultDto(
            savedProposal.id,
            'pending',
            expGained
        );
    }

    async getMyProposals(userId: number, status?: 'pending' | 'approved' | 'rejected', page: number = 1, size: number = 20) {
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
