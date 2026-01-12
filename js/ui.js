// js/ui.js 전체 교체

import { gameData, getActiveStages, getActiveResearch, getActivePlanetData, legacyList } from './data.js';
import * as Logic from './logic.js';

// 내부에서 구매 콜백 함수를 기억하기 위한 변수
let cachedBuyCallback = null;

window.adjustActiveCount = function(id, delta) {
    const b = gameData.buildings.find(build => build.id === id);
    if (b) {
        // 0 ~ 보유 개수(count) 사이로 제한
        b.activeCount = Math.max(0, Math.min(b.count, b.activeCount + delta));
        // 즉시 로직 계산 및 화면 갱신
        const netMPS = Logic.calculateNetMPS();
        updateScreen(netMPS);
    }
};



const elements = {
    viewDashboard: document.getElementById('view-dashboard'),
    viewPower: document.getElementById('view-power'),
    viewResearch: document.getElementById('view-research'),
    navDashboard: document.getElementById('nav-dashboard'),
    viewTechTree: document.getElementById('view-tech-tree'),
    navTechTree: document.getElementById('nav-tech-tree'),
    navPower: document.getElementById('nav-power'),
    navResearch: document.getElementById('nav-research'),

    viewLegacy: document.getElementById('view-legacy'),
    navLegacy: document.getElementById('nav-legacy'),

    dashPowerPanel: document.getElementById('dash-power-panel'),
    dashPowerText: document.getElementById('dash-power-text'),
    dashPowerFill: document.getElementById('dash-power-fill'),
    logList: document.getElementById('game-log-list'),
    resGrid: document.querySelector('.resource-grid'),
    houseName: document.getElementById('header-title'),
    houseDesc: document.getElementById('house-desc'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    btns: {
        wood: document.getElementById('btn-gather-wood'),
        stone: document.getElementById('btn-gather-stone'),
        coal: document.getElementById('btn-gather-coal'),
        ironOre: document.getElementById('btn-gather-iron'),
        copperOre: document.getElementById('btn-gather-copper'),
        plank: document.getElementById('btn-craft-plank')
    },
    buildingList: document.getElementById('building-list'),
    headerLog: document.getElementById('message-log'),
    powerDisplay: document.getElementById('power-display-text'), 
    powerBar: document.getElementById('power-fill-bar')
};

const resNames = {
    wood: "🌲 나무", stone: "🪨 돌", coal: "⚫ 석탄", ironOre: "⚙️ 철광", copperOre: "🥉 구리광", 
    oil: "🛢️ 원유", titaniumOre: "💎 티타늄광", uraniumOre: "💚 우라늄광",
    plank: "🪵 판자", brick: "🧱 벽돌", ironPlate: "⬜ 철판", copperPlate: "🟧 구리판", 
    glass: "🍷 유리", sulfur: "💛 유황", steel: "🏗️ 강철", plastic: "🧪 플라스틱", 
    concrete: "🏢 콘크리트", battery: "🔋 배터리", fuelCell: "☢️ 연료봉",
    gear: "⚙️ 톱니", circuit: "📟 회로", advCircuit: "🔴 고급회로", 
    processor: "🔵 프로세서", aiCore: "🧠 AI코어", rocketFuel: "🚀 로켓연료", 
    nanobots: "🤖 나노봇", warpCore: "🌀 워프코어", energy: "⚡ 전력",
    titaniumPlate: "💎 티타늄판", optics: "🔭 광학렌즈", advAlloy: "🛡️ 고급합금",
    quantumData: "💾 양자데이터", gravityModule: "🛸 중력모듈",

    bioFiber: "🌿 유기섬유",
    spore: "🍄 포자",
    yeast: "🦠 효모",
    livingWood: "🌳 생명목",
    bioFuel: "🧪 바이오연료",
    rootBrick: "🪵 뿌리벽돌",
    neuralFiber: "🧠 신경섬유",
    mutantCell: "🌑 변이세포",
    geneticCode: "🧬 유전코드",
    pheromone: "🧪 페로몬",
    biosphereCore: "🌐 생태코어",
    



    scrapMetal: "🔩 고철파편",
    magnet: "🧲 자석",
    chargedCrystal: "💎 대전수정",
    heavyAlloy: "🛡️ 중합금",
    fluxEnergy: "🌀 플럭스에너지",
    nanoSteel: "🌑 나노강철",
    plasmaCore: "⚛️ 플라즈마코어",
    magConcrete: "🧱 자력콘크리트", 
    fluxLogic: "💾 플럭스회로"

};

const resourceGroups = {
    // === [1] 지구 (Earth) 자원 그룹 ===
    earth_raw: { 
        planet: 'earth', title: "⛏️ 원자재 (Raw Materials)", 
        items: ['wood', 'stone', 'coal', 'ironOre', 'copperOre', 'oil', 'titaniumOre', 'uraniumOre'] 
    },
    earth_mat: { 
        planet: 'earth', title: "🧱 가공 자재 (Materials)", 
        items: ['plank', 'brick', 'glass', 'concrete', 'ironPlate', 'copperPlate', 'steel', 'titaniumPlate', 'advAlloy', 'sulfur', 'plastic'] 
    },
    earth_comp: { 
        planet: 'earth', title: "⚙️ 부품 및 첨단 (High-Tech)", 
        items: ['gear', 'circuit', 'battery', 'optics', 'advCircuit', 'processor', 'fuelCell', 'rocketFuel', 'nanobots', 'aiCore', 'quantumData', 'gravityModule', 'warpCore'] 
    },

    // === [2] 아우렐리아 (Aurelia) 자원 그룹 ===
    aurelia_raw: { 
        planet: 'aurelia', title: "🧲 행성 자원 (Aurelia Resources)", 
        items: ['scrapMetal', 'magnet', 'chargedCrystal'] 
    },
    aurelia_mat: { 
        planet: 'aurelia', title: "🌑 특수 제련 (Aurelia Metals)", 
        items: ['heavyAlloy', 'fluxEnergy', 'nanoSteel'] 
    },
    aurelia_comp: { 
        planet: 'aurelia', title: "⚛️ 에너지 코어 (High-Tech)", 
        items: ['plasmaCore'] 
    },

    // === [3] 베리디안 (Veridian) 자원 그룹 ===
    veridian_raw: { 
        planet: 'veridian', title: "🌿 유기 자원 (Veridian Life)", 
        items: ['bioFiber', 'spore', 'yeast'] 
    },
    veridian_mat: { 
        planet: 'veridian', title: "🧪 바이오 가공 (Bio-Processing)", 
        items: ['livingWood', 'bioFuel', 'rootBrick', 'mutantCell', 'neuralFiber'] 
    },
    veridian_comp: { 
        planet: 'veridian', title: "🧬 유전 공학 (Evolutionary Tech)", 
        items: ['geneticCode', 'pheromone', 'biosphereCore'] 
    }
};

const buildingGroups = {
    extraction: {
        title: "🚜 채집 및 채굴 (Extraction)",
        // 자원을 직접 수집하거나 땅에서 퍼올리는 시설들
        ids: [
            0, 1, 2, 3, 20, 25, 28, 40, 41, 42, 43, 44, 45, 49, 51, 53, 54, // 지구
            100, 101, 102, 108, 115, 118,                                   // 아우렐리아
            200, 201, 202, 208, 210, 211, 220                               // 베리디안
        ]
    },
    refining: {
        title: "🔥 기초 공정 및 제련 (Refining)",
        // 원재료를 판, 벽돌, 강철, 화학물로 1차/2차 가공하는 시설들
        ids: [
            4, 5, 6, 7, 13, 16, 18, 21, 26, 29, 34, 48, 50, 52, 55, 56, 57, 59, 61, 62, 63, 64, // 지구
            103, 104, 106, 107, 110, 112, 113, 114, 116, 121,                                       // 아우렐리아
            203, 204, 205, 207, 209, 213, 215                                                   // 베리디안
        ]
    },
    production: {
        title: "🔬 첨단 제조 및 부품 (Manufacturing)",
        // 톱니, 회로, 나노봇, 유전코드 등 고차원 부품을 조립하는 시설들
        ids: [
            9, 15, 22, 24, 27, 31, 32, 33, 35, 36, 37, 38, 47, 58, 60, // 지구
            109, 119, 122,                                                 // 아우렐리아
            212, 214, 217, 218                                         // 베리디안
        ]
    },
    power: {
        title: "⚡ 에너지 발전 (Power Generation)",
        // 기지 운영에 필요한 에너지를 생산하는 모든 발전기들
        ids: [
            8, 14, 23, 30, 39, 46, // 지구
            105, 111, 117, 120,    // 아우렐리아
            206, 216, 219          // 베리디안
        ]
    }
};

let isGridInitialized = false;
function initResourceGrid() {
    // 행성이 바뀌었을 수도 있으므로, 매번 초기화하거나 행성 체크 로직이 필요함
    // 여기서는 간단히 행성이 바뀔 때마다 초기화되도록 처리
    if (isGridInitialized === gameData.currentPlanet) return;
    
    elements.resGrid.innerHTML = "";
    elements.resGrid.style.display = "block";

    for (const [key, group] of Object.entries(resourceGroups)) {
        // ⭐ 중요: 현재 행성에 해당하지 않는 그룹은 건너뜁니다.
        if (group.planet !== gameData.currentPlanet) continue;

        const titleContainer = document.createElement('div');
        titleContainer.className = 'res-category-title';
        titleContainer.innerHTML = `
            <span>${group.title} <span class="toggle-arrow">▼</span></span>
            <div class="title-ctrls"><span class="btn-size-toggle" data-key="${key}">슬림</span></div>
        `;
        
        const container = document.createElement('div');
        container.className = 'sub-res-grid';
        container.id = `grid-group-${key}`;

        titleContainer.querySelector('span').onclick = () => {
            titleContainer.classList.toggle('collapsed');
            container.classList.toggle('collapsed-content');
        };

        titleContainer.querySelector('.btn-size-toggle').onclick = (e) => {
            e.stopPropagation();
            container.classList.toggle('slim-mode');
            e.target.innerText = container.classList.contains('slim-mode') ? "기본" : "슬림";
        };

        elements.resGrid.appendChild(titleContainer);
        elements.resGrid.appendChild(container);
    }
    isGridInitialized = gameData.currentPlanet; // 현재 행성 저장
}

export function getResNameOnly(key) {
    const full = resNames[key];
    if (!full) return key;
    const parts = full.split(' ');
    return parts.length > 1 ? parts[1] : parts[0];
}

function formatNumber(num) {
    if (num == null || isNaN(num) || num === 0) return "0";
    
    // 1000 미만 처리
    if (num < 1000) {
        if (num < 10 && num % 1 !== 0) return num.toFixed(1); 
        return Math.round(num).toLocaleString();
    }

    // ⭐ 확장된 단위 리스트 (k:천, M:백만, B:십억, T:조, Qa:경, Qi:해, Sx:자, Sp:양, Oc:구, No:간, Dc:정...)
    const suffixes = [
        "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", 
        "Dc", "Ud", "Dd", "Td", "qad", "qid", "sxd", "spd", "Ocd", "Nod", "vg"
    ];

    // 지수 계산 (1000 단위로 몇 번째 단위인지 확인)
    const exp = Math.floor(Math.log10(num) / 3);
    const suffixIndex = exp - 1;

    // 단위를 넘어가는 너무 큰 숫자는 과학적 표기법(e+숫자)으로 처리
    if (suffixIndex >= suffixes.length) {
        return num.toExponential(2);
    }

    const suffix = suffixes[suffixIndex];
    const shortValue = num / Math.pow(10, exp * 3);

    // 소수점 처리: 100 이상이면 소수점 없음, 10 이상이면 1자리, 10 미만이면 2자리
    let formatted;
    if (shortValue >= 100) formatted = shortValue.toFixed(0);
    else if (shortValue >= 10) formatted = shortValue.toFixed(1);
    else formatted = shortValue.toFixed(2);

    // .00 또는 .0 제거 후 접미사 결합
    return formatted.replace(/\.0+$/, '') + suffix;
}

export function switchTab(tabName) {
    // 모든 뷰 숨기기 (Tech Tree 및 Legacy 추가)
    elements.viewDashboard.classList.add('hidden');
    elements.viewPower.classList.add('hidden');
    elements.viewResearch.classList.add('hidden');
    if (elements.viewTechTree) elements.viewTechTree.classList.add('hidden');
    if (elements.viewLegacy) elements.viewLegacy.classList.add('hidden'); // ⭐ 유산 뷰 숨김 추가

    // 모든 메뉴 활성화 해제
    elements.navDashboard.classList.remove('active');
    elements.navPower.classList.remove('active');
    elements.navResearch.classList.remove('active');
    if (elements.navTechTree) elements.navTechTree.classList.remove('active');
    if (elements.navLegacy) elements.navLegacy.classList.remove('active'); // ⭐ 유산 메뉴 해제 추가

    if (tabName === 'dashboard') {
        elements.viewDashboard.classList.remove('hidden');
        elements.navDashboard.classList.add('active');
        renderShop(cachedBuyCallback, Logic.getBuildingCost);
    } else if (tabName === 'power') {
        elements.viewPower.classList.remove('hidden');
        elements.navPower.classList.add('active');
    } else if (tabName === 'research') {
        elements.viewResearch.classList.remove('hidden');
        elements.navResearch.classList.add('active');
        renderResearchTab();
    } else if (tabName === 'tech-tree') {
        elements.viewTechTree.classList.remove('hidden');
        elements.navTechTree.classList.add('active');
        renderTechTree();
    } else if (tabName === 'legacy') { // ⭐ 우주 유산 탭 활성화
        if (elements.viewLegacy) elements.viewLegacy.classList.remove('hidden');
        if (elements.navLegacy) elements.navLegacy.classList.add('active');
        renderLegacyTab(); // 유산 리스트 그리기
    }
}

export function log(msg, isImportant = false) {
    if(elements.headerLog) {
        elements.headerLog.innerText = msg;
        elements.headerLog.style.opacity = 1;
        setTimeout(() => { elements.headerLog.style.opacity = 0.5; }, 3000);
    }
    if(elements.logList) {
        const li = document.createElement('li');
        li.className = 'log-entry';
        const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
        const contentClass = isImportant ? 'log-msg log-highlight' : 'log-msg';
        li.innerHTML = `<span class="log-time">${time}</span><span class="${contentClass}">${msg}</span>`;
        elements.logList.prepend(li);
        if (elements.logList.children.length > 50) elements.logList.removeChild(elements.logList.lastChild);
    }
}

function checkResourceDiscovery() {
    // 1. 현재 행성 데이터 가져오기
    const planetTemplate = getActivePlanetData();
    if(!gameData.unlockedResources || gameData.unlockedResources.length === 0) {
        gameData.unlockedResources = [...planetTemplate.initialResources];
    }

    const discovered = new Set(gameData.unlockedResources);

    // 2. 현재 지을 수 있는 건물의 입/출력 자원 발견
    gameData.buildings.forEach(b => {
        const req = b.reqLevel || 0;
        // 현재 집 레벨에서 지을 수 있는 건물만 대상으로 함
        if (gameData.houseLevel >= req) {
            if (b.inputs) Object.keys(b.inputs).forEach(k => { if(k !== 'energy') discovered.add(k); });
            if (b.outputs) Object.keys(b.outputs).forEach(k => { if(k !== 'energy') discovered.add(k); });
        }
    });
    
    // 3. 현재 보유량이 0보다 큰 자원 발견 (단, NaN이나 null 제외)
    for (let key in gameData.resources) {
        const val = gameData.resources[key];
        if (val > 0 && !isNaN(val) && key !== 'energy' && key !== 'energyMax') {
            discovered.add(key);
        }
    }
    
    gameData.unlockedResources = Array.from(discovered);
}


export function updateScreen(stats) {
    checkResourceDiscovery();
    
    // 1. 현재 행성에 맞는 그리드 구조 초기화 (행성 변경 시 재구축됨)
    initResourceGrid();

    const planet = gameData.currentPlanet || 'earth';
    const powerProd = gameData.resources.energy || 0;
    const powerReq = gameData.resources.energyMax || 0;
    const isPowerShort = powerProd < powerReq;

    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;
        if (!gameData.unlockedResources.includes(key)) continue;

        // ⭐ [핵심 추가] 현재 행성의 자원 그룹에 속하는지 확인
        let targetGroupId = null;
        for (const [groupKey, groupData] of Object.entries(resourceGroups)) {
            // 현재 행성(planet)과 그룹의 행성이 일치하고, 아이템 목록에 key가 있는 경우
            if (groupData.planet === planet && groupData.items.includes(key)) {
                targetGroupId = `grid-group-${groupKey}`;
                break;
            }
        }

        // 현재 행성에 속한 자원이 아니면 카드를 생성하거나 업데이트하지 않고 건너뜀
        if (!targetGroupId) continue;

        let card = document.getElementById(`card-${key}`);
        
        // 없으면 새로 생성하여 해당 행성의 그룹 컨테이너에 추가
        if (!card) {
            card = createResourceCard(key);
            const container = document.getElementById(targetGroupId);
            if(container) container.appendChild(card);
        }

        // 수치 업데이트 로직
        const val = gameData.resources[key] || 0;
        const net = (stats[key] ? stats[key].prod - stats[key].cons : 0);
        
        card.querySelector('.res-amount').innerText = formatNumber(val);
        const mpsEl = card.querySelector('.res-mps');

        let powerWarning = isPowerShort ? `<span style="color:#f1c40f; font-size:0.7rem;">⚡</span>` : "";

        if (stats[key] && stats[key].prod > 0 && stats[key].cons > 0) {
            mpsEl.innerHTML = `<span style="color:#2ecc71">+${formatNumber(stats[key].prod)}</span>|<span style="color:#e74c3c">-${formatNumber(stats[key].cons)}</span>/s${powerWarning}`;
        } else {
            let mpsValue = Math.abs(net);
            let mpsText = mpsValue < 10 && mpsValue > 0 ? net.toFixed(1) : formatNumber(net);
            
            if(net < 0) { mpsEl.style.color = "#e74c3c"; mpsEl.innerText = `▼ ${mpsText}/s`; }
            else if(net > 0) { mpsEl.style.color = "#2ecc71"; mpsEl.innerText = `▲ ${mpsText}/s`; }
            else { mpsEl.style.color = "#7f8c8d"; mpsEl.innerText = `+0.0/s`; }
            
            if (isPowerShort && net !== 0) mpsEl.innerHTML += powerWarning;
        }
    }
    
    // 시스템 UI들 업데이트
    updatePowerUI();
    if(!elements.viewResearch.classList.contains('hidden')) updateResearchButtons();
    checkUnlocks();
    updatePrestigeUI();
}
function updatePowerUI() {
    const prod = gameData.resources.energy || 0;
    const req = gameData.resources.energyMax || 0;
    const percent = req > 0 ? (prod / req) * 100 : 100;
    const powerColor = (prod >= req) ? '#2ecc71' : '#e74c3c';

    // 1. 상단 바 업데이트
    if(elements.powerDisplay) elements.powerDisplay.innerHTML = `<span style="color:#2ecc71">${formatNumber(prod)} MW</span> 생산 / <span style="color:#e74c3c">${formatNumber(req)} MW</span> 소비`;
    if(elements.powerBar) {
        elements.powerBar.style.width = `${Math.min(100, percent)}%`;
        elements.powerBar.style.backgroundColor = powerColor;
        if (prod < req) elements.powerBar.classList.add('power-low');
        else elements.powerBar.classList.remove('power-low');
    }
    // 대시보드 연동
    if (elements.dashPowerPanel && gameData.houseLevel >= 5) {
        elements.dashPowerPanel.classList.remove('hidden');
        elements.dashPowerText.innerHTML = `<span style="color:#2ecc71">${formatNumber(prod)}</span> / <span style="color:#e74c3c">${formatNumber(req)} MW</span>`;
        elements.dashPowerFill.style.width = `${Math.min(100, percent)}%`;
        elements.dashPowerFill.style.backgroundColor = powerColor;
    }

    const container = document.getElementById('power-breakdown-container');
    if (!container) return;
    if (!container.dataset.initialized) {
    container.innerHTML = ""; 
    container.style.background = "none"; // 배경 제거
    container.style.maxHeight = "none";  // 높이 제한 해제
    container.dataset.initialized = "true";
    }
    // 2. 카테고리별 루프
    for (const [groupKey, group] of Object.entries(buildingGroups)) {
        const ownedBuildings = gameData.buildings.filter(b => group.ids.includes(b.id) && b.count > 0);
        
        let sectionTitle = document.getElementById(`ctrl-title-${groupKey}`);
        let sectionGrid = document.getElementById(`ctrl-grid-${groupKey}`);

        if (ownedBuildings.length === 0) {
            if(sectionTitle) sectionTitle.style.display = "none";
            if(sectionGrid) sectionGrid.style.display = "none";
            continue;
        }

        if (!sectionTitle) {
            sectionTitle = document.createElement('div');
            sectionTitle.id = `ctrl-title-${groupKey}`;
            sectionTitle.className = 'build-category-title';
            sectionTitle.innerHTML = `${group.title} <span class="toggle-arrow">▼</span>`;
            sectionGrid = document.createElement('div');
            sectionGrid.id = `ctrl-grid-${groupKey}`;
            sectionGrid.className = 'sub-build-grid';
            sectionTitle.onclick = () => { sectionTitle.classList.toggle('collapsed'); sectionGrid.classList.toggle('collapsed-content'); };
            container.appendChild(sectionTitle);
            container.appendChild(sectionGrid);
        }
        sectionTitle.style.display = "flex";
        sectionGrid.style.display = "grid";

        ownedBuildings.forEach(b => {
            let ctrlCard = document.getElementById(`ctrl-card-${b.id}`);
            if (!ctrlCard) {
                ctrlCard = document.createElement('div');
                ctrlCard.id = `ctrl-card-${b.id}`;
                ctrlCard.className = 'shop-item';
                ctrlCard.style.cursor = "default";
                ctrlCard.innerHTML = `
                    <span class="si-name" style="font-size:0.85rem;"></span>
                    <span class="si-level" style="font-size:0.75rem; color:#ffd700;"></span>
                    <div class="si-desc" style="bottom:45px; right: 90px;"></div>
                    <div class="si-cost" style="top:auto; bottom:45px; right:14px; font-size:0.8rem;"></div>
                    <div class="si-ctrl-btns" style="position:absolute; bottom:8px; left:12px; right:12px; display:flex; gap:3px;">
                        <button class="b-adj" data-v="-10" style="flex:1; background:#444; color:#fff; border:none; border-radius:3px; cursor:pointer; padding:3px 0;">--</button>
                        <button class="b-adj" data-v="-1" style="flex:1; background:#e74c3c; color:#fff; border:none; border-radius:3px; cursor:pointer; font-weight:bold;">-</button>
                        <button class="b-adj" data-v="1" style="flex:1; background:#2ecc71; color:#fff; border:none; border-radius:3px; cursor:pointer; font-weight:bold;">+</button>
                        <button class="b-adj" data-v="10" style="flex:1; background:#444; color:#fff; border:none; border-radius:3px; cursor:pointer; padding:3px 0;">++</button>
                    </div>
                `;
                ctrlCard.querySelectorAll('.b-adj').forEach(btn => {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        window.adjustActiveCount(b.id, parseInt(btn.dataset.v));
                    };
                });
                sectionGrid.appendChild(ctrlCard);
            }

            const speedMult = Logic.getBuildingMultiplier(b.id);
            const consMult = Logic.getBuildingConsumptionMultiplier(b.id);
            const energyEff = Logic.getEnergyEfficiencyMultiplier(b.id);
            const isOn = b.activeCount > 0;

            let energyImpact = 0;
            const isProducer = b.outputs && b.outputs.energy;
            const isConsumer = b.inputs && b.inputs.energy;
            if (isProducer) energyImpact = b.outputs.energy * b.activeCount * speedMult;
            else if (isConsumer) energyImpact = b.inputs.energy * b.activeCount * speedMult * consMult * energyEff;

            let prodText = "가동 중지";
            if (isOn && b.outputs) {
                const resKey = Object.keys(b.outputs).find(k => k !== 'energy');
                if (resKey) prodText = `<span style="color:#2ecc71">▲ ${formatNumber(b.outputs[resKey] * b.activeCount * speedMult)}${getResNameOnly(resKey)}/s</span>`;
            }

            let energyText = "";
            if (isProducer) energyText = `<span style="color:#2ecc71">+${formatNumber(energyImpact)}MW</span>`;
            else if (isConsumer) energyText = `<span style="color:#e74c3c">-${formatNumber(energyImpact)}MW</span>`;

            ctrlCard.style.opacity = isOn ? "1" : "0.5";
            ctrlCard.querySelector('.si-name').innerText = b.name;
            ctrlCard.querySelector('.si-level').innerText = `${b.activeCount}/${b.count}`;
            ctrlCard.querySelector('.si-desc').innerHTML = prodText;
            ctrlCard.querySelector('.si-cost').innerHTML = energyText;
        });
    }
}

