type PageMeta = {
	title: string;
	description: string;
	image?: string;
	url?: string;
	type?: string;
	siteName?: string;
	twitterCard?: string;
};

const DEFAULT_META: PageMeta = {
	title: "뽑기팡 – 전국 뽑기방 지도·리뷰·중고거래 플랫폼",
	description:
		"전국 뽑기방 정보를 지도 기반으로 한눈에 확인하세요. 뽑기팡은 실제 리뷰와 평가, 뽑기 상품 중고 거래까지 연결한 뽑기방 통합 플랫폼입니다.",
	image: "/og-image.png",
	type: "website",
	siteName: "뽑기팡",
	twitterCard: "summary_large_image",
};

const MAX_DESCRIPTION_LENGTH = 160;

const collapseWhitespace = (value: string) => value.replace(/\s+/g, " ").trim();

const toAbsoluteUrl = (value: string) => {
	if (/^https?:\/\//i.test(value)) return value;
	if (typeof window === "undefined") return value;
	const origin = window.location.origin;
	if (!origin) return value;
	return value.startsWith("/") ? `${origin}${value}` : `${origin}/${value}`;
};

const setMetaTag = (attribute: "name" | "property", key: string, content: string) => {
	const selector = `meta[${attribute}="${key}"]`;
	let element = document.head.querySelector<HTMLMetaElement>(selector);
	if (!element) {
		element = document.createElement("meta");
		element.setAttribute(attribute, key);
		document.head.appendChild(element);
	}
	element.setAttribute("content", content);
};

const removeMetaTag = (attribute: "name" | "property", key: string) => {
	const selector = `meta[${attribute}="${key}"]`;
	const element = document.head.querySelector<HTMLMetaElement>(selector);
	if (element) {
		element.remove();
	}
};

export const applyPageMeta = (meta: PageMeta) => {
	const next = { ...DEFAULT_META, ...meta };
	const description = next.description;
	const image = toAbsoluteUrl(next.image ?? DEFAULT_META.image ?? "/og-image.png");

	document.title = next.title;
	setMetaTag("name", "description", description);

	setMetaTag("property", "og:title", next.title);
	setMetaTag("property", "og:description", description);
	setMetaTag("property", "og:type", next.type ?? DEFAULT_META.type ?? "website");
	setMetaTag("property", "og:site_name", next.siteName ?? DEFAULT_META.siteName ?? "뽑기팡");
	setMetaTag("property", "og:image", image);

	if (next.url) {
		setMetaTag("property", "og:url", toAbsoluteUrl(next.url));
	} else {
		removeMetaTag("property", "og:url");
	}

	setMetaTag("property", "twitter:card", next.twitterCard ?? DEFAULT_META.twitterCard ?? "summary_large_image");
	setMetaTag("property", "twitter:title", next.title);
	setMetaTag("property", "twitter:description", description);
	setMetaTag("property", "twitter:image", image);
};

export const resetPageMeta = () => {
	applyPageMeta(DEFAULT_META);
};

export const getMetaDescription = (value: string | undefined, fallback: string) => {
	const normalized = collapseWhitespace(value ?? "");
	if (!normalized) return fallback;
	if (normalized.length <= MAX_DESCRIPTION_LENGTH) return normalized;
	return `${normalized.slice(0, MAX_DESCRIPTION_LENGTH - 3).trim()}...`;
};
