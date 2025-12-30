const BASE = 0;
const ABOVE = 1;

const HEADER = BASE + ABOVE; // 1 - 헤더
const MAP_OVERLAY = HEADER + ABOVE; // 2 - 지도 위 오버레이 (맵 컨트롤 포함)
const BOTTOM_NAVIGATION_BAR = MAP_OVERLAY + ABOVE; // 3 - 바텀 nav
const FLOATING_BUTTON = BOTTOM_NAVIGATION_BAR + ABOVE; // 4 - 전역 플로팅 버튼
const DROPDOWN_LIST = FLOATING_BUTTON + ABOVE; // 5 - 드롭다운 리스트
const MODAL_DIMMED_LAYER = DROPDOWN_LIST + ABOVE; // 6 - 일반 모달 backdrop
const MODAL_CONTAINER = MODAL_DIMMED_LAYER + ABOVE; // 7 - 일반 모달 본체
const FULLSCREEN_MODAL = MODAL_CONTAINER + ABOVE; // 8 - 풀스크린 모달
const TOAST = FULLSCREEN_MODAL + ABOVE; // 9 - 토스트 알림 (최상위)

export const ZINDEX = {
  header: HEADER,
  mapOverlay: MAP_OVERLAY,
  bottomNavigationBar: BOTTOM_NAVIGATION_BAR,
  floatingButton: FLOATING_BUTTON,
  dropdownList: DROPDOWN_LIST,
  modalDimmedLayer: MODAL_DIMMED_LAYER,
  modalContainer: MODAL_CONTAINER,
  fullscreenModal: FULLSCREEN_MODAL,
  toast: TOAST,
} as const;

type ZIndexKeys =
  | "header"
  | "mapOverlay"
  | "bottomNavigationBar"
  | "floatingButton"
  | "dropdownList"
  | "modalDimmedLayer"
  | "modalContainer"
  | "fullscreenModal"
  | "toast";

export type ZIndexTokens = Record<ZIndexKeys, number>;