export function renderResearchTab() {
    const container = elements.viewResearch.querySelector('#research-list-container') || elements.viewResearch.querySelector('.action-box');
    if (!container) return;
    container.innerHTML = "";
    if (!gameData.researches) gameData.researches = [];

    const availableRes = [];
    const completedRes = [];
    const currentResearchList = getActiveResearch(); 

    currentResearchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id);
        const isPrereqDone = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;
        let isTargetVisible = true;
        if (r.type === 'building' || r.type === 'consumption' || r.type === 'energyEff') {
            isTargetVisible = r.target.some(targetId => {
                const b = gameData.buildings.find(build => build.id === targetId);
                return b && gameData.houseLevel >= (b.reqLevel || 0);
            });
        }
        if (isDone) completedRes.push(r);
        else if (isPrereqDone && isTargetVisible) availableRes.push(r);
    });

    if (availableRes.length > 0) renderResearchSection("🔬 진행 가능한 연구", availableRes, false, container);
    if (completedRes.length > 0) renderResearchSection("✅ 완료된 기술", completedRes, true, container);
    updateResearchButtons();
}

function renderResearchSection(titleText, list, isDone, parentContainer) {
    const title = document.createElement('div');
    title.className = 'research-section-title';
    title.innerHTML = `${titleText} (${list.length}) <span class="toggle-arrow">▼</span>`;

    const subGrid = document.createElement('div');
    subGrid.className = 'sub-build-grid'; // CSS와 이름 일치 확인

    title.onclick = () => {
        title.classList.toggle('collapsed');
        subGrid.classList.toggle('collapsed-content');
    };

    parentContainer.appendChild(title);
    parentContainer.appendChild(subGrid);
    list.forEach(r => subGrid.appendChild(createResearchElement(r, isDone)));
}

