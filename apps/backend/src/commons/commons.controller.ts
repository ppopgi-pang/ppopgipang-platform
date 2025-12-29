import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResult } from '@ppopgipang/types';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';

@ApiTags('[Common] 공통 기능')
@Controller('v1/commons')
export class CommonsController {
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
  @ApiOkResponse({ type: FileResult.UploadDto, description: '파일 업로드 성공' })
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
