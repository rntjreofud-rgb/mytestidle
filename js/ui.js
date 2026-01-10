// js/ui.js 전체 교체

import { gameData, houseStages, researchList } from './data.js';
import * as Logic from './logic.js'; // ⭐ Logic이 반드시 있어야 계산을 다시 합니다.

// 내부에서 구매 콜백 함수를 기억하기 위한 변수
let cachedBuyCallback = null;


const elements = {
    viewDashboard: document.getElementById('view-dashboard'),
    viewPower: document.getElementById('view-power'),
    viewResearch: document.getElementById('view-research'),
    navDashboard: document.getElementById('nav-dashboard'),
    navPower: document.getElementById('nav-power'),
    navResearch: document.getElementById('nav-research'),
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
    quantumData: "💾 양자데이터", gravityModule: "🛸 중력모듈"
};

const resourceGroups = {
    raw: {
        title: "⛏️ 원자재 (Raw Materials)",
        items: ['wood', 'stone', 'coal', 'ironOre', 'copperOre', 'oil', 'titaniumOre', 'uraniumOre']
    },
    material: {
        title: "🧱 가공 자재 (Materials)",
        items: ['plank', 'brick', 'glass', 'concrete', 'ironPlate', 'copperPlate', 'steel', 'titaniumPlate', 'advAlloy', 'sulfur', 'plastic']
    },
    component: {
        title: "⚙️ 부품 및 첨단 (High-Tech)",
        items: ['gear', 'circuit', 'battery', 'optics', 'advCircuit', 'processor', 'fuelCell', 'rocketFuel', 'nanobots', 'aiCore', 'quantumData', 'gravityModule', 'warpCore']
    }
};

let isGridInitialized = false;
function initResourceGrid() {
    if (isGridInitialized) return;
    
    elements.resGrid.innerHTML = ""; // 기존 그리드 초기화
    elements.resGrid.style.display = "block"; // CSS grid 속성 제거 (블록으로 변경)

    // 3개의 섹션 생성
    for (const [key, group] of Object.entries(resourceGroups)) {
        // 제목
        const title = document.createElement('div');
        title.className = 'res-category-title';
        title.innerText = group.title;
        elements.resGrid.appendChild(title);

        // 서브 그리드 컨테이너
        const container = document.createElement('div');
        container.className = 'sub-res-grid';
        container.id = `grid-group-${key}`;
        elements.resGrid.appendChild(container);
    }
    isGridInitialized = true;
}


