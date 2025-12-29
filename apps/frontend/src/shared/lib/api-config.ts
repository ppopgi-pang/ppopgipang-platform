const DEFAULT_API_ORIGIN = import.meta.env.PROD ? "https://ppopgi.me" : "http://localhost:3000";
const rawApiOrigin = import.meta.env.VITE_API_ORIGIN || DEFAULT_API_ORIGIN;
const normalizedOrigin = rawApiOrigin.replace(/\/$/, "");

export const API_ORIGIN = normalizedOrigin;
export const API_BASE_URL = `${API_ORIGIN}/api`;
export const API_V1_BASE_URL = `${API_BASE_URL}/v1`;

export const CAREER_IMAGE_BASE_URL = `${API_ORIGIN}/public/career/`;
export const TEMP_IMAGE_BASE_URL = `${API_ORIGIN}/public/temp/`;
export const TRADE_IMAGE_BASE_URL = `${API_ORIGIN}/public/trade/`;
export const REVIEW_IMAGE_BASE_URL = `${API_ORIGIN}/public/review/`;
