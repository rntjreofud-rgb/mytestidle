import { gameData, houseStages, researchList } from './data.js';
import * as Logic from './logic.js';

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
    wood: "🌲나무", stone: "🪨돌", coal: "⚫석탄", ironOre: "⚙️철광", copperOre: "🥉구리광", 
    plank: "🪵판자", brick: "🧱벽돌", ironPlate: "⬜철판", copperPlate: "🟧구리판", 
    concrete: "🏢콘크리트", gear: "⚙️톱니", steel: "🏗️강철", circuit: "📟회로", energy: "⚡전력"
};

function formatNumber(num) {
    if (num == null || isNaN(num)) return "0";
    if (num < 1000) return Math.floor(num).toLocaleString();
    const suffixes = ["k", "m", "b", "t"];
    const suffixNum = Math.floor(("" + Math.floor(num)).length / 3);
    let shortValue = parseFloat((num / Math.pow(1000, suffixNum)).toPrecision(3));
    return shortValue + suffixes[suffixNum - 1];
}

export function switchTab(tabName) {
    [elements.viewDashboard, elements.viewPower, elements.viewResearch].forEach(v => v.classList.add('hidden'));
    [elements.navDashboard, elements.navPower, elements.navResearch].forEach(n => n.classList.remove('active'));
    if (tabName === 'dashboard') { elements.viewDashboard.classList.remove('hidden'); elements.navDashboard.classList.add('active'); renderShop(cachedBuyCallback, Logic.getBuildingCost); }
    else if (tabName === 'power') { elements.viewPower.classList.remove('hidden'); elements.navPower.classList.add('active'); }
    else if (tabName === 'research') { elements.viewResearch.classList.remove('hidden'); elements.navResearch.classList.add('active'); renderResearchTab(); }
}

export function log(msg, isImportant = false) {
    if(elements.headerLog) { elements.headerLog.innerText = msg; elements.headerLog.style.opacity = 1; setTimeout(() => { elements.headerLog.style.opacity = 0.5; }, 3000); }
    if(elements.logList) {
        const li = document.createElement('li');
        li.className = 'log-entry';
        li.innerHTML = `<span class="log-time">${new Date().toLocaleTimeString('ko-KR', {hour12:false})}</span><span class="${isImportant?'log-highlight':''}">${msg}</span>`;
        elements.logList.prepend(li);
        if (elements.logList.children.length > 50) elements.logList.removeChild(elements.logList.lastChild);
    }
}

function checkDiscovery() {
    if(!gameData.unlockedResources) gameData.unlockedResources = ['wood', 'stone', 'plank'];
    gameData.buildings.forEach(b => {
        const isVisible = (b.reqLevel === 0.5 && (gameData.houseLevel >= 1 || (gameData.resources.wood || 0) >= 10)) || (gameData.houseLevel >= b.reqLevel);
        if (isVisible) {
            if (b.inputs) Object.keys(b.inputs).forEach(k => { if(!gameData.unlockedResources.includes(k)) gameData.unlockedResources.push(k); });
            if (b.outputs) Object.keys(b.outputs).forEach(k => { if(!gameData.unlockedResources.includes(k)) gameData.unlockedResources.push(k); });
        }
    });
}

export function updateScreen(stats) {
    checkDiscovery();
    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;
        if (!gameData.unlockedResources.includes(key)) continue;
        let card = document.getElementById(`card-${key}`);
        if (!card) { card = createResourceCard(key); elements.resGrid.appendChild(card); }
        const prod = stats[key]?.prod || 0, cons = stats[key]?.cons || 0, net = prod - cons;
        card.querySelector('.res-amount').innerText = formatNumber(gameData.resources[key]);
        const mpsEl = card.querySelector('.res-mps');
        if (prod > 0 && cons > 0) mpsEl.innerHTML = `<span style="color:#2ecc71">+${formatNumber(prod)}</span>|<span style="color:#e74c3c">-${formatNumber(cons)}</span>/s`;
        else {
            mpsEl.style.color = net < 0 ? "#e74c3c" : (net > 0 ? "#2ecc71" : "#7f8c8d");
            mpsEl.innerText = `${net >= 0 ? '▲' : '▼'} ${formatNumber(Math.abs(net))}/s`;
        }
    }
    const p = gameData.resources.energy || 0, r = gameData.resources.energyMax || 0;
    if(elements.powerDisplay) elements.powerDisplay.innerHTML = `<span style="color:#2ecc71">${formatNumber(p)} MW</span> / <span style="color:#e74c3c">${formatNumber(r)} MW</span>`;
    if(elements.powerBar) { elements.powerBar.style.width = `${Math.min(100, r>0?(p/r)*100:100)}%`; elements.powerBar.style.backgroundColor = p >= r ? '#2ecc71' : '#e74c3c'; }
    if(!elements.viewResearch.classList.contains('hidden')) updateResearchButtons();
    checkUnlocks();
}

function createResourceCard(key) {
    const div = document.createElement('div');
    div.className = `res-card ${key}`;
    div.id = `card-${key}`;
    div.innerHTML = `<div class="res-header"><span class="res-name">${resNames[key]||key}</span></div><div class="res-body"><h3>0</h3></div><div class="res-footer"><small class="res-mps">+0/s</small></div>`;
    return div;
}

