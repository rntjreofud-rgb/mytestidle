// js/ui.js 전체 교체

import { gameData, houseStages, researchList } from './data.js';
import * as Logic from './logic.js';

// 내부에서 구매 콜백 함수를 기억하기 위한 변수
let cachedBuyCallback = null;

window.toggleBuildingPower = function(id) {
    // 1. 해당 건물 찾기
    const building = gameData.buildings.find(b => b.id === id);
    
    if (building) {
        // 2. 상태 토글 (켜져있으면 끄고, 꺼져있으면 켬)
        // (undefined일 경우를 대비해 확실하게 true/false 처리)
        building.on = (building.on === undefined) ? false : !building.on;
        
        // 3. 화면 갱신 (중요: UI.updateScreen이 아니라 그냥 updateScreen 호출)
        const netMPS = Logic.calculateNetMPS();
        updateScreen(netMPS); 
        
        console.log(`건물 ID ${id} 전원 상태 변경: ${building.on ? 'ON' : 'OFF'}`);
    } else {
        console.error("건물을 찾을 수 없습니다. ID:", id);
    }
};


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

    // 현재 전력 상태 확인
    const powerProd = gameData.resources.energy || 0;
    const powerReq = gameData.resources.energyMax || 0;
    const isPowerShort = powerProd < powerReq; // 전력 부족 여부

    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;
        if (!gameData.unlockedResources.includes(key)) continue;

        let card = document.getElementById(`card-${key}`);
        if (!card) {
            card = createResourceCard(key);
            elements.resGrid.appendChild(card);
        }

        const val = gameData.resources[key] || 0;
        const net = (stats[key].prod - stats[key].cons);
        
        card.querySelector('.res-amount').innerText = formatNumber(val);
        const mpsEl = card.querySelector('.res-mps');

        // 전력이 부족한 상태라면 경고 메시지 추가
        let powerWarning = isPowerShort ? `<span style="color:#f1c40f; font-size:0.7rem;"> [⚡부족]</span>` : "";

        if (stats[key].prod > 0 && stats[key].cons > 0) {
            mpsEl.innerHTML = `<span style="color:#2ecc71">+${formatNumber(stats[key].prod)}</span>|<span style="color:#e74c3c">-${formatNumber(stats[key].cons)}</span>/s${powerWarning}`;
        } else {
            let mpsText = Math.abs(net) < 10 ? net.toFixed(1) : formatNumber(net);
            if(net < 0) { mpsEl.style.color = "#e74c3c"; mpsEl.innerText = `▼ ${mpsText}/s`; }
            else if(net > 0) { mpsEl.style.color = "#2ecc71"; mpsEl.innerText = `▲ ${mpsText}/s`; }
            else { mpsEl.style.color = "#7f8c8d"; mpsEl.innerText = `+0.0/s`; }
            
            // 전력 부족 시 텍스트 뒤에 경고 아이콘 추가
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
    
    // 1. 상단 요약 텍스트 및 바 업데이트 (기존 로직 유지)
    if(elements.powerDisplay) elements.powerDisplay.innerHTML = `<span style="color:#2ecc71">${formatNumber(prod)} MW</span> 생산 / <span style="color:#e74c3c">${formatNumber(req)} MW</span> 소비`;
    
    if(elements.powerBar) {
        let percent = req > 0 ? (prod / req) * 100 : 100;
        elements.powerBar.style.width = `${Math.min(100, percent)}%`;
        
        if (prod < req) {
            elements.powerBar.classList.add('power-low'); // 깜빡임 효과
            elements.powerBar.style.backgroundColor = '#e74c3c';
        } else {
            elements.powerBar.classList.remove('power-low');
            elements.powerBar.style.backgroundColor = '#2ecc71';
        }
    }

    // 2. 상세 내역 렌더링 시작 (ON/OFF 버튼 추가됨)
    const container = document.getElementById('power-breakdown-container');
    if (!container) return;

    // 테이블 헤더에 '상태' 컬럼 추가
    let html = `<table style="width:100%; border-collapse: collapse; font-size: 0.85rem;">
                <tr style="border-bottom: 1px solid #444; color: #8892b0;">
                    <th style="text-align:left; padding: 5px;">건물명</th>
                    <th style="text-align:center; padding: 5px;">상태</th> 
                    <th style="text-align:right; padding: 5px;">에너지 (MW)</th>
                </tr>`;

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            // 각종 효율 배수 가져오기
            const speedMult = Logic.getBuildingMultiplier(b.id);
            const consMult = Logic.getBuildingConsumptionMultiplier(b.id);
            const energyEff = Logic.getEnergyEfficiencyMultiplier(b.id);
            
            // 전력 생산 건물인지 소비 건물인지 확인
            const isProducer = b.outputs && b.outputs.energy;
            const isConsumer = b.inputs && b.inputs.energy;

            // 전력과 관련 없는 건물은 목록에서 제외
            if (!isProducer && !isConsumer) return;

            let energyTxt = "";
            let rowStyle = "";
            
            // A. 건물이 꺼져있는 경우 (OFF)
            if (!b.on) {
                energyTxt = `<span style="color:#7f8c8d;">OFF</span>`; // 회색 텍스트
                rowStyle = "opacity: 0.5;"; // 행 전체 흐리게
            } 
            // B. 건물이 켜져있는 경우 (ON)
            else {
                if (isProducer) {
                    // 생산량 계산
                    const totalProd = b.outputs.energy * b.count * speedMult;
                    energyTxt = `<span style="color:#2ecc71">+${formatNumber(totalProd)}</span>`;
                } else {
                    // 소비량 계산 (모든 효율 연구 적용)
                    const totalCons = b.inputs.energy * consMult * energyEff * b.count * speedMult;
                    energyTxt = `<span style="color:#e74c3c">-${formatNumber(totalCons)}</span>`;
                }
            }

            // ON/OFF 버튼 스타일
            const btnColor = b.on ? "#2ecc71" : "#95a5a6"; // 초록색(ON) / 회색(OFF)
            const btnText = b.on ? "ON" : "OFF";
            
            html += `<tr style="${rowStyle} border-bottom: 1px solid rgba(255,255,255,0.05);">
                <td style="padding: 5px;">
                    ${b.name} <span style="font-size:0.7rem; color:#666;">(x${b.count})</span>
                </td>
                <td style="text-align:center; padding: 5px;">
                    <button onclick="window.toggleBuildingPower(${b.id})" 
                            style="background:${btnColor}; color:#fff; border:none; border-radius:3px; cursor:pointer; font-size:0.7rem; padding:2px 6px;">
                        ${btnText}
                    </button>
                </td>
                <td style="text-align:right; padding: 5px;">${energyTxt}</td>
            </tr>`;
        }
    });

    html += `</table>`;
    
    // 변화가 있을 때만 DOM 업데이트
    if (container.innerHTML !== html) {
        container.innerHTML = html;
    }
}

