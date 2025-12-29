import { Body, Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileResult } from '@ppopgipang/types';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UploadsService } from './uploads.service';
import { GenerateUploadUrlsDto } from './dto/upload-request.dto';

@ApiTags('[Common] 공통 기능')
@Controller('v1/commons')
export class CommonsController {
  constructor(private readonly uploadsService: UploadsService) {}

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

  @Post('uploads/certification')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: '(사용자) 인증 이미지 업로드 URL 발급',
    description: 'S3 Presigned URL을 발급합니다. 발급받은 URL로 PUT 요청하여 이미지 업로드'
  })
  @ApiBody({ type: GenerateUploadUrlsDto })
  generateCertificationUploadUrls(
    @Body() dto: GenerateUploadUrlsDto
  ) {
    return this.uploadsService.generateCertificationUploadUrls(dto.fileCount, dto.contentTypes);
  }

}