// 개별 연구 버튼 생성 함수
function createResearchElement(r, isDone) {
    const div = document.createElement('div');
    div.className = `shop-item research-item ${isDone ? 'done disabled' : ''}`;
    div.id = `research-${r.id}`;
    
    let costTxt = Object.entries(r.cost).map(([k, v]) => `${formatNumber(v)}${getResNameOnly(k)}`).join(' ');
    let warning = (r.type === 'building' && r.value > 1) ? `<br><span style="color:#ff7675; font-size:0.7rem;">⚠️ 속도 증가 시 재료 소모량 비례 증가</span>` : "";

    div.innerHTML = `
        <span class="si-name">${r.name}</span>
        <span class="si-level">${isDone ? '✓' : ''}</span>
        <div class="si-desc">${r.desc}${warning}</div>
        <div class="si-cost">${isDone ? '연구 완료' : costTxt}</div>
    `;

    if (!isDone) {
        div.onclick = (e) => {
            e.stopPropagation();
            
            // 1. 결과를 변수에 담습니다.
            const result = Logic.tryBuyResearch(r.id); 
            
            // 2. ⭐ 'result'가 아니라 'result.success'가 true인지 확인해야 합니다!
            if (result.success) { 
                log(`🔬 [연구 완료] ${r.name}`, true);
                renderResearchTab();
                renderShop(cachedBuyCallback, Logic.getBuildingCost);
            } else {
                // 3. 실패했을 때 어떤 재료가 부족한지 로그 출력
                const missingNames = result.missing.map(key => getResNameOnly(key)).join(', ');
                log(`❌ 연구 불가 (부족: ${missingNames})`);
            }
        };
    }
    return div;
}

