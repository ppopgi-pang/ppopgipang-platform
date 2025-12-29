export namespace CareerInput {
    export class CreateJobPostingDto {
        title: string;
        description?: string;
        department?: string;
        positionType?: string;
        location?: string;
    }

    export class UpdateJobPostingDto {
        title?: string;
        description?: string;
        department?: string;
        positionType?: string;
        location?: string;
        isActive?: boolean;
    }

    export class CreateApplicationDto {
        jobPostingId: number;
        name: string;
        email: string;
        phone?: string;
        resumeName?: string;
        memo?: string;
    }
}
