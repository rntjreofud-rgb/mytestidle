import { gameData, getActiveStages, getActiveResearch, getActivePlanetData, legacyList } from '../core/data.js';
import * as Logic from '../core/logic.js';
import { elements, resourceGroups, buildingGroups, resNames } from './ui_constants.js';
import { formatNumber, getResNameOnly, getResEmoji, log } from './ui_utils.js';

// 내부 상태 유지 변수
export let cachedBuyCallback = null;
const collapsedState = {};

// 전역 함수 등록 (버튼 클릭용)
window.adjustActiveCount = function(id, delta) {
    const b = gameData.buildings.find(build => build.id === id);
    if (b) {
        b.activeCount = Math.max(0, Math.min(b.count, b.activeCount + delta));
        const netMPS = Logic.calculateNetMPS();
        updateScreen(netMPS);
    }
};

let isGridInitialized = false;

function initResourceGrid() {
    if (isGridInitialized === gameData.currentPlanet) return;
    
    elements.resGrid.innerHTML = "";
    elements.resGrid.style.display = "block";

    for (const [key, group] of Object.entries(resourceGroups)) {
        if (group.planet !== gameData.currentPlanet) continue;

        const titleContainer = document.createElement('div');
        titleContainer.className = 'res-category-title';
        titleContainer.innerHTML = `
            <span>${group.title} <span class="toggle-arrow">▼</span></span>
            <div class="title-ctrls"><span class="btn-size-toggle" data-key="${key}">슬림</span></div>
        `;
        
        const container = document.createElement('div');
        container.className = 'sub-res-grid';
        container.id = `grid-group-${key}`;

        titleContainer.querySelector('span').onclick = () => {
            titleContainer.classList.toggle('collapsed');
            container.classList.toggle('collapsed-content');
        };

        titleContainer.querySelector('.btn-size-toggle').onclick = (e) => {
            e.stopPropagation();
            container.classList.toggle('slim-mode');
            e.target.innerText = container.classList.contains('slim-mode') ? "기본" : "슬림";
        };

        elements.resGrid.appendChild(titleContainer);
        elements.resGrid.appendChild(container);
    }
    isGridInitialized = gameData.currentPlanet;
}

function checkResourceDiscovery() {
    const planetTemplate = getActivePlanetData();
    if(!gameData.unlockedResources || gameData.unlockedResources.length === 0) {
        gameData.unlockedResources = [...planetTemplate.initialResources];
    }

    const discovered = new Set(gameData.unlockedResources);

    gameData.buildings.forEach(b => {
        const req = b.reqLevel || 0;
        if (gameData.houseLevel >= req) {
            if (b.inputs) Object.keys(b.inputs).forEach(k => { if(k !== 'energy') discovered.add(k); });
            if (b.outputs) Object.keys(b.outputs).forEach(k => { if(k !== 'energy') discovered.add(k); });
        }
    });
    
    for (let key in gameData.resources) {
        const val = gameData.resources[key];
        if (val > 0 && !isNaN(val) && key !== 'energy' && key !== 'energyMax') {
            discovered.add(key);
        }
    }
    
    gameData.unlockedResources = Array.from(discovered);
}

function createResourceCard(key) {
    const div = document.createElement('div');
    div.className = `res-card ${key}`;
    div.id = `card-${key}`;
    div.innerHTML = `<div class="res-header"><span class="res-name">${resNames[key] || key}</span></div><div class="res-body"><span style="font-size:0.7rem; color:#666;">보유</span><h3 class="res-amount">0</h3></div><div class="res-footer"><small class="res-mps">+0.0/s</small></div>`;
    return div;
}

