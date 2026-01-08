// js/logic.js

import { gameData, researchList } from './data.js'; // researchList import 추가

export function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count);
    let currentCost = {};
    for (let r in building.cost) {
        currentCost[r] = Math.floor(building.cost[r] * multiplier);
    }
    return currentCost;
}

export function calculateNetMPS() {
    let net = {};
    for(let key in gameData.resources) net[key] = 0;

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') net[res] -= b.inputs[res] * b.count;
                }
            }
            if (b.outputs) {
                for (let res in b.outputs) {
                    if(res !== 'energy') net[res] += b.outputs[res] * b.count;
                }
            }
        }
    });
    return net;
}

export function produceResources(deltaTime) {
    // 1. 전력 생산량 계산
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;

    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.outputs && b.outputs.energy) {
            let fuelEfficiency = 1.0;
            if(b.inputs) {
                for(let res in b.inputs) {
                    let needed = b.inputs[res] * b.count * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        fuelEfficiency = (gameData.resources[res] || 0) / needed;
                    }
                }
                if(fuelEfficiency > 0) {
                    for(let res in b.inputs) {
                        gameData.resources[res] -= (b.inputs[res] * b.count * deltaTime) * fuelEfficiency;
                    }
                }
            }
            totalEnergyProd += (b.outputs.energy * b.count) * fuelEfficiency;
        }
    });

    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) {
            totalEnergyReq += b.inputs.energy * b.count;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;

    let powerFactor = 1.0;
    if (totalEnergyReq > 0) {
        powerFactor = totalEnergyProd / totalEnergyReq;
        if (powerFactor > 1) powerFactor = 1.0;
    }

    // 2. 일반 건물 가동
    gameData.buildings.forEach(b => {
        if (b.count === 0) return;
        if (b.outputs && b.outputs.energy) return;

        let efficiency = 1.0;
        
        if (b.inputs && b.inputs.energy) {
            efficiency *= powerFactor;
        }

        if (b.inputs) {
            let maxPotential = 1.0; 
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let required = b.inputs[res] * b.count * deltaTime * efficiency;
                if ((gameData.resources[res] || 0) < required) {
                    let ratio = (gameData.resources[res] || 0) / required; 
                    if (ratio < maxPotential) maxPotential = ratio;
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

// ⭐ [신규] 현재 채집 효율 계산 (연구 반영)
export function getClickStrength() {
    let strength = 1; // 기본 1
    
    // 완료된 연구 목록을 순회하며 보너스 합산
    researchList.forEach(r => {
        if (gameData.researches.includes(r.id)) {
            strength += r.bonus;
        }
    });
    
    return strength;
}

// ⭐ [수정됨] 수동 채집 로직 (집 레벨 대신 연구 효율 사용)
export function manualGather(type) {
    // 이제 집 레벨이 아니라 연구에 따라 채집량이 결정됨
    const amount = getClickStrength(); 

    if (type === 'wood') {
        gameData.resources.wood += amount;
        return true;
    }
    if (type === 'stone') {
        // 돌은 나무 10개 이상이면 캘 수 있음 (도구 없으면 맨손이라도)
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
    // 판자 제작은 효율 영향 안 받음 (항상 1개)
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += 1;
            return true;
        }
    }
    return false;
}

// ⭐ [신규] 연구 구매 로직
export function tryBuyResearch(id) {
    // 이미 연구했는지 체크
    if (gameData.researches.includes(id)) return false;

    const research = researchList.find(r => r.id === id);
    if (!research) return false;

    // 비용 체크
    const cost = research.cost;
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) return false;
    }

    // 비용 차감
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }

    // 연구 완료 처리
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