function formatNumber(num) {
    if (num == null || isNaN(num)) return "0";
    
    // 1000 미만의 작은 숫자 처리
    if (num < 1000) {
        if (num === 0) return "0";
        // 소숫점이 있고 10보다 작은 경우 (예: 0.8, 1.5 등) 소숫점 1자리까지 표시
        if (num < 10 && num % 1 !== 0) return num.toFixed(1); 
        // 그 외에는 반올림하여 정수로 표시
        return Math.round(num).toLocaleString();
    }

    // 1000 이상의 큰 숫자 처리 (k, m, b... 접미사)
    const suffixes = ["k", "m", "b", "t", "q"];
    const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
    let shortValue = parseFloat((suffixNum != 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    return shortValue + suffixes[suffixNum - 1];
}

export function switchTab(tabName) {
    elements.viewDashboard.classList.add('hidden');
    elements.viewPower.classList.add('hidden');
    elements.viewResearch.classList.add('hidden');
    elements.navDashboard.classList.remove('active');
    elements.navPower.classList.remove('active');
    elements.navResearch.classList.remove('active');

    if (tabName === 'dashboard') {
        elements.viewDashboard.classList.remove('hidden');
        elements.navDashboard.classList.add('active');
        // ⭐ 저장된 콜백을 사용하여 상점을 다시 그림
        renderShop(cachedBuyCallback, Logic.getBuildingCost);
    } else if (tabName === 'power') {
        elements.viewPower.classList.remove('hidden');
        elements.navPower.classList.add('active');
    } else if (tabName === 'research') {
        elements.viewResearch.classList.remove('hidden');
        elements.navResearch.classList.add('active');
        renderResearchTab();
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
    if(!gameData.unlockedResources) gameData.unlockedResources = ['wood', 'stone', 'plank'];
    for (let key in gameData.resources) {
        if (key === 'energy' || key === 'energyMax') continue;
        if (gameData.unlockedResources.includes(key)) continue;
        if (gameData.resources[key] > 0) {
            gameData.unlockedResources.push(key);
            continue;
        }
        gameData.buildings.forEach(b => {
            const req = b.reqLevel || 0;
            const isVisible = (req === 0.5 && (gameData.houseLevel >= 1 || (gameData.resources.wood || 0) >= 10)) || (gameData.houseLevel >= req);
            if (isVisible) {
                if (b.inputs && b.inputs[key] !== undefined) gameData.unlockedResources.push(key);
                if (b.outputs && b.outputs[key] !== undefined) gameData.unlockedResources.push(key);
            }
        });
    }
}


export function updateScreen(stats) {
    checkResourceDiscovery();
    
    // 그리드 구조가 안 잡혀있으면 잡기
    initResourceGrid();

    // 전력 상태 확인
    const powerProd = gameData.resources.energy || 0;
    const powerReq = gameData.resources.energyMax || 0;
    const isPowerShort = powerProd < powerReq;

    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;
        if (!gameData.unlockedResources.includes(key)) continue;

        // 카드가 이미 있는지 확인
        let card = document.getElementById(`card-${key}`);
        
        // 없으면 새로 생성하여 올바른 그룹에 넣기
        if (!card) {
            card = createResourceCard(key);
            
            // 어느 그룹인지 찾기
            let targetGroupId = 'grid-group-raw'; // 기본값
            for (const [groupKey, groupData] of Object.entries(resourceGroups)) {
                if (groupData.items.includes(key)) {
                    targetGroupId = `grid-group-${groupKey}`;
                    break;
                }
            }
            
            // 해당 그룹 컨테이너에 추가
            const container = document.getElementById(targetGroupId);
            if(container) container.appendChild(card);
        }

        // 수치 업데이트 (기존 로직 동일)
        const val = gameData.resources[key] || 0;
        const net = (stats[key].prod - stats[key].cons);
        
        card.querySelector('.res-amount').innerText = formatNumber(val);
        const mpsEl = card.querySelector('.res-mps');

        let powerWarning = isPowerShort ? `<span style="color:#f1c40f; font-size:0.7rem;">⚡</span>` : "";

        if (stats[key].prod > 0 && stats[key].cons > 0) {
            mpsEl.innerHTML = `<span style="color:#2ecc71">+${formatNumber(stats[key].prod)}</span>|<span style="color:#e74c3c">-${formatNumber(stats[key].cons)}</span>/s${powerWarning}`;
        } else {
            let mpsText = Math.abs(net) < 10 ? net.toFixed(1) : formatNumber(net);
            if(net < 0) { mpsEl.style.color = "#e74c3c"; mpsEl.innerText = `▼ ${mpsText}/s`; }
            else if(net > 0) { mpsEl.style.color = "#2ecc71"; mpsEl.innerText = `▲ ${mpsText}/s`; }
            else { mpsEl.style.color = "#7f8c8d"; mpsEl.innerText = `+0.0/s`; }
            
            if (isPowerShort && net !== 0) mpsEl.innerHTML += powerWarning;
        }
    }
    updatePowerUI();
    if(!elements.viewResearch.classList.contains('hidden')) updateResearchButtons();
    checkUnlocks();
}

function updatePowerUI() {
    const prod = gameData.resources.energy || 0;
    const req = gameData.resources.energyMax || 0;
    
    // 1. 상단 바 업데이트
    if(elements.powerDisplay) elements.powerDisplay.innerHTML = `<span style="color:#2ecc71">${formatNumber(prod)} MW</span> 생산 / <span style="color:#e74c3c">${formatNumber(req)} MW</span> 소비`;
    
    if(elements.powerBar) {
        let percent = req > 0 ? (prod / req) * 100 : 100;
        elements.powerBar.style.width = `${Math.min(100, percent)}%`;
        if (prod < req) {
            elements.powerBar.classList.add('power-low');
            elements.powerBar.style.backgroundColor = '#e74c3c';
        } else {
            elements.powerBar.classList.remove('power-low');
            elements.powerBar.style.backgroundColor = '#2ecc71';
        }
    }

    // 2. 상세 내역 렌더링 (DOM 재활용 방식)
    const container = document.getElementById('power-breakdown-container');
    if (!container) return;

    // 테이블 틀 생성 (최초 1회)
    let table = container.querySelector('table');
    if (!table) {
        container.innerHTML = `
            <table style="width:100%; border-collapse: collapse; font-size: 0.85rem; table-layout: fixed;">
                <thead>
                    <tr style="border-bottom: 1px solid #444; color: #8892b0;">
                        <th style="text-align:left; padding: 8px; width: 40%;">건물명</th>
                        <th style="text-align:center; padding: 8px; width: 15%;">개수</th>
                        <th style="text-align:center; padding: 8px; width: 25%;">전원 제어</th>
                        <th style="text-align:right; padding: 8px; width: 20%;">에너지</th>
                    </tr>
                </thead>
                <tbody id="power-list-body"></tbody>
            </table>`;
        table = container.querySelector('table');
    }

    const tbody = container.querySelector('#power-list-body');

    // 현재 존재하는 건물 ID 목록 (청소용)
    const currentBuildingIds = new Set();

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            const speedMult = Logic.getBuildingMultiplier(b.id);
            const consMult = Logic.getBuildingConsumptionMultiplier(b.id);
            const energyEff = Logic.getEnergyEfficiencyMultiplier(b.id);
            
            const isProducer = b.outputs && b.outputs.energy;
            const isConsumer = b.inputs && b.inputs.energy;

            if (!isProducer && !isConsumer) return;

            currentBuildingIds.add(b.id);

            // 에너지 값 계산
            let energyVal = 0;
            let isPlus = false;
            
            // 켜져 있을 때만 계산
            if (b.on !== false) { 
                if (isProducer) {
                    energyVal = b.outputs.energy * b.count * speedMult;
                    isPlus = true;
                } else {
                    energyVal = b.inputs.energy * consMult * energyEff * b.count * speedMult;
                }
            }

            // --- DOM 요소 찾기 또는 생성 ---
            let row = document.getElementById(`pwr-row-${b.id}`);
            
            if (!row) {
                row = document.createElement('tr');
                row.id = `pwr-row-${b.id}`;
                row.style.borderBottom = "1px solid rgba(255,255,255,0.05)";
                row.style.transition = "opacity 0.2s"; // 깜빡임 부드럽게
                
                // 셀 구조 생성
                row.innerHTML = `
                    <td class="p-name" style="padding: 8px; vertical-align: middle;"></td>
                    <td class="p-count" style="text-align:center; padding: 8px; vertical-align: middle; font-weight:bold;"></td>
                    <td class="p-ctrl" style="text-align:center; padding: 8px; vertical-align: middle;">
                        <div style="display:inline-flex; gap:4px;"></div>
                    </td>
                    <td class="p-energy" style="text-align:right; padding: 8px; vertical-align: middle;"></td>
                `;

                // 버튼 생성 (HTML 문자열 아님, 객체 직접 생성)
                const btnOn = document.createElement('button');
                btnOn.innerText = "ON";
                btnOn.style.cssText = "padding: 4px 8px; border-radius: 4px 0 0 4px; cursor: pointer; border: 1px solid #555; font-size: 0.75rem;";
                
                // ⭐ [수정] UI.updateScreen -> updateScreen 으로 변경 (에러 해결)
                btnOn.onclick = function() { 
                    b.on = true; 
                    updateScreen(Logic.calculateNetMPS()); 
                };

                const btnOff = document.createElement('button');
                btnOff.innerText = "OFF";
                btnOff.style.cssText = "padding: 4px 8px; border-radius: 0 4px 4px 0; cursor: pointer; border: 1px solid #555; font-size: 0.75rem; border-left: none;";
                
                // ⭐ [수정] UI.updateScreen -> updateScreen 으로 변경
                btnOff.onclick = function() { 
                    b.on = false; 
                    updateScreen(Logic.calculateNetMPS()); 
                };

                // 버튼 삽입
                const btnContainer = row.querySelector('.p-ctrl div');
                btnContainer.appendChild(btnOn);
                btnContainer.appendChild(btnOff);

                // 참조 저장
                row.btnOn = btnOn;
                row.btnOff = btnOff;

                tbody.appendChild(row);
            }

            // --- 내용 업데이트 (매 프레임) ---
            
            // 1. 텍스트
            row.querySelector('.p-name').innerText = b.name;
            row.querySelector('.p-count').innerText = formatNumber(b.count);

            // 2. 에너지 및 투명도
            const energyCell = row.querySelector('.p-energy');
            if (b.on === false) {
                energyCell.innerHTML = `<span style="color:#7f8c8d;">0 MW</span>`;
                row.style.opacity = "0.5";
            } else {
                row.style.opacity = "1";
                if (isPlus) energyCell.innerHTML = `<span style="color:#2ecc71">+${formatNumber(energyVal)}</span>`;
                else energyCell.innerHTML = `<span style="color:#e74c3c">-${formatNumber(energyVal)}</span>`;
            }

            // 3. 버튼 스타일 (활성 상태 강조)
            const isOn = (b.on !== false);
            
            // 켜짐 버튼 스타일
            row.btnOn.style.background = isOn ? "#2ecc71" : "#222";
            row.btnOn.style.color = isOn ? "#fff" : "#666";
            row.btnOn.style.fontWeight = isOn ? "bold" : "normal";

            // 꺼짐 버튼 스타일
            row.btnOff.style.background = !isOn ? "#e74c3c" : "#222";
            row.btnOff.style.color = !isOn ? "#fff" : "#666";
            row.btnOff.style.fontWeight = !isOn ? "bold" : "normal";
        }
    });

    // 사라진 건물 행 제거 (청소)
    Array.from(tbody.children).forEach(row => {
        const id = parseInt(row.id.replace('pwr-row-', ''));
        if (!currentBuildingIds.has(id)) {
            row.remove();
        }
    });
}

