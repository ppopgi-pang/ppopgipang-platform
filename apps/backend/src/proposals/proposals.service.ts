import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proposal } from './entities/proposal.entity';
import { Repository } from 'typeorm';
import { ProposalInput } from '@ppopgipang/types';
import { User } from 'src/users/entities/user.entity';

@Injectable()
@Injectable()
export class ProposalsService {
    constructor(
        @InjectRepository(Proposal)
        private readonly proposalRepository: Repository<Proposal>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
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

        return await this.proposalRepository.save(proposal);
    }
}