export function updateScreen(stats) {
    checkResourceDiscovery();
    initResourceGrid();

    const planet = gameData.currentPlanet || 'earth';
    const powerProd = gameData.resources.energy || 0;
    const powerReq = gameData.resources.energyMax || 0;
    const isPowerShort = powerProd < powerReq;

    for (let key in gameData.resources) {
        if(key === 'energy' || key === 'energyMax') continue;
        if (!gameData.unlockedResources.includes(key)) continue;

        let targetGroupId = null;
        for (const [groupKey, groupData] of Object.entries(resourceGroups)) {
            if (groupData.planet === planet && groupData.items.includes(key)) {
                targetGroupId = `grid-group-${groupKey}`;
                break;
            }
        }

        if (!targetGroupId) continue;

        let card = document.getElementById(`card-${key}`);
        if (!card) {
            card = createResourceCard(key);
            const container = document.getElementById(targetGroupId);
            if(container) container.appendChild(card);
        }

        const val = gameData.resources[key] || 0;
        const prod = stats[key] ? stats[key].prod : 0;
        const cons = stats[key] ? stats[key].cons : 0;
        const net = prod - cons;
        
        card.classList.remove('res-warning', 'res-danger');
        
        if (net < -0.01 && val > 0.5) {
            card.classList.add('res-warning');
        } else if (val <= 0.5 && cons > 0 && net <= 0.01) {
            card.classList.add('res-danger');
        }

        card.querySelector('.res-amount').innerText = formatNumber(val);
        const mpsEl = card.querySelector('.res-mps');
        let powerWarning = isPowerShort ? `<span style="color:#f1c40f; font-size:0.7rem;">⚡</span>` : "";

        if (stats[key] && stats[key].prod > 0 && stats[key].cons > 0) {
            mpsEl.innerHTML = `<span style="color:#2ecc71">+${formatNumber(stats[key].prod)}</span>|<span style="color:#e74c3c">-${formatNumber(stats[key].cons)}</span>/s${powerWarning}`;
        } else {
            let mpsValue = Math.abs(net);
            let mpsText = mpsValue < 10 && mpsValue > 0 ? net.toFixed(1) : formatNumber(net);
            
            if(net < 0) { mpsEl.style.color = "#e74c3c"; mpsEl.innerText = `▼ ${mpsText}/s`; }
            else if(net > 0) { mpsEl.style.color = "#2ecc71"; mpsEl.innerText = `▲ ${mpsText}/s`; }
            else { mpsEl.style.color = "#7f8c8d"; mpsEl.innerText = `+0.0/s`; }
            
            if (isPowerShort && net !== 0) mpsEl.innerHTML += powerWarning;
        }
    }
    
    updatePowerUI();
    if(!elements.viewResearch.classList.contains('hidden')) updateResearchButtons();
    checkUnlocks();
    updatePrestigeUI();
}



