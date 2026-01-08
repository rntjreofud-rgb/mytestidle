// js/ui.js

import { gameData, houseStages } from './data.js';

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
        coal: document.getElementById('btn-gather-coal'), // 신규
        ironOre: document.getElementById('btn-gather-iron'),
        copperOre: document.getElementById('btn-gather-copper'),
        plank: document.getElementById('btn-craft-plank')
    },
    buildingList: document.getElementById('building-list'),
    headerLog: document.getElementById('message-log'),
    // 전력 UI 요소
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
    // 자원 표시 (에너지는 제외)
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
        
        // mps 포맷팅
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

    // ⭐ 전력 탭 UI 업데이트
    updatePowerUI();
    checkUnlocks();
}

function updatePowerUI() {
    const prod = gameData.resources.energy || 0;
    const req = gameData.resources.energyMax || 0;
    
    // 텍스트 업데이트
    if(elements.powerDisplay) {
        elements.powerDisplay.innerHTML = `
            <span style="color:#2ecc71">${formatNumber(prod)} MW</span> 생산 / 
            <span style="color:#e74c3c">${formatNumber(req)} MW</span> 소비
        `;
    }

    // 게이지 바 업데이트
    if(elements.powerBar) {
        let percent = 100;
        if(req > 0) percent = (prod / req) * 100;
        if(percent > 100) percent = 100;
        
        elements.powerBar.style.width = `${percent}%`;
        // 전력 부족하면 빨간색, 충분하면 초록색
        elements.powerBar.style.backgroundColor = (prod >= req) ? '#2ecc71' : '#e74c3c';
    }
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
    
    // Lv 1 이상이면 석탄, 철, 구리, 판자 모두 해금
    const unlocked = (lv >= 1); 

    const toggle = (el, show) => {
        if(!el) return;
        if(show) el.classList.remove('hidden');
        else el.classList.add('hidden');
    };

    toggle(elements.btns.stone, unlocked);
    toggle(elements.btns.plank, unlocked);
    toggle(elements.btns.coal, unlocked); // 석탄
    toggle(elements.btns.ironOre, unlocked);
    toggle(elements.btns.copperOre, unlocked);

    // 전력 탭 활성화 (Lv 2 이상)
    if(elements.navPower) {
        if(lv >= 2) elements.navPower.style.display = 'flex';
        else elements.navPower.style.display = 'none';
    }
}

export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    gameData.buildings.forEach((b, index) => {
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
                if(k === 'energy') name = "⚡"; // 전력 아이콘
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
        // 요구사항 표시 (전력 조건 제외하거나 별도 표시)
        const reqTxt = Object.entries(req)
            .filter(([k,v]) => k !== 'energy') // 전력은 텍스트에서 뺌
            .map(([k,v]) => `${resNames[k].split(' ')[1]} ${formatNumber(v)}`)
            .join(', ');
        
        elements.upgradeBtn.innerText = `⬆️ ${nextStage.name} (${reqTxt})`;
        elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        
        let canUp = true;
        for(let k in req) {
             if (k === 'energy') continue; // 전력 제외
            if((gameData.resources[k] || 0) < req[k]) canUp = false;
        }
        elements.upgradeBtn.disabled = !canUp;
    } else {
        elements.upgradeBtn.innerText = "🚀 완료";
        elements.upgradeBtn.disabled = true;
    }
}

export const uiElements = elements;