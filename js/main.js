// js/main.js

import { gameData, houseStages } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';
import * as Storage from './save.js';

function init() {
    Storage.loadGame();
    window.UI = UI; 
    setupEvents();
    
    // UI 초기화 (handleBuyBuilding 함수 참조를 UI 모듈에 넘겨줍니다)
    UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);
    
    UI.log("시스템 로드 완료. Escape Earth 가동 시작.");
    requestAnimationFrame(gameLoop);
    setInterval(() => Storage.saveGame(), 10000);
}


function setupEvents() {
    if(UI.uiElements.navDashboard) UI.uiElements.navDashboard.addEventListener('click', () => UI.switchTab('dashboard'));
    if(UI.uiElements.navPower) UI.uiElements.navPower.addEventListener('click', () => UI.switchTab('power'));
    if(UI.uiElements.navResearch) UI.uiElements.navResearch.addEventListener('click', () => UI.switchTab('research'));

    UI.uiElements.btns.wood.addEventListener('click', () => handleGather('wood'));
    UI.uiElements.btns.stone.addEventListener('click', () => handleGather('stone'));
    if(UI.uiElements.btns.coal) UI.uiElements.btns.coal.addEventListener('click', () => handleGather('coal'));
    UI.uiElements.btns.ironOre.addEventListener('click', () => handleGather('ironOre'));
    UI.uiElements.btns.copperOre.addEventListener('click', () => handleGather('copperOre'));
    UI.uiElements.btns.plank.addEventListener('click', () => handleGather('plank'));

    // 파일 내보내기 버튼
    document.getElementById('btn-export').addEventListener('click', () => {
        Storage.exportToFile();
        UI.log("세이브 데이터를 파일로 저장했습니다.");
    });

    // 파일 가져오기 버튼 (클릭 시 파일 선택창 열기)
    const fileInput = document.getElementById('import-file');
    document.getElementById('btn-import').addEventListener('click', () => {
        fileInput.click();
    });

    // 파일이 선택되었을 때 처리
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            Storage.importFromFile(e.target.files[0])
                .then(() => {
                    alert("데이터를 성공적으로 불러왔습니다. 게임을 다시 시작합니다.");
                    location.reload(); // 데이터 동기화를 위해 새로고침
                })
                .catch(err => {
                    alert(err);
                });
        }
    });


}

function handleGather(type) {
    if (Logic.manualGather(type)) {
        UI.updateScreen(Logic.calculateNetMPS());
        const btn = UI.uiElements.btns[type];
        if(btn) {
            btn.style.transform = "scale(0.95)";
            setTimeout(() => btn.style.transform = "scale(1)", 50);
        }
        
        // ⭐ 자원을 캘 때도 해금 조건(나무 10개)이 달성될 수 있으므로 상점 갱신 체크
        // (매번 다시 그리면 느리니, 특정 조건에서만 다시 그리게 하거나, 
        // 간단히 여기서 호출해도 됩니다. 여기선 10개 돌파 순간을 잡기 어려우니 
        // 일단 checkUnlocks가 버튼은 처리해주고, 건물 목록은 아래 1초 루프에서 처리하는게 낫지만
        // 즉각 반응을 위해 10개 돌파 시 한번 호출하는게 좋음. 
        // 복잡하므로 여기선 UI.checkUnlocks()는 내부적으로 항상 돕니다.)
        
        // 나무 10개가 되는 순간 상점을 갱신하고 싶다면:
        if (type === 'wood' && gameData.resources.wood === 10) {
             UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
        }
        
    } else {
        UI.log("작업 불가: 재료 부족 또는 도구 필요");
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
        
        // ⭐ 중요: 레벨이 올랐으니 새로운 건물이 해금되었을 수 있음. 상점 다시 그리기
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
        
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