export function renderResearchTab() {
    const container = elements.viewResearch.querySelector('#research-list-container') || elements.viewResearch.querySelector('.action-box');
    if (!container) return;
    
    container.innerHTML = "";
    if (!gameData.researches) gameData.researches = [];

    // 1. 연구 리스트 분류
    const availableRes = [];
    const completedRes = [];

    researchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id);
        
        // 해금 조건 체크 (선행 연구 완료 여부)
        const isPrereqDone = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;
        
        // 타겟 건물 해금 여부 체크 (건물이 상점에 떠야 연구도 뜸)
        let isTargetVisible = true;
        if (r.type === 'building' || r.type === 'consumption' || r.type === 'energyEff') {
            isTargetVisible = r.target.some(targetId => {
                const b = gameData.buildings.find(build => build.id === targetId);
                return b && gameData.houseLevel >= (b.reqLevel || 0);
            });
        }

        if (isDone) {
            completedRes.push(r);
        } else if (isPrereqDone && isTargetVisible) {
            availableRes.push(r);
        }
    });

    // 2. 진행 가능한 연구 렌더링
    if (availableRes.length > 0) {
        const title = document.createElement('div');
        title.className = 'research-section-title';
        title.innerHTML = `🔬 진행 가능한 연구 (${availableRes.length})`;
        container.appendChild(title);

        availableRes.forEach(r => {
            container.appendChild(createResearchElement(r, false));
        });
    }

    // 3. 완료된 연구 렌더링
    if (completedRes.length > 0) {
        const title = document.createElement('div');
        title.className = 'research-section-title';
        title.style.color = '#8892b0';
        title.innerHTML = `✅ 완료된 기술 (${completedRes.length})`;
        container.appendChild(title);

        completedRes.forEach(r => {
            container.appendChild(createResearchElement(r, true));
        });
    }
    
    updateResearchButtons();
}