export function updatePowerUI() {
    const prod = gameData.resources.energy || 0;
    const req = gameData.resources.energyMax || 0;
    const percent = req > 0 ? (prod / req) * 100 : 100;
    const powerColor = (prod >= req) ? '#2ecc71' : '#e74c3c';

    if(elements.powerDisplay) elements.powerDisplay.innerHTML = `<span style="color:#2ecc71">${formatNumber(prod)} MW</span> 생산 / <span style="color:#e74c3c">${formatNumber(req)} MW</span> 소비`;
    if(elements.powerBar) {
        elements.powerBar.style.width = `${Math.min(100, percent)}%`;
        elements.powerBar.style.backgroundColor = powerColor;
        if (prod < req) elements.powerBar.classList.add('power-low');
        else elements.powerBar.classList.remove('power-low');
    }

    if (elements.dashPowerPanel && gameData.houseLevel >= 5) {
        elements.dashPowerPanel.classList.remove('hidden');
        elements.dashPowerText.innerHTML = `<span style="color:#2ecc71">${formatNumber(prod)}</span> / <span style="color:#e74c3c">${formatNumber(req)} MW</span>`;
        elements.dashPowerFill.style.width = `${Math.min(100, percent)}%`;
        elements.dashPowerFill.style.backgroundColor = powerColor;
    }

    const container = document.getElementById('power-breakdown-container');
    if (!container) return;
    if (!container.dataset.initialized) {
        container.innerHTML = ""; 
        container.style.background = "none";
        container.style.maxHeight = "none";
        container.dataset.initialized = "true";
    }

    for (const [groupKey, group] of Object.entries(buildingGroups)) {
        const ownedBuildings = gameData.buildings.filter(b => group.ids.includes(b.id) && b.count > 0);
        let sectionTitle = document.getElementById(`ctrl-title-${groupKey}`);
        let sectionGrid = document.getElementById(`ctrl-grid-${groupKey}`);

        if (ownedBuildings.length === 0) {
            if(sectionTitle) sectionTitle.style.display = "none";
            if(sectionGrid) sectionGrid.style.display = "none";
            continue;
        }

        if (!sectionTitle) {
            sectionTitle = document.createElement('div');
            sectionTitle.id = `ctrl-title-${groupKey}`;
            sectionTitle.className = 'build-category-title';
            sectionTitle.innerHTML = `${group.title} <span class="toggle-arrow">▼</span>`;
            sectionGrid = document.createElement('div');
            sectionGrid.id = `ctrl-grid-${groupKey}`;
            sectionGrid.className = 'sub-build-grid';
            sectionTitle.onclick = () => { 
                sectionTitle.classList.toggle('collapsed');
                sectionGrid.classList.toggle('collapsed-content'); };
            container.appendChild(sectionTitle);
            container.appendChild(sectionGrid);
        }
        sectionTitle.style.display = "flex";
        sectionGrid.style.display = "grid";

        ownedBuildings.forEach(b => {
            let ctrlCard = document.getElementById(`ctrl-card-${b.id}`);
            if (!ctrlCard) {
                ctrlCard = document.createElement('div');
                ctrlCard.id = `ctrl-card-${b.id}`;
                ctrlCard.className = 'shop-item';
                ctrlCard.style.cursor = "default";
                ctrlCard.innerHTML = `
                    <span class="si-name" style="font-size:0.85rem;"></span>
                    <span class="si-level" style="font-size:0.75rem; color:#ffd700;"></span>
                    <div class="si-desc" style="bottom:45px; right: 90px;"></div>
                    <div class="si-cost" style="top:auto; bottom:45px; right:14px; font-size:0.8rem;"></div>
                    <div class="si-ctrl-btns" style="position:absolute; bottom:8px; left:12px; right:12px; display:flex; gap:3px;">
                        <button class="b-adj" data-v="-10" style="flex:1; background:#444; color:#fff; border:none; border-radius:3px; cursor:pointer; padding:3px 0;">--</button>
                        <button class="b-adj" data-v="-1" style="flex:1; background:#e74c3c; color:#fff; border:none; border-radius:3px; cursor:pointer; font-weight:bold;">-</button>
                        <button class="b-adj" data-v="1" style="flex:1; background:#2ecc71; color:#fff; border:none; border-radius:3px; cursor:pointer; font-weight:bold;">+</button>
                        <button class="b-adj" data-v="10" style="flex:1; background:#444; color:#fff; border:none; border-radius:3px; cursor:pointer; padding:3px 0;">++</button>
                    </div>
                `;
                ctrlCard.querySelectorAll('.b-adj').forEach(btn => {
                    btn.onclick = (e) => {
                        e.stopPropagation();
                        window.adjustActiveCount(b.id, parseInt(btn.dataset.v));
                    };
                });
                sectionGrid.appendChild(ctrlCard);
            }

            const speedMult = Logic.getBuildingMultiplier(b.id);
            const consMult = Logic.getBuildingConsumptionMultiplier(b.id);
            const energyEff = Logic.getEnergyEfficiencyMultiplier(b.id);
            const prodBonus = Logic.getProductionBonus();
            const isOn = b.activeCount > 0;

            let energyImpact = 0;
            const isProducer = b.outputs && b.outputs.energy;
            const isConsumer = b.inputs && b.inputs.energy;

            if (isProducer) energyImpact = b.outputs.energy * b.activeCount * speedMult * prodBonus;
            else if (isConsumer) energyImpact = b.inputs.energy * b.activeCount * speedMult * consMult * energyEff;

            let prodText = "가동 중지";
            if (isOn) {
                const resKey = b.outputs ? Object.keys(b.outputs).find(k => k !== 'energy') : null;
                if (resKey) {
                    const finalOut = b.outputs[resKey] * b.activeCount * speedMult * prodBonus;
                    prodText = `<span style="color:#2ecc71">▲ ${formatNumber(finalOut)}${getResNameOnly(resKey)}/s</span>`;
                } else if (isProducer) {
                    prodText = `<span style="color:#2ecc71">에너지 생산 중</span>`;
                }
            }

            let energyText = "";
            if (isProducer) energyText = `<span style="color:#2ecc71">+${formatNumber(energyImpact)}MW</span>`;
            else if (isConsumer) energyText = `<span style="color:#e74c3c">-${formatNumber(energyImpact)}MW</span>`;

            ctrlCard.style.opacity = isOn ? "1" : "0.5";
            ctrlCard.querySelector('.si-name').innerText = b.name;
            ctrlCard.querySelector('.si-level').innerText = `${b.activeCount}/${b.count}`;
            ctrlCard.querySelector('.si-desc').innerHTML = prodText;
            ctrlCard.querySelector('.si-cost').innerHTML = energyText;
        });
    }
}

export function switchTab(tabName) {
    // 1. 모든 뷰 숨기기
    elements.viewDashboard.classList.add('hidden');
    elements.viewPower.classList.add('hidden');
    elements.viewResearch.classList.add('hidden');
    if (elements.viewTechTree) elements.viewTechTree.classList.add('hidden');
    if (elements.viewLegacy) elements.viewLegacy.classList.add('hidden');

    // 2. 모든 메뉴 활성화 상태 해제
    elements.navDashboard.classList.remove('active');
    elements.navPower.classList.remove('active');
    elements.navResearch.classList.remove('active');
    if (elements.navTechTree) elements.navTechTree.classList.remove('active');
    if (elements.navLegacy) elements.navLegacy.classList.remove('active');

    // 3. 선택된 탭 활성화 및 렌더링
    if (tabName === 'dashboard') {
        elements.viewDashboard.classList.remove('hidden');
        elements.navDashboard.classList.add('active');
        // Logic.getBuildingCost를 사용하기 위해 Logic이 import 되어 있어야 합니다.
        renderShop(cachedBuyCallback, Logic.getBuildingCost);
    } else if (tabName === 'power') {
        elements.viewPower.classList.remove('hidden');
        elements.navPower.classList.add('active');
    } else if (tabName === 'research') {
        elements.viewResearch.classList.remove('hidden');
        elements.navResearch.classList.add('active');
        renderResearchTab();
    } else if (tabName === 'tech-tree') {
        elements.viewTechTree.classList.remove('hidden');
        elements.navTechTree.classList.add('active');
        renderTechTree();
    } else if (tabName === 'legacy') {
        if (elements.viewLegacy) elements.viewLegacy.classList.remove('hidden');
        if (elements.navLegacy) elements.navLegacy.classList.add('active');
        renderLegacyTab();
    }
}


