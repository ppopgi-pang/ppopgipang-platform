import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import type { CareerInput, CareerResult, FileResult } from "@ppopgipang/types";
import { createApplication, getJobPosting, uploadResumeFile } from "@/shared/api/careers";
import { applyPageMeta, getMetaDescription, resetPageMeta } from "@/shared/lib/page-meta";

const formatJobDate = (value?: string | Date) => {
	if (!value) return "";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "";
	return format(parsed, "yyyy.MM.dd");
};

const getJobMeta = (jobPosting: CareerResult.JobPostingDto) =>
	[jobPosting.department, jobPosting.positionType, jobPosting.location].filter(Boolean) as string[];

export const Route = createFileRoute("/careers/$jobPostingId")({
	component: JobPostingDetailPage,
});

function JobPostingDetailPage() {
	const { jobPostingId } = Route.useParams();
	const parsedId = Number(jobPostingId);
	const queryClient = useQueryClient();
	const [isModalOpen, setIsModalOpen] = useState(false);

	const jobPostingQuery = useQuery({
		queryKey: ["jobPosting", parsedId],
		queryFn: () => getJobPosting(parsedId),
		enabled: Number.isFinite(parsedId),
	});

	useEffect(() => {
		if (!Number.isFinite(parsedId)) {
			applyPageMeta({
				title: "모집 공고 | 뽑기팡",
				description: "유효하지 않은 모집 공고입니다.",
				url: "/careers",
			});

			return () => resetPageMeta();
		}

		const fallbackDescription = "뽑기팡 팀의 채용 공고를 확인하고 지원해 보세요.";
		const jobPosting = jobPostingQuery.data;
		const title = jobPosting ? `${jobPosting.title} | 뽑기팡 채용` : "뽑기팡 채용 | 모집 공고";
		const description = jobPosting
			? getMetaDescription(jobPosting.description, fallbackDescription)
			: fallbackDescription;
		const url = jobPosting ? `/careers/${jobPosting.id}` : `/careers/${parsedId}`;

		applyPageMeta({
			title,
			description,
			url,
		});

		return () => resetPageMeta();
	}, [parsedId, jobPostingQuery.data]);

	if (!Number.isFinite(parsedId)) {
		return (
			<div className="min-h-screen w-full bg-slate-50 text-slate-900">
				<div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
					<p className="text-lg font-semibold text-slate-700">유효하지 않은 모집 공고입니다.</p>
					<Link
						to="/about-us"
						className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-sky-600"
					>
						소개 페이지로 돌아가기
					</Link>
				</div>
			</div>
		);
	}

	if (jobPostingQuery.isLoading) {
		return (
			<div className="min-h-screen w-full bg-slate-50 text-slate-900">
				<div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
					<div className="h-10 w-10 animate-spin rounded-full border-4 border-sky-500 border-t-transparent" />
					<p className="mt-4 text-sm text-slate-500">모집 공고를 불러오는 중입니다.</p>
				</div>
			</div>
		);
	}

	if (jobPostingQuery.isError || !jobPostingQuery.data) {
		return (
			<div className="min-h-screen w-full bg-slate-50 text-slate-900">
				<div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-20 text-center">
					<p className="text-lg font-semibold text-slate-700">모집 공고를 불러오지 못했습니다.</p>
					<p className="mt-2 text-sm text-slate-500">잠시 후 다시 시도해 주세요.</p>
					<Link
						to="/about-us"
						className="mt-4 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:text-sky-600"
					>
						소개 페이지로 돌아가기
					</Link>
				</div>
			</div>
		);
	}

	const jobPosting = jobPostingQuery.data;
	const tags = getJobMeta(jobPosting);
	const statusLabel = jobPosting.isActive ? "모집중" : "마감";
	const statusClass = jobPosting.isActive
		? "border-emerald-200 bg-emerald-50 text-emerald-600"
		: "border-slate-200 bg-slate-100 text-slate-500";
	const createdAt = formatJobDate(jobPosting.createdAt);
	const updatedAt = formatJobDate(jobPosting.updatedAt);

	return (
		<div className="min-h-screen w-full bg-slate-50 text-slate-900">
			<header className="sticky top-0 z-30 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
				<div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
					<Link to="/about-us" className="text-sm font-semibold text-slate-600 transition hover:text-sky-600">
						← 소개 페이지
					</Link>
					<span className="text-sm font-semibold text-slate-500">모집 공고</span>
				</div>
			</header>

			<main className="mx-auto max-w-5xl px-6 py-12">
				<div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
					<div className="flex flex-wrap items-center gap-3 text-xs">
						<span className={`rounded-full border px-2.5 py-1 font-semibold ${statusClass}`}>
							{statusLabel}
						</span>
						{createdAt && <span className="text-slate-400">게시일 {createdAt}</span>}
						{typeof jobPosting.applicationCount === "number" && (
							<span className="text-slate-400">지원 {jobPosting.applicationCount}명</span>
						)}
					</div>
					<h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-4xl">{jobPosting.title}</h1>
					{tags.length > 0 && (
						<div className="mt-6 flex flex-wrap gap-2 text-sm text-slate-600">
							{tags.map((tag) => (
								<span
									key={`${jobPosting.id}-${tag}`}
									className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1"
								>
									{tag}
								</span>
							))}
						</div>
					)}
					<div className="mt-8 border-t border-slate-200 pt-6">
						<h2 className="text-lg font-semibold text-slate-900">업무 소개</h2>
						<p className="mt-3 whitespace-pre-line text-slate-600">
							{jobPosting.description?.trim()
								? jobPosting.description
								: "상세 설명이 준비되는 중입니다."}
						</p>
					</div>
					<dl className="mt-8 grid gap-4 sm:grid-cols-2">
						<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
							<dt className="text-xs font-semibold text-slate-500">부서</dt>
							<dd className="mt-2 text-sm font-semibold text-slate-900">
								{jobPosting.department || "추후 안내"}
							</dd>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
							<dt className="text-xs font-semibold text-slate-500">직무 유형</dt>
							<dd className="mt-2 text-sm font-semibold text-slate-900">
								{jobPosting.positionType || "추후 안내"}
							</dd>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
							<dt className="text-xs font-semibold text-slate-500">근무지</dt>
							<dd className="mt-2 text-sm font-semibold text-slate-900">
								{jobPosting.location || "추후 안내"}
							</dd>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
							<dt className="text-xs font-semibold text-slate-500">최근 업데이트</dt>
							<dd className="mt-2 text-sm font-semibold text-slate-900">
								{updatedAt || "-"}
							</dd>
						</div>
					</dl>
					<div className="mt-10 flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-6 sm:flex-row sm:items-center sm:justify-between">
						<div>
							<p className="text-sm font-semibold text-slate-900">지금 지원할 수 있어요</p>
							<p className="mt-1 text-xs text-slate-500">
								기본 정보를 입력하면 지원서가 바로 접수됩니다.
							</p>
						</div>
						<button
							type="button"
							onClick={() => setIsModalOpen(true)}
							disabled={!jobPosting.isActive}
							className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
						>
							지원서 제출
						</button>
					</div>
				</div>
			</main>
			<ApplicationModal
				jobPostingId={jobPosting.id}
				jobTitle={jobPosting.title}
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSuccess={() => queryClient.invalidateQueries({ queryKey: ["jobPosting", parsedId] })}
			/>
		</div>
	);
}

