// js/ui.js 전체 덮어쓰기

import { gameData, houseStages } from './data.js';

const elements = {
    // 뷰(화면) 요소
    viewDashboard: document.getElementById('view-dashboard'),
    viewLog: document.getElementById('view-log'),
    
    // 네비게이션 버튼
    navDashboard: document.getElementById('nav-dashboard'),
    navLog: document.getElementById('nav-log'),

    // 로그 리스트
    logList: document.getElementById('game-log-list'),

    // 기존 요소들
    resGrid: document.querySelector('.resource-grid'),
    houseName: document.getElementById('house-name'),
    houseDesc: document.getElementById('house-desc'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    btns: {
        wood: document.getElementById('btn-gather-wood'),
        stone: document.getElementById('btn-gather-stone'),
        ironOre: document.getElementById('btn-gather-iron'),
        copperOre: document.getElementById('btn-gather-copper'),
        plank: document.getElementById('btn-craft-plank')
    },
    buildingList: document.getElementById('building-list'),
    headerLog: document.getElementById('message-log') // 헤더의 임시 로그
};

const resNames = {
    wood: "🌲 나무", stone: "🪨 돌", 
    ironOre: "⚙️ 철광석", copperOre: "🥉 구리광석",
    plank: "🪵 판자", brick: "🧱 벽돌",
    ironPlate: "⬜ 철판", copperPlate: "🟧 구리판",
    gear: "⚙️ 톱니", circuit: "📟 회로"
};

function formatNumber(num) {
    if (num == null) return "0";
    if (num < 1000) return Math.floor(num).toLocaleString();
    const suffixes = ["k", "m", "b", "t", "q"];
    const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
    let shortValue = parseFloat((suffixNum != 0 ? (num / Math.pow(1000, suffixNum)) : num).toPrecision(3));
    if (shortValue % 1 != 0) shortValue = shortValue.toFixed(1);
    return shortValue + suffixes[suffixNum - 1];
}

// ⭐ [기능 추가] 탭 전환 함수
export function switchTab(tabName) {
    // 1. 모든 뷰 숨김
    elements.viewDashboard.classList.add('hidden');
    elements.viewLog.classList.add('hidden');
    
    // 2. 모든 네비 버튼 비활성화
    elements.navDashboard.classList.remove('active');
    elements.navLog.classList.remove('active');

    // 3. 선택된 탭만 활성화
    if (tabName === 'dashboard') {
        elements.viewDashboard.classList.remove('hidden');
        elements.navDashboard.classList.add('active');
    } else if (tabName === 'log') {
        elements.viewLog.classList.remove('hidden');
        elements.navLog.classList.add('active');
    }
}

// ⭐ [기능 수정] 로그 함수: 헤더 표시 + 리스트 추가
export function log(msg, isImportant = false) {
    // 1. 상단 헤더에 잠시 보여주기 (기존 기능)
    if(elements.headerLog) {
        elements.headerLog.innerText = msg;
        elements.headerLog.style.opacity = 1;
        setTimeout(() => { elements.headerLog.style.opacity = 0.5; }, 3000);
    }

    // 2. 로그 탭 리스트에 영구 기록 (신규 기능)
    if(elements.logList) {
        const li = document.createElement('li');
        li.className = 'log-entry';
        
        const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
        
        // 중요 메시지(업그레이드 등)는 색상 강조
        const contentClass = isImportant ? 'log-msg log-highlight' : 'log-msg';
        
        li.innerHTML = `
            <span class="log-time">[${time}]</span>
            <span class="${contentClass}">${msg}</span>
        `;
        
        // 최신 글이 위로 오게
        elements.logList.prepend(li);
        
        // 로그가 너무 많이 쌓이면 삭제 (성능 최적화, 50개 유지)
        if (elements.logList.children.length > 50) {
            elements.logList.removeChild(elements.logList.lastChild);
        }
    }
}

export function updateScreen(netMPS) {
    for (let key in gameData.resources) {
        let card = document.getElementById(`card-${key}`);
        if (!card) {
            card = createResourceCard(key);
            elements.resGrid.appendChild(card);
        }
        
        const val = gameData.resources[key] || 0;
        const mps = netMPS[key] || 0;
        
        const amountEl = card.querySelector('.res-amount');
        amountEl.innerText = formatNumber(val);
        
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
    checkUnlocks();
}

function createResourceCard(key) {
    const div = document.createElement('div');
    div.className = `res-card ${key}`;
    div.id = `card-${key}`;
    div.innerHTML = `
        <div class="res-header">
            <span class="res-name">${resNames[key] || key}</span>
        </div>
        <div class="res-body">
            <span style="font-size:0.8rem; color:#aaa; display:block;">현재 보유</span>
            <h3 class="res-amount">0</h3>
        </div>
        <div class="res-footer">
            <small class="res-mps">+0.0 /초</small>
        </div>
    `;
    return div;
}

function checkUnlocks() {
    const lv = gameData.houseLevel;
    const woodCount = gameData.resources.wood || 0;
    
    if (lv >= 1 || woodCount >= 10) {
        if(elements.btns.stone) elements.btns.stone.classList.remove('hidden');
        if(elements.btns.plank) elements.btns.plank.classList.remove('hidden');
    } else {
        if(elements.btns.stone) elements.btns.stone.classList.add('hidden');
        if(elements.btns.plank) elements.btns.plank.classList.add('hidden');
    }

    if (lv >= 2) { if(elements.btns.ironOre) elements.btns.ironOre.classList.remove('hidden'); }
    else { if(elements.btns.ironOre) elements.btns.ironOre.classList.add('hidden'); }

    if (lv >= 3) { if(elements.btns.copperOre) elements.btns.copperOre.classList.remove('hidden'); }
    else { if(elements.btns.copperOre) elements.btns.copperOre.classList.add('hidden'); }
}

export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    gameData.buildings.forEach((b, index) => {
        const div = document.createElement('div');
        div.className = `shop-item`;
        div.id = `build-${index}`;
        
        const cost = getCostFunc(b);
        let costTxt = Object.entries(cost)
            .map(([k, v]) => `${formatNumber(v)} ${resNames[k].split(' ')[1]}`)
            .join(', ');

        let processTxt = "";
        if (b.inputs) {
            let inTxt = Object.entries(b.inputs).map(([k,v]) => `${v} ${resNames[k].split(' ')[1]}`).join(',');
            processTxt += `<span style="color:#e74c3c">-${inTxt}</span> `;
        }
        if (b.outputs) {
             let outTxt = Object.entries(b.outputs).map(([k,v]) => `${v} ${resNames[k].split(' ')[1]}`).join(',');
             processTxt += `➡ <span style="color:#2ecc71">+${outTxt}</span> /s`;
        }

        div.innerHTML = `
            <div style="flex:1;">
                <div style="font-weight:bold; font-size:1.05em;">${b.name} <span style="font-size:0.8em; color:#f39c12;">(Lv.${b.count})</span></div>
                <div style="font-size:0.85em; margin-top:5px; color:#ddd;">${processTxt}</div>
            </div>
            <div style="text-align:right; font-size:0.9em;">
                <span class="cost-text">${costTxt}</span>
            </div>
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

    elements.houseName.innerText = `🏡 Lv.${gameData.houseLevel} ${currentStage.name}`;
    elements.houseDesc.innerText = currentStage.desc;

    if (nextStage) {
        const req = nextStage.req;
        const reqTxt = Object.entries(req)
            .map(([k,v]) => `${resNames[k].split(' ')[1]} ${formatNumber(v)}`)
            .join(', ');
        
        elements.upgradeBtn.innerText = `⬆️ 진화: ${nextStage.name} (${reqTxt})`;
        elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        
        let canUp = true;
        for(let k in req) {
            if((gameData.resources[k] || 0) < req[k]) canUp = false;
        }
        elements.upgradeBtn.disabled = !canUp;
    } else {
        elements.upgradeBtn.innerText = "🚀 우주 진출 성공!";
        elements.upgradeBtn.disabled = true;
    }
}

export const uiElements = elements;