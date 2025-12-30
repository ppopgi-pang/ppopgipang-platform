import { ApiProperty } from "@nestjs/swagger";

export namespace CareerResult {
    export class JobPostingDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'Sample Title' })
        title: string;
        @ApiProperty({ type: String, example: 'Sample description', required: false })
        description?: string;
        @ApiProperty({ type: String, example: 'Engineering', required: false })
        department?: string;
        @ApiProperty({ type: String, example: 'Full-time', required: false })
        positionType?: string;
        @ApiProperty({ type: String, example: 'Seoul', required: false })
        location?: string;
        @ApiProperty({ type: Boolean, example: true })
        isActive: boolean;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        updatedAt: Date;
        @ApiProperty({ type: Number, example: 3, required: false })
        applicationCount?: number;

        constructor(
            id: number,
            title: string,
            description?: string,
            department?: string,
            positionType?: string,
            location?: string,
            isActive?: boolean,
            createdAt?: Date,
            updatedAt?: Date,
            applicationCount?: number
        ) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.department = department;
            this.positionType = positionType;
            this.location = location;
            this.isActive = isActive ?? true;
            this.createdAt = createdAt ?? new Date();
            this.updatedAt = updatedAt ?? new Date();
            this.applicationCount = applicationCount;
        }
    }

    export class JobPostingListDto {
        @ApiProperty({ type: () => [JobPostingDto], example: [{ id: 1, title: 'Sample Title', description: 'Sample description', department: 'Engineering', positionType: 'Full-time', location: 'Seoul', isActive: true, createdAt: '2024-01-01T00:00:00.000Z', updatedAt: '2024-01-01T00:00:00.000Z', applicationCount: 3 }] })
        items: JobPostingDto[];
        @ApiProperty({ type: Number, example: 20 })
        total: number;
        @ApiProperty({ type: Number, example: 1 })
        page: number;
        @ApiProperty({ type: Number, example: 10 })
        size: number;

        constructor(items: JobPostingDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }

    export class ApplicationDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: Object, example: { id: 1, title: 'Sample Title' } })
        jobPosting: {
            id: number;
            title: string;
        };
        @ApiProperty({ type: String, example: 'Sample Name' })
        name: string;
        @ApiProperty({ type: String, example: 'user@example.com' })
        email: string;
        @ApiProperty({ type: String, example: '010-1234-5678', required: false })
        phone?: string;
        @ApiProperty({ type: String, example: 'resume.pdf', required: false })
        resumeName?: string;
        @ApiProperty({ type: String, example: 'Sample memo', required: false })
        memo?: string;
        @ApiProperty({ type: String, example: 'active' })
        status: string;
        @ApiProperty({ type: String, format: 'date-time', example: '2024-01-01T00:00:00.000Z' })
        createdAt: Date;

        constructor(
            id: number,
            jobPosting: { id: number; title: string },
            name: string,
            email: string,
            phone?: string,
            resumeName?: string,
            memo?: string,
            status?: string,
            createdAt?: Date
        ) {
            this.id = id;
            this.jobPosting = jobPosting;
            this.name = name;
            this.email = email;
            this.phone = phone;
            this.resumeName = resumeName;
            this.memo = memo;
            this.status = status ?? 'new';
            this.createdAt = createdAt ?? new Date();
        }
    }

    export class ApplicationListDto {
        @ApiProperty({ type: () => [ApplicationDto], example: [{ id: 1, jobPosting: { id: 1, title: 'Sample Title' }, name: 'Sample Name', email: 'user@example.com', phone: '010-1234-5678', resumeName: 'resume.pdf', memo: 'Sample memo', status: 'active', createdAt: '2024-01-01T00:00:00.000Z' }] })
        items: ApplicationDto[];
        @ApiProperty({ type: Number, example: 20 })
        total: number;
        @ApiProperty({ type: Number, example: 1 })
        page: number;
        @ApiProperty({ type: Number, example: 10 })
        size: number;

        constructor(items: ApplicationDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }

    export class CreateApplicationResultDto {
        @ApiProperty({ type: Number, example: 1 })
        id: number;
        @ApiProperty({ type: String, example: 'success' })
        message: string;

        constructor(id: number, message: string) {
            this.id = id;
            this.message = message;
        }
    }
}
