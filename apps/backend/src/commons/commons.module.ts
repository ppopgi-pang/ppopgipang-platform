import { Module } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { CommonsController } from './commons.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { join } from 'path';
import { v4 } from "uuid";

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(process.cwd(), '../../public', 'temp'),
        filename: (req, file, cb) => {
          const split = file.originalname.split('.');

          let extension = 'unknown';

          if (split.length > 1) {
            extension = split[split.length - 1];
          }

          cb(null, `${v4()}_${Date.now()}.${extension}`)
        }
      }),
    })
  ],
  controllers: [CommonsController],
  providers: [CommonsService],
})
export class CommonsModule {}
