import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { useEffect } from "react";
import type { CareerResult } from "@ppopgipang/types";
import { getJobPostings } from "@/shared/api/careers";
import { applyPageMeta, resetPageMeta } from "@/shared/lib/page-meta";

const formatJobDate = (value?: string | Date) => {
	if (!value) return "";
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return "";
	return format(parsed, "yyyy.MM.dd");
};

const getJobMeta = (jobPosting: CareerResult.JobPostingDto) =>
	[jobPosting.department, jobPosting.positionType, jobPosting.location].filter(Boolean) as string[];

const getJobSummary = (jobPosting: CareerResult.JobPostingDto) => {
	const description = jobPosting.description?.trim();
	if (description) return description;
	return "상세 설명은 모집 공고에서 확인할 수 있어요.";
};

function AboutUsPage() {
	useEffect(() => {
		applyPageMeta({
			title: "뽑기팡팀 소개 | 뽑기팡",
			description: "뽑기팡 팀 소개와 서비스 방향, 그리고 현재 진행 중인 채용 공고를 확인해 보세요.",
			url: "/about-us",
		});

		return () => resetPageMeta();
	}, []);

	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	const teamMembers = [
		{
			name: "김원정",
			role: "백엔드 · 인공지능 · 개발 리드",
			lead: true,
			image: "/team/kim-wonjeong.png",
			highlights: [
				"현업 2년차 백엔드 개발",
				"백엔드 인공지능 프로젝트 리더",
				"인천대학교 컴퓨터공학부",
				"인천대학교 글로벌앱센터 센터장",
				"인천대학교 구름톤 유니브 리더",
			],
		},
		{
			name: "조하은",
			role: "프론트엔드",
			lead: false,
			image: "/team/jo-haeun.png",
			highlights: [
				"인천대학교 임베디드공학과",
				"인천대학교 글로벌앱센터",
				"예비창업패키지 프로젝트 참여",
				"다수의 사이드 프로젝트 경험",
			],
		},
		{
			name: "채영은",
			role: "PM 리드",
			lead: false,
			image: "/team/chae-yeongeun.png",
			highlights: [
				"현업 1년차 PM",
				"인천대학교 컴퓨터공학부",
				"실제 서비스 출시 및 운영 경험",
				"플랫폼·SNS 등 다양한 도메인 프로젝트 수행",
				"스타트업 곡물:원 초기 운영 팀원",
				"GDGoC INU 1기 기획 파트장",
			],
		},
	];

	const jobPostingPage = 1;
	const jobPostingSize = 6;

	const jobPostingsQuery = useQuery({
		queryKey: ["jobPostings", { isActive: true, page: jobPostingPage, size: jobPostingSize }],
		queryFn: () =>
			getJobPostings({
				isActive: true,
				page: jobPostingPage,
				size: jobPostingSize,
			}),
	});

	const jobPostings = jobPostingsQuery.data?.items ?? [];
	const totalJobPostings = jobPostingsQuery.data?.total ?? 0;

	return (
		<div className="min-h-screen w-full overflow-y-auto bg-slate-50 text-slate-900">
			<header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 backdrop-blur">
				<div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-10">
					<div className="flex items-center gap-3">
						<img
							src="/icons/ppopgipang-icon.png"
							alt="뽑기팡"
							className="h-9 w-9 rounded-xl object-contain"
						/>
						<span className="text-lg font-semibold text-slate-900">뽑기팡팀</span>
					</div>
					<nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
						<button
							onClick={() => scrollToSection("solution")}
							className="transition-colors hover:text-sky-600"
						>
							제품
						</button>
						<button
							onClick={() => scrollToSection("team")}
							className="transition-colors hover:text-sky-600"
						>
							팀
						</button>
						<button
							onClick={() => scrollToSection("team-members")}
							className="transition-colors hover:text-sky-600"
						>
							팀원
						</button>
						<button
							onClick={() => scrollToSection("careers")}
							className="transition-colors hover:text-sky-600"
						>
							모집
						</button>
					</nav>
					<button
						onClick={() => scrollToSection("careers")}
						className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
					>
						함께하기
					</button>
				</div>
			</header>

			<section className="relative w-full overflow-hidden bg-gradient-to-br from-sky-50 via-white to-indigo-100 py-20 md:py-28">
				<div
					className="pointer-events-none absolute -top-16 right-0 h-64 w-64 rounded-full bg-sky-200/60 blur-3xl"
					aria-hidden="true"
				/>
				<div
					className="pointer-events-none absolute -bottom-24 left-0 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl"
					aria-hidden="true"
				/>
				<div className="relative mx-auto max-w-6xl px-6 text-center lg:px-10">
					<h1 className="text-4xl font-bold text-slate-900 md:text-5xl lg:text-6xl">
						뽑기방은 많은데, 왜 정보는 없을까?
					</h1>
					<p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600 md:text-xl">
						뽑기팡은 '운의 경험'을 데이터로 남기기 위해 시작한 팀입니다.
					</p>
					<div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
						<button
							onClick={() => scrollToSection("solution")}
							className="rounded-xl bg-sky-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-sky-700"
						>
							뽑기팡이 하는 일 보기
						</button>
						<button
							onClick={() => scrollToSection("careers")}
							className="rounded-xl border border-slate-300 bg-white/80 px-8 py-3 text-base font-semibold text-slate-700 transition hover:border-slate-400"
						>
							함께하기
						</button>
					</div>
				</div>
			</section>

			<section className="w-full bg-white py-20">
				<div className="mx-auto max-w-6xl px-6 text-center lg:px-10">
					<h2 className="text-3xl font-bold text-slate-900 md:text-4xl">운을 데이터로, 소비를 수집으로.</h2>
					<p className="mx-auto mt-6 max-w-3xl text-lg text-slate-600">
						뽑기팡은 뽑기방 탐험 → 방문/득템 인증 → 도장/배지 수집을 한 번의 루프로 연결합니다.
					</p>
					<div className="mt-12 grid gap-6 md:grid-cols-3">
						<div className="rounded-2xl border border-slate-100 bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-md">
							<div className="text-3xl">🗺️</div>
							<h3 className="mt-4 text-xl font-semibold text-slate-900">탐험</h3>
							<p className="mt-2 text-slate-600">내 주변 뽑기방 발견</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-md">
							<div className="text-3xl">📸</div>
							<h3 className="mt-4 text-xl font-semibold text-slate-900">인증</h3>
							<p className="mt-2 text-slate-600">방문/득템 기록</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-8 text-left shadow-sm transition-shadow hover:shadow-md">
							<div className="text-3xl">📒</div>
							<h3 className="mt-4 text-xl font-semibold text-slate-900">수집</h3>
							<p className="mt-2 text-slate-600">여권/갤러리/배지</p>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full bg-slate-50 py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">우리가 푸는 문제</h2>
					<div className="mt-12 grid gap-8 md:grid-cols-2">
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<h3 className="text-2xl font-semibold text-slate-900">
								뽑기는 '정보'가 아니라 '소문'으로 굴러갑니다
							</h3>
							<ul className="mt-4 space-y-3 text-slate-600">
								<li>• 어디가 잘 나오는지, 언제가 좋은지: 대부분 개인 경험과 카톡방 후기뿐</li>
								<li>• 실패 기록은 남지 않고, 성공만 과장됩니다</li>
								<li>• 같은 돈을 써도 유저는 더 좋은 선택을 할 근거가 없습니다</li>
							</ul>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<h3 className="text-2xl font-semibold text-slate-900">기록은 쌓이지만, 자산이 되지 않습니다</h3>
							<ul className="mt-4 space-y-3 text-slate-600">
								<li>• 득템샷은 남는데 "내가 뭘 얼마나 했는지"는 정리되지 않음</li>
								<li>• 반복 방문을 만드는 보상이 약함</li>
								<li>• 득템 아이템의 가치/희소성은 확인하기 어렵고 거래는 불안합니다</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 text-center text-lg font-semibold text-slate-800 shadow-sm">
						"성공만 남고 실패는 사라진다"
					</div>
				</div>
			</section>

			<section id="solution" className="w-full bg-white py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">뽑기팡이 만든 구조</h2>
					<p className="mt-4 text-center text-lg text-slate-600">
						뽑기팡은 '탐험-인증-수집'으로 리텐션을 만듭니다
					</p>
					<div className="mt-12 grid gap-8 md:grid-cols-3">
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<div className="text-3xl">🗺️</div>
							<h3 className="mt-4 text-2xl font-semibold text-slate-900">탐험 (Explore)</h3>
							<p className="mt-3 text-slate-600">
								내 주변 뽑기방을 발견하고, 안 가본 곳은 회색으로 남습니다. 가봤던 곳은 방문/정복 상태가 기록됩니다.
							</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<div className="text-3xl">📸</div>
							<h3 className="mt-4 text-2xl font-semibold text-slate-900">인증 (Certify)</h3>
							<p className="mt-3 text-slate-600">
								방문/득템을 빠르게 기록합니다. 성공도, 실패도 데이터가 됩니다.
							</p>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<div className="text-3xl">📒</div>
							<h3 className="mt-4 text-2xl font-semibold text-slate-900">수집 (Collection)</h3>
							<p className="mt-3 text-slate-600">
								방문은 여권이 되고, 득템은 갤러리가 됩니다. 배지/업적으로 '계속 하고 싶게' 만듭니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full bg-slate-50 py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">우리가 만든 것</h2>
					<p className="mt-4 text-center text-lg text-slate-600">
						기획만 있는 팀이 아니라, 지금 돌아가는 제품을 만든 팀입니다.
					</p>
					<div className="mt-12 rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
						<ul className="space-y-4 text-lg text-slate-700">
							<li className="flex items-center gap-3">
								<span className="text-sky-500">✓</span>
								<span>지도 기반 뽑기방 탐색</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="text-sky-500">✓</span>
								<span>방문/득템 인증 플로우</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="text-sky-500">✓</span>
								<span>도장/레벨/배지(업적) 수집 구조</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="text-sky-500">✓</span>
								<span>가게 제보 → 관리자 승인 흐름</span>
							</li>
							<li className="flex items-center gap-3">
								<span className="text-sky-500">✓</span>
								<span>마이룸에서 내 활동/기록 확인</span>
							</li>
						</ul>
						<div className="mt-8 border-t border-slate-200 pt-6">
							<p className="text-sm font-semibold text-slate-600">Proof</p>
							<div className="mt-4 flex flex-wrap gap-3">
								<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
									Dev 인프라 운영중
								</span>
								<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
									App/DB 분리
								</span>
								<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm text-slate-600">
									Monorepo 운영
								</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="team" className="w-full bg-slate-50 py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">우리는 이런 팀</h2>
					<p className="mt-4 text-center text-lg text-slate-600">
						우리는 역할보다 문제 해결을 우선합니다. 작지만 빠르고, 만들면서 배웁니다.
					</p>
					<div className="mt-12 rounded-3xl border border-slate-100 bg-white p-10 shadow-sm">
						<h3 className="text-xl font-semibold text-slate-900">우리가 중요하게 생각하는 것</h3>
						<div className="mt-6 grid gap-4 md:grid-cols-2">
							<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
								과장하지 않기
							</span>
							<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
								데이터를 남기는 실행
							</span>
							<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
								사용자 루프를 끝까지 완성하기
							</span>
							<span className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
								피드백을 빨리 반영하기
							</span>
						</div>
					</div>
				</div>
			</section>

			<section className="w-full bg-white py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<h2 className="text-center text-3xl font-bold text-slate-900 md:text-4xl">우리가 실행하는 방식</h2>
					<div className="mt-12 grid gap-8 md:grid-cols-2">
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<h3 className="text-2xl font-semibold text-slate-900">빠르게 만들고, 바로 검증합니다</h3>
							<ul className="mt-4 space-y-3 text-slate-600">
								<li>• 가설을 세우고</li>
								<li>• 최소 기능으로 만들고</li>
								<li>• 실제 사용 흐름으로 검증합니다</li>
							</ul>
						</div>
						<div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
							<h3 className="text-2xl font-semibold text-slate-900">현실적인 스택으로, 확장 가능한 구조로</h3>
							<div className="mt-4 space-y-3 text-sm text-slate-600">
								<div className="flex items-center gap-3">
									<span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-semibold text-slate-700">
										React (Vite)
									</span>
									<span>Frontend</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-semibold text-slate-700">
										NestJS
									</span>
									<span>Backend</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-semibold text-slate-700">
										MySQL
									</span>
									<span>DB</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-semibold text-slate-700">
										GCP Compute Engine
									</span>
									<span>Infra</span>
								</div>
								<div className="flex items-center gap-3">
									<span className="rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-semibold text-slate-700">
										Turborepo
									</span>
									<span>Monorepo</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			<section id="team-members" className="w-full bg-white py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-slate-900 md:text-4xl">팀원 소개</h2>
						<p className="mt-4 text-lg text-slate-600">
							각자의 전문성으로 뽑기팡의 루프를 완성합니다.
						</p>
					</div>
					<div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
						{teamMembers.map((member) => (
							<div
								key={member.name}
								className={`group relative rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)] ${member.lead ? "ring-1 ring-sky-200" : ""}`}
							>
								<div className="flex items-center gap-4">
									<div className="h-20 w-20 overflow-hidden rounded-2xl bg-slate-100">
										<img
											src={member.image}
											alt={member.name}
											className="h-full w-full object-cover"
											loading="lazy"
										/>
									</div>
									<div>
										<div className="flex flex-wrap items-center gap-2">
											<h3 className="text-lg font-semibold text-slate-900">{member.name}</h3>
											{member.lead && (
												<span className="rounded-full bg-sky-600 px-2.5 py-0.5 text-xs font-semibold text-white">
													리더
												</span>
											)}
										</div>
										<p className="mt-1 text-sm font-semibold text-sky-600">{member.role}</p>
									</div>
								</div>
								<ul className="mt-5 space-y-2 text-sm text-slate-600">
									{member.highlights.map((item) => (
										<li key={item} className="flex items-start gap-2">
											<span className="mt-2 h-1.5 w-1.5 rounded-full bg-sky-500" aria-hidden="true" />
											<span>{item}</span>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
			</section>

			<section id="careers" className="w-full bg-white py-20">
				<div className="mx-auto max-w-6xl px-6 lg:px-10">
					<div className="text-center">
						<h2 className="text-3xl font-bold text-slate-900 md:text-4xl">모집 공고</h2>
						<p className="mt-4 text-lg text-slate-600">
							뽑기팡과 함께 서비스의 루프를 완성할 동료를 찾고 있습니다.
						</p>
					</div>
					<div className="mt-12 grid gap-6 md:grid-cols-2">
						{jobPostingsQuery.isLoading
							? Array.from({ length: 4 }).map((_, index) => (
									<div
										key={`job-skeleton-${index}`}
										className="rounded-3xl border border-slate-100 bg-white p-7 shadow-sm"
									>
										<div className="flex items-center justify-between">
											<div className="h-5 w-16 rounded-full bg-slate-100" />
											<div className="h-4 w-20 rounded bg-slate-100" />
										</div>
										<div className="mt-5 h-5 w-3/4 rounded bg-slate-100" />
										<div className="mt-3 h-4 w-full rounded bg-slate-100" />
										<div className="mt-2 h-4 w-5/6 rounded bg-slate-100" />
										<div className="mt-4 flex gap-2">
											<div className="h-6 w-16 rounded-full bg-slate-100" />
											<div className="h-6 w-20 rounded-full bg-slate-100" />
										</div>
									</div>
							  ))
							: jobPostingsQuery.isError
								? (
										<div className="rounded-3xl border border-rose-100 bg-rose-50 p-6 text-sm text-rose-600 md:col-span-2">
											모집 공고를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.
										</div>
								  )
								: jobPostings.length === 0
									? (
											<div className="rounded-3xl border border-slate-100 bg-slate-50 p-6 text-sm text-slate-600 md:col-span-2">
												현재 오픈된 모집 공고가 없습니다.
											</div>
									  )
									: jobPostings.map((jobPosting: any) => {
											const tags = getJobMeta(jobPosting);
											const dateLabel = formatJobDate(jobPosting.createdAt);
											const statusLabel = jobPosting.isActive ? "모집중" : "마감";
											const statusClass = jobPosting.isActive
												? "border-emerald-200 bg-emerald-50 text-emerald-600"
												: "border-slate-200 bg-slate-100 text-slate-500";
											const summary = getJobSummary(jobPosting);

											return (
												<Link
													key={jobPosting.id}
													to="/careers/$jobPostingId"
													params={{ jobPostingId: jobPosting.id.toString() }}
													className="group rounded-3xl border border-slate-100 bg-white p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]"
												>
													<div className="flex items-center justify-between text-xs">
														<span className={`rounded-full border px-2.5 py-1 font-semibold ${statusClass}`}>
															{statusLabel}
														</span>
														{dateLabel && <span className="text-slate-400">{dateLabel}</span>}
													</div>
													<h3 className="mt-4 text-xl font-semibold text-slate-900 transition-colors group-hover:text-sky-600">
														{jobPosting.title}
													</h3>
													<p className="mt-3 text-sm text-slate-600">{summary}</p>
													{tags.length > 0 && (
														<div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600">
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
													<div className="mt-5 flex items-center justify-between text-xs text-slate-500">
														<span>
															{typeof jobPosting.applicationCount === "number"
																? `지원 ${jobPosting.applicationCount}명`
																: "지원 현황 집계 중"}
														</span>
														<span className="font-semibold text-sky-600">자세히 보기 →</span>
													</div>
												</Link>
											);
									  })}
					</div>
					{jobPostings.length > 0 && totalJobPostings > jobPostings.length && (
						<p className="mt-6 text-center text-sm text-slate-500">
							총 {totalJobPostings}개의 모집 공고 중 일부만 표시하고 있어요.
						</p>
					)}
					<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
						<a
							href="mailto:admin@ppopgi.me"
							className="rounded-xl bg-sky-600 px-8 py-3 text-base font-semibold text-white transition hover:bg-sky-700"
						>
							합류 문의하기
						</a>
					</div>
				</div>
			</section>

			<footer className="bg-slate-900 py-12 text-white">
				<div className="mx-auto max-w-6xl px-6 text-center lg:px-10">
					<p className="text-sm text-slate-300">© 2025 뽑기팡팀. All rights reserved.</p>
				</div>
			</footer>
		</div>
	);
}

export const Route = createFileRoute("/about-us")({
	component: AboutUsPage,
});
