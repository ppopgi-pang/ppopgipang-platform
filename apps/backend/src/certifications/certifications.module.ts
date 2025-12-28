import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Certification } from './entities/certification.entity';
import { CertificationPhoto } from './entities/certification-photo.entity';
import { LootLike } from './entities/loot-like.entity';
import { CertificationsController } from './certifications.controller';
import { CertificationsService } from './certifications.service';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Certification,
      CertificationPhoto,
      LootLike,
      User
    ])
  ],
  controllers: [CertificationsController],
  providers: [CertificationsService],
})
export class CertificationsModule { }
