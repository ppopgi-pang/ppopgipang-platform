import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPosting } from './entities/job-posting.entity';
import { Application } from './entities/application.entity';
import { CareerInput, CareerResult } from '@ppopgipang/types';
import { join } from 'path';
import { copyFile, rename, unlink } from 'fs/promises';

@Injectable()
export class CareersService {
    constructor(
        @InjectRepository(JobPosting)
        private readonly jobPostingRepository: Repository<JobPosting>,
        @InjectRepository(Application)
        private readonly applicationRepository: Repository<Application>
    ) { }

    async createJobPosting(dto: CareerInput.CreateJobPostingDto): Promise<CareerResult.JobPostingDto> {
        const jobPosting = new JobPosting();
        jobPosting.title = dto.title;
        jobPosting.description = dto.description;
        jobPosting.department = dto.department;
        jobPosting.positionType = dto.positionType;
        jobPosting.location = dto.location;
        jobPosting.isActive = true;

        const saved = await this.jobPostingRepository.save(jobPosting);

        return new CareerResult.JobPostingDto(
            saved.id,
            saved.title,
            saved.description,
            saved.department,
            saved.positionType,
            saved.location,
            saved.isActive,
            saved.createdAt,
            saved.updatedAt,
            0
        );
    }

    async getJobPostings(
        isActive?: boolean,
        page: number = 1,
        size: number = 20
    ): Promise<CareerResult.JobPostingListDto> {
        const qb = this.jobPostingRepository.createQueryBuilder('jobPosting')
            .leftJoin('jobPosting.applications', 'application')
            .addSelect('COUNT(application.id)', 'applicationCount')
            .groupBy('jobPosting.id');

        if (isActive !== undefined) {
            qb.where('jobPosting.isActive = :isActive', { isActive });
        }

        qb.orderBy('jobPosting.createdAt', 'DESC')
            .skip((page - 1) * size)
            .take(size);

        const [rawResults, total] = await Promise.all([
            qb.getRawAndEntities(),
            qb.getCount()
        ]);

        const items = rawResults.entities.map((jobPosting, index) => {
            const applicationCount = parseInt(rawResults.raw[index]?.applicationCount || '0');
            return new CareerResult.JobPostingDto(
                jobPosting.id,
                jobPosting.title,
                jobPosting.description,
                jobPosting.department,
                jobPosting.positionType,
                jobPosting.location,
                jobPosting.isActive,
                jobPosting.createdAt,
                jobPosting.updatedAt,
                applicationCount
            );
        });

        return new CareerResult.JobPostingListDto(items, total, page, size);
    }

    async getJobPosting(id: number): Promise<CareerResult.JobPostingDto> {
        const result = await this.jobPostingRepository.createQueryBuilder('jobPosting')
            .leftJoin('jobPosting.applications', 'application')
            .addSelect('COUNT(application.id)', 'applicationCount')
            .where('jobPosting.id = :id', { id })
            .groupBy('jobPosting.id')
            .getRawAndEntities();

        if (result.entities.length === 0) {
            throw new NotFoundException('Job posting not found');
        }

        const jobPosting = result.entities[0];
        const applicationCount = parseInt(result.raw[0]?.applicationCount || '0');

        return new CareerResult.JobPostingDto(
            jobPosting.id,
            jobPosting.title,
            jobPosting.description,
            jobPosting.department,
            jobPosting.positionType,
            jobPosting.location,
            jobPosting.isActive,
            jobPosting.createdAt,
            jobPosting.updatedAt,
            applicationCount
        );
    }

