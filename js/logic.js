// js/logic.js

import { gameData } from './data.js';

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
            // 전력 효율 고려 안 함 (단순 표기용)
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

// ⭐ 핵심 로직: 전력 및 자원 생산
export function produceResources(deltaTime) {
    // 1. 전력 계산 (Energy Calculation)
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;

    // 발전소 먼저 가동해서 총 전력량 계산
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.outputs && b.outputs.energy) {
            // 발전소는 연료(석탄)가 있어야 전기를 만듦
            let fuelEfficiency = 1.0;
            if(b.inputs) {
                for(let res in b.inputs) {
                    let needed = b.inputs[res] * b.count * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        fuelEfficiency = (gameData.resources[res] || 0) / needed;
                    }
                }
                // 연료 소모
                if(fuelEfficiency > 0) {
                    for(let res in b.inputs) {
                        gameData.resources[res] -= (b.inputs[res] * b.count * deltaTime) * fuelEfficiency;
                    }
                }
            }
            totalEnergyProd += (b.outputs.energy * b.count) * fuelEfficiency;
        }
    });

    // 전력 요구량 계산
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) {
            totalEnergyReq += b.inputs.energy * b.count;
        }
    });

    // 전력망 상태 저장 (UI 표시용)
    gameData.resources.energy = totalEnergyProd;    // 현재 생산량
    gameData.resources.energyMax = totalEnergyReq;  // 현재 요구량

    // 전력 효율 (공급 / 수요)
    let powerFactor = 1.0;
    if (totalEnergyReq > 0) {
        powerFactor = totalEnergyProd / totalEnergyReq;
        if (powerFactor > 1) powerFactor = 1.0; // 효율 최대 100%
    }

    // 2. 일반 건물 가동
    gameData.buildings.forEach(b => {
        if (b.count === 0) return;
        if (b.outputs && b.outputs.energy) return; // 발전소는 이미 위에서 계산함

        let efficiency = 1.0;
        
        // 전력 소모 건물이라면 효율 적용
        if (b.inputs && b.inputs.energy) {
            efficiency *= powerFactor;
        }

        // 재료 소모 체크
        if (b.inputs) {
            let maxPotential = 1.0; 
            for (let res in b.inputs) {
                if (res === 'energy') continue; // 전력은 위에서 처리

                let required = b.inputs[res] * b.count * deltaTime * efficiency; // 전력 효율만큼만 재료 요구
                if ((gameData.resources[res] || 0) < required) {
                    let ratio = (gameData.resources[res] || 0) / required; 
                    if (ratio < maxPotential) maxPotential = ratio;
                }
            }
            // 최종 효율 = 전력 효율 * 재료 효율
            efficiency *= maxPotential;

            // 재료 소모
            if (efficiency > 0) {
                for (let res in b.inputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] -= (b.inputs[res] * b.count * deltaTime) * efficiency; // 원래 소모량 * 최종 효율 X -> 버그 수정: 비율대로
                    // 수정: 기준 요구량(required)은 이미 전력효율 먹음. 여기서 maxPotential만 곱하면 됨.
                    // 복잡하니 단순화: 소모량 = 초당소모 * 시간 * 최종효율
                }
                // 다시 정확히 계산
                 for (let res in b.inputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] -= (b.inputs[res] * b.count * deltaTime) * efficiency;
                }
            }
        }

        // 결과물 생산
        if (efficiency > 0 && b.outputs) {
            for (let res in b.outputs) {
                gameData.resources[res] += (b.outputs[res] * b.count * deltaTime) * efficiency;
            }
        }
    });
}

export function manualGather(type) {
    const amount = 1 + gameData.houseLevel;
    
    // ⭐ [수정됨] 레벨 1부터 철, 구리, 석탄 채집 가능
    const basicResources = ['wood', 'stone', 'coal', 'ironOre', 'copperOre'];
    
    if (basicResources.includes(type)) {
        // Lv.0: 나무만
        if (type !== 'wood' && gameData.houseLevel < 1) return false;
        
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
        // energy 조건은 소모하는게 아니라 달성 조건
        if (r === 'energy') { 
            // 현재 생산량이 요구량보다 커야 함
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