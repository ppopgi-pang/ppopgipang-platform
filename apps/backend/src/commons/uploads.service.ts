import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

/**
 * S3 업로드 서비스
 *
 * TODO: AWS SDK 설치 필요
 * npm install @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
 *
 * 환경변수 설정:
 * - AWS_REGION
 * - AWS_ACCESS_KEY_ID
 * - AWS_SECRET_ACCESS_KEY
 * - AWS_S3_BUCKET_NAME
 */
@Injectable()
export class UploadsService {
    constructor(private readonly configService: ConfigService) {}

    /**
     * 인증 이미지 업로드용 Presigned URL 발급
     */
    async generateCertificationUploadUrls(fileCount: number, contentTypes: string[]) {
        const bucket = this.configService.get('AWS_S3_BUCKET_NAME') || 'ppopgipang-uploads';
        const region = this.configService.get('AWS_REGION') || 'ap-northeast-2';
        const expiresIn = 3600; // 1시간

        const uploads = [];

        for (let i = 0; i < fileCount; i++) {
            const key = this.generateCertificationImageKey();
            const contentType = contentTypes[i] || 'image/jpeg';

            // TODO: AWS SDK 사용 시 아래 코드 활성화
            /*
            const { S3Client } = require('@aws-sdk/client-s3');
            const { PutObjectCommand } = require('@aws-sdk/client-s3');
            const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

            const s3Client = new S3Client({
                region,
                credentials: {
                    accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
                    secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY')
                }
            });

            const command = new PutObjectCommand({
                Bucket: bucket,
                Key: key,
                ContentType: contentType
            });

            const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
            */

            // 임시: 로컬 개발용 모의 URL
            const uploadUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Expires=${expiresIn}`;

            uploads.push({
                key,
                uploadUrl,
                expiresIn
            });
        }

        return { uploads };
    }

    /**
     * 인증 이미지 키 생성
     * 형식: certifications/{YYYY}/{MM}/{uuid}.{ext}
     */
    private generateCertificationImageKey(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const uuid = uuidv4();

        return `certifications/${year}/${month}/${uuid}.jpg`;
    }
}