function checkUnlocks() {
    const disc = gameData.unlockedResources;
    const toggle = (el, show) => { if(el) show ? el.classList.remove('hidden') : el.classList.add('hidden'); };
    toggle(elements.btns.stone, disc.includes('stone'));
    toggle(elements.btns.plank, disc.includes('plank'));
    toggle(elements.btns.coal, disc.includes('coal'));
    toggle(elements.btns.ironOre, disc.includes('ironOre'));
    toggle(elements.btns.copperOre, disc.includes('copperOre'));
    if(elements.navPower) elements.navPower.style.display = (gameData.houseLevel >= 2) ? 'flex' : 'none';
}

export function renderResearchTab() {
    const container = document.getElementById('research-list-container');
    container.innerHTML = "";
    researchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id), isUn = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;
        if (!isDone && !isUn) return;
        const div = document.createElement('div');
        div.className = `shop-item ${isDone ? 'done disabled' : ''}`;
        let cost = Object.entries(r.cost).map(([k, v]) => `${formatNumber(v)}${resNames[k]?.split(')')[0].slice(-2)||k}`).join(' ');
        div.innerHTML = `<span class="si-name">${r.name}</span><span class="si-level">${isDone?'✓':''}</span><div class="si-desc">${r.desc}</div><div class="si-cost">${isDone?'완료':cost}</div>`;
        if (!isDone) div.onclick = () => { if(Logic.tryBuyResearch(r.id)) { log(`🔬 연구 완료: ${r.name}`, true); renderResearchTab(); renderShop(cachedBuyCallback, Logic.getBuildingCost); } };
        container.appendChild(div);
    });
}

function updateResearchButtons() {
    researchList.forEach(r => {
        const div = document.getElementById(`research-${r.id}`);
        if(!div || gameData.researches.includes(r.id)) return;
        let can = true;
        for(let k in r.cost) if((gameData.resources[k] || 0) < r.cost[k]) can = false;
        can ? div.classList.remove('disabled') : div.classList.add('disabled');
    });
}

export function renderShop(onBuyCallback, getCostFunc) {
    if(onBuyCallback) cachedBuyCallback = onBuyCallback;
    elements.buildingList.innerHTML = "";
    const isStone = (gameData.houseLevel >= 1 || (gameData.resources.wood || 0) >= 10);
    gameData.buildings.forEach((b, index) => {
        if ((b.reqLevel === 0.5 && !isStone) || (b.reqLevel >= 1 && gameData.houseLevel < b.reqLevel)) return;
        const div = document.createElement('div');
        div.className = `shop-item`;
        const costObj = getCostFunc(b), costTxt = Object.entries(costObj).map(([k, v]) => `${formatNumber(v)}${resNames[k]?.slice(-2)||k}`).join(' ');
        let speed = Logic.getBuildingMultiplier(b.id);
        let inT = b.inputs ? Object.entries(b.inputs).map(([k,v]) => `${formatNumber(v*speed)}${k==='energy'?'⚡':resNames[k]?.slice(-2)}`).join(',') : "";
        let outT = b.outputs ? Object.entries(b.outputs).map(([k,v]) => `${formatNumber(v*speed)}${k==='energy'?'⚡':resNames[k]?.slice(-2)}`).join(',') : "";
        div.innerHTML = `<span class="si-name">${b.name}</span><span class="si-level">Lv.${b.count}</span><div class="si-desc">${inT?'-'+inT+' ':''}➡${outT}/s</div><div class="si-cost">${costTxt}</div>`;
        div.onclick = () => { if(cachedBuyCallback) cachedBuyCallback(index); };
        elements.buildingList.appendChild(div);
    });
}

export function updateShopButtons(getCostFunc) {
    gameData.buildings.forEach((b, index) => {
        const div = document.getElementById(`build-${index}`);
        if(!div) return;
        const cost = getCostFunc(b);
        let can = true;
        for(let k in cost) if((gameData.resources[k] || 0) < cost[k]) can = false;
        can ? div.classList.remove('disabled') : div.classList.add('disabled');
    });
}

export function updateHouseUI(onUpgrade) {
    const next = houseStages[gameData.houseLevel + 1], curr = houseStages[gameData.houseLevel];
    elements.houseName.innerText = `Lv.${gameData.houseLevel} ${curr.name}`;
    elements.houseDesc.innerText = curr.desc;
    if (next) {
        const reqT = Object.entries(next.req).map(([k,v]) => `${resNames[k]?.slice(-2)}${formatNumber(v)}`).join(',');
        elements.upgradeBtn.innerText = `⬆️ ${next.name} (${reqT})`;
        elements.upgradeBtn.onclick = () => onUpgrade(next);
        let can = true;
        for(let k in next.req) if((gameData.resources[k] || 0) < next.req[k]) can = false;
        elements.upgradeBtn.disabled = !can;
    } else { elements.upgradeBtn.innerText = "🚀 완료"; elements.upgradeBtn.disabled = true; }
}

export const uiElements = elements;