export function renderResearchTab() {
    const container = elements.viewResearch.querySelector('#research-list-container') || elements.viewResearch.querySelector('.action-box');
    container.innerHTML = "";
    if (!gameData.researches) gameData.researches = [];
    researchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id);
        let isUnlocked = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;
        if (!isDone && !isUnlocked) return;
        const div = document.createElement('div');
        div.className = `shop-item ${isDone ? 'done disabled' : ''}`;
        div.id = `research-${r.id}`;
        let costTxt = Object.entries(r.cost).map(([k, v]) => `${formatNumber(v)}${resNames[k].split(' ')[1]}`).join(' ');
        div.innerHTML = `<span class="si-name">${r.name}</span><span class="si-level">${isDone ? '✓' : ''}</span><div class="si-desc">${r.desc}</div><div class="si-cost">${isDone ? '연구 완료' : costTxt}</div>`;
        if (!isDone) {
            div.onclick = (e) => {
                e.stopPropagation();
                if(Logic.tryBuyResearch(r.id)) {
                    log(`🔬 [연구 완료] ${r.name}`, true);
                    renderResearchTab();
                    // ⭐ 연구 완료 시 건물 상점도 갱신 (효율 반영을 위해)
                    renderShop(cachedBuyCallback, Logic.getBuildingCost);
                } else {
                    log("연구 자원이 부족하거나 선행 연구가 필요합니다.");
                }
            };
        }
        container.appendChild(div);
    });
    updateResearchButtons();
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