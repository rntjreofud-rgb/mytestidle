document.addEventListener("DOMContentLoaded", () => {
    // 1. 요소 가져오기
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

    // 요소 체크 (안전장치)
    if (!ui.btnWood) {
        console.error("HTML 요소가 없습니다. index.html을 확인하세요.");
        return;
    }

    // 2. 게임 데이터
    let gameData = {
        resources: { wood: 0, stone: 0, iron: 0 },
        houseLevel: 0,
        buildings: [
            { id: 0, name: "나무꾼 오두막", type: "wood", baseCost: { wood: 15 }, production: 1, count: 0 },
            { id: 1, name: "채석장", type: "stone", baseCost: { wood: 50, stone: 10 }, production: 1, count: 0 },
            { id: 2, name: "제철소", type: "iron", baseCost: { wood: 200, stone: 100, iron: 20 }, production: 1, count: 0 },
            { id: 3, name: "고급 벌목 기계", type: "wood", baseCost: { wood: 500, iron: 50 }, production: 10, count: 0 },
            { id: 4, name: "자동 채굴 드릴", type: "stone", baseCost: { wood: 1000, stone: 500, iron: 100 }, production: 10, count: 0 }
        ]
    };

    const houseStages = [
        { name: "텐트", desc: "야생의 시작입니다.", req: { wood: 20 }, unlock: "none" },
        { name: "나무 오두막", desc: "이제 돌을 캘 수 있습니다.", req: { wood: 100, stone: 0 }, unlock: "stone" },
        { name: "석조 주택", desc: "단단한 집입니다. 철을 발견하세요.", req: { wood: 300, stone: 150 }, unlock: "iron" },
        { name: "현대식 아파트", desc: "자동화 기계를 늘리세요.", req: { wood: 1000, stone: 500, iron: 100 }, unlock: "all" },
        { name: "우주 센터", desc: "우주선을 건조할 준비가 되었습니다.", req: { wood: 5000, stone: 3000, iron: 2000 }, unlock: "rocket" },
        { name: "우주선 발사 (엔딩)", desc: "지구를 떠납니다!", req: { wood: 50000, stone: 50000, iron: 50000 }, unlock: "end" }
    ];

    // 시간 계산을 위한 변수
    let lastTime = performance.now();

    function init() {
        loadGame();

        ui.btnWood.addEventListener('click', () => manualGather('wood'));
        ui.btnStone.addEventListener('click', () => manualGather('stone'));
        ui.btnIron.addEventListener('click', () => manualGather('iron'));

        renderShop();
        updateUI();

        // ⭐ 변경점: setInterval 대신 requestAnimationFrame 게임 루프 시작
        requestAnimationFrame(gameLoop);

        // 자동 저장은 그대로 10초마다
        setInterval(saveGame, 10000);
    }

    // ⭐ 핵심: 게임 루프 (매 프레임 실행됨)
    function gameLoop(currentTime) {
        // 지난 프레임과의 시간 차이(초 단위) 계산 (Delta Time)
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // 시간 차이만큼 자원 생산
        produceResources(deltaTime);
        updateUI();

        // 다음 프레임 예약
        requestAnimationFrame(gameLoop);
    }

    // ⭐ 변경점: deltaTime을 받아서 곱해줌
    function produceResources(deltaTime) {
        gameData.buildings.forEach(b => {
            if (b.count > 0) {
                // 생산량 * 시간(초)
                // 예: 초당 10개 생산이고 0.01초 지났으면 0.1개 추가
                gameData.resources[b.type] += (b.production * b.count) * deltaTime;
            }
        });
    }

    function manualGather(type) {
        if (type === 'stone' && gameData.houseLevel < 1) return;
        if (type === 'iron' && gameData.houseLevel < 2) return;

        const amount = 1 + gameData.houseLevel;
        gameData.resources[type] += amount;

        // 클릭 효과
        const btn = type === 'wood' ? ui.btnWood : (type === 'stone' ? ui.btnStone : ui.btnIron);
        btn.style.transform = "scale(0.95)";
        setTimeout(() => btn.style.transform = "scale(1)", 50);
    }

    function updateUI() {
        // 소수점 버리고 표시 (내부적으로는 소수점까지 쌓임)
        ui.wood.innerText = Math.floor(gameData.resources.wood).toLocaleString();
        ui.stone.innerText = Math.floor(gameData.resources.stone).toLocaleString();
        ui.iron.innerText = Math.floor(gameData.resources.iron).toLocaleString();

        let mps = { wood: 0, stone: 0, iron: 0 };
        gameData.buildings.forEach(b => {
            mps[b.type] += b.production * b.count;
        });
        ui.mpsWood.innerText = `+${mps.wood.toFixed(1)}/초`; // 소수점 1자리까지 표시
        ui.mpsStone.innerText = `+${mps.stone.toFixed(1)}/초`;
        ui.mpsIron.innerText = `+${mps.iron.toFixed(1)}/초`;

        updateHouseUI();
        checkUnlocks();
        updateShopButtons();
    }

    function updateHouseUI() {
        if (gameData.houseLevel >= houseStages.length) return;

        const currentStage = houseStages[gameData.houseLevel];
        const nextStage = houseStages[gameData.houseLevel + 1];

        ui.houseName.innerText = `🏡 Lv.${gameData.houseLevel} ${currentStage.name}`;
        ui.houseDesc.innerText = currentStage.desc;

        ui.upgradeBtn.onclick = null;

        if (nextStage) {
            let costText = [];
            if (nextStage.req.wood > 0) costText.push(`나무 ${nextStage.req.wood}`);
            if (nextStage.req.stone > 0) costText.push(`돌 ${nextStage.req.stone}`);
            if (nextStage.req.iron > 0) costText.push(`철 ${nextStage.req.iron}`);

            ui.upgradeBtn.innerText = `⬆️ 다음: ${nextStage.name} (${costText.join(', ')})`;

            const canUpgrade =
                gameData.resources.wood >= (nextStage.req.wood || 0) &&
                gameData.resources.stone >= (nextStage.req.stone || 0) &&
                gameData.resources.iron >= (nextStage.req.iron || 0);

            ui.upgradeBtn.disabled = !canUpgrade;
            if (canUpgrade) {
                ui.upgradeBtn.onclick = () => upgradeHouse(nextStage);
            }
        } else {
            ui.upgradeBtn.innerText = "🚀 우주 정복 완료!";
            ui.upgradeBtn.disabled = true;
        }
    }

    function upgradeHouse(nextStage) {
        gameData.resources.wood -= (nextStage.req.wood || 0);
        gameData.resources.stone -= (nextStage.req.stone || 0);
        gameData.resources.iron -= (nextStage.req.iron || 0);

        gameData.houseLevel++;
        log(`🎉 ${nextStage.name}으로 발전했습니다!`);

        if (gameData.houseLevel === houseStages.length - 1) {
            alert("축하합니다! 우주선을 타고 지구를 떠납니다! 엔딩!");
            resetGame();
        }
        updateUI();
    }

    function checkUnlocks() {
        if (gameData.houseLevel >= 1) {
            ui.btnStone.classList.remove('locked');
            ui.btnStone.innerText = "🪨 돌 캐기";
        } else {
            ui.btnStone.classList.add('locked');
            ui.btnStone.innerText = "🪨 돌 캐기 (잠김)";
        }

        if (gameData.houseLevel >= 2) {
            ui.btnIron.classList.remove('locked');
            ui.btnIron.innerText = "⚙️ 철광석 캐기";
        } else {
            ui.btnIron.classList.add('locked');
            ui.btnIron.innerText = "⚙️ 철광석 캐기 (잠김)";
        }
    }

    function renderShop() {
        ui.buildingList.innerHTML = "";
        gameData.buildings.forEach((b, index) => {
            const div = document.createElement('div');
            div.className = `shop-item type-${b.type}`;
            div.id = `build-${index}`;

            let costTxt = [];
            for (let r in b.baseCost) {
                costTxt.push(`${getResIcon(r)} ${b.baseCost[r]}`);
            }

            div.innerHTML = `
                <div>
                    <strong>${b.name}</strong> <br>
                    <small class="build-count">보유: ${b.count} | +${b.production}/초</small>
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

        if (gameData.resources.wood >= (cost.wood || 0) &&
            gameData.resources.stone >= (cost.stone || 0) &&
            gameData.resources.iron >= (cost.iron || 0)) {

            gameData.resources.wood -= (cost.wood || 0);
            gameData.resources.stone -= (cost.stone || 0);
            gameData.resources.iron -= (cost.iron || 0);

            b.count++;
            log(`${b.name} 건설 완료!`);

            const newCost = getBuildingCost(b);
            const div = document.getElementById(`build-${index}`);
            let costTxt = [];
            for (let r in newCost) {
                costTxt.push(`${getResIcon(r)} ${newCost[r]}`);
            }
            div.querySelector('.cost-text').innerText = costTxt.join(' ');
            div.querySelector('.build-count').innerText = `보유: ${b.count} | +${b.production}/초`;
        } else {
            log("자원이 부족합니다.");
        }
    }

    function getBuildingCost(building) {
        let multiplier = Math.pow(1.2, building.count);
        let currentCost = {};
        for (let r in building.baseCost) {
            currentCost[r] = Math.floor(building.baseCost[r] * multiplier);
        }
        return currentCost;
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

    function getResIcon(type) {
        if (type === 'wood') return '🌲';
        if (type === 'stone') return '🪨';
        if (type === 'iron') return '⚙️';
        return '';
    }

    function log(msg) {
        if (ui.log) {
            ui.log.innerText = msg;
            ui.log.style.opacity = 1;
            setTimeout(() => { ui.log.style.opacity = 0.5; }, 2000);
        }
    }

    function saveGame() {
        localStorage.setItem('civIdleSave', JSON.stringify(gameData));
    }

    function loadGame() {
        const save = localStorage.getItem('civIdleSave');
        if (save) {
            try {
                const saved = JSON.parse(save);
                gameData.resources = { ...gameData.resources, ...saved.resources };
                gameData.houseLevel = saved.houseLevel || 0;
                if (saved.buildings) {
                    saved.buildings.forEach((sb, i) => {
                        if (gameData.buildings[i]) {
                            gameData.buildings[i].count = sb.count;
                        }
                    });
                }
            } catch (e) {
                console.error("세이브 파일 오류", e);
            }
        }
    }

    function resetGame() {
        localStorage.removeItem('civIdleSave');
        location.reload();
    }

    init();
});