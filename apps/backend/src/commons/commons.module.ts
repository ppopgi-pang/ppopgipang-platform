import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CommonsService } from './commons.service';
import { CommonsController } from './commons.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from "uuid";

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        storage: diskStorage({
          destination: join(configService.getOrThrow('PUBLIC_UPLOAD_DIR'), 'temp'),
          filename: (req, file, cb) => {
            const split = file.originalname.split('.');

            let extension = 'unknown';

            if (split.length > 1) {
              extension = split[split.length - 1];
            }

            cb(null, `${v4()}_${Date.now()}.${extension}`)
          }
        }),
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [CommonsController],
  providers: [CommonsService],
})
export class CommonsModule { }