    async updateJobPosting(
        id: number,
        dto: CareerInput.UpdateJobPostingDto
    ): Promise<CareerResult.JobPostingDto> {
        const jobPosting = await this.jobPostingRepository.findOne({ where: { id } });
        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        if (dto.title !== undefined) jobPosting.title = dto.title;
        if (dto.description !== undefined) jobPosting.description = dto.description;
        if (dto.department !== undefined) jobPosting.department = dto.department;
        if (dto.positionType !== undefined) jobPosting.positionType = dto.positionType;
        if (dto.location !== undefined) jobPosting.location = dto.location;
        if (dto.isActive !== undefined) jobPosting.isActive = dto.isActive;

        const updated = await this.jobPostingRepository.save(jobPosting);

        const applicationCount = await this.applicationRepository.count({
            where: { jobPosting: { id } }
        });

        return new CareerResult.JobPostingDto(
            updated.id,
            updated.title,
            updated.description,
            updated.department,
            updated.positionType,
            updated.location,
            updated.isActive,
            updated.createdAt,
            updated.updatedAt,
            applicationCount
        );
    }

    async deleteJobPosting(id: number): Promise<void> {
        const jobPosting = await this.jobPostingRepository.findOne({ where: { id } });
        if (!jobPosting) {
            throw new NotFoundException('Job posting not found');
        }

        await this.jobPostingRepository.remove(jobPosting);
    }

    async createApplication(dto: CareerInput.CreateApplicationDto): Promise<CareerResult.CreateApplicationResultDto> {
        const jobPosting = await this.jobPostingRepository.findOne({
            where: { id: dto.jobPostingId }
        });

        if (!jobPosting) {
            throw new BadRequestException('Job posting not found');
        }

        if (!jobPosting.isActive) {
            throw new BadRequestException('This job posting is not accepting applications');
        }

        const application = new Application();
        application.jobPosting = jobPosting;
        application.name = dto.name;
        application.email = dto.email;
        application.phone = dto.phone;
        application.resumeName = dto.resumeName;
        application.memo = dto.memo;
        application.status = 'new';

        if (dto.resumeName) {
            const tempFolder = join(process.cwd(), 'public', 'temp');
            const careerFolder = join(process.cwd(), 'public', 'career');

            const oldPath = join(tempFolder, dto.resumeName);
            const newPath = join(careerFolder, dto.resumeName);

            try {
                await rename(oldPath, newPath);
            } catch (e: any) {
                if (e.code === 'EXDEV') {
                    await copyFile(oldPath, newPath);
                    await unlink(oldPath);
                } else {
                    throw e;
                }
            }
        }

        const saved = await this.applicationRepository.save(application);

        return new CareerResult.CreateApplicationResultDto(
            saved.id,
            '지원서가 성공적으로 제출되었습니다.'
        );
    }

    async getApplications(
        jobPostingId?: number,
        status?: string,
        page: number = 1,
        size: number = 20
    ): Promise<CareerResult.ApplicationListDto> {
        const qb = this.applicationRepository.createQueryBuilder('application')
            .leftJoinAndSelect('application.jobPosting', 'jobPosting');

        if (jobPostingId) {
            qb.where('application.jobPosting.id = :jobPostingId', { jobPostingId });
        }

        if (status) {
            qb.andWhere('application.status = :status', { status });
        }

        qb.orderBy('application.createdAt', 'DESC')
            .skip((page - 1) * size)
            .take(size);

        const [applications, total] = await qb.getManyAndCount();

        const items = applications.map(app => new CareerResult.ApplicationDto(
            app.id,
            {
                id: app.jobPosting.id,
                title: app.jobPosting.title
            },
            app.name,
            app.email,
            app.phone,
            app.resumeName,
            app.memo,
            app.status,
            app.createdAt
        ));

        return new CareerResult.ApplicationListDto(items, total, page, size);
    }

    async getApplication(id: number): Promise<CareerResult.ApplicationDto> {
        const application = await this.applicationRepository.findOne({
            where: { id },
            relations: ['jobPosting']
        });

        if (!application) {
            throw new NotFoundException('Application not found');
        }

        return new CareerResult.ApplicationDto(
            application.id,
            {
                id: application.jobPosting.id,
                title: application.jobPosting.title
            },
            application.name,
            application.email,
            application.phone,
            application.resumeName,
            application.memo,
            application.status,
            application.createdAt
        );
    }
}
