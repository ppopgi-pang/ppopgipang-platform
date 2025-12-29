import type { CareerInput, CareerResult, FileResult } from "@ppopgipang/types";
import { apiClient } from "../lib/axios";

type JobPostingsParams = {
	isActive?: boolean;
	page?: number;
	size?: number;
};

export const getJobPostings = async ({
	isActive,
	page = 1,
	size = 20,
}: JobPostingsParams = {}): Promise<CareerResult.JobPostingListDto> => {
	const params: Record<string, string | number | boolean> = { page, size };
	if (typeof isActive === "boolean") {
		params.isActive = isActive;
	}

	const { data } = await apiClient.get<CareerResult.JobPostingListDto>(
		"/careers/job-postings",
		{ params },
	);
	return data;
};

export const getJobPosting = async (
	id: number,
): Promise<CareerResult.JobPostingDto> => {
	const { data } = await apiClient.get<CareerResult.JobPostingDto>(
		`/careers/job-postings/${id}`,
	);
	return data;
};

export const uploadResumeFile = async (file: File): Promise<FileResult.UploadDto> => {
	const formData = new FormData();
	formData.append("file", file);

	const { data } = await apiClient.post<FileResult.UploadDto>("/commons/file-upload", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});

	return data;
};

export const createApplication = async (
	dto: CareerInput.CreateApplicationDto,
): Promise<CareerResult.CreateApplicationResultDto> => {
	const { data } = await apiClient.post<CareerResult.CreateApplicationResultDto>(
		"/careers/applications",
		dto,
	);
	return data;
};

export const createJobPosting = async (
	dto: CareerInput.CreateJobPostingDto,
): Promise<CareerResult.JobPostingDto> => {
	const { data } = await apiClient.post<CareerResult.JobPostingDto>(
		"/careers/job-postings",
		dto,
	);
	return data;
};

export const updateJobPosting = async (
	id: number,
	dto: CareerInput.UpdateJobPostingDto,
): Promise<CareerResult.JobPostingDto> => {
	const { data } = await apiClient.put<CareerResult.JobPostingDto>(
		`/careers/job-postings/${id}`,
		dto,
	);
	return data;
};

export const deleteJobPosting = async (id: number): Promise<void> => {
	await apiClient.delete(`/careers/job-postings/${id}`);
};

type GetApplicationsParams = {
	jobPostingId?: number;
	status?: string;
	page?: number;
	size?: number;
};

export const getApplications = async ({
	jobPostingId,
	status,
	page = 1,
	size = 20,
}: GetApplicationsParams = {}): Promise<CareerResult.ApplicationListDto> => {
	const params: Record<string, string | number> = { page, size };
	if (jobPostingId) params.jobPostingId = jobPostingId;
	if (status) params.status = status;

	const { data } = await apiClient.get<CareerResult.ApplicationListDto>(
		"/careers/applications",
		{ params },
	);
	return data;
};

export const getApplication = async (
	id: number,
): Promise<CareerResult.ApplicationDto> => {
	const { data } = await apiClient.get<CareerResult.ApplicationDto>(
		`/careers/applications/${id}`,
	);
	return data;
};
