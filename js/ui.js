import { gameData, houseStages } from './data.js';

// DOM 요소 캐싱 (미리 찾아둠)
const elements = {
    wood: document.getElementById('res-wood'),
    stone: document.getElementById('res-stone'),
    iron: document.getElementById('res-iron'),
    mpsWood: document.getElementById('mps-wood'),
    mpsStone: document.getElementById('mps-stone'),
    mpsIron: document.getElementById('mps-iron'),
    houseName: document.getElementById('house-name'),
    houseDesc: document.getElementById('house-desc'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    btns: {
        wood: document.getElementById('btn-gather-wood'),
        stone: document.getElementById('btn-gather-stone'),
        iron: document.getElementById('btn-gather-iron')
    },
    buildingList: document.getElementById('building-list'),
    log: document.getElementById('message-log')
};

export function log(msg) {
    elements.log.innerText = msg;
    elements.log.style.opacity = 1;
    setTimeout(() => { elements.log.style.opacity = 0.5; }, 2000);
}

// 아이콘 헬퍼
function getResIcon(type) {
    const icons = { wood: '🌲', stone: '🪨', iron: '⚙️' };
    return icons[type] || '';
}

// 메인 화면 업데이트
export function updateScreen(mps) {
    // 자원 표시
    elements.wood.innerText = Math.floor(gameData.resources.wood).toLocaleString();
    elements.stone.innerText = Math.floor(gameData.resources.stone).toLocaleString();
    elements.iron.innerText = Math.floor(gameData.resources.iron).toLocaleString();

    // MPS 표시
    elements.mpsWood.innerText = `+${mps.wood.toFixed(1)}/초`;
    elements.mpsStone.innerText = `+${mps.stone.toFixed(1)}/초`;
    elements.mpsIron.innerText = `+${mps.iron.toFixed(1)}/초`;

    // 버튼 잠금 상태
    checkUnlocks();
}

function checkUnlocks() {
    // 돌
    if (gameData.houseLevel >= 1) {
        elements.btns.stone.classList.remove('locked');
        elements.btns.stone.innerText = "🪨 돌 캐기";
    } else {
        elements.btns.stone.classList.add('locked');
    }
    // 철
    if (gameData.houseLevel >= 2) {
        elements.btns.iron.classList.remove('locked');
        elements.btns.iron.innerText = "⚙️ 철광석 캐기";
    } else {
        elements.btns.iron.classList.add('locked');
    }
}

// 상점 그리기 (초기 1회 및 구매 시 갱신)
export function renderShop(onBuyCallback, getCostFunc) {
    elements.buildingList.innerHTML = "";
    gameData.buildings.forEach((b, index) => {
        const div = document.createElement('div');
        div.className = `shop-item type-${b.type}`;
        div.id = `build-${index}`;
        
        // 비용 계산
        const cost = getCostFunc(b);
        let costTxt = Object.entries(cost).map(([k, v]) => `${getResIcon(k)} ${v}`).join(' ');

        div.innerHTML = `
            <div>
                <strong>${b.name}</strong> <br>
                <small>보유: ${b.count} | +${b.production}/초</small>
            </div>
            <div style="text-align:right">
                <span class="cost-text">${costTxt}</span>
            </div>
        `;
        
        div.onclick = () => onBuyCallback(index);
        elements.buildingList.appendChild(div);
    });
    
    // 버튼 활성/비활성 상태 업데이트
    updateShopButtons(getCostFunc);
}

// 상점 버튼 상태만 빠르게 업데이트 (매 프레임 호출 가능)
export function updateShopButtons(getCostFunc) {
    gameData.buildings.forEach((b, index) => {
        const div = document.getElementById(`build-${index}`);
        if(!div) return;

        const cost = getCostFunc(b);
        const canBuy = 
            gameData.resources.wood >= (cost.wood || 0) &&
            gameData.resources.stone >= (cost.stone || 0) &&
            gameData.resources.iron >= (cost.iron || 0);
        
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
        const reqTxt = Object.entries(req).filter(([k,v]) => v > 0).map(([k,v]) => `${getResIcon(k)} ${v}`).join(' ');
        
        elements.upgradeBtn.innerText = `⬆️ 다음: ${nextStage.name} (${reqTxt})`;
        elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        
        // 활성화 체크
        const canUp = gameData.resources.wood >= (req.wood||0) && gameData.resources.stone >= (req.stone||0) && gameData.resources.iron >= (req.iron||0);
        elements.upgradeBtn.disabled = !canUp;
    } else {
        elements.upgradeBtn.innerText = "🚀 우주 정복 완료!";
        elements.upgradeBtn.disabled = true;
    }
}

// 버튼 요소 반환 (이벤트 연결용)
export const uiElements = elements;