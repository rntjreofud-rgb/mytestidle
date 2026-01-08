import { gameData, houseStages } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';
import * as Storage from './save.js';

// 초기화
function init() {
    Storage.loadGame();
    setupEvents();
    
    // UI 초기 렌더링
    UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);

    // 게임 루프 시작
    requestAnimationFrame(gameLoop);

    // 자동 저장 (10초)
    setInterval(() => {
        Storage.saveGame();
        UI.log("게임이 자동 저장되었습니다.");
    }, 10000);
}

// 이벤트 연결
function setupEvents() {
    UI.uiElements.btns.wood.addEventListener('click', () => handleGather('wood'));
    UI.uiElements.btns.stone.addEventListener('click', () => handleGather('stone'));
    UI.uiElements.btns.iron.addEventListener('click', () => handleGather('iron'));
}

// 핸들러 (UI와 로직 연결)
function handleGather(type) {
    const success = Logic.manualGather(type);
    if (success) {
        // 버튼 애니메이션 효과
        const btn = UI.uiElements.btns[type];
        btn.style.transform = "scale(0.95)";
        setTimeout(() => btn.style.transform = "scale(1)", 50);
        UI.updateScreen(Logic.calculateMPS());
    }
}

function handleBuyBuilding(index) {
    if (Logic.tryBuyBuilding(index)) {
        UI.log(`${gameData.buildings[index].name} 건설 완료!`);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); // 가격 갱신을 위해 다시 렌더링
    } else {
        UI.log("자원이 부족합니다.");
    }
}

function handleHouseUpgrade(nextStage) {
    if (Logic.tryUpgradeHouse(nextStage)) {
        UI.log(`🎉 ${nextStage.name}으로 발전했습니다!`);
        if(gameData.houseLevel >= houseStages.length - 1) {
            alert("축하합니다! 우주선을 타고 지구를 탈출했습니다!");
            Storage.resetGame();
        }
    }
    UI.updateHouseUI(handleHouseUpgrade);
}

// 게임 루프
let lastTime = performance.now();

function gameLoop(currentTime) {
    const deltaTime = (currentTime - lastTime) / 1000;
    lastTime = currentTime;

    // 1. 자원 생산
    Logic.produceResources(deltaTime);

    // 2. 화면 갱신
    const mps = Logic.calculateMPS();
    UI.updateScreen(mps);
    UI.updateShopButtons(Logic.getBuildingCost); // 버튼 활성/비활성 실시간 체크
    UI.updateHouseUI(handleHouseUpgrade); // 업그레이드 버튼 상태 체크

    requestAnimationFrame(gameLoop);
}

// 게임 시작!
document.addEventListener("DOMContentLoaded", init);