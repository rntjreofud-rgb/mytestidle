import { gameData, researchList } from './data.js';

export function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count);
    let currentCost = {};
    for (let r in building.cost) {
        currentCost[r] = Math.floor(building.cost[r] * multiplier);
    }
    return currentCost;
}

export function getBuildingMultiplier(buildingId) {
    let multiplier = 1.0;
    const completed = gameData.researches || [];
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'building' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });
    return multiplier;
}

export function calculateNetMPS() {
    let stats = {};
    for(let key in gameData.resources) stats[key] = { prod: 0, cons: 0 };
    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            if (b.inputs) for (let res in b.inputs) if(res !== 'energy') stats[res].cons += b.inputs[res] * b.count * speedMult;
            if (b.outputs) for (let res in b.outputs) if(res !== 'energy') stats[res].prod += b.outputs[res] * b.count * speedMult;
        }
    });
    return stats;
}

export function produceResources(deltaTime) {
    let totalEnergyProd = 0, totalEnergyReq = 0;
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id), fuelEff = 1.0;
            if(b.inputs) {
                for(let res in b.inputs) {
                    let needed = b.inputs[res] * b.count * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) fuelEff = Math.min(fuelEff, (gameData.resources[res] || 0) / needed);
                }
                for(let res in b.inputs) gameData.resources[res] = Math.max(0, gameData.resources[res] - (b.inputs[res] * b.count * speedMult * deltaTime * fuelEff));
            }
            totalEnergyProd += (b.outputs.energy * b.count) * speedMult * fuelEff;
        }
    });
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) totalEnergyReq += b.inputs.energy * b.count * getBuildingMultiplier(b.id);
    });
    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;
    gameData.buildings.forEach(b => {
        if (b.count === 0 || (b.outputs && b.outputs.energy)) return;
        let speedMult = getBuildingMultiplier(b.id), efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);
        if (b.inputs) {
            let inEff = 1.0;
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let needed = b.inputs[res] * b.count * deltaTime * efficiency;
                if(needed > 0 && (gameData.resources[res] || 0) < needed) inEff = Math.min(inEff, (gameData.resources[res] || 0) / needed);
            }
            efficiency *= inEff;
            for (let res in b.inputs) if (res !== 'energy') gameData.resources[res] = Math.max(0, gameData.resources[res] - (b.inputs[res] * b.count * deltaTime * efficiency));
        }
        if (efficiency > 0 && b.outputs) for (let res in b.outputs) if (res !== 'energy') gameData.resources[res] += (b.outputs[res] * b.count * deltaTime * efficiency);
    });
}

export function manualGather(type) {
    let strength = 1;
    (gameData.researches || []).forEach(rid => {
        const r = researchList.find(res => res.id === rid);
        if(r && r.type === 'manual') strength += r.value;
    });
    if (type === 'wood') { gameData.resources.wood += strength; return true; }
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) { gameData.resources.wood -= 2; gameData.resources.plank += 1; return true; }
        return false;
    }
    const discovered = gameData.unlockedResources || ['wood', 'stone', 'plank'];
    if (!discovered.includes(type)) return false;
    gameData.resources[type] += strength;
    return true;
}

export function tryBuyResearch(id) {
    if (!gameData.researches) gameData.researches = [];
    if (gameData.researches.includes(id)) return false;
    const r = researchList.find(res => res.id === id);
    if (!r || (r.reqResearch && !gameData.researches.includes(r.reqResearch))) return false;
    for (let k in r.cost) if ((gameData.resources[k] || 0) < r.cost[k]) return false;
    for (let k in r.cost) gameData.resources[k] -= r.cost[k];
    gameData.researches.push(id);
    return true;
}

export function tryBuyBuilding(index) {
    const b = gameData.buildings[index], cost = getBuildingCost(b);
    for (let r in cost) if ((gameData.resources[r] || 0) < cost[r]) return false;
    for (let r in cost) gameData.resources[r] -= cost[r];
    b.count++;
    return true;
}

export function tryUpgradeHouse(nextStage) {
    for (let r in nextStage.req) if ((gameData.resources[r] || 0) < nextStage.req[r]) return false;
    for (let r in nextStage.req) gameData.resources[r] -= nextStage.req[r];
    gameData.houseLevel++;
    return true;
}