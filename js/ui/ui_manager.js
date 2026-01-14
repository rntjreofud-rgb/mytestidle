import { elements } from './ui_constants.js';
import * as Renderers from './ui_renderers.js';
import * as Utils from './ui_utils.js';

// DOM 요소 노출
export const uiElements = elements;

// 유틸리티 함수 연결
export const formatNumber = Utils.formatNumber;
export const getResNameOnly = Utils.getResNameOnly;
export const log = Utils.log;

// 렌더링 함수 연결
export const updateScreen = Renderers.updateScreen;
export const updatePowerUI = Renderers.updatePowerUI;
export const renderShop = Renderers.renderShop;
export const updateHouseUI = Renderers.updateHouseUI;
export const renderResearchTab = Renderers.renderResearchTab;
export const renderTechTree = Renderers.renderTechTree;
export const renderLegacyTab = Renderers.renderLegacyTab;
export const showPlanetSelection = Renderers.showPlanetSelection;
export const triggerWarpEffect = Renderers.triggerWarpEffect;
export const checkUnlocks = Renderers.checkUnlocks;
export const updateShopButtons = Renderers.updateShopButtons;

// ⭐ [누락 수정] 오프라인 보상 팝업 연결
export const showOfflineReport = Renderers.showOfflineReport;

// ⭐ [누락 수정] 환생 UI 업데이트 연결
export const updatePrestigeUI = Renderers.updatePrestigeUI;

// 탭 전환 함수 연결
export function switchTab(tabName) {
    Renderers.switchTab(tabName);
}