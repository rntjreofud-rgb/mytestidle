// js/main.js 덮어쓰기

import { gameData, houseStages } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';
import * as Storage from './save.js';

function init() {
    Storage.loadGame();
    setupEvents();
    
    UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);
    
    UI.log("시스템 로드 완료. Escape Earth 가동 시작.");

    requestAnimationFrame(gameLoop);

    setInterval(() => {
        Storage.saveGame();
    }, 10000);
}

function setupEvents() {
    // 탭 이벤트 삭제됨 (이제 로그는 항상 보임)

    // 자원 버튼 연결
    UI.uiElements.btns.wood.addEventListener('click', () => handleGather('wood'));
    UI.uiElements.btns.stone.addEventListener('click', () => handleGather('stone'));
    UI.uiElements.btns.ironOre.addEventListener('click', () => handleGather('ironOre'));
    UI.uiElements.btns.copperOre.addEventListener('click', () => handleGather('copperOre'));
    UI.uiElements.btns.plank.addEventListener('click', () => handleGather('plank'));
}

function handleGather(type) {
    const success = Logic.manualGather(type);
    if (success) {
        UI.updateScreen(Logic.calculateNetMPS());
        const btn = UI.uiElements.btns[type];
        if(btn) {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => btn.style.transform = "scale(1)", 50);
        }
    } else {
        UI.log("재료가 부족합니다.");
    }
}

function handleBuyBuilding(index) {
    if (Logic.tryBuyBuilding(index)) {
        UI.log(`[건설] ${gameData.buildings[index].name} 건설 완료.`);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); 
    } else {
        UI.log("자원이 부족합니다.");
    }
}

function handleHouseUpgrade(nextStage) {
    if (Logic.tryUpgradeHouse(nextStage)) {
        UI.log(`🎉 기술 발전 성공! [${nextStage.name}] 단계로 진입했습니다.`, true);
        
        UI.updateHouseUI(handleHouseUpgrade);
        if(gameData.houseLevel >= houseStages.length - 1) {
            UI.log("🚀 우주 진출 조건 달성! 엔딩 시퀀스 시작.", true);
            alert("엔딩: 행성 탈출 성공!");
            Storage.resetGame();
        }
    } else {
        UI.log("업그레이드 자원이 부족합니다.");
    }
}

let lastTime = performance.now();

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    Logic.produceResources(deltaTime);

    const netMPS = Logic.calculateNetMPS();
    UI.updateScreen(netMPS);
    UI.updateShopButtons(Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);

    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", init);