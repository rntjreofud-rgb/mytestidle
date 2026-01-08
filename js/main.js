// js/main.js

import { gameData, houseStages } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';
import * as Storage from './save.js';

function init() {
    Storage.loadGame();
    setupEvents();
    
    UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);

    requestAnimationFrame(gameLoop);

    setInterval(() => {
        Storage.saveGame();
    }, 10000);
}

function setupEvents() {
    // 수동 채집 버튼 연결
    UI.uiElements.btns.wood.addEventListener('click', () => handleGather('wood'));
    UI.uiElements.btns.stone.addEventListener('click', () => handleGather('stone'));
    UI.uiElements.btns.ironOre.addEventListener('click', () => handleGather('ironOre'));
    UI.uiElements.btns.copperOre.addEventListener('click', () => handleGather('copperOre'));
    
    // 수동 제작 버튼 연결
    UI.uiElements.btns.plank.addEventListener('click', () => handleGather('plank'));
}

function handleGather(type) {
    const success = Logic.manualGather(type);
    if (success) {
        // UI 즉시 갱신 (반응성 향상)
        UI.updateScreen(Logic.calculateNetMPS());
        
        // 버튼 눌림 효과 (옵션)
        let btnKey = type;
        if(type === 'ironOre') btnKey = 'ironOre'; // 매핑 확인
        
        // 버튼 요소 찾기
        const btn = UI.uiElements.btns[type];
        if(btn) {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => btn.style.transform = "scale(1)", 50);
        }
    } else {
        UI.log("재료가 부족합니다!");
    }
}

function handleBuyBuilding(index) {
    if (Logic.tryBuyBuilding(index)) {
        UI.log(`${gameData.buildings[index].name} 건설 완료!`);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); 
    } else {
        UI.log("자원이 부족합니다.");
    }
}

function handleHouseUpgrade(nextStage) {
    if (Logic.tryUpgradeHouse(nextStage)) {
        UI.log(`🎉 ${nextStage.name} 발전!`);
        UI.updateHouseUI(handleHouseUpgrade);
        if(gameData.houseLevel >= houseStages.length - 1) {
            alert("엔딩: 행성 탈출 성공!");
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

    // 1. 공정 가동 (생산 및 소비)
    Logic.produceResources(deltaTime);

    // 2. 화면 갱신
    const netMPS = Logic.calculateNetMPS();
    UI.updateScreen(netMPS);
    UI.updateShopButtons(Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);

    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", init);