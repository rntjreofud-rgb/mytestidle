// js/main.js

import { gameData, houseStages } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';
import * as Storage from './save.js';

// 전역으로 게임 데이터를 노출 (디버그 및 콘솔용)
window.gameData = gameData;


window.performPrestige = function() {
    if(!confirm("지구를 떠나시겠습니까? 자원과 건물이 초기화되지만 영구 보너스 포인트 3를 얻습니다.")) return;

    // 1. 유산 포인트 지급
    gameData.cosmicData = (gameData.cosmicData || 0) + 3;
    gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;

    // 2. 핵심 데이터 초기화
    for (let key in gameData.resources) { gameData.resources[key] = 0; }
    gameData.buildings.forEach(b => { b.count = 0; b.activeCount = 0; });
    gameData.researches = [];
    gameData.houseLevel = 0;
    gameData.unlockedResources = ['wood', 'stone', 'plank'];

    // 3. '선구자의 보급품' 보너스 적용
    if (gameData.legacyUpgrades.includes('start_resource')) {
        gameData.resources.wood = 500;
        gameData.resources.stone = 500;
        gameData.resources.plank = 100;
    }

    Storage.saveGame();
    location.reload(); 
};


// setupEvents에 네비게이션 추가
UI.uiElements.navLegacy.addEventListener('click', () => UI.switchTab('legacy'));

window.toggleBuildingPower = function(id) {
    console.log(`[클릭 감지] 건물 ID: ${id}`); // 클릭 확인용 로그

    // 1. 데이터 찾기
    const building = gameData.buildings.find(b => b.id === id);
    if (!building) {
        console.error("건물을 찾을 수 없습니다.");
        return;
    }

    // 2. 값 변경 (켜져있으면 끄고, 꺼져있으면 켬)
    // (undefined일 경우를 대비해 확실하게 boolean 처리)
    building.on = !building.on;

    // 3. 화면 갱신 (Logic과 UI를 사용)
    const netMPS = Logic.calculateNetMPS();
    UI.updateScreen(netMPS);
    
    console.log(`[상태 변경] ${building.name} -> ${building.on ? 'ON' : 'OFF'}`);
};



function init() {
    window.UI = UI; 
    
    // 1. 게임을 로드하며 오프라인 시간을 가져옴
    const offlineSeconds = Storage.loadGame(); 
    
    setupEvents();
    const initialStats = Logic.calculateNetMPS();
    UI.updateScreen(initialStats);
    UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
    UI.updateHouseUI(handleHouseUpgrade);

    // 2. ⭐ 오프라인 자원 계산 및 처리
    if (offlineSeconds > 10) { // 10초 이상 자리를 비웠을 때만 실행
        // 최대 오프라인 시간 제한 (예: 12시간 = 43200초)
        const cappedSeconds = Math.min(offlineSeconds, 43200); 
        
        // 현재 생산량 기준으로 자원 생성
        Logic.produceResources(cappedSeconds); 
        
        const hours = Math.floor(cappedSeconds / 3600);
        const mins = Math.floor((cappedSeconds % 3600) / 60);
        UI.log(`💤 자리를 비운 ${hours}시간 ${mins}분 동안 자원이 축적되었습니다!`, true);
        
        // 어떤 자원을 얼마나 얻었는지 팝업으로 보여주면 더 좋음 (선택사항)
    }

    UI.log("시스템 로드 완료. Escape Earth 가동 시작.");
    requestAnimationFrame(gameLoop);
    setInterval(() => Storage.saveGame(), 10000);
}