function updateResearchButtons() {
    getActiveResearch().forEach(r => {
        const div = document.getElementById(`research-${r.id}`);
        if(!div || gameData.researches.includes(r.id)) return;
        let canBuy = true;
        for(let k in r.cost) { if((gameData.resources[k] || 0) < r.cost[k]) canBuy = false; }
        if(canBuy) div.classList.remove('disabled'); else div.classList.add('disabled');
    });
}

function createResourceCard(key) {
    const div = document.createElement('div');
    div.className = `res-card ${key}`;
    div.id = `card-${key}`;
    div.innerHTML = `<div class="res-header"><span class="res-name">${resNames[key] || key}</span></div><div class="res-body"><span style="font-size:0.7rem; color:#666;">보유</span><h3 class="res-amount">0</h3></div><div class="res-footer"><small class="res-mps">+0.0/s</small></div>`;
    return div;
}

function checkUnlocks() {
    const p = gameData.currentPlanet || 'earth', disc = gameData.unlockedResources || [];
    const toggle = (el, show) => el && el.classList.toggle('hidden', !show);
    // ⭐ [수정] 유산 탭 해금 조건: 집 50렙 OR 환생 1회 이상 OR 현재 외계 행성 거주 중
    const isLegacy = (gameData.houseLevel >= 50 || (gameData.prestigeLevel || 0) > 0 || p !== 'earth');
    // 중도 탈출
    const isPrestiged = (gameData.prestigeLevel > 0 || p !== 'earth'); // 환생했거나 지구가 아니면 고수
    
    // 1. 행성별 이름 매핑 (3번째 버튼은 지구 전용)
    const names = { earth: ["🌲 나무 베기", "🪨 돌 캐기", "⚫ 석탄 캐기"], aurelia: ["🔩 고철 줍기", "🧲 자석 수집", ""], veridian: ["🌿 섬유 채집", "🍄 포자 채취", ""] }[p];
    [elements.btns.wood, elements.btns.stone, elements.btns.coal].forEach((btn, i) => { if(btn) btn.innerText = names[i]; });

    // 2. 버튼 노출 제어 (행성 체크 추가)
    toggle(elements.btns.wood, true);
    // 두 번째 버튼: 지구는 발견 시 노출, 외계 행성은 시작부터 노출 (첫 단계 자원이므로)
    toggle(elements.btns.stone, p !== 'earth' || disc.includes('stone'));
    // 석탄, 판자, 철광석, 구리광석은 '지구'일 때만 발견 여부에 따라 노출
    toggle(elements.btns.coal, p === 'earth' && disc.includes('coal'));
    toggle(elements.btns.plank, p === 'earth' && disc.includes('plank'));
    toggle(elements.btns.ironOre, p === 'earth' && disc.includes('ironOre'));
    toggle(elements.btns.copperOre, p === 'earth' && disc.includes('copperOre'));

    // 3. 시스템 메뉴 노출
    if(elements.navPower) elements.navPower.style.display = (gameData.houseLevel >= 5 || p !== 'earth') ? 'flex' : 'none';
    
    // ⭐ [핵심] 우주 유산 탭 노출 강제 활성화
    if(elements.navLegacy) elements.navLegacy.style.display = isLegacy ? 'flex' : 'none';
    const lCat = document.getElementById('legacy-cat'); 
    if(lCat) lCat.style.display = isLegacy ? 'block' : 'none';

    // ⭐ [추가] 긴급 탈출 버튼 노출 제어
    const sBtn = document.getElementById('btn-become-star');
    if(sBtn) {
        // 현재 행성이 지구가 아닐 때만(외계 행성일 때만) 보임
        sBtn.style.display = (p !== 'earth') ? 'block' : 'none';
    }
}

