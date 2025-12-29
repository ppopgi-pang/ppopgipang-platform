export namespace CareerResult {
    export class JobPostingDto {
        id: number;
        title: string;
        description?: string;
        department?: string;
        positionType?: string;
        location?: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
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
        items: JobPostingDto[];
        total: number;
        page: number;
        size: number;

        constructor(items: JobPostingDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }

    export class ApplicationDto {
        id: number;
        jobPosting: {
            id: number;
            title: string;
        };
        name: string;
        email: string;
        phone?: string;
        resumeName?: string;
        memo?: string;
        status: string;
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
        items: ApplicationDto[];
        total: number;
        page: number;
        size: number;

        constructor(items: ApplicationDto[], total: number, page: number, size: number) {
            this.items = items;
            this.total = total;
            this.page = page;
            this.size = size;
        }
    }

    export class CreateApplicationResultDto {
        id: number;
        message: string;

        constructor(id: number, message: string) {
            this.id = id;
            this.message = message;
        }
    }
}