export function renderResearchTab() {
    const container = elements.viewResearch.querySelector('#research-list-container') || elements.viewResearch.querySelector('.action-box');
    if (!container) return;
    container.innerHTML = "";
    if (!gameData.researches) gameData.researches = [];

    const availableRes = [];
    const completedRes = [];
    const currentResearchList = getActiveResearch(); 

    currentResearchList.forEach(r => {
        const isDone = gameData.researches.includes(r.id);
        const isPrereqDone = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;
        let isTargetVisible = true;
        if (r.type === 'building' || r.type === 'consumption' || r.type === 'energyEff') {
            isTargetVisible = r.target.some(targetId => {
                const b = gameData.buildings.find(build => build.id === targetId);
                return b && gameData.houseLevel >= (b.reqLevel || 0);
            });
        }
        if (isDone) completedRes.push(r);
        else if (isPrereqDone && isTargetVisible) availableRes.push(r);
    });

    if (availableRes.length > 0) renderResearchSection("🔬 진행 가능한 연구", availableRes, false, container);
    if (completedRes.length > 0) renderResearchSection("✅ 완료된 기술", completedRes, true, container);
    updateResearchButtons();
}

function renderResearchSection(titleText, list, isDone, parentContainer) {
    const stateKey = `res_${titleText}`;
    const isCollapsed = collapsedState[stateKey] === true;

    const title = document.createElement('div');
    title.className = `research-section-title ${isCollapsed ? 'collapsed' : ''}`; 
    title.innerHTML = `${titleText} (${list.length}) <span class="toggle-arrow">▼</span>`;

    const subGrid = document.createElement('div');
    subGrid.className = `sub-build-grid ${isCollapsed ? 'collapsed-content' : ''}`; 

    title.onclick = () => {
        const isNowCollapsed = title.classList.toggle('collapsed');
        subGrid.classList.toggle('collapsed-content');
        collapsedState[stateKey] = isNowCollapsed;
    };

    parentContainer.appendChild(title);
    parentContainer.appendChild(subGrid);
    list.forEach(r => subGrid.appendChild(createResearchElement(r, isDone)));
}

function createResearchElement(r, isDone) {
    const div = document.createElement('div');
    div.className = `shop-item research-item ${isDone ? 'done disabled' : ''}`;
    div.id = `research-${r.id}`;
    
    let costTxt = Object.entries(r.cost)
        .map(([k, v]) => `${getResEmoji(k)} ${formatNumber(v)}`)
        .join(' ');
    let warning = (r.type === 'building' && r.value > 1) ? `<br><span style="color:#ff7675; font-size:0.7rem;">⚠️ 속도 증가 시 재료 소모량 비례 증가</span>` : "";

    div.innerHTML = `
        <span class="si-name">${r.name}</span>
        <span class="si-level">${isDone ? '✓' : ''}</span>
        <div class="si-desc">${r.desc}${warning}</div>
        <div class="si-cost">${isDone ? '연구 완료' : costTxt}</div>
    `;

    if (!isDone) {
        div.onclick = (e) => {
            e.stopPropagation();
            const result = Logic.tryBuyResearch(r.id); 
            if (result.success) { 
                log(`🔬 [연구 완료] ${r.name}`, true);
                renderResearchTab();
                renderShop(cachedBuyCallback, Logic.getBuildingCost);
            } else {
                const missingNames = result.missing.map(key => getResNameOnly(key)).join(', ');
                log(`❌ 연구 불가 (부족: ${missingNames})`);
            }
        };
    }
    return div;
}

export function updateResearchButtons() {
    getActiveResearch().forEach(r => {
        const div = document.getElementById(`research-${r.id}`);
        if(!div || gameData.researches.includes(r.id)) return;
        let canBuy = true;
        for(let k in r.cost) { if((gameData.resources[k] || 0) < r.cost[k]) canBuy = false; }
        if(canBuy) div.classList.remove('disabled'); else div.classList.add('disabled');
    });
}