export function renderShop(onBuyCallback, getCostFunc) {
    if(onBuyCallback) cachedBuyCallback = onBuyCallback;
    if (!elements.buildingList) return;
    elements.buildingList.innerHTML = "";
    elements.buildingList.style.display = "block";

    const wood = gameData.resources.wood || 0;
    const isStoneUnlocked = (gameData.houseLevel >= 1 || wood >= 10 || (gameData.buildings[0] && gameData.buildings[0].count > 0));

    for (const [groupKey, group] of Object.entries(buildingGroups)) {
        const visibleBuildings = gameData.buildings.filter(b => {
            if (!group.ids.includes(b.id)) return false;
            const req = b.reqLevel || 0;
            if (req === 0.5) return isStoneUnlocked;
            return gameData.houseLevel >= req;
        });

        if (visibleBuildings.length === 0) continue;

        const title = document.createElement('div');
        title.className = 'build-category-title';
        title.innerHTML = `${group.title} <span class="toggle-arrow">▼</span>`;
        
        const subGrid = document.createElement('div');
        subGrid.className = 'sub-build-grid'; // CSS와 이름 일치 확인

        title.onclick = () => {
            title.classList.toggle('collapsed');
            subGrid.classList.toggle('collapsed-content');
        };

        elements.buildingList.appendChild(title);
        elements.buildingList.appendChild(subGrid);

        visibleBuildings.forEach(b => {
            const index = gameData.buildings.findIndex(build => build.id === b.id);
            subGrid.appendChild(createBuildingElement(b, index, getCostFunc));
        });
    }
    updateShopButtons(getCostFunc);
}

