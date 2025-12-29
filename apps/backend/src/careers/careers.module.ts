import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CareersController } from './careers.controller';
import { CareersService } from './careers.service';
import { JobPosting } from './entities/job-posting.entity';
import { Application } from './entities/application.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([JobPosting, Application])
    ],
    controllers: [CareersController],
    providers: [CareersService],
    exports: [CareersService]
})
export class CareersModule { }
