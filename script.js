// 게임 데이터
let gameData = {
    resources: { wood: 0, stone: 0, iron: 0 },
    houseLevel: 0,
    buildings: [
        // type: 어떤 자원을 생산하는가
        { id: 0, name: "나무꾼 오두막", type: "wood", baseCost: { wood: 15 }, production: 1, count: 0 },
        { id: 1, name: "채석장", type: "stone", baseCost: { wood: 50, stone: 10 }, production: 1, count: 0 },
        { id: 2, name: "제철소", type: "iron", baseCost: { wood: 200, stone: 100, iron: 20 }, production: 1, count: 0 },
        { id: 3, name: "고급 벌목 기계", type: "wood", baseCost: { wood: 500, iron: 50 }, production: 10, count: 0 },
        { id: 4, name: "자동 채굴 드릴", type: "stone", baseCost: { wood: 1000, stone: 500, iron: 100 }, production: 10, count: 0 }
    ]
};

// 집 업그레이드 정보 (비용 및 해금 요소)
const houseStages = [
    { name: "텐트", desc: "야생의 시작입니다.", req: { wood: 20 }, unlock: "none" },
    { name: "나무 오두막", desc: "이제 돌을 캘 수 있습니다.", req: { wood: 100, stone: 0 }, unlock: "stone" },
    { name: "석조 주택", desc: "단단한 집입니다. 철을 발견하세요.", req: { wood: 300, stone: 150 }, unlock: "iron" },
    { name: "현대식 아파트", desc: "자동화 기계를 늘리세요.", req: { wood: 1000, stone: 500, iron: 100 }, unlock: "all" },
    { name: "우주 센터", desc: "우주선을 건조할 준비가 되었습니다.", req: { wood: 5000, stone: 3000, iron: 2000 }, unlock: "rocket" },
    { name: "우주선 발사 (엔딩)", desc: "지구를 떠납니다!", req: { wood: 50000, stone: 50000, iron: 50000 }, unlock: "end" }
];

// DOM 요소 연결
const ui = {
    wood: document.getElementById('res-wood'),
    stone: document.getElementById('res-stone'),
    iron: document.getElementById('res-iron'),
    mpsWood: document.getElementById('mps-wood'),
    mpsStone: document.getElementById('mps-stone'),
    mpsIron: document.getElementById('mps-iron'),
    houseName: document.getElementById('house-name'),
    houseDesc: document.getElementById('house-desc'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    btnWood: document.getElementById('btn-gather-wood'),
    btnStone: document.getElementById('btn-gather-stone'),
    btnIron: document.getElementById('btn-gather-iron'),
    buildingList: document.getElementById('building-list'),
    log: document.getElementById('message-log')
};

// 초기화
function init() {
    loadGame();
    renderShop();
    updateUI();

    // 1초 루프
    setInterval(() => {
        produceResources();
        updateUI();
        saveGame();
    }, 1000);
}

// 자원 생산 (초당)
function produceResources() {
    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            gameData.resources[b.type] += b.production * b.count;
        }
    });
}

// 화면 업데이트 (핵심)
function updateUI() {
    // 자원 표시
    ui.wood.innerText = Math.floor(gameData.resources.wood).toLocaleString();
    ui.stone.innerText = Math.floor(gameData.resources.stone).toLocaleString();
    ui.iron.innerText = Math.floor(gameData.resources.iron).toLocaleString();

    // 초당 생산량 계산
    let mps = { wood: 0, stone: 0, iron: 0 };
    gameData.buildings.forEach(b => {
        mps[b.type] += b.production * b.count;
    });
    ui.mpsWood.innerText = `+${mps.wood}/초`;
    ui.mpsStone.innerText = `+${mps.stone}/초`;
    ui.mpsIron.innerText = `+${mps.iron}/초`;

    // 집 업그레이드 버튼 상태
    updateHouseUI();

    // 버튼 잠금 해제 체크
    checkUnlocks();

    // 상점 버튼 활성/비활성 업데이트
    updateShopButtons();
}

function updateHouseUI() {
    if (gameData.houseLevel >= houseStages.length) return;

    const currentStage = houseStages[gameData.houseLevel];
    const nextStage = houseStages[gameData.houseLevel + 1]; // 다음 단계 정보

    ui.houseName.innerText = `🏡 Lv.${gameData.houseLevel} ${currentStage.name}`;
    ui.houseDesc.innerText = currentStage.desc;

    if (nextStage) {
        // 비용 텍스트 만들기
        let costText = [];
        if (nextStage.req.wood > 0) costText.push(`나무 ${nextStage.req.wood}`);
        if (nextStage.req.stone > 0) costText.push(`돌 ${nextStage.req.stone}`);
        if (nextStage.req.iron > 0) costText.push(`철 ${nextStage.req.iron}`);

        ui.upgradeBtn.innerText = `⬆️ 다음: ${nextStage.name} (${costText.join(', ')})`;

        // 비용 충족 확인
        const canUpgrade =
            gameData.resources.wood >= (nextStage.req.wood || 0) &&
            gameData.resources.stone >= (nextStage.req.stone || 0) &&
            gameData.resources.iron >= (nextStage.req.iron || 0);

        ui.upgradeBtn.disabled = !canUpgrade;
        ui.upgradeBtn.onclick = () => upgradeHouse(nextStage);
    } else {
        ui.upgradeBtn.innerText = "🚀 우주 정복 완료!";
        ui.upgradeBtn.disabled = true;
    }
}

