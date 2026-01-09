import { gameData, houseStages, researchList } from './data.js';
import * as Logic from './logic.js';

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
    nanobots: "🤖 나노봇", warpCore: "🌀 워프코어", energy: "⚡ 전력"
};

function checkResourceDiscovery() {
    for (let key in gameData.resources) {
        if (key === 'energy' || key === 'energyMax') continue;

        // 이미 해금된 것은 패스
        if (gameData.unlockedResources.includes(key)) continue;

        // 1. 자원을 0.1개 이상 보유하게 되면 해금 (발견)
        if (gameData.resources[key] > 0) {
            gameData.unlockedResources.push(key);
            log(`✨ 새로운 자원 발견: ${resNames[key].split(' ')[1]}`, true);
            continue;
        }

        // 2. 현재 지을 수 있는 건물의 소모/생산 목록에 포함되어 있으면 해금 (예고)
        gameData.buildings.forEach(b => {
            // 건물이 상점에 나타날 조건이 충족되었을 때
            const req = b.reqLevel || 0;
            const isVisible = (req === 0.5 && (gameData.houseLevel >= 1 || gameData.resources.wood >= 10)) || (gameData.houseLevel >= req);
            
            if (isVisible) {
                if (b.inputs && b.inputs[key] !== undefined) gameData.unlockedResources.push(key);
                if (b.outputs && b.outputs[key] !== undefined) gameData.unlockedResources.push(key);
            }
        });
    }
}



