// js/ui.js

import { gameData, houseStages } from './data.js';

const elements = {
    // 자원 컨테이너 (그리드)
    resGrid: document.querySelector('.resource-grid'),
    houseName: document.getElementById('house-name'),
    houseDesc: document.getElementById('house-desc'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    // 수동 버튼들
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

// 자원 이름 한글 매핑
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

// 화면 전체 업데이트
export function updateScreen(netMPS) {
    // 자원 카드 업데이트 (없으면 생성, 있으면 갱신)
    for (let key in gameData.resources) {
        let card = document.getElementById(`card-${key}`);
        if (!card) {
            // 카드가 없으면 동적 생성
            card = createResourceCard(key);
            elements.resGrid.appendChild(card);
        }
        
        // 수치 갱신
        const val = gameData.resources[key];
        const mps = netMPS[key] || 0;
        
        card.querySelector('h3').innerText = Math.floor(val).toLocaleString();
        
        const mpsEl = card.querySelector('small');
        mpsEl.innerText = `${mps > 0 ? '+' : ''}${mps.toFixed(1)}/s`;
        
        // 생산량 색상 (양수: 초록, 음수: 빨강)
        if(mps < 0) mpsEl.style.color = "#e74c3c"; // Red
        else if(mps > 0) mpsEl.style.color = "#2ecc71"; // Green
        else mpsEl.style.color = "#95a5a6"; // Grey
    }

    checkUnlocks();
}

function createResourceCard(key) {
    const div = document.createElement('div');
    div.className = `res-card ${key}`;
    div.id = `card-${key}`;
    div.innerHTML = `
        <span>${resNames[key] || key}</span>
        <h3>0</h3>
        <small>+0/s</small>
    `;
    return div;
}

// 잠금 해제 체크
function checkUnlocks() {
    // 레벨에 따라 버튼 보이기/숨기기
    const lv = gameData.houseLevel;
    
    // 0: 나무
    // 1: 돌, 판자(수동)
    if (lv >= 1) {
        elements.btns.stone.classList.remove('hidden');
        elements.btns.plank.classList.remove('hidden');
    } else {
        elements.btns.stone.classList.add('hidden');
        elements.btns.plank.classList.add('hidden');
    }

    // 2: 철
    if (lv >= 2) elements.btns.ironOre.classList.remove('hidden');
    else elements.btns.ironOre.classList.add('hidden');

    // 3: 구리
    if (lv >= 3) elements.btns.copperOre.classList.remove('hidden');
    else elements.btns.copperOre.classList.add('hidden');
}

// 상점 렌더링
export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    gameData.buildings.forEach((b, index) => {
        const div = document.createElement('div');
        div.className = `shop-item`;
        div.id = `build-${index}`;
        
        // 비용 텍스트
        const cost = getCostFunc(b);
        let costTxt = Object.entries(cost)
            .map(([k, v]) => `${v} ${resNames[k].split(' ')[1]}`)
            .join(', ');

        // 공정 정보 (Input -> Output)
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
            <div>
                <strong>${b.name}</strong> <span style="font-size:0.8em; color:#aaa;">(Lv.${b.count})</span><br>
                <small>${processTxt}</small>
            </div>
            <div style="text-align:right; font-size:0.85em;">
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
            if(gameData.resources[k] < cost[k]) canBuy = false;
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
            if(gameData.resources[k] < req[k]) canUp = false;
        }
        elements.upgradeBtn.disabled = !canUp;
    } else {
        elements.upgradeBtn.innerText = "🚀 우주 진출 성공!";
        elements.upgradeBtn.disabled = true;
    }
}

export const uiElements = elements;