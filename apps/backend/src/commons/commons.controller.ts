import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CommonsService } from './commons.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResult } from '@ppopgipang/types';
import { ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';

@Controller('v1/commons')
export class CommonsController {
  constructor(private readonly commonsService: CommonsService) {}

  @Post('file-upload')
  @ApiOperation({ summary: '파일 업로드', description: '단일 파일 업로드 (최대 10MB)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary'
        }
      }
    }
  })
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 10 * 1024 * 1024
    }
  }))
  uploadFile(
    @UploadedFile() file: Express.Multer.File
  ) {
    return new FileResult.UploadDto(file.filename);
  }

}