function setupEvents() {
    if(UI.uiElements.navDashboard) UI.uiElements.navDashboard.addEventListener('click', () => UI.switchTab('dashboard'));
    if(UI.uiElements.navPower) UI.uiElements.navPower.addEventListener('click', () => UI.switchTab('power'));
    if(UI.uiElements.navResearch) UI.uiElements.navResearch.addEventListener('click', () => UI.switchTab('research'));
    if(UI.uiElements.navTechTree) UI.uiElements.navTechTree.addEventListener('click', () => UI.switchTab('tech-tree'));
    UI.uiElements.btns.wood.addEventListener('click', () => handleGather('wood'));
    UI.uiElements.btns.stone.addEventListener('click', () => handleGather('stone'));
    if(UI.uiElements.btns.coal) UI.uiElements.btns.coal.addEventListener('click', () => handleGather('coal'));
    UI.uiElements.btns.ironOre.addEventListener('click', () => handleGather('ironOre'));
    UI.uiElements.btns.copperOre.addEventListener('click', () => handleGather('copperOre'));
    UI.uiElements.btns.plank.addEventListener('click', () => handleGather('plank'));
    UI.uiElements.navLegacy.addEventListener('click', () => UI.switchTab('legacy'));

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

    // ⭐ 전력 토글 스위치 전용 감시자 (이벤트 위임)
    document.body.addEventListener('click', (e) => {
        // 클릭한 요소가 전력 제어 버튼인지 확인
        if (e.target && e.target.classList.contains('btn-power-ctrl')) {
            const id = parseInt(e.target.dataset.id);
            const type = e.target.dataset.type; // 'on' 또는 'off'
            
            const building = gameData.buildings.find(b => b.id === id);
            
            if (building) {
                // 버튼 타입에 따라 확실하게 true/false 설정
                if (type === 'on') {
                    building.on = true;
                } else {
                    building.on = false;
                }
                
                // 화면 갱신
                UI.updateScreen(Logic.calculateNetMPS());
                
                console.log(`[전력 제어] ${building.name} -> ${building.on ? 'ON' : 'OFF'}`);
            }
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
    // 1. 먼저 결과를 변수에 담아야 합니다. (객체는 그 자체로 참이기 때문)
    const result = Logic.tryBuyBuilding(index); 
    
    if (result.success) {
        UI.log(`[건설] ${gameData.buildings[index].name} 건설 완료.`);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost); 
    } else {
        // 2. result 객체 안에 있는 missing 배열을 사용합니다.
        const missingNames = result.missing.map(key => UI.getResNameOnly(key)).join(', ');
        UI.log(`🏗️ 건설 불가 (부족: ${missingNames})`, false);
    }
}

function handleHouseUpgrade(nextStage) {
    // 1. 결과를 변수에 담아 success 여부를 확인합니다.
    const result = Logic.tryUpgradeHouse(nextStage);
    
    if (result.success) {
         if (gameData.houseLevel >= houseStages.length - 1) {
            UI.log("🚀 [지구 탈출 성공] 대기권을 돌파하여 우주로 나아갑니다!", true);
            
            setTimeout(() => {
                if (confirm(`🎉 축하합니다! 지구를 탈출했습니다!\n\n우주 항해를 통해 얻은 데이터로 숙련도가 상승합니다.\n현재 숙련도: Lv.${gameData.prestigeLevel}\n\n숙련도 Lv.${gameData.prestigeLevel + 1}로 다음 회차를 시작하시겠습니까?\n(영구 생산 속도 20% 보너스 부여)`)) {
                    performPrestige();
                }
            }, 1000);
            return;
        }

        UI.log(`🎉 기술 발전 성공! [${nextStage.name}]`, true);
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
        UI.updateHouseUI(handleHouseUpgrade);
    } else {
        // 2. 부족한 자원 목록을 로그에 출력합니다.
        const missingNames = result.missing.map(key => UI.getResNameOnly(key)).join(', ');
        UI.log(`⬆️ 업그레이드 불가 (부족: ${missingNames})`, false);
    }
}

function performPrestige() {
    // 1. 환생 레벨 상승
    gameData.prestigeLevel++;

    // 2. 자원 초기화 (0으로)
    for (let key in gameData.resources) {
        gameData.resources[key] = 0;
    }
    gameData.resources.energy = 0;
    gameData.resources.energyMax = 0;

    // 3. 건물 초기화
    gameData.buildings.forEach(b => {
        b.count = 0;
        b.activeCount = 0;
        b.on = true;
    });

    // 4. 연구 및 레벨 초기화
    gameData.researches = [];
    gameData.houseLevel = 0;
    gameData.unlockedResources = ['wood', 'stone', 'plank'];

    // 5. 저장 및 재시작
    Storage.saveGame();
    location.reload(); 
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