function formatNumber(num) {
    if (num == null) return "0";
    if (num < 1000) return Math.floor(num).toLocaleString();
    const suffixes = ["k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
    let shortValue = parseFloat((suffixNum != 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    return shortValue + suffixes[suffixNum - 1];
}

export function switchTab(tabName) {
    if(elements.viewDashboard) elements.viewDashboard.classList.add('hidden');
    if(elements.viewPower) elements.viewPower.classList.add('hidden');
    if(elements.viewResearch) elements.viewResearch.classList.add('hidden');
    
    if(elements.navDashboard) elements.navDashboard.classList.remove('active');
    if(elements.navPower) elements.navPower.classList.remove('active');
    if(elements.navResearch) elements.navResearch.classList.remove('active');

    if (tabName === 'dashboard') {
        elements.viewDashboard.classList.remove('hidden');
        elements.navDashboard.classList.add('active');
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

export function updateScreen(stats) {
    // ⭐ 자원 해금 상태 먼저 확인
    checkResourceDiscovery();

    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;

        // ⭐ 해금된 자원만 카드를 만듦
        if (!gameData.unlockedResources.includes(key)) {
            const existingCard = document.getElementById(`card-${key}`);
            if (existingCard) existingCard.classList.add('hidden');
            continue;
        }

        let card = document.getElementById(`card-${key}`);
        if (!card) {
            card = createResourceCard(key);
            elements.resGrid.appendChild(card);
        }
        card.classList.remove('hidden'); // 발견되면 보임
        
        const val = gameData.resources[key] || 0;
        const prod = stats[key] ? stats[key].prod : 0;
        const cons = stats[key] ? stats[key].cons : 0;
        const net = prod - cons;
        
        card.querySelector('.res-amount').innerText = formatNumber(val);
        const mpsEl = card.querySelector('.res-mps');
        
        if (prod > 0 && cons > 0) {
            mpsEl.innerHTML = `<span style="color:#2ecc71">+${formatNumber(prod)}</span>|<span style="color:#e74c3c">-${formatNumber(cons)}</span>/s`;
        } else {
            let mpsText = Math.abs(net) < 1000 ? Math.abs(net).toFixed(1) : formatNumber(Math.abs(net));
            if(net < 0) { mpsEl.style.color = "#e74c3c"; mpsEl.innerText = `▼ ${mpsText}/s`; }
            else if(net > 0) { mpsEl.style.color = "#2ecc71"; mpsEl.innerText = `▲ ${mpsText}/s`; }
            else { mpsEl.style.color = "#7f8c8d"; mpsEl.innerText = `+0.0/s`; }
        }
    }
    updatePowerUI();
    if(!elements.viewResearch.classList.contains('hidden')) renderResearchTab();
    checkUnlocks();
}

function updatePowerUI() {
    const prod = gameData.resources.energy || 0;
    const req = gameData.resources.energyMax || 0;
    if(elements.powerDisplay) {
        elements.powerDisplay.innerHTML = `
            <span style="color:#2ecc71">${formatNumber(prod)} MW</span> 생산 / 
            <span style="color:#e74c3c">${formatNumber(req)} MW</span> 소비
        `;
    }
    if(elements.powerBar) {
        let percent = 100;
        if(req > 0) percent = (prod / req) * 100;
        if(percent > 100) percent = 100;
        elements.powerBar.style.width = `${percent}%`;
        elements.powerBar.style.backgroundColor = (prod >= req) ? '#2ecc71' : '#e74c3c';
    }
}

function renderResearchTab() {
    const container = elements.viewResearch.querySelector('.action-box');
    container.innerHTML = `<div class="section-title">기술 계통도 (Research Tree)</div>`;
    
    const listDiv = document.createElement('div');
    listDiv.id = 'research-list-container';
    
    // 안전장치
    if (!gameData.researches) gameData.researches = [];

    researchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id);
        
        // 선행 연구 체크
        let isUnlocked = true;
        if (r.reqResearch && !gameData.researches.includes(r.reqResearch)) {
            isUnlocked = false;
        }

        // 잠겨있고 완료도 안 된 연구는 아예 안 보여줌 (테크트리 발견의 재미)
        if (!isDone && !isUnlocked) return;

        const div = document.createElement('div');
        // 클래스 부여 (연구 완료 시 .done 추가)
        div.className = `shop-item ${isDone ? 'done disabled' : ''}`;
        div.id = `research-${r.id}`;
        
        let costTxt = Object.entries(r.cost).map(([k, v]) => `${formatNumber(v)}${resNames[k].split(' ')[1]}`).join(' ');
        
        div.innerHTML = `
            <span class="si-name">${r.name}</span>
            <span class="si-level">${isDone ? '✓' : ''}</span>
            <div class="si-desc">${r.desc}</div>
            <div class="si-cost">${isDone ? '<span class="research-done-tag">연구 완료</span>' : costTxt}</div>
        `;
        
        if (!isDone) {
            div.onclick = () => {
                if(Logic.tryBuyResearch(r.id)) {
                    log(`🔬 [연구 완료] ${r.name}`, true);
                    renderResearchTab(); // 즉시 리스트 갱신
                    updateScreen(Logic.calculateNetMPS()); // 속도 즉시 반영
                } else {
                    log("연구 자원이 부족합니다.");
                }
            };
        }
        listDiv.appendChild(div);
    });
    
    container.appendChild(listDiv);
    updateResearchButtons();
}

function updateResearchButtons() {
    if (!gameData.researches) gameData.researches = [];
    
    researchList.forEach(r => {
        if(gameData.researches.includes(r.id)) return;
        const div = document.getElementById(`research-${r.id}`);
        if(!div) return;
        let canBuy = true;
        for(let k in r.cost) {
            if((gameData.resources[k] || 0) < r.cost[k]) canBuy = false;
        }
        if(canBuy) div.classList.remove('disabled');
        else div.classList.add('disabled');
    });
}

function createResourceCard(key) {
    const div = document.createElement('div');
    div.className = `res-card ${key}`;
    div.id = `card-${key}`;
    div.innerHTML = `
        <div class="res-header"><span class="res-name">${resNames[key] || key}</span></div>
        <div class="res-body"><span style="font-size:0.7rem; color:#666;">보유</span><h3 class="res-amount">0</h3></div>
        <div class="res-footer"><small class="res-mps">+0.0/s</small></div>
    `;
    return div;
}

function checkUnlocks() {
    const lv = gameData.houseLevel;
    const wood = gameData.resources.wood || 0;
    
    const hasLogger = gameData.buildings[0] && gameData.buildings[0].count > 0;
    const hasPlank = (gameData.resources.plank || 0) > 0;
    const canGatherStone = (lv >= 1 || wood >= 10 || hasLogger || hasPlank);

    const toggle = (el, show) => {
        if(!el) return;
        if(show) el.classList.remove('hidden');
        else el.classList.add('hidden');
    };

    toggle(elements.btns.stone, canGatherStone);
    toggle(elements.btns.plank, canGatherStone);
    toggle(elements.btns.coal, (lv >= 1));
    toggle(elements.btns.ironOre, (lv >= 1));
    toggle(elements.btns.copperOre, (lv >= 1));

    if(elements.navPower) {
        if(lv >= 2) elements.navPower.style.display = 'flex';
        else elements.navPower.style.display = 'none';
    }
}

/* js/ui.js의 renderShop 함수를 이걸로 완전히 덮어씌워주세요 */

export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    
    const lv = gameData.houseLevel;
    const wood = gameData.resources.wood || 0;
    const hasLogger = gameData.buildings[0] && gameData.buildings[0].count > 0;
    const hasPlank = (gameData.resources.plank || 0) > 0;
    const isStoneUnlocked = (lv >= 1 || wood >= 10 || hasLogger || hasPlank);

    gameData.buildings.forEach((b, index) => {
        const req = b.reqLevel || 0;
        if (req === 0.5 && !isStoneUnlocked) return;
        if (req >= 1 && lv < req) return;
        
        const div = document.createElement('div');
        div.className = `shop-item`;
        div.id = `build-${index}`;
        
        const cost = getCostFunc(b);
        let costTxt = Object.entries(cost).map(([k, v]) => `${formatNumber(v)} ${resNames[k].split(' ')[1]}`).join(', ');

        let processTxt = "";
        if (b.inputs) {
            let inArr = [];
            for(let k in b.inputs) {
                let val = b.inputs[k];
                let name = resNames[k] ? resNames[k].split(' ')[1] : k;
                if(k === 'energy') name = "⚡";
                inArr.push(`${val}${name}`);
            }
            processTxt += `<span style="color:#e74c3c">-${inArr.join(', ')}</span> `;
        }
        if (b.outputs) {
             let outArr = [];
             for(let k in b.outputs) {
                let val = b.outputs[k];
                let name = resNames[k] ? resNames[k].split(' ')[1] : k;
                if(k === 'energy') name = "⚡";
                outArr.push(`${val}${name}`);
             }
             processTxt += `➡ <span style="color:#2ecc71">+${outArr.join(', ')}</span> /s`;
        }

        /* ⭐ 수정됨: 이름과 레벨을 묶지 않고 따로 배치 ⭐ */
        div.innerHTML = `
            <span class="si-name">${b.name}</span>
            <span class="si-level">Lv.${b.count}</span>
            <div class="si-desc">${processTxt}</div>
            <div class="si-cost">${costTxt}</div>
        `;
        
        div.onclick = () => onBuyCallback(index);
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
        for(let k in cost) {
            if((gameData.resources[k] || 0) < cost[k]) canBuy = false;
        }
        if (canBuy) div.classList.remove('disabled');
        else div.classList.add('disabled');
    });
}

export function updateHouseUI(onUpgrade) {
    if (gameData.houseLevel >= houseStages.length) return;
    const nextStage = houseStages[gameData.houseLevel + 1];
    const currentStage = houseStages[gameData.houseLevel];

    if(elements.houseName) elements.houseName.innerText = `Lv.${gameData.houseLevel} ${currentStage.name}`;
    if(elements.houseDesc) elements.houseDesc.innerText = currentStage.desc;

    if (nextStage) {
        const req = nextStage.req;
        const reqTxt = Object.entries(req)
            .filter(([k,v]) => k !== 'energy')
            .map(([k,v]) => `${resNames[k].split(' ')[1]} ${formatNumber(v)}`)
            .join(', ');
        elements.upgradeBtn.innerText = `⬆️ ${nextStage.name} (${reqTxt})`;
        elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        let canUp = true;
        for(let k in req) {
             if (k === 'energy') continue;
            if((gameData.resources[k] || 0) < req[k]) canUp = false;
        }
        elements.upgradeBtn.disabled = !canUp;
    } else {
        elements.upgradeBtn.innerText = "🚀 완료";
        elements.upgradeBtn.disabled = true;
    }
}

export const uiElements = elements;