function createBuildingElement(b, index, getCostFunc) {
    const div = document.createElement('div');
    div.className = `shop-item`;
    div.id = `build-${index}`;
    
    const cost = getCostFunc(b);
    let costTxt = Object.entries(cost).map(([k, v]) => `${formatNumber(v)}${getResNameOnly(k)}`).join(' ');

    let speedMult = Logic.getBuildingMultiplier(b.id);
    let consMult = Logic.getBuildingConsumptionMultiplier(b.id);
    let energyEff = Logic.getEnergyEfficiencyMultiplier(b.id);

    let inArr = b.inputs ? Object.entries(b.inputs).map(([k,v]) => {
        let finalVal = v * speedMult * consMult;
        if (k === 'energy') finalVal *= energyEff;
        return `${formatNumber(finalVal)}${k === 'energy' ? '⚡' : getResNameOnly(k)}`;
    }) : [];
    
    let outArr = b.outputs ? Object.entries(b.outputs).map(([k,v]) => `${formatNumber(v * speedMult)}${k === 'energy' ? '⚡' : getResNameOnly(k)}`) : [];
    

    let processTxt = "";
    if (inArr.length > 0) processTxt += `<span style="color:#e74c3c">-${inArr.join(',')}</span> `;
    if (outArr.length > 0) processTxt += `➡<span style="color:#2ecc71">+${outArr.join(',')}</span>/s`;

    const active = b.activeCount || 0;
    const total = b.count || 0;
    // 가동/보유 정보만 이름 옆에 작게 표시
    div.innerHTML = `
        <span class="si-name">${b.name} <small style="color:#8892b0; font-weight:normal;">(${b.activeCount}/${b.count})</small></span>
        <span class="si-level">Lv.${b.count}</span>
        <div class="si-desc">${processTxt}</div>
        <div class="si-cost">${costTxt}</div>
    `;
    
    div.onclick = () => { if(cachedBuyCallback) cachedBuyCallback(index); };
    return div;
}

export function updateShopButtons(getCostFunc) {
    gameData.buildings.forEach((b, index) => {
        const div = document.getElementById(`build-${index}`);
        if(!div) return;
        const cost = getCostFunc(b);
        let canBuy = true;
        for(let k in cost) { if((gameData.resources[k] || 0) < cost[k]) canBuy = false; }
        if (canBuy) div.classList.remove('disabled'); else div.classList.add('disabled');
    });
}

export function updatePrestigeUI() {
    // gameData가 없거나 prestigeLevel이 없는 경우를 대비해 안전하게 가져옴
    const level = (gameData && gameData.prestigeLevel) ? gameData.prestigeLevel : 0;
    
    const headerPrestige = document.getElementById('header-prestige');
    const sideSmall = document.querySelector('.logo-area small');

    if (level > 0) {
        // --- 환생 레벨이 1 이상일 때 (황금색 표시) ---
        const prestigeText = `(⭐Lv.${level})`;

        if (headerPrestige) {
            headerPrestige.innerText = prestigeText;
            headerPrestige.style.display = "inline"; // 보이게 함
        }

        if (sideSmall) {
            sideSmall.innerHTML = `우주 항해 숙련도 <b style="color:#f1c40f;">Lv.${level}</b>`;
            sideSmall.style.color = "#f1c40f";
        }
    } else {
        // --- 환생 전(Lv.0)이거나 초기화되었을 때 (기본값 복구) ---
        if (headerPrestige) {
            headerPrestige.innerText = "";
            headerPrestige.style.display = "none"; // 공간 차지하지 않게 숨김
        }

        if (sideSmall) {
            sideSmall.innerText = "IDLE GAME"; // 원래 초기 텍스트
            sideSmall.style.color = "#f39c12"; // 원래 주황색
        }
    }
}