interface ApplicationModalProps {
	jobPostingId: number;
	jobTitle: string;
	isOpen: boolean;
	onClose: () => void;
	onSuccess: () => void;
}

function ApplicationModal({ jobPostingId, jobTitle, isOpen, onClose, onSuccess }: ApplicationModalProps) {
	const [formData, setFormData] = useState({
		name: "",
		email: "",
		phone: "",
		memo: "",
	});
	const [resumeFile, setResumeFile] = useState<File | null>(null);
	const resumeInputRef = useRef<HTMLInputElement>(null);

	const uploadMutation = useMutation<FileResult.UploadDto, Error, File>({
		mutationFn: uploadResumeFile,
	});

	const createApplicationMutation = useMutation<
		CareerResult.CreateApplicationResultDto,
		Error,
		CareerInput.CreateApplicationDto
	>({
		mutationFn: createApplication,
		onSuccess: (result) => {
			onSuccess();
			onClose();
			setFormData({ name: "", email: "", phone: "", memo: "" });
			setResumeFile(null);
			alert(result.message || "지원서가 성공적으로 제출되었습니다.");
		},
		onError: () => {
			alert("지원서 제출에 실패했습니다. 잠시 후 다시 시도해 주세요.");
		},
	});

	const handleResumeChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;
		setResumeFile(file);
	};

	const handleChange = (field: keyof typeof formData) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setFormData((prev) => ({ ...prev, [field]: event.target.value }));
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const name = formData.name.trim();
		const email = formData.email.trim();
		const phone = formData.phone.trim();
		const memo = formData.memo.trim();

		if (!name) {
			alert("이름을 입력해 주세요.");
			return;
		}

		if (!email) {
			alert("이메일을 입력해 주세요.");
			return;
		}

		try {
			let uploadedFileName: string | undefined;
			if (resumeFile) {
				const result = await uploadMutation.mutateAsync(resumeFile);
				uploadedFileName = result.fileName;
			}

			const payload: CareerInput.CreateApplicationDto = {
				jobPostingId,
				name,
				email,
			};

			if (phone) payload.phone = phone;
			if (uploadedFileName) payload.resumeName = uploadedFileName;
			if (memo) payload.memo = memo;

			createApplicationMutation.mutate(payload);
		} catch (error) {
			console.error(error);
			alert("이력서 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.");
		}
	};

	if (!isOpen) return null;

	const isSubmitting = createApplicationMutation.isPending || uploadMutation.isPending;

	return (
		<div
			className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/40 px-4 py-8 backdrop-blur-sm"
			onClick={onClose}
		>
			<div
				className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-[0_30px_80px_rgba(15,23,42,0.2)] animate-pop"
				role="dialog"
				aria-modal="true"
				onClick={(event) => event.stopPropagation()}
			>
				<div className="flex items-start justify-between">
					<div>
						<p className="text-xs font-semibold text-slate-500">지원서 제출</p>
						<h2 className="mt-2 text-xl font-bold text-slate-900">{jobTitle}</h2>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="text-slate-400 transition hover:text-slate-600"
					>
						✕
					</button>
				</div>
				<form className="mt-6 space-y-4" onSubmit={handleSubmit}>
					<div>
						<label className="text-xs font-semibold text-slate-600">이름</label>
						<input
							type="text"
							value={formData.name}
							onChange={handleChange("name")}
							placeholder="홍길동"
							className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-600">이메일</label>
						<input
							type="email"
							value={formData.email}
							onChange={handleChange("email")}
							placeholder="applicant@example.com"
							className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-600">연락처</label>
						<input
							type="tel"
							value={formData.phone}
							onChange={handleChange("phone")}
							placeholder="+82-010-1234-5678"
							className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
						/>
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-600">이력서 첨부</label>
						<input
							ref={resumeInputRef}
							type="file"
							accept=".pdf"
							onChange={handleResumeChange}
							className="hidden"
						/>
						{resumeFile ? (
							<div className="mt-2 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
								<div className="min-w-0">
									<p className="truncate font-semibold">{resumeFile.name}</p>
									<p className="text-xs text-slate-400">
										{Math.max(resumeFile.size / 1024 / 1024, 0.01).toFixed(2)}MB
									</p>
								</div>
								<button
									type="button"
									onClick={() => setResumeFile(null)}
									className="text-xs font-semibold text-slate-500 transition hover:text-slate-700"
								>
									삭제
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => resumeInputRef.current?.click()}
								className="mt-2 flex w-full items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-500 transition hover:border-sky-400 hover:text-sky-500"
							>
								<span>PDF 파일 업로드 (최대 25MB)</span>
								<span className="text-xs">첨부하기</span>
							</button>
						)}
					</div>
					<div>
						<label className="text-xs font-semibold text-slate-600">메모</label>
						<textarea
							value={formData.memo}
							onChange={handleChange("memo")}
							placeholder="포트폴리오 링크 포함"
							className="mt-2 h-28 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
						/>
					</div>
					<button
						type="submit"
						disabled={isSubmitting}
						className="w-full rounded-xl bg-slate-900 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
					>
						{isSubmitting ? "제출 중..." : "지원서 제출하기"}
					</button>
				</form>
			</div>
		</div>
	);
}
