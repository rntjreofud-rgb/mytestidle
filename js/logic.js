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
    // ⭐ [안전장치] 연구 데이터가 없으면 빈 배열로 취급
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id)) {
            if (r.type === 'building' && r.target.includes(buildingId)) {
                multiplier *= r.value;
            }
        }
    });
    return multiplier;
}

export function calculateNetMPS() {
    let stats = {};
    for(let key in gameData.resources) {
        stats[key] = { prod: 0, cons: 0 };
    }

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            let speedMult = getBuildingMultiplier(b.id);

            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') {
                        stats[res].cons += b.inputs[res] * b.count * speedMult;
                    }
                }
            }
            if (b.outputs) {
                for (let res in b.outputs) {
                    if(res !== 'energy') {
                        stats[res].prod += b.outputs[res] * b.count * speedMult;
                    }
                }
            }
        }
    });
    return stats;
}

export function produceResources(deltaTime) {
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;

    // 1. 전력 생산
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let fuelEfficiency = 1.0;

            if(b.inputs) {
                for(let res in b.inputs) {
                    let needed = b.inputs[res] * b.count * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        fuelEfficiency = (gameData.resources[res] || 0) / needed;
                    }
                }
                if(fuelEfficiency > 0) {
                    for(let res in b.inputs) {
                        gameData.resources[res] -= (b.inputs[res] * b.count * speedMult * deltaTime) * fuelEfficiency;
                    }
                }
            }
            totalEnergyProd += (b.outputs.energy * b.count * speedMult) * fuelEfficiency;
        }
    });

    // 2. 전력 소모 집계
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            totalEnergyReq += b.inputs.energy * b.count * speedMult;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;

    let powerFactor = 1.0;
    if (totalEnergyReq > 0) {
        powerFactor = totalEnergyProd / totalEnergyReq;
        if (powerFactor > 1) powerFactor = 1.0;
    }

    // 3. 일반 생산
    gameData.buildings.forEach(b => {
        if (b.count === 0) return;
        if (b.outputs && b.outputs.energy) return;

        let speedMult = getBuildingMultiplier(b.id);
        let efficiency = 1.0 * speedMult;
        
        if (b.inputs && b.inputs.energy) {
            efficiency *= powerFactor;
        }

        if (b.inputs) {
            let maxPotential = 1.0; 
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let required = b.inputs[res] * b.count * deltaTime * efficiency;
                
                if(required > 0) {
                    if ((gameData.resources[res] || 0) < required) {
                        let ratio = (gameData.resources[res] || 0) / required; 
                        if (ratio < maxPotential) maxPotential = ratio;
                    }
                }
            }
            efficiency *= maxPotential;

            if (efficiency > 0) {
                for (let res in b.inputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] -= (b.inputs[res] * b.count * deltaTime) * efficiency;
                }
            }
        }

        if (efficiency > 0 && b.outputs) {
            for (let res in b.outputs) {
                gameData.resources[res] += (b.outputs[res] * b.count * deltaTime) * efficiency;
            }
        }
    });
}

export function getClickStrength() {
    let strength = 1; 
    // ⭐ [안전장치]
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id)) {
            if (r.type === 'manual') {
                strength += r.value;
            }
        }
    });
    return strength;
}

export function manualGather(type) {
    const amount = getClickStrength(); 

    if (type === 'wood') {
        gameData.resources.wood += amount;
        return true;
    }
    if (type === 'stone') {
        if (gameData.houseLevel >= 1 || gameData.resources.wood >= 10) {
            gameData.resources.stone += amount;
            return true;
        }
        return false;
    }
    if (['coal', 'ironOre', 'copperOre'].includes(type)) {
        if (gameData.houseLevel < 1) return false;
        gameData.resources[type] += amount;
        return true;
    }
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += 1;
            return true;
        }
    }
    return false;
}

export function tryBuyResearch(id) {
    // ⭐ [안전장치] 배열 없으면 생성
    if (!gameData.researches) gameData.researches = [];

    if (gameData.researches.includes(id)) return false;
    
    const research = researchList.find(r => r.id === id);
    if (!research) return false;
    
    if (research.reqResearch) {
        if (!gameData.researches.includes(research.reqResearch)) return false;
    }

    const cost = research.cost;
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) return false;
    }
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }
    
    gameData.researches.push(id);
    return true;
}

export function tryBuyBuilding(index) {
    const b = gameData.buildings[index];
    const cost = getBuildingCost(b);
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) return false;
    }
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }
    b.count++;
    return true;
}

export function tryUpgradeHouse(nextStage) {
    const req = nextStage.req;
    for (let r in req) {
        if (r === 'energy') { 
            if(gameData.resources.energy < req[r]) return false;
            continue; 
        }
        if ((gameData.resources[r] || 0) < req[r]) return false;
    }
    for (let r in req) {
        if (r === 'energy') continue;
        gameData.resources[r] -= req[r];
    }
    gameData.houseLevel++;
    return true;
}