// 개별 연구 아이템을 생성하는 보조 함수 (중복 코드 방지)
function createResearchElement(r, isDone) {
    const div = document.createElement('div');
    div.className = `shop-item research-item ${isDone ? 'done disabled' : ''}`;
    div.id = `research-${r.id}`;
    
    let costTxt = Object.entries(r.cost)
        .map(([k, v]) => `${formatNumber(v)}${getResNameOnly(k)}`)
        .join(' ');

    div.innerHTML = `
        <span class="si-name">${r.name}</span>
        <span class="si-level">${isDone ? '✓' : ''}</span>
        <div class="si-desc">${r.desc}</div>
        <div class="si-cost">${isDone ? '연구 완료' : costTxt}</div>
    `;

    if (!isDone) {
        div.onclick = (e) => {
            e.stopPropagation();
            if (Logic.tryBuyResearch(r.id)) {
                log(`🔬 [연구 완료] ${r.name}`, true);
                renderResearchTab(); // 탭 다시 그리기
                renderShop(cachedBuyCallback, Logic.getBuildingCost); // 상점 효율 반영
            } else {
                log("연구 자원이 부족합니다.");
            }
        };
    }
    return div;
}

function updateResearchButtons() {
    researchList.forEach(r => {
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
    const discovered = gameData.unlockedResources || ['wood', 'stone', 'plank'];
    const toggle = (el, show) => {
        if(!el) return;
        if(show) el.classList.remove('hidden'); else el.classList.add('hidden');
    };
    toggle(elements.btns.wood, true);
    toggle(elements.btns.stone, discovered.includes('stone'));
    toggle(elements.btns.plank, discovered.includes('plank'));
    toggle(elements.btns.coal, discovered.includes('coal'));
    toggle(elements.btns.ironOre, discovered.includes('ironOre'));
    toggle(elements.btns.copperOre, discovered.includes('copperOre'));
    if(elements.navPower) elements.navPower.style.display = (gameData.houseLevel >= 2) ? 'flex' : 'none';
    if(elements.navPower) {
    const isPowerUnlocked = (gameData.houseLevel >= 5); // 풍력 발전기 등장 시점
    elements.navPower.style.display = isPowerUnlocked ? 'flex' : 'none';
    if(isPowerUnlocked && !elements.navPower.classList.contains('unlocked-flash')) {
        elements.navPower.classList.add('unlocked-flash');
        log("⚡ 전력 관리 시스템이 활성화되었습니다!", true);
    }
}
}

export function renderShop(onBuyCallback, getCostFunc) {
    if(onBuyCallback) cachedBuyCallback = onBuyCallback; // ⭐ 콜백 함수 기억
    
    elements.buildingList.innerHTML = "";
    const wood = gameData.resources.wood || 0;
    const isStoneUnlocked = (gameData.houseLevel >= 1 || wood >= 10 || (gameData.buildings[0] && gameData.buildings[0].count > 0));

    gameData.buildings.forEach((b, index) => {
        const req = b.reqLevel || 0;
        if (req === 0.5 && !isStoneUnlocked) return;
        if (req >= 1 && gameData.houseLevel < req) return;
        
        const div = document.createElement('div');
        div.className = `shop-item`;
        div.id = `build-${index}`;
        const cost = getCostFunc(b);
        let costTxt = Object.entries(cost).map(([k, v]) => `${formatNumber(v)}${resNames[k].split(' ')[1]}`).join(' ');

        let speedMult = Logic.getBuildingMultiplier(b.id);
        // ⭐ [추가] 소모량 감소 연구 배수 가져오기
        let consMult = Logic.getBuildingConsumptionMultiplier(b.id);
        let energyEff = Logic.getEnergyEfficiencyMultiplier(b.id); // ⭐ 추가

        // ⭐ [수정] 소모량(inArr) 계산식 뒤에 * consMult 를 추가함
        let inArr = b.inputs ? Object.entries(b.inputs).map(([k,v]) => {
        let finalVal = v * speedMult * consMult;
         if (k === 'energy') finalVal *= energyEff; // ⭐ 전력일 때만 전기효율 배수 추가 적용
        return `${formatNumber(finalVal)}${k === 'energy' ? '⚡' : resNames[k].split(' ')[1]}`;
        }) : [];
        let outArr = b.outputs ? Object.entries(b.outputs).map(([k,v]) => `${formatNumber(v * speedMult)}${k === 'energy' ? '⚡' : resNames[k].split(' ')[1]}`) : [];
        
        let processTxt = "";
        if (inArr.length > 0) processTxt += `<span style="color:#e74c3c">-${inArr.join(',')}</span> `;
        if (outArr.length > 0) processTxt += `➡<span style="color:#2ecc71">+${outArr.join(',')}</span>/s`;

        div.innerHTML = `<span class="si-name">${b.name}</span><span class="si-level">Lv.${b.count}</span><div class="si-desc">${processTxt}</div><div class="si-cost">${costTxt}</div>`;
        
        div.onclick = () => {
            if(cachedBuyCallback) cachedBuyCallback(index);
        };
        elements.buildingList.appendChild(div);
    });
    updateShopButtons(getCostFunc);
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

export function updateHouseUI(onUpgrade) {
    const nextStage = houseStages[gameData.houseLevel + 1];
    const currentStage = houseStages[gameData.houseLevel];
    if(elements.houseName) elements.houseName.innerText = `Lv.${gameData.houseLevel} ${currentStage.name}`;
    if(elements.houseDesc) elements.houseDesc.innerText = currentStage.desc;

    if (nextStage) {
        const reqTxt = Object.entries(nextStage.req).filter(([k,v]) => k !== 'energy').map(([k,v]) => `${resNames[k].split(' ')[1]}${formatNumber(v)}`).join(',');
        elements.upgradeBtn.innerText = `⬆️ ${nextStage.name} (${reqTxt})`;
        elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        let canUp = true;
        for(let k in nextStage.req) {
            if (k === 'energy') { if((gameData.resources.energy || 0) < nextStage.req[k]) canUp = false; }
            else { if((gameData.resources[k] || 0) < nextStage.req[k]) canUp = false; }
        }
        elements.upgradeBtn.disabled = !canUp;
    } else {
        elements.upgradeBtn.innerText = "🚀 완료";
        elements.upgradeBtn.disabled = true;
    }
}

export const uiElements = elements;