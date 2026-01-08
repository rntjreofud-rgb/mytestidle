// js/ui.js

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
    wood: "🌲 나무", stone: "🪨 돌", coal: "⚫ 석탄",
    ironOre: "⚙️ 철광석", copperOre: "🥉 구리광석",
    plank: "🪵 판자", brick: "🧱 벽돌",
    ironPlate: "⬜ 철판", copperPlate: "🟧 구리판",
    gear: "⚙️ 톱니", circuit: "📟 회로",
    energy: "⚡ 전력"
};

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

export function updateScreen(netMPS) {
    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;
        let card = document.getElementById(`card-${key}`);
        if (!card) {
            card = createResourceCard(key);
            elements.resGrid.appendChild(card);
        }
        
        const val = gameData.resources[key] || 0;
        const mps = netMPS[key] || 0;
        
        card.querySelector('.res-amount').innerText = formatNumber(val);
        const mpsEl = card.querySelector('.res-mps');
        let mpsText = Math.abs(mps) < 1000 ? Math.abs(mps).toFixed(1) : formatNumber(Math.abs(mps));
        if(mps < 0) {
            mpsEl.style.color = "#e74c3c";
            mpsEl.innerText = `▼ ${mpsText} /s`;
        } else if(mps > 0) {
            mpsEl.style.color = "#2ecc71";
            mpsEl.innerText = `▲ ${mpsText} /s`;
        } else {
            mpsEl.style.color = "#7f8c8d";
            mpsEl.innerText = `+0.0 /s`;
        }
    }
    updatePowerUI();
    if(!elements.viewResearch.classList.contains('hidden')) {
        updateResearchButtons();
    }
    
    // ⭐ 중요: 해금 상태 체크 후 상점도 다시 그릴지 판단하면 좋지만,
    // 성능을 위해 checkUnlocks()는 버튼만 제어하고,
    // renderShop은 main.js에서 건설/업그레이드 등 이벤트 발생 시 호출하는 구조 유지.
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
    container.innerHTML = `<div class="section-title">연구 목록</div>`;
    const listDiv = document.createElement('div');
    listDiv.id = 'research-list-container';
    listDiv.style.display = 'grid';
    listDiv.style.gap = '10px';
    
    researchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id);
        const div = document.createElement('div');
        div.className = `shop-item ${isDone ? 'disabled' : ''}`;
        div.id = `research-${r.id}`;
        
        let costTxt = Object.entries(r.cost).map(([k, v]) => `${formatNumber(v)} ${resNames[k].split(' ')[1]}`).join(', ');
        if(isDone) costTxt = "연구 완료";

        div.innerHTML = `
            <div style="flex:1;">
                <div style="font-weight:bold; font-size:1em;">${r.name}</div>
                <div style="font-size:0.8em; margin-top:3px; color:#aaa;">${r.desc}</div>
            </div>
            <div style="text-align:right; font-size:0.9em;">
                <span class="cost-text" style="${isDone ? 'color:#2ecc71' : ''}">${costTxt}</span>
            </div>
        `;
        if (!isDone) {
            div.onclick = () => {
                if(Logic.tryBuyResearch(r.id)) {
                    log(`🔬 [연구 완료] ${r.name}`, true);
                    renderResearchTab();
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
    
    // 돌 해금 조건 (reqLevel 0.5에 해당)
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

    // ⭐ 중요: checkUnlocks가 호출될 때마다 상점 목록을 다시 그리는 것은 비효율적이지만,
    // "해금 상태"가 바뀌었는지 체크해서 필요하면 다시 그리는게 좋습니다.
    // 여기서는 간단하게 로직을 분리해 둠.
    // (상점 갱신은 main.js에서 이벤트 발생 시 하거나, 
    //  아래에서 1초마다 하는 루프 안에서 조건부 호출 가능)
}

// ⭐ [수정됨] 상점 렌더링 시 조건 필터링
export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    
    // 조건 체크용 변수들
    const lv = gameData.houseLevel;
    const wood = gameData.resources.wood || 0;
    const hasLogger = gameData.buildings[0] && gameData.buildings[0].count > 0;
    const hasPlank = (gameData.resources.plank || 0) > 0;
    const isStoneUnlocked = (lv >= 1 || wood >= 10 || hasLogger || hasPlank);

    gameData.buildings.forEach((b, index) => {
        // ⭐ 건물 등장 조건 체크
        const req = b.reqLevel || 0;
        
        // 0.5 레벨 (돌 해금 단계) 처리
        if (req === 0.5) {
            if (!isStoneUnlocked) return; // 돌 해금 안됐으면 안 보여줌
        } 
        // 정수 레벨 (1, 2...) 처리
        else if (req >= 1) {
            if (lv < req) return; // 레벨 부족하면 안 보여줌
        }
        
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

        div.innerHTML = `
            <div style="flex:1;">
                <div style="font-weight:bold; font-size:1em;">${b.name} <span style="font-size:0.8em; color:#f39c12;">(Lv.${b.count})</span></div>
                <div style="font-size:0.8em; margin-top:3px; color:#999;">${processTxt}</div>
            </div>
            <div style="text-align:right; font-size:0.9em;"><span class="cost-text">${costTxt}</span></div>
        `;
        div.onclick = () => onBuyCallback(index);
        elements.buildingList.appendChild(div);
    });
    updateShopButtons(getCostFunc);
}

export function updateShopButtons(getCostFunc) {
    gameData.buildings.forEach((b, index) => {
        const div = document.getElementById(`build-${index}`);
        if(!div) return; // 조건 미달로 생성 안 된 건물은 패스
        
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