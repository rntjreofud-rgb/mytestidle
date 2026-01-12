// js/main.js

import { gameData, getActiveStages } from './data.js';
import * as UI from './ui.js';
import * as Logic from './logic.js';
import * as Storage from './save.js';

// 전역으로 게임 데이터를 노출 (디버그 및 콘솔용)
window.gameData = gameData;


/**
 * 특정 행성에 착륙하여 새로운 시즌을 시작하는 함수
 * @param {string} planetKey - 'aurelia' 또는 'veridian'
 */
window.landOnPlanet = function(planetKey) {
    const planetName = planetKey === 'aurelia' ? '아우렐리아' : '베리디안';
    
    if(!confirm(`${planetName} 행성에 진입하시겠습니까? 현재의 모든 인프라가 파괴됩니다.`)) return;

    // ⭐ [핵심 추가] 떠나기 전 현재 행성에서의 성과를 점수로 정산합니다.
    const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
    gameData.cosmicData = (gameData.cosmicData || 0) + gain;
    
    // 만약 50레벨을 찍고 이동하는 것이라면 숙련도(환생 레벨)도 올려줍니다.
    if (gameData.houseLevel >= 50) {
        gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;
    }

    // 1. 행성 환경 전환
    gameData.currentPlanet = planetKey;
    gameData.houseLevel = 0;

    // 2. 자원 및 건물 제로베이스 초기화 (유산 및 숙련도는 보존)
    for (let key in gameData.resources) { gameData.resources[key] = 0; }
    gameData.buildings.forEach(b => { b.count = 0; b.activeCount = 0; });
    gameData.researches = [];
    
    // 3. 저장 및 리로드
    Storage.saveGame();
    UI.log(`🚀 ${planetName} 착륙 성공! 데이터 ${gain}개를 획득했습니다.`, true);
    
    setTimeout(() => {
        location.reload(); 
    }, 1000);
};

window.performPrestige = function() {
    // 현재 행성과 레벨(보통 50)을 기준으로 포인트 계산
    const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
    
    if(!confirm(`지구를 떠나시겠습니까? 자원과 건물이 초기화되지만\n우주 데이터 ${gain}개를 획득합니다.`)) return;

    // 1. 데이터 업데이트
    gameData.cosmicData = (gameData.cosmicData || 0) + gain;
    gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;

    // 2. 초기화 로직 (이전과 동일)
    for (let key in gameData.resources) { gameData.resources[key] = 0; }
    gameData.buildings.forEach(b => { b.count = 0; b.activeCount = 0; });
    gameData.researches = [];
    gameData.houseLevel = 0;
    gameData.unlockedResources = ['wood', 'stone', 'plank'];

    // 3. 유산 보너스 적용 및 저장
    if (gameData.legacyUpgrades.includes('start_resource')) {
        gameData.resources.wood = 500; gameData.resources.stone = 500; gameData.resources.plank = 100;
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

    const starBtn = document.getElementById('btn-become-star');
    if (starBtn) {
        starBtn.onclick = () => {
            // 1. 현재 성과에 따른 포인트 계산
            const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
            const planetDisplayName = {aurelia: '아우렐리아', veridian: '베리디안'}[gameData.currentPlanet];

            const msg = `🌌 모든 삶을 놓아버리고 우주의 별이 되시겠습니까?\n\n현재 ${planetDisplayName}에서의 인프라는 파괴되지만,\n성과를 인정받아 우주 데이터 ${gain}개를 획득하고\n고향인 '지구'에서 다시 눈을 뜹니다.`;

            if (confirm(msg)) {
                // 2. 우주 데이터 포인트 지급
                gameData.cosmicData = (gameData.cosmicData || 0) + gain;

                // 3. 행성을 지구(earth)로 강제 변경 및 레벨 초기화
                gameData.currentPlanet = 'earth';
                gameData.houseLevel = 0;

                // 4. 자원 및 건물 초기화 (유산/숙련도는 유지됨)
                for (let key in gameData.resources) { gameData.resources[key] = 0; }
                gameData.buildings.forEach(b => { b.count = 0; b.activeCount = 0; });
                gameData.researches = [];
                gameData.unlockedResources = ['wood', 'stone', 'plank'];

                // 5. '선구자의 보급품' 유산이 있다면 지구 자원 지급
                if (gameData.legacyUpgrades && gameData.legacyUpgrades.includes('start_resource')) {
                    gameData.resources.wood = 500;
                    gameData.resources.stone = 500;
                    gameData.resources.plank = 100;
                }

                // 6. 저장 및 리로드
                Storage.saveGame();
                UI.log(`🌌 당신은 우주의 별이 되어 지구로 다시 내려앉았습니다. (+${gain} 데이터)`, true);
                
                setTimeout(() => {
                    location.reload(); 
                }, 1000);
            }
        };
    }


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
    // 1. 업그레이드 시도 (결과 객체 반환받음)
    const result = Logic.tryUpgradeHouse(nextStage);
    
    if (result.success) {
        // 현재 행성의 전체 단계 리스트를 가져와서 엔딩 여부 확인
        const stages = getActiveStages(); 
        
        // 엔딩 단계(Lv.50 등)에 도달했는지 체크
        if (gameData.houseLevel >= stages.length - 1) {
            UI.log(`🚀 [미션 완료] ${nextStage.name}! 행성을 떠날 준비가 되었습니다.`, true);
            
            // UI를 즉시 갱신하여 '환생' 및 '탐사' 버튼이 나타나게 함
            UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
            UI.updateHouseUI(handleHouseUpgrade);
            
            // 별도의 confirm 창 없이 버튼 선택으로 유도 (UI가 알아서 바뀜)
            return;
        }

        // 일반 업그레이드 성공 로그
        UI.log(`🎉 기술 발전 성공! [${nextStage.name}]`, true);
        
        // 상점(새 건물 해금 대비) 및 하우스 UI 갱신
        UI.renderShop(handleBuyBuilding, Logic.getBuildingCost);
        UI.updateHouseUI(handleHouseUpgrade);
        
    } else {
        // 자원 부족 시 어떤 자원이 모자란지 구체적으로 출력
        // UI.getResNameOnly 가 export 되어 있어야 에러가 나지 않습니다.
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