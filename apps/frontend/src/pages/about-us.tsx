import { createFileRoute } from "@tanstack/react-router";

function AboutUsPage() {
	const scrollToSection = (id: string) => {
		const element = document.getElementById(id);
		if (element) {
			element.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="min-h-screen w-full overflow-y-auto">
			{/* Header */}
			<header className="sticky top-0 z-50 w-full glass-panel-strong">
				<div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
					<div className="text-xl font-bold bg-gradient-to-r from-sky-500 to-sky-700 bg-clip-text text-transparent">
						PpopgiPang
					</div>
					<nav className="hidden md:flex items-center gap-8">
						<button
							onClick={() => scrollToSection("solution")}
							className="text-sm text-sky-700 hover:text-sky-500 transition-colors"
						>
							제품
						</button>
						<button
							onClick={() => scrollToSection("team")}
							className="text-sm text-sky-700 hover:text-sky-500 transition-colors"
						>
							팀
						</button>
						<button
							onClick={() => scrollToSection("roadmap")}
							className="text-sm text-sky-700 hover:text-sky-500 transition-colors"
						>
							로드맵
						</button>
						<button
							onClick={() => scrollToSection("join-us")}
							className="text-sm text-sky-700 hover:text-sky-500 transition-colors"
						>
							합류
						</button>
					</nav>
					<button
						onClick={() => scrollToSection("join-us")}
						className="liquid-button px-6 py-2 text-sm font-semibold"
					>
						함께하기
					</button>
				</div>
			</header>

			{/* Section 1: Hero */}
			<section className="w-full py-20 md:py-32 px-6">
				<div className="max-w-5xl mx-auto text-center">
					<h1 className="text-4xl md:text-6xl font-bold text-sky-900 mb-6 animate-fade-up">
						뽑기방은 많은데, 왜 정보는 없을까?
					</h1>
					<p className="text-lg md:text-xl text-sky-700 mb-10 animate-fade-up" style={{ animationDelay: "0.1s" }}>
						뽑기팡은 '운의 경험'을 데이터로 남기기 위해 시작한 팀입니다.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.2s" }}>
						<button
							onClick={() => scrollToSection("solution")}
							className="liquid-button px-8 py-4 text-base font-semibold"
						>
							뽑기팡이 하는 일 보기
						</button>
						<button
							onClick={() => scrollToSection("join-us")}
							className="liquid-outline px-8 py-4 text-base font-semibold"
						>
							함께하기
						</button>
					</div>
				</div>
			</section>

			{/* Section 2: Mission */}
			<section className="w-full py-20 px-6 bg-gradient-to-b from-sky-50/50 to-white">
				<div className="max-w-5xl mx-auto text-center">
					<h2 className="text-3xl md:text-5xl font-bold text-sky-900 mb-6">
						운을 데이터로, 소비를 수집으로.
					</h2>
					<p className="text-lg md:text-xl text-sky-700 max-w-3xl mx-auto">
						뽑기팡은 뽑기방 탐험 → 방문/득템 인증 → 도장/배지 수집을 한 번의 루프로 연결합니다.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
						<div className="glass-panel p-8 rounded-3xl animate-pop" style={{ animationDelay: "0s" }}>
							<div className="text-4xl mb-4">🗺️</div>
							<h3 className="text-xl font-bold text-sky-900 mb-2">탐험</h3>
							<p className="text-sky-700">내 주변 뽑기방 발견</p>
						</div>
						<div className="glass-panel p-8 rounded-3xl animate-pop" style={{ animationDelay: "0.1s" }}>
							<div className="text-4xl mb-4">📸</div>
							<h3 className="text-xl font-bold text-sky-900 mb-2">인증</h3>
							<p className="text-sky-700">방문/득템 기록</p>
						</div>
						<div className="glass-panel p-8 rounded-3xl animate-pop" style={{ animationDelay: "0.2s" }}>
							<div className="text-4xl mb-4">📒</div>
							<h3 className="text-xl font-bold text-sky-900 mb-2">수집</h3>
							<p className="text-sky-700">여권/갤러리/배지</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section 3: Problem */}
			<section className="w-full py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-12 text-center">우리가 푸는 문제</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-4">
								뽑기는 '정보'가 아니라 '소문'으로 굴러갑니다
							</h3>
							<ul className="space-y-3 text-sky-700">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>어디가 잘 나오는지, 언제가 좋은지: 대부분 개인 경험과 카톡방 후기뿐</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>실패 기록은 남지 않고, 성공만 과장됩니다</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>같은 돈을 써도 유저는 더 좋은 선택을 할 근거가 없습니다</span>
								</li>
							</ul>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-4">기록은 쌓이지만, 자산이 되지 않습니다</h3>
							<ul className="space-y-3 text-sky-700">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>득템샷은 남는데 "내가 뭘 얼마나 했는지"는 정리되지 않음</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>반복 방문을 만드는 보상이 약함</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>득템 아이템의 가치/희소성은 확인하기 어렵고 거래는 불안합니다</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="mt-8 glass-panel-strong p-6 rounded-2xl text-center">
						<p className="text-xl font-semibold text-sky-900">"성공만 남고 실패는 사라진다"</p>
					</div>
				</div>
			</section>

			{/* Section 4: Solution (Core Loop) */}
			<section id="solution" className="w-full py-20 px-6 bg-gradient-to-b from-white to-sky-50/50">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6 text-center">뽑기팡이 만든 구조</h2>
					<p className="text-lg text-sky-700 text-center mb-12">
						뽑기팡은 '탐험-인증-수집'으로 리텐션을 만듭니다
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
						<div className="glass-panel p-8 rounded-3xl">
							<div className="text-4xl mb-4">🗺️</div>
							<h3 className="text-2xl font-bold text-sky-900 mb-3">탐험 (Explore)</h3>
							<p className="text-sky-700 leading-relaxed">
								내 주변 뽑기방을 발견하고, 안 가본 곳은 회색으로 남습니다. 가봤던 곳은 방문/정복 상태가 기록됩니다.
							</p>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<div className="text-4xl mb-4">📸</div>
							<h3 className="text-2xl font-bold text-sky-900 mb-3">인증 (Certify)</h3>
							<p className="text-sky-700 leading-relaxed">
								방문/득템을 빠르게 기록합니다. 성공도, 실패도 데이터가 됩니다.
							</p>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<div className="text-4xl mb-4">📒</div>
							<h3 className="text-2xl font-bold text-sky-900 mb-3">수집 (Collection)</h3>
							<p className="text-sky-700 leading-relaxed">
								방문은 여권이 되고, 득템은 갤러리가 됩니다. 배지/업적으로 '계속 하고 싶게' 만듭니다.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section 5: What We Built */}
			<section className="w-full py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6 text-center">우리가 만든 것</h2>
					<p className="text-lg text-sky-700 text-center mb-12">
						기획만 있는 팀이 아니라, 지금 돌아가는 제품을 만든 팀입니다.
					</p>
					<div className="glass-panel p-10 rounded-3xl">
						<ul className="space-y-4 text-lg">
							<li className="flex items-center text-sky-700">
								<span className="mr-3 text-sky-500">✓</span>
								<span>지도 기반 뽑기방 탐색</span>
							</li>
							<li className="flex items-center text-sky-700">
								<span className="mr-3 text-sky-500">✓</span>
								<span>방문/득템 인증 플로우</span>
							</li>
							<li className="flex items-center text-sky-700">
								<span className="mr-3 text-sky-500">✓</span>
								<span>도장/레벨/배지(업적) 수집 구조</span>
							</li>
							<li className="flex items-center text-sky-700">
								<span className="mr-3 text-sky-500">✓</span>
								<span>가게 제보 → 관리자 승인 흐름</span>
							</li>
							<li className="flex items-center text-sky-700">
								<span className="mr-3 text-sky-500">✓</span>
								<span>마이룸에서 내 활동/기록 확인</span>
							</li>
						</ul>
						<div className="mt-8 pt-8 border-t border-sky-200">
							<p className="text-sm text-sky-600 mb-2">Proof</p>
							<div className="flex flex-wrap gap-3">
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">Dev 인프라 운영중</span>
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">App/DB 분리</span>
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">Monorepo 운영</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 6: Execution / Tech */}
			<section className="w-full py-20 px-6 bg-gradient-to-b from-sky-50/50 to-white">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-12 text-center">우리가 실행하는 방식</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-6">빠르게 만들고, 바로 검증합니다</h3>
							<ul className="space-y-3 text-sky-700">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>가설을 세우고</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>최소 기능으로 만들고</span>
								</li>
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>실제 사용 흐름으로 검증합니다</span>
								</li>
							</ul>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-6">현실적인 스택으로, 확장 가능한 구조로</h3>
							<div className="space-y-3">
								<div className="flex items-center gap-2">
									<span className="liquid-chip px-3 py-1 text-sm font-medium text-sky-700">React (Vite)</span>
									<span className="text-sky-600 text-sm">Frontend</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="liquid-chip px-3 py-1 text-sm font-medium text-sky-700">NestJS</span>
									<span className="text-sky-600 text-sm">Backend</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="liquid-chip px-3 py-1 text-sm font-medium text-sky-700">MySQL</span>
									<span className="text-sky-600 text-sm">DB</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="liquid-chip px-3 py-1 text-sm font-medium text-sky-700">GCP Compute Engine</span>
									<span className="text-sky-600 text-sm">Infra</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="liquid-chip px-3 py-1 text-sm font-medium text-sky-700">Turborepo</span>
									<span className="text-sky-600 text-sm">Monorepo</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 7: Team */}
			<section id="team" className="w-full py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6 text-center">우리는 이런 팀</h2>
					<p className="text-lg text-sky-700 text-center mb-12">
						우리는 역할보다 문제 해결을 우선합니다. 작지만 빠르고, 만들면서 배웁니다.
					</p>
					<div className="glass-panel p-10 rounded-3xl">
						<h3 className="text-xl font-bold text-sky-900 mb-6">우리가 중요하게 생각하는 것</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="flex items-center gap-3">
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">과장하지 않기</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">데이터를 남기는 실행</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">사용자 루프를 끝까지 완성하기</span>
							</div>
							<div className="flex items-center gap-3">
								<span className="liquid-chip px-4 py-2 text-sm text-sky-700">피드백을 빨리 반영하기</span>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 8: Roadmap */}
			<section id="roadmap" className="w-full py-20 px-6 bg-gradient-to-b from-white to-sky-50/50">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6 text-center">다음 단계</h2>
					<p className="text-lg text-sky-700 text-center mb-12">
						지금은 '루프를 굴리는 MVP'에 집중합니다. 데이터가 쌓이면 AI는 그다음입니다.
					</p>
					<div className="space-y-6">
						<div className="glass-panel p-8 rounded-3xl">
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center text-white font-bold text-sm">
									Now
								</div>
								<div>
									<h3 className="text-xl font-bold text-sky-900 mb-2">단기: MVP 루프 고도화</h3>
									<p className="text-sky-700">인증/방문 데이터 축적, 리텐션 지표 확보</p>
								</div>
							</div>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-sky-300 to-sky-500 flex items-center justify-center text-white font-bold text-sm">
									Next
								</div>
								<div>
									<h3 className="text-xl font-bold text-sky-900 mb-2">중기: 데이터 기반 추천</h3>
									<p className="text-sky-700">득템 신호등(추천), 타임슬롯 기반 힌트</p>
								</div>
							</div>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0 w-20 h-20 rounded-full bg-gradient-to-br from-sky-200 to-sky-400 flex items-center justify-center text-white font-bold text-sm">
									Later
								</div>
								<div>
									<h3 className="text-xl font-bold text-sky-900 mb-2">장기: 자산화 & 거래</h3>
									<p className="text-sky-700">득템 자산화, 시세 추정, 안전 거래 강화</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 9: Join Us */}
			<section id="join-us" className="w-full py-20 px-6">
				<div className="max-w-5xl mx-auto">
					<h2 className="text-3xl md:text-4xl font-bold text-sky-900 mb-6 text-center">함께할 사람</h2>
					<p className="text-lg text-sky-700 text-center mb-12">
						뽑기팡은 "멋진 말"보다 "돌아가는 결과"를 좋아하는 사람을 찾습니다.
					</p>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-4">PM</h3>
							<ul className="space-y-2 text-sky-700">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>가설-실험-지표로 움직이는 사람</span>
								</li>
							</ul>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-4">Design</h3>
							<ul className="space-y-2 text-sky-700">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>수집욕/성취욕을 UI로 구현하는 사람</span>
								</li>
							</ul>
						</div>
						<div className="glass-panel p-8 rounded-3xl">
							<h3 className="text-2xl font-bold text-sky-900 mb-4">Dev</h3>
							<ul className="space-y-2 text-sky-700">
								<li className="flex items-start">
									<span className="mr-2">•</span>
									<span>빠른 실험을 안정적으로 굴리는 사람</span>
								</li>
							</ul>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<button className="liquid-button px-8 py-4 text-base font-semibold">합류 문의하기</button>
						<button className="liquid-outline px-8 py-4 text-base font-semibold">커피챗 요청하기</button>
					</div>
				</div>
			</section>

			{/* Footer */}
			<footer className="w-full py-12 px-6 bg-sky-50/50 border-t border-sky-100">
				<div className="max-w-5xl mx-auto text-center">
					<p className="text-sm text-sky-600 mb-4">© 2025 PpopgiPang. All rights reserved.</p>
					<div className="flex justify-center gap-6 text-sm text-sky-600">
						<a href="#" className="hover:text-sky-500 transition-colors">
							Notion
						</a>
						<a href="#" className="hover:text-sky-500 transition-colors">
							GitHub
						</a>
						<a href="#" className="hover:text-sky-500 transition-colors">
							Contact
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
}

export const Route = createFileRoute("/about-us")({
	component: AboutUsPage,
});