export function checkUnlocks() {
    const p = gameData.currentPlanet || 'earth', disc = gameData.unlockedResources || [];
    const toggle = (el, show) => el && el.classList.toggle('hidden', !show);
    const isLegacy = (gameData.houseLevel >= 50 || (gameData.prestigeLevel || 0) > 0 || p !== 'earth');
    const isPrestiged = (gameData.prestigeLevel > 0 || p !== 'earth');
    
    const names = { earth: ["🌲 나무 베기", "🪨 돌 캐기", "⚫ 석탄 캐기"], aurelia: ["🔩 고철 줍기", "🧲 자석 수집", ""], veridian: ["🌿 섬유 채집", "🍄 포자 채취", ""] }[p];
    [elements.btns.wood, elements.btns.stone, elements.btns.coal].forEach((btn, i) => { if(btn) btn.innerText = names[i]; });

    toggle(elements.btns.wood, true);
    toggle(elements.btns.stone, p !== 'earth' || disc.includes('stone'));
    toggle(elements.btns.coal, p === 'earth' && disc.includes('coal'));
    toggle(elements.btns.plank, p === 'earth' && disc.includes('plank'));
    toggle(elements.btns.ironOre, p === 'earth' && disc.includes('ironOre'));
    toggle(elements.btns.copperOre, p === 'earth' && disc.includes('copperOre'));

    if(elements.navPower) elements.navPower.style.display = (gameData.houseLevel >= 5 || p !== 'earth') ? 'flex' : 'none';
    if(elements.navLegacy) elements.navLegacy.style.display = isLegacy ? 'flex' : 'none';
    const lCat = document.getElementById('legacy-cat'); 
    if(lCat) lCat.style.display = isLegacy ? 'block' : 'none';

    const sBtn = document.getElementById('btn-become-star');
    if(sBtn) sBtn.style.display = (p !== 'earth') ? 'block' : 'none';
}

export function renderShop(onBuyCallback, getCostFunc) {
    if(onBuyCallback) cachedBuyCallback = onBuyCallback;
    if (!elements.buildingList) return;


     if (!gameData.buildings || gameData.buildings.length === 0) {
        console.warn("건물 데이터가 비어있습니다. 데이터 로드를 확인하세요.");
        return;
    }

    elements.buildingList.innerHTML = "";
    elements.buildingList.style.display = "block";

    const wood = gameData.resources.wood || 0;
    const firstBuilding = gameData.buildings[0];
    const isStoneUnlocked = (gameData.houseLevel >= 1 || wood >= 10 || (gameData.buildings[0] && gameData.buildings[0].count > 0));

    for (const [groupKey, group] of Object.entries(buildingGroups)) {
        const visibleBuildings = gameData.buildings.filter(b => {
            if (!group.ids.includes(b.id)) return false;
            const req = b.reqLevel || 0;
            if (req === 0.5) return isStoneUnlocked;
            return gameData.houseLevel >= req;
        });

        if (visibleBuildings.length === 0) continue;

        const isCollapsed = collapsedState[groupKey] === true;

        const title = document.createElement('div');
        title.className = `build-category-title ${isCollapsed ? 'collapsed' : ''}`;
        title.innerHTML = `${group.title} <span class="toggle-arrow">▼</span>`;
        const subGrid = document.createElement('div');
        subGrid.className = `sub-build-grid ${isCollapsed ? 'collapsed-content' : ''}`; 

        title.onclick = () => {
            const isNowCollapsed = title.classList.toggle('collapsed'); 
            title.classList.toggle('collapsed');
            subGrid.classList.toggle('collapsed-content');
            collapsedState[groupKey] = isNowCollapsed;
        };

        elements.buildingList.appendChild(title);
        elements.buildingList.appendChild(subGrid);

        visibleBuildings.forEach(b => {
            const index = gameData.buildings.findIndex(build => build.id === b.id);
            subGrid.appendChild(createBuildingElement(b, index, getCostFunc));
        });
    }
    updateShopButtons(getCostFunc);
}

