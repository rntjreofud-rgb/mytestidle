// js/main.js

import { gameData, getActiveStages } from './core/data.js';
import * as UI from './ui/ui_manager.js';
import * as Logic from './core/logic.js';
import * as Storage from './core/save.js';

// 디버깅용 전역 변수 노출
window.gameData = gameData;
window.Logic = Logic; // 로직 테스트용

// 1. 유산 보너스 적용 함수
function applyLegacyStartBonuses() {
    const legacy = gameData.legacyUpgrades || []; 
    const p = gameData.currentPlanet;

    if (legacy.includes('start_resource') && p === 'earth') { 
        gameData.resources.wood = 500; 
        gameData.resources.stone = 500; 
        gameData.resources.plank = 100; 
    }
    if (legacy.includes('legacy_spore_start') && p === 'veridian') {
        gameData.resources.spore = 200;
    }
    if (legacy.includes('aurelia_start_metal') && p === 'aurelia') {
        gameData.resources.scrapMetal = 300;
    }
    console.log("시작 자원 유산 적용 완료");
}

// 2. 행성 착륙 함수
window.landOnPlanet = function(planetKey) {
    const planetName = { earth: '지구', aurelia: '아우렐리아', veridian: '베리디안' }[planetKey];
    UI.triggerWarpEffect(planetName, () => {
        const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
        gameData.cosmicData = (gameData.cosmicData || 0) + gain;
        if (gameData.houseLevel >= 50) gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;
        
        // 리셋 로직
        gameData.currentPlanet = planetKey; 
        gameData.houseLevel = 0; 
        gameData.researches = [];
        for (let k in gameData.resources) gameData.resources[k] = 0;
        gameData.buildings = []; 
        
        const planetInitRes = { earth: ['wood', 'stone', 'plank'], aurelia: ['scrapMetal'], veridian: ['bioFiber'] };
        gameData.unlockedResources = [...(planetInitRes[planetKey] || ['wood'])];

        applyLegacyStartBonuses(); 
        Storage.saveGame(); 
        location.reload(); 
    });
};

// 3. 환생 함수
window.performPrestige = function() {
    UI.triggerWarpEffect("지구", () => {
        const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
        gameData.cosmicData = (gameData.cosmicData || 0) + gain;
        gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;
        
        gameData.currentPlanet = 'earth'; 
        gameData.houseLevel = 0; 
        gameData.researches = [];
        for (let k in gameData.resources) gameData.resources[k] = 0;
        gameData.buildings = []; 
        gameData.unlockedResources = ['wood', 'stone', 'plank'];
        
        applyLegacyStartBonuses(); 
        Storage.saveGame(); 
        location.reload();
    });
};

// 4. 전력 제어 (전역)
window.adjustActiveCount = (id, delta) => {
    const b = gameData.buildings.find(build => build.id === id);
    if (b) { 
        b.activeCount = Math.max(0, Math.min(b.count, b.activeCount + delta)); 
        UI.updateScreen(Logic.calculateNetMPS()); 
    }
};

// 5. 초기화 함수
function init() {
    // 저장된 게임 로드
    const offlineSeconds = Storage.loadGame(); 
    
    // 이벤트 연결
    setupEvents();
    
    // ⭐ [중요] 초기 화면 렌더링 (이게 없어서 건물이 안 보였던 것임)
    const initialStats = Logic.calculateNetMPS();
    UI.updateScreen(initialStats);
    UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); // 콜백 함수 전달
    UI.updateHouseUI(handleHouseUpgrade);

    // 오프라인 보상
    if (offlineSeconds > 10) { 
        const cappedSeconds = Math.min(offlineSeconds, 43200);
        Logic.produceResources(cappedSeconds); 
        UI.showOfflineReport(cappedSeconds, initialStats);
        UI.log(`💤 ${Math.floor(cappedSeconds/60)}분 동안의 오프라인 자원이 생산되었습니다.`, true); 
    } else {
        UI.log("시스템 가동. Escape Earth 시작.", true);
    }

    // 게임 루프 시작
    requestAnimationFrame(gameLoop);
    setInterval(() => Storage.saveGame(), 10000);
}