export function updateHouseUI(onUpgrade) {
    const stages = getActiveStages(); // ⭐ 현재 행성의 단계 리스트를 가져옴
    const nextStage = stages[gameData.houseLevel + 1];
    const currentStage = stages[gameData.houseLevel];
    
    // 1. 현재 단계 이름 및 설명 업데이트
    if(elements.houseName) elements.houseName.innerText = `Lv.${gameData.houseLevel} ${currentStage.name}`;
    if(elements.houseDesc) elements.houseDesc.innerText = currentStage.desc;

    const btnContainer = elements.upgradeBtn.parentElement; // 버튼을 감싸는 부모 div

    if (nextStage) {
        // --- [일반 진행 모드: Lv.0 ~ Lv.49] ---
        elements.upgradeBtn.style.display = "flex";
        
        // 요구 자원 텍스트 생성
        const reqTxt = Object.entries(nextStage.req)
            .filter(([k]) => k !== 'energy')
            .map(([k, v]) => `${getResNameOnly(k)} ${formatNumber(v)}`)
            .join(', ');

        elements.upgradeBtn.innerText = `⬆️ ${nextStage.name} (${reqTxt})`;
        
        // 자원 충족 여부 확인 (버튼 활성화/비활성화)
        let canUp = true;
        for(let k in nextStage.req) {
            if (k === 'energy') { 
                if((gameData.resources.energy || 0) < nextStage.req[k]) canUp = false; 
            } else { 
                if((gameData.resources[k] || 0) < nextStage.req[k]) canUp = false; 
            }
        }
        elements.upgradeBtn.disabled = !canUp;
        
        // 클릭 시 업그레이드 실행
        elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        
        // 환생 후 다시 시작할 때 엔딩 선택지 버튼이 남아있다면 제거
        const choiceDiv = document.getElementById('ending-choices');
        if(choiceDiv) choiceDiv.remove();

    } else {
        // --- [엔딩 달성 모드: Lv.50] ---
        elements.upgradeBtn.style.display = "none"; // 기존 업그레이드 버튼 숨김
        
        // 엔딩 선택지 버튼 세트 생성 (중복 생성 방지)
        if (!document.getElementById('ending-choices')) {
            const choiceDiv = document.createElement('div');
            choiceDiv.id = 'ending-choices';
            choiceDiv.style.cssText = "display:flex; gap:10px; width:100%;";

            choiceDiv.innerHTML = `
                <button id="btn-prestige-final" class="prestige-ready" style="flex:1; height:95px; font-weight:bold; border-radius:6px; cursor:pointer;">
                    ✨ 우주 유산 남기기<br><small>(데이터 +3 및 환생)</small>
                </button>
                <button id="btn-new-world" style="flex:1; height:95px; background:#4db5ff; color:#fff; font-weight:bold; border:none; border-radius:6px; cursor:pointer;">
                    🌌 새로운 세상 탐사<br><small>(beta 벨런스가 안맞을수 있습니다)</small>
                </button>
            `;
            btnContainer.appendChild(choiceDiv);

            // 1. 환생 버튼 클릭 이벤트
            document.getElementById('btn-prestige-final').onclick = () => {
                if(confirm("지구를 떠나시겠습니까? 모든 자원과 건물은 초기화되지만 영구적인 유산 보너스를 얻습니다.")) {
                    if (typeof window.performPrestige === 'function') {
                        window.performPrestige();
                    } else {
                        console.error("performPrestige 함수가 등록되지 않았습니다.");
                    }
                }
            };

            // 2. 시즌 2 버튼 클릭 이벤트
            document.getElementById('btn-new-world').onclick = () => {
            showPlanetSelection(); // 아래 정의할 팝업 함수 호출
            };
        }
    }
}

// 2. 연구 계통도 깊이 계산 함수
// 1. [수정] 연구 깊이(티어) 계산 함수 (현재 행성 리스트를 참조하도록 보정)
function getResearchDepth(id) {
    const currentList = getActiveResearch(); // ⭐ 현재 행성의 연구 목록 가져오기
    const research = currentList.find(r => r.id === id);
    if (!research || !research.reqResearch) return 0;
    return 1 + getResearchDepth(research.reqResearch);
}

