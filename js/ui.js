// js/ui.js

import { gameData, houseStages } from './data.js';

const elements = {
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
    log: document.getElementById('message-log')
};

const resNames = {
    wood: "🌲 나무", stone: "🪨 돌", 
    ironOre: "⚙️ 철광석", copperOre: "🥉 구리광석",
    plank: "🪵 판자", brick: "🧱 벽돌",
    ironPlate: "⬜ 철판", copperPlate: "🟧 구리판",
    gear: "⚙️ 톱니", circuit: "📟 회로"
};

export function log(msg) {
    if(elements.log) {
        elements.log.innerText = msg;
        elements.log.style.opacity = 1;
        setTimeout(() => { elements.log.style.opacity = 0.5; }, 2000);
    }
}

export function updateScreen(netMPS) {
    // 자원 루프
    for (let key in gameData.resources) {
        let card = document.getElementById(`card-${key}`);
        
        // 카드가 없으면 새로 생성
        if (!card) {
            card = createResourceCard(key);
            elements.resGrid.appendChild(card);
        }
        
        // 값 업데이트
        const val = gameData.resources[key] || 0; // 안전장치
        const mps = netMPS[key] || 0;
        
        // ⭐ 보유량 텍스트 업데이트 (명확하게 표시)
        const amountEl = card.querySelector('.res-amount');
        amountEl.innerText = Math.floor(val).toLocaleString();
        
        // 생산량 텍스트 업데이트
        const mpsEl = card.querySelector('.res-mps');
        mpsEl.innerText = `${mps > 0 ? '▲' : ''}${mps.toFixed(1)} /초`;
        
        // 생산량 색상 처리
        if(mps < 0) {
            mpsEl.style.color = "#e74c3c"; // 빨강 (감소 중)
            mpsEl.innerText = `▼ ${Math.abs(mps).toFixed(1)} /초`;
        } else if(mps > 0) {
            mpsEl.style.color = "#2ecc71"; // 초록 (증가 중)
        } else {
            mpsEl.style.color = "#7f8c8d"; // 회색 (변화 없음)
        }
    }

    checkUnlocks();
}

// ⭐ 카드 생성 HTML 구조 변경
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
    
    // 버튼 숨김/보임 처리
    if (lv >= 1) {
        elements.btns.stone.classList.remove('hidden');
        elements.btns.plank.classList.remove('hidden');
    } else {
        elements.btns.stone.classList.add('hidden');
        elements.btns.plank.classList.add('hidden');
    }

    if (lv >= 2) elements.btns.ironOre.classList.remove('hidden');
    else elements.btns.ironOre.classList.add('hidden');

    if (lv >= 3) elements.btns.copperOre.classList.remove('hidden');
    else elements.btns.copperOre.classList.add('hidden');
}

export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    gameData.buildings.forEach((b, index) => {
        const div = document.createElement('div');
        div.className = `shop-item`;
        div.id = `build-${index}`;
        
        const cost = getCostFunc(b);
        let costTxt = Object.entries(cost)
            .map(([k, v]) => `${v} ${resNames[k].split(' ')[1]}`)
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
            .map(([k,v]) => `${resNames[k].split(' ')[1]} ${v}`)
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