function createBuildingElement(b, index, getCostFunc) {
    const div = document.createElement('div');
    div.className = `shop-item`;
    div.id = `build-${index}`;
    
    // ⭐ [NEW 표기 추가]
    const isNew = (b.count || 0) === 0;
    const newBadgeHtml = isNew ? `<span class="new-badge">NEW</span>` : "";

    const cost = getCostFunc(b);
     let costTxt = Object.entries(cost)
        .map(([k, v]) => `${getResEmoji(k)} ${formatNumber(v)}`)
        .join(' ');

    const speedMult = Logic.getBuildingMultiplier(b.id);
    const consMult = Logic.getBuildingConsumptionMultiplier(b.id);
    const energyEff = Logic.getEnergyEfficiencyMultiplier(b.id);
    const prodBonus = Logic.getProductionBonus();

    let inArr = b.inputs ? Object.entries(b.inputs).map(([k,v]) => {
        let finalVal = v * speedMult * consMult;
        if (k === 'energy') finalVal *= energyEff;
        return `${formatNumber(finalVal)}${k === 'energy' ? '⚡' : getResEmoji(k)}`;
    }) : [];
    
    // ⭐ [이모지 적용]: getResEmoji 사용
    let outArr = b.outputs ? Object.entries(b.outputs).map(([k,v]) => {
        let finalProd = v * speedMult;
        if (k !== 'energy') finalProd *= prodBonus;
        else finalProd *= prodBonus;
        return `${formatNumber(finalProd)}${k === 'energy' ? '⚡' : getResEmoji(k)}`;
    }) : [];
    
    let processTxt = "";
    if (inArr.length > 0) processTxt += `<span style="color:#e74c3c">-${inArr.join(' ')}</span> `;
    if (outArr.length > 0) processTxt += `➡ <span style="color:#2ecc71">+${outArr.join(' ')}</span>/s`;

    div.innerHTML = `
        ${newBadgeHtml}
        <span class="si-name">${b.name} <small style="color:#8892b0; font-weight:normal;">(${b.activeCount}/${b.count})</small></span>
        <span class="si-level">Lv.${b.count}</span>
        <div class="si-desc">${processTxt}</div>
        <div class="si-cost">${costTxt}</div>
    `;
    
    div.onclick = () => { if(cachedBuyCallback) cachedBuyCallback(index); };
    return div;
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

export function updatePrestigeUI() {
    const level = (gameData && gameData.prestigeLevel) ? gameData.prestigeLevel : 0;
    const headerPrestige = document.getElementById('header-prestige');
    const sideSmall = document.querySelector('.logo-area small');

    if (level > 0) {
        const prestigeText = `(⭐Lv.${level})`;
        if (headerPrestige) {
            headerPrestige.innerText = prestigeText;
            headerPrestige.style.display = "inline"; 
        }
        if (sideSmall) {
            sideSmall.innerHTML = `우주 항해 숙련도 <b style="color:#f1c40f;">Lv.${level}</b>`;
            sideSmall.style.color = "#f1c40f";
        }
    } else {
        if (headerPrestige) {
            headerPrestige.innerText = "";
            headerPrestige.style.display = "none";
        }
        if (sideSmall) {
            sideSmall.innerText = "IDLE GAME"; 
            sideSmall.style.color = "#f39c12"; 
        }
    }
}

export function updateHouseUI(onUpgrade) {
    // 1. 데이터 가져오기
    const stages = getActiveStages(); 
    if (!stages || stages.length === 0) return;

    const nextStage = stages[gameData.houseLevel + 1];
    const currentStage = stages[gameData.houseLevel] || { name: "최고 레벨", desc: "-" };
    
    // 2. 텍스트 업데이트
    if(elements.houseName) elements.houseName.innerText = `Lv.${gameData.houseLevel} ${currentStage.name}`;
    if(elements.houseDesc) elements.houseDesc.innerText = currentStage.desc;

    // 3. 다음 단계가 있을 경우
    if (nextStage) {
        elements.upgradeBtn.style.display = "flex";
        
        // 버튼 텍스트 생성
        const reqTxt = Object.entries(nextStage.req)
            .map(([k, v]) => {
                if (k === 'energy') return `⚡ ${formatNumber(v)}MW`; 
                return `${getResEmoji(k)} ${formatNumber(v)}`;
            })
            .join('  ');

        elements.upgradeBtn.innerText = `⬆️ ${nextStage.name} (${reqTxt})`;
        
        // ⭐ [핵심 수정] 로직 파일에 직접 물어봐서 정확도 일치시킴
        const isPossible = Logic.canUpgradeHouse(nextStage);

        // 버튼 상태 강제 적용 (매 프레임 실행됨)
        if (isPossible) {
            elements.upgradeBtn.disabled = false;
            elements.upgradeBtn.classList.remove('disabled'); // 스타일 확실하게 적용
            elements.upgradeBtn.style.opacity = "1";
            elements.upgradeBtn.style.cursor = "pointer";
            // 클릭 이벤트는 함수 참조가 계속 바뀌지 않도록 한 번만 연결하는 게 좋지만,
            // 현재 구조상 매번 연결해도 기능엔 문제 없음. 확실한 동작을 위해 유지.
            elements.upgradeBtn.onclick = () => onUpgrade(nextStage);
        } else {
            elements.upgradeBtn.disabled = true;
            elements.upgradeBtn.classList.add('disabled');
            elements.upgradeBtn.style.opacity = "0.5";
            elements.upgradeBtn.style.cursor = "not-allowed";
            elements.upgradeBtn.onclick = null;
        }
        
        const choiceDiv = document.getElementById('ending-choices');
        if(choiceDiv) choiceDiv.remove();

    } else {
        // 4. 엔딩 처리 (기존 코드 유지)
        elements.upgradeBtn.style.display = "none"; 
        
        if (!document.getElementById('ending-choices')) {
            const btnContainer = elements.upgradeBtn.parentElement; 
            const choiceDiv = document.createElement('div');
            choiceDiv.id = 'ending-choices';
            choiceDiv.style.cssText = "display:flex; gap:10px; width:100%;";

            choiceDiv.innerHTML = `
                <button id="btn-prestige-final" class="prestige-ready" style="flex:1; height:95px; font-weight:bold; border-radius:6px; cursor:pointer;">
                    ✨ 우주 유산 남기기<br><small>(데이터 +3 및 환생)</small>
                </button>
                <button id="btn-new-world" style="flex:1; height:95px; background:#4db5ff; color:#fff; font-weight:bold; border:none; border-radius:6px; cursor:pointer;">
                    🌌 새로운 세상 탐사<br><small>(beta 벨런스가 안맞을수 있습니다)</small>
                </button>
            `;
            btnContainer.appendChild(choiceDiv);

            document.getElementById('btn-prestige-final').onclick = () => {
                if(confirm("지구를 떠나시겠습니까? 모든 자원과 건물은 초기화되지만 영구적인 유산 보너스를 얻습니다.")) {
                    if (typeof window.performPrestige === 'function') window.performPrestige();
                }
            };
            document.getElementById('btn-new-world').onclick = () => showPlanetSelection();
        }
    }
}

function getResearchDepth(id) {
    const currentList = getActiveResearch();
    const research = currentList.find(r => r.id === id);
    if (!research || !research.reqResearch) return 0;
    return 1 + getResearchDepth(research.reqResearch);
}

export function renderTechTree() {
    const container = document.getElementById('tech-tree-content');
    if (!container) return;
    container.innerHTML = ""; 

    const currentList = getActiveResearch(); 
    if (!currentList || currentList.length === 0) {
        container.innerHTML = "<p style='color:#666; padding:20px;'>이 행성에는 아직 기록된 기술 문서가 없습니다.</p>";
        return;
    }

    const tiers = {};
    currentList.forEach(r => {
        const depth = getResearchDepth(r.id);
        if (!tiers[depth]) tiers[depth] = [];
        tiers[depth].push(r);
    });

    const sortedDepths = Object.keys(tiers).sort((a, b) => a - b);
    let lastTierName = "";

    const tierNames = {
        0: "Tier 1: 생존의 시작", 1: "Tier 1: 생존의 시작",
        2: "Tier 2: 원시 산업", 3: "Tier 2: 원시 산업",
        4: "Tier 3: 전기 및 회로 시대", 5: "Tier 3: 전기 및 회로 시대",
        6: "Tier 4: 화학 및 정유", 7: "Tier 4: 화학 및 정유",
        8: "Tier 5: 첨단 소재 및 티타늄", 9: "Tier 5: 첨단 소재 및 티타늄",
        10: "Tier 6: 지구 이별 준비"
    };

    sortedDepths.forEach(depth => {
        const currentTierName = tierNames[depth] || `Tier ${parseInt(depth / 2) + 1}: 심화 기술`;
        if (currentTierName !== lastTierName) {
            const header = document.createElement('div');
            header.className = 'tree-tier-header';
            header.innerText = currentTierName;
            container.appendChild(header);
            lastTierName = currentTierName;
        }

        const nodesContainer = document.createElement('div');
        nodesContainer.className = 'tree-nodes-container';

        tiers[depth].forEach(r => {
            const isDone = gameData.researches.includes(r.id);
            const isPrereqDone = r.reqResearch ? gameData.researches.includes(r.reqResearch) : true;
            const node = document.createElement('div');
            node.className = `tree-node ${isDone ? 'done' : (isPrereqDone ? 'available' : 'locked')}`;
            const parent = currentList.find(p => p.id === r.reqResearch);
            const parentName = parent ? `[${parent.name}]에서 연결` : "시작 기술";

            node.innerHTML = `
                <div class="tree-node-parent">${parentName}</div>
                <span class="tree-node-name">${r.name}</span>
                <span class="tree-node-status">${isDone ? '✅ 완료' : (isPrereqDone ? '💡 연구 가능' : '🔒 잠김')}</span>
            `;

            if (isPrereqDone && !isDone) {
                node.onclick = () => {
                    switchTab('research');
                    setTimeout(() => {
                        const targetEl = document.getElementById(`research-${r.id}`);
                        if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                };
            }
            nodesContainer.appendChild(node);
        });
        container.appendChild(nodesContainer);
    });
}

export function renderLegacyTab() {
    const listContainer = document.getElementById('legacy-upgrade-list');
    const dataDisplay = document.getElementById('cosmic-data-count');
    if (!listContainer || !dataDisplay) return;

    dataDisplay.innerText = formatNumber(gameData.cosmicData || 0);
    listContainer.innerHTML = "";

    legacyList.forEach(u => {
        const isBought = gameData.legacyUpgrades.includes(u.id);
        const isUnlocked = u.req ? gameData.legacyUpgrades.includes(u.req) : true;
        if (!isBought && !isUnlocked) return;

        const canAfford = (gameData.cosmicData || 0) >= u.cost;
        const div = document.createElement('div');
        div.className = `shop-item ${isBought ? 'done' : (canAfford ? '' : 'disabled')}`;
        
        div.innerHTML = `
            <span class="si-name">${u.name}</span>
            <span class="si-level">${isBought ? '✅ 적용 중' : '미해금'}</span>
            <div class="si-desc">${u.desc}</div>
            <div class="si-cost">${isBought ? '영구 보너스' : '비용: ' + u.cost + ' 데이터'}</div>
        `;

        if (!isBought && canAfford) {
            div.style.cursor = "pointer";
            div.onclick = () => {
                if (confirm(`'${u.name}' 보너스를 해금하시겠습니까?`)) {
                    gameData.cosmicData -= u.cost;
                    gameData.legacyUpgrades.push(u.id);
                    log(`✨ 유산 보너스 해금: ${u.name}`, true);
                    renderLegacyTab(); 
                    if (typeof renderShop === 'function') renderShop(cachedBuyCallback, Logic.getBuildingCost);
                }
            };
        }
        listContainer.appendChild(div);
    });
}

export function showPlanetSelection() {
    const oldModal = document.getElementById('planet-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'planet-modal';
    modal.style.cssText = "position:fixed; top:50%; left:50%; transform:translate(-50%,-50%); background:#16213e; padding:30px; border:2px solid #4db5ff; border-radius:15px; z-index:10000; text-align:center; color:white; min-width:350px; box-shadow:0 0 50px rgba(0,0,0,0.8);";
    
    modal.innerHTML = `
        <h2 style="color:#4db5ff; margin-bottom:10px;">어디로 탐사하시겠습니까?</h2>
        <p style="margin-bottom:25px; color:#8892b0; font-size:0.85rem;">행성 진입 시 기존 자원과 건물은 리셋되지만,<br><b>우주 숙련도(Prestige)와 유산</b>은 유지됩니다.</p>
        <div style="display:flex; flex-direction:column; gap:10px;">
            <button onclick="window.landOnPlanet('aurelia')" style="padding:15px; background:#2c3e50; border:1px solid #7f8c8d; border-radius:8px; cursor:pointer; color:white;">
                <div style="font-size:1.5rem;">🔩</div>
                <strong>아우렐리아 (Aurelia)</strong><br><small>금속과 자성이 가득한 황무지</small>
            </button>
            <button onclick="window.landOnPlanet('veridian')" style="padding:15px; background:#1b3d2f; border:1px solid #27ae60; border-radius:8px; cursor:pointer; color:white;">
                <div style="font-size:1.5rem;">🌿</div>
                <strong>베리디안 (Veridian)</strong><br><small>거대 생명체와 유기물의 정글</small>
            </button>
            <button onclick="this.parentElement.parentElement.remove()" style="margin-top:10px; background:none; border:none; color:#556; cursor:pointer; text-decoration:underline;">돌아가기</button>
        </div>
    `;
    document.body.appendChild(modal);
}

export function showOfflineReport(seconds, statsBefore) {
    const modal = document.getElementById('offline-modal');
    const timeText = document.getElementById('offline-time-text');
    const reportDiv = document.getElementById('offline-report');
    if (!modal) return;
    
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    timeText.innerText = `${hours}시간 ${mins}분 동안의 성과입니다.`;
    
    let reportHtml = "";
    for (let res in gameData.resources) {
        const net = (Logic.calculateNetMPS()[res]?.prod || 0) - (Logic.calculateNetMPS()[res]?.cons || 0);
        if (net > 0) {
            const gain = net * seconds;
            reportHtml += `<div>${resNames[res] || res}: <span style="color:#2ecc71">+${formatNumber(gain)}</span></div>`;
        }
    }
    reportDiv.innerHTML = reportHtml || "획득한 자원이 없습니다.";
    modal.classList.remove('hidden');
}

export function triggerWarpEffect(destName, callback) {
    const overlay = document.getElementById('warp-overlay');
    const destMsg = document.getElementById('warp-dest-msg');
    if (!overlay) return callback(); 
    destMsg.innerText = `목적지: ${destName}`;
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('active'), 10);
    setTimeout(() => { callback(); }, 2000);
}