function upgradeHouse(nextStage) {
    // 자원 소모
    gameData.resources.wood -= (nextStage.req.wood || 0);
    gameData.resources.stone -= (nextStage.req.stone || 0);
    gameData.resources.iron -= (nextStage.req.iron || 0);

    gameData.houseLevel++;

    log(`🎉 ${nextStage.name}으로 발전했습니다!`);

    if (gameData.houseLevel === houseStages.length - 1) {
        alert("축하합니다! 우주선을 발사하여 지구를 떠났습니다! 게임 클리어!");
        resetGame();
    }

    updateUI();
}

function checkUnlocks() {
    // 레벨에 따른 버튼 해금
    if (gameData.houseLevel >= 1) {
        ui.btnStone.classList.remove('locked');
        ui.btnStone.onclick = () => manualGather('stone');
    } else {
        ui.btnStone.onclick = null;
    }

    if (gameData.houseLevel >= 2) {
        ui.btnIron.classList.remove('locked');
        ui.btnIron.onclick = () => manualGather('iron');
    } else {
        ui.btnIron.onclick = null;
    }
}

// 수동 채집
ui.btnWood.onclick = () => manualGather('wood');

function manualGather(type) {
    // 집 레벨이 높을수록 클릭 효율 증가
    const amount = 1 + gameData.houseLevel;
    gameData.resources[type] += amount;

    updateUI();

    // 간단한 클릭 애니메이션
    const btn = document.getElementById(`btn-gather-${type}`);
    btn.style.transform = "scale(0.95)";
    setTimeout(() => btn.style.transform = "scale(1)", 50);
}

// 상점 렌더링
function renderShop() {
    ui.buildingList.innerHTML = "";
    gameData.buildings.forEach((b, index) => {
        const div = document.createElement('div');
        div.className = `shop-item type-${b.type}`;
        div.id = `build-${index}`;

        // 비용 텍스트
        let costTxt = [];
        for (let r in b.baseCost) {
            costTxt.push(`${getResIcon(r)} ${b.baseCost[r]}`);
        }

        div.innerHTML = `
            <div>
                <strong>${b.name}</strong> <br>
                <small>보유: ${b.count} | +${b.production} ${getResIcon(b.type)}/초</small>
            </div>
            <div style="text-align:right">
                <span class="cost-text">${costTxt.join(' ')}</span>
            </div>
        `;

        div.onclick = () => buyBuilding(index);
        ui.buildingList.appendChild(div);
    });
}

function buyBuilding(index) {
    const b = gameData.buildings[index];
    const cost = getBuildingCost(b);

    // 자원 충분한지 체크
    if (gameData.resources.wood >= (cost.wood || 0) &&
        gameData.resources.stone >= (cost.stone || 0) &&
        gameData.resources.iron >= (cost.iron || 0)) {

        // 자원 차감
        gameData.resources.wood -= (cost.wood || 0);
        gameData.resources.stone -= (cost.stone || 0);
        gameData.resources.iron -= (cost.iron || 0);

        b.count++;
        log(`${b.name} 건설 완료!`);
        updateUI();
        updateShopCostDisplay(); // 가격 갱신
    } else {
        log("자원이 부족합니다.");
    }
}

// 건물 가격 계산 (보유량에 따라 1.2배씩 증가)
function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count);
    let currentCost = {};
    for (let r in building.baseCost) {
        currentCost[r] = Math.floor(building.baseCost[r] * multiplier);
    }
    return currentCost;
}

function updateShopCostDisplay() {
    gameData.buildings.forEach((b, index) => {
        const div = document.getElementById(`build-${index}`);
        const cost = getBuildingCost(b);
        let costTxt = [];
        for (let r in cost) {
            costTxt.push(`${getResIcon(r)} ${cost[r]}`);
        }
        div.querySelector('.cost-text').innerText = costTxt.join(' ');

        // 보유 개수 업데이트
        div.querySelector('small').innerText = `보유: ${b.count} | +${b.production} ${getResIcon(b.type)}/초`;
    });
}

function updateShopButtons() {
    gameData.buildings.forEach((b, index) => {
        const div = document.getElementById(`build-${index}`);
        const cost = getBuildingCost(b);
        const canBuy =
            gameData.resources.wood >= (cost.wood || 0) &&
            gameData.resources.stone >= (cost.stone || 0) &&
            gameData.resources.iron >= (cost.iron || 0);

        if (canBuy) div.classList.remove('disabled');
        else div.classList.add('disabled');
    });
}

// 유틸리티
function getResIcon(type) {
    if (type === 'wood') return '🌲';
    if (type === 'stone') return '🪨';
    if (type === 'iron') return '⚙️';
    return '';
}

function log(msg) {
    ui.log.innerText = msg;
    ui.log.style.opacity = 1;
    setTimeout(() => { ui.log.style.opacity = 0.5; }, 2000);
}

// 저장/불러오기
function saveGame() {
    localStorage.setItem('civIdleSave', JSON.stringify(gameData));
}

function loadGame() {
    const save = localStorage.getItem('civIdleSave');
    if (save) {
        const saved = JSON.parse(save);
        // 간단한 병합 로직
        gameData.resources = saved.resources || gameData.resources;
        gameData.houseLevel = saved.houseLevel || 0;
        if (saved.buildings) {
            saved.buildings.forEach((sb, i) => {
                if (gameData.buildings[i]) {
                    gameData.buildings[i].count = sb.count;
                }
            });
        }
    }
}

function resetGame() {
    localStorage.removeItem('civIdleSave');
    location.reload();
}

init();