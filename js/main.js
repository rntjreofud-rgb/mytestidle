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
    
    UI.log("시스템 가동. 지구 탈출 시퀀스 준비.");
    requestAnimationFrame(gameLoop);
    setInterval(() => Storage.saveGame(), 10000);
}

function setupEvents() {
    if(UI.uiElements.navDashboard) UI.uiElements.navDashboard.addEventListener('click', () => UI.switchTab('dashboard'));
    if(UI.uiElements.navPower) UI.uiElements.navPower.addEventListener('click', () => UI.switchTab('power'));
    if(UI.uiElements.navResearch) UI.uiElements.navResearch.addEventListener('click', () => UI.switchTab('research'));

    // 자원 버튼
    UI.uiElements.btns.wood.addEventListener('click', () => handleGather('wood'));
    UI.uiElements.btns.stone.addEventListener('click', () => handleGather('stone'));
    // ⭐ 석탄 추가됨
    if(UI.uiElements.btns.coal) UI.uiElements.btns.coal.addEventListener('click', () => handleGather('coal'));
    
    UI.uiElements.btns.ironOre.addEventListener('click', () => handleGather('ironOre'));
    UI.uiElements.btns.copperOre.addEventListener('click', () => handleGather('copperOre'));
    UI.uiElements.btns.plank.addEventListener('click', () => handleGather('plank'));
}

function handleGather(type) {
    if (Logic.manualGather(type)) {
        UI.updateScreen(Logic.calculateNetMPS());
        const btn = UI.uiElements.btns[type];
        if(btn) {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => btn.style.transform = "scale(1)", 50);
        }
    } else {
        UI.log("작업 불가: 재료 부족 또는 도구 필요");
    }
}

function handleBuyBuilding(index) {
    if (Logic.tryBuyBuilding(index)) {
        UI.log(`[건설] ${gameData.buildings[index].name} 가동 시작.`);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); 
    } else {
        UI.log("자원이 부족하여 건설할 수 없습니다.");
    }
}

function handleHouseUpgrade(nextStage) {
    if (Logic.tryUpgradeHouse(nextStage)) {
        UI.log(`🎉 기술 발전 성공: [${nextStage.name}]`, true);
        UI.updateHouseUI(handleHouseUpgrade);
        if(gameData.houseLevel >= houseStages.length - 1) {
            UI.log("🚀 엔딩 조건 달성! 탈출 프로세스 개시.", true);
            alert("지구 탈출 성공!");
            Storage.resetGame();
        }
    } else {
        UI.log("업그레이드 자원 부족");
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