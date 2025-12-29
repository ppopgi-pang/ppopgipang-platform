import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CareersService } from './careers.service';
import { CareerInput } from '@ppopgipang/types';

@Controller('v1/careers')
@ApiTags('[Career] 채용')
export class CareersController {
    constructor(private readonly careersService: CareersService) { }

    // Job Posting CRUD
    @Post('job-postings')
    @ApiOperation({ summary: '(관리자) 채용 공고 생성' })
    createJobPosting(@Body() dto: CareerInput.CreateJobPostingDto) {
        return this.careersService.createJobPosting(dto);
    }

    @Get('job-postings')
    @ApiOperation({ summary: '(공개) 채용 공고 목록 조회' })
    @ApiQuery({ name: 'isActive', required: false, description: '활성 상태 필터 (true/false)' })
    @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1 })
    @ApiQuery({ name: 'size', required: false, description: '한 페이지당 개수', example: 20 })
    getJobPostings(
        @Query('isActive') isActive?: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 20
    ) {
        const isActiveBoolean = isActive === 'true' ? true : isActive === 'false' ? false : undefined;
        return this.careersService.getJobPostings(isActiveBoolean, page, size);
    }

    @Get('job-postings/:id')
    @ApiOperation({ summary: '(공개) 채용 공고 상세 조회' })
    getJobPosting(@Param('id', ParseIntPipe) id: number) {
        return this.careersService.getJobPosting(id);
    }

    @Put('job-postings/:id')
    @ApiOperation({ summary: '(관리자) 채용 공고 수정' })
    updateJobPosting(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CareerInput.UpdateJobPostingDto
    ) {
        return this.careersService.updateJobPosting(id, dto);
    }

    @Delete('job-postings/:id')
    @ApiOperation({ summary: '(관리자) 채용 공고 삭제' })
    deleteJobPosting(@Param('id', ParseIntPipe) id: number) {
        return this.careersService.deleteJobPosting(id);
    }

    // Application
    @Post('applications')
    @ApiOperation({ summary: '(공개) 지원서 제출' })
    createApplication(@Body() dto: CareerInput.CreateApplicationDto) {
        return this.careersService.createApplication(dto);
    }

    @Get('applications')
    @ApiOperation({ summary: '(관리자) 지원서 목록 조회' })
    @ApiQuery({ name: 'jobPostingId', required: false, description: '채용 공고 ID 필터' })
    @ApiQuery({ name: 'status', required: false, description: '지원서 상태 필터' })
    @ApiQuery({ name: 'page', required: false, description: '페이지', example: 1 })
    @ApiQuery({ name: 'size', required: false, description: '한 페이지당 개수', example: 20 })
    getApplications(
        @Query('jobPostingId') jobPostingId?: number,
        @Query('status') status?: string,
        @Query('page') page: number = 1,
        @Query('size') size: number = 20
    ) {
        return this.careersService.getApplications(jobPostingId, status, page, size);
    }

    @Get('applications/:id')
    @ApiOperation({ summary: '(관리자) 지원서 상세 조회' })
    getApplication(@Param('id', ParseIntPipe) id: number) {
        return this.careersService.getApplication(id);
    }
}