// 2. [수정] 기술 계통도 렌더링 함수 (전체 교체)
export function renderTechTree() {
    const container = document.getElementById('tech-tree-content');
    if (!container) return;
    container.innerHTML = ""; // 기존 내용 초기화

    const currentList = getActiveResearch(); // ⭐ 현재 행성의 연구 목록
    if (!currentList || currentList.length === 0) {
        container.innerHTML = "<p style='color:#666; padding:20px;'>이 행성에는 아직 기록된 기술 문서가 없습니다.</p>";
        return;
    }

    // 티어별 그룹화
    const tiers = {};
    currentList.forEach(r => {
        const depth = getResearchDepth(r.id);
        if (!tiers[depth]) tiers[depth] = [];
        tiers[depth].push(r);
    });

    const sortedDepths = Object.keys(tiers).sort((a, b) => a - b);
    let lastTierName = "";

    // 사용자 기획안에 따른 티어 명칭 매핑
    const tierNames = {
        0: "Tier 1: 생존의 시작", 1: "Tier 1: 생존의 시작",
        2: "Tier 2: 원시 산업", 3: "Tier 2: 원시 산업",
        4: "Tier 3: 전기 및 회로 시대", 5: "Tier 3: 전기 및 회로 시대",
        6: "Tier 4: 화학 및 정유", 7: "Tier 4: 화학 및 정유",
        8: "Tier 5: 첨단 소재 및 티타늄", 9: "Tier 5: 첨단 소재 및 티타늄",
        10: "Tier 6: 지구 이별 준비"
    };

    sortedDepths.forEach(depth => {
        const currentTierName = tierNames[depth] || `Tier ${parseInt(depth / 2) + 1}: 심화 기술`;

        // 티어 헤더 생성 (이름이 바뀔 때만)
        if (currentTierName !== lastTierName) {
            const header = document.createElement('div');
            header.className = 'tree-tier-header';
            header.innerText = currentTierName;
            container.appendChild(header);
            lastTierName = currentTierName;
        }

        const nodesContainer = document.createElement('div');
        nodesContainer.className = 'tree-nodes-container';

        tiers[depth].forEach(r => {
            const isDone = gameData.researches.includes(r.id);
            const isPrereqDone = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;

            const node = document.createElement('div');
            node.className = `tree-node ${isDone ? 'done' : (isPrereqDone ? 'available' : 'locked')}`;

            // 부모 연구 이름 찾기
            const parent = currentList.find(p => p.id === r.reqResearch);
            const parentName = parent ? `[${parent.name}]에서 연결` : "시작 기술";

            node.innerHTML = `
                <div class="tree-node-parent">${parentName}</div>
                <span class="tree-node-name">${r.name}</span>
                <span class="tree-node-status">${isDone ? '✅ 완료' : (isPrereqDone ? '💡 연구 가능' : '🔒 잠김')}</span>
            `;

            // 클릭 시 기술 연구 탭으로 이동
            if (isPrereqDone && !isDone) {
                node.onclick = () => {
                    switchTab('research');
                    // 연구소 탭에서 해당 항목을 찾아 강조(반짝임 등)할 수 있도록 스크롤
                    setTimeout(() => {
                        const targetEl = document.getElementById(`research-${r.id}`);
                        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                };
            }
            nodesContainer.appendChild(node);
        });
        container.appendChild(nodesContainer);
    });
}

// 레거시 업그레이드 탭 렌더링 함수

export function renderLegacyTab() {
    const listContainer = document.getElementById('legacy-upgrade-list');
    const dataDisplay = document.getElementById('cosmic-data-count');
    
    if (!listContainer || !dataDisplay) return;

    // 보유 포인트 표시
    dataDisplay.innerText = formatNumber(gameData.cosmicData || 0);
    listContainer.innerHTML = "";

    // 유산 목록 출력
    legacyList.forEach(u => {
        const isBought = gameData.legacyUpgrades.includes(u.id);
        const canAfford = (gameData.cosmicData || 0) >= u.cost;
        
        const div = document.createElement('div');
        // 구매 완료면 done, 돈 없으면 disabled 클래스 부여
        div.className = `shop-item ${isBought ? 'done' : (canAfford ? '' : 'disabled')}`;
        
        div.innerHTML = `
            <span class="si-name">${u.name}</span>
            <span class="si-level">${isBought ? '✅ 적용 중' : '미해금'}</span>
            <div class="si-desc">${u.desc}</div>
            <div class="si-cost">${isBought ? '영구 보너스' : '비용: ' + u.cost + ' 데이터'}</div>
        `;

        // 아직 안 샀고 돈이 있으면 클릭 이벤트 연결
        if (!isBought && canAfford) {
            div.style.cursor = "pointer";
            div.onclick = () => {
                if (confirm(`'${u.name}' 보너스를 해금하시겠습니까?`)) {
                    gameData.cosmicData -= u.cost;
                    gameData.legacyUpgrades.push(u.id);
                    log(`✨ 유산 보너스 해금: ${u.name}`, true);
                    // 1. 현재 유산 탭 새로고침
                    renderLegacyTab(); 
                    
                    // 2. ⭐ [중요] 상점(건물 목록)의 가격 텍스트도 즉시 갱신
                    // cachedBuyCallback과 Logic.getBuildingCost를 사용하여 상점을 다시 그립니다.
                    if (typeof renderShop === 'function') {
                        renderShop(cachedBuyCallback, Logic.getBuildingCost);
                    }

                }
            };
        }
        listContainer.appendChild(div);
    });
}


export function showPlanetSelection() {
    // 이미 팝업이 있다면 제거
    const oldModal = document.getElementById('planet-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'planet-modal';
    // 스타일은 이전 드린 것과 동일하게 적용 (중앙 정렬 팝업)
    modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#16213e; padding:30px; border:2px solid #4db5ff; border-radius:15px; z-index:10000; text-align:center; color:white; min-width:350px; box-shadow:0 0 50px rgba(0,0,0,0.8);";
    
    modal.innerHTML = `
        <h2 style="color:#4db5ff; margin-bottom:10px;">어디로 탐사하시겠습니까?</h2>
        <p style="margin-bottom:25px; color:#8892b0; font-size:0.85rem;">행성 진입 시 기존 자원과 건물은 리셋되지만,<br><b>우주 숙련도(Prestige)와 유산</b>은 유지됩니다.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button onclick="window.landOnPlanet('aurelia')" style="padding:15px; background:#2c3e50; border:1px solid #7f8c8d; border-radius:8px; cursor:pointer; color:white;">
                <div style="font-size:1.5rem;">🔩</div>
                <strong>아우렐리아 (Aurelia)</strong><br><small>금속과 자성이 가득한 황무지</small>
            </button>
            <button onclick="window.landOnPlanet('veridian')" style="padding:15px; background:#1b3d2f; border:1px solid #27ae60; border-radius:8px; cursor:pointer; color:white;">
                <div style="font-size:1.5rem;">🌿</div>
                <strong>베리디안 (Veridian)</strong><br><small>거대 생명체와 유기물의 정글</small>
            </button>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top:10px; background:none; border:none; color:#556; cursor:pointer; text-decoration:underline;">돌아가기</button>
        </div>
    `;
    document.body.appendChild(modal);
}









// 오프라인 보고서 모달 표시 함수
export function showOfflineReport(seconds, statsBefore) {
    const modal = document.getElementById('offline-modal');
    const timeText = document.getElementById('offline-time-text');
    const reportDiv = document.getElementById('offline-report');
    
    if (!modal) return;
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    timeText.innerText = `${hours}시간 ${mins}분 동안의 성과입니다.`;
    
    // 이전에 계산된 순수 MPS(stats)를 활용해 획득량 표시
    let reportHtml = "";
    for (let res in gameData.resources) {
        const net = (Logic.calculateNetMPS()[res]?.prod || 0) - (Logic.calculateNetMPS()[res]?.cons || 0);
        if (net > 0) {
            const gain = net * seconds;
            reportHtml += `<div>${resNames[res] || res}: <span style="color:#2ecc71">+${formatNumber(gain)}</span></div>`;
        }
    }
    
    reportDiv.innerHTML = reportHtml || "획득한 자원이 없습니다.";
    modal.classList.remove('hidden');
}





export function triggerWarpEffect(destName, callback) {
    const overlay = document.getElementById('warp-overlay');
    const destMsg = document.getElementById('warp-dest-msg');
    
    if (!overlay) return callback(); // 요소 없으면 바로 콜백 실행

    destMsg.innerText = `목적지: ${destName}`;
    overlay.style.display = 'flex';
    
    // 1. 화면 페이드 인
    setTimeout(() => overlay.classList.add('active'), 10);

    // 2. 충분히 연출을 보여준 뒤 데이터 처리(callback) 실행
    setTimeout(() => {
        callback(); 
    }, 2000);
}







export const uiElements = elements;