// 6. 이벤트 설정
function setupEvents() {
    UI.uiElements.navDashboard.onclick = () => UI.switchTab('dashboard');
    UI.uiElements.navPower.onclick = () => UI.switchTab('power');
    UI.uiElements.navResearch.onclick = () => UI.switchTab('research');
    UI.uiElements.navTechTree.onclick = () => UI.switchTab('tech-tree');
    UI.uiElements.navLegacy.onclick = () => UI.switchTab('legacy');

    // 자원 채집 버튼들
    if(UI.uiElements.btns.wood) UI.uiElements.btns.wood.onclick = () => handleGather('wood');
    if(UI.uiElements.btns.stone) UI.uiElements.btns.stone.onclick = () => handleGather('stone');
    if(UI.uiElements.btns.coal) UI.uiElements.btns.coal.onclick = () => handleGather('coal');
    if(UI.uiElements.btns.ironOre) UI.uiElements.btns.ironOre.onclick = () => handleGather('ironOre');
    if(UI.uiElements.btns.copperOre) UI.uiElements.btns.copperOre.onclick = () => handleGather('copperOre');
    if(UI.uiElements.btns.plank) UI.uiElements.btns.plank.onclick = () => handleGather('plank');

    // 파일 관리
    document.getElementById('btn-export').onclick = () => { Storage.exportToFile(); UI.log("파일 저장 완료"); };
    document.getElementById('btn-import').onclick = () => document.getElementById('import-file').click();
    document.getElementById('import-file').onchange = (e) => Storage.importFromFile(e.target.files[0]).then(() => location.reload());
    
    // 별이 되기 버튼 (외계 행성용)
    const starBtn = document.getElementById('btn-become-star');
    if (starBtn) {
        starBtn.onclick = () => {
            if(confirm("정말 우주의 별이 되어 지구로 귀환하시겠습니까? (데이터 획득)")) {
                window.performPrestige(); // 단순화: performPrestige 호출
            }
        }
    }
}

// 7. 핸들러 함수들
function handleGather(type) { 
    if (Logic.manualGather(type)) {
        UI.updateScreen(Logic.calculateNetMPS());
        // 나무 10개 모이면 상점 갱신 (돌 해금 등 확인)
        if (type === 'wood' && gameData.resources.wood >= 10 && gameData.resources.wood <= 12) {
             UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
        }
    } else {
        UI.log("채집 불가: 도구가 없거나 조건 부족");
    }
}

// ⭐ [중요] 건물 구매 핸들러
function handleBuyBuilding(index) {
    const result = Logic.tryBuyBuilding(index); 
    if (result.success) {
        UI.log(`[건설] ${gameData.buildings[index].name} 건설 완료.`);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); 
    } else {
        const missingNames = result.missing.map(key => UI.getResNameOnly(key)).join(', ');
        UI.log(`🏗️ 건설 불가 (부족: ${missingNames})`, false);
    }
}

// ⭐ [중요] 하우스 업그레이드 핸들러
function handleHouseUpgrade(nextStage) {
    const result = Logic.tryUpgradeHouse(nextStage);
    if (result.success) {
        const stages = getActiveStages();
        if (gameData.houseLevel >= stages.length - 1) {
            UI.log(`🚀 [미션 완료] ${nextStage.name}!`, true);
        } else {
            UI.log(`🎉 [발전] ${nextStage.name} 업그레이드 완료`, true);
        }
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
        UI.updateHouseUI(handleHouseUpgrade);
    } else {
        const missingNames = result.missing.map(key => UI.getResNameOnly(key)).join(', ');
        UI.log(`⬆️ 업그레이드 불가 (부족: ${missingNames})`, false);
    }
}

// 8. 게임 루프
let lastTime = performance.now();
function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    Logic.produceResources(deltaTime);

    const netMPS = Logic.calculateNetMPS();
    UI.updateScreen(netMPS);
    UI.updateShopButtons(Logic.getBuildingCost);
    
    // 반복 호출에서 무명 함수를 계속 만들지 않도록 핸들러 전달
    // (UI.updateHouseUI는 변화가 있을 때만 DOM을 건드리는 게 좋지만, 현재 구조상 매 프레임 호출하므로 가볍게 유지)
    // 여기서는 UI 깜빡임 방지를 위해 로직 상태가 변했을 때만 호출하는 게 좋으나, 일단 유지합니다.
    
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", init);