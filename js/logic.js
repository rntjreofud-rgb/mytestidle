import { gameData } from './data.js';

// 건물 비용 계산
export function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count);
    let currentCost = {};
    for (let r in building.cost) {
        currentCost[r] = Math.floor(building.cost[r] * multiplier);
    }
    return currentCost;
}

// 초당 변동량 계산
export function calculateNetMPS() {
    let net = {};
    for(let key in gameData.resources) net[key] = 0;

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            if (b.inputs) {
                for (let res in b.inputs) {
                    net[res] -= b.inputs[res] * b.count;
                }
            }
            if (b.outputs) {
                for (let res in b.outputs) {
                    net[res] += b.outputs[res] * b.count;
                }
            }
        }
    });
    return net;
}

// 자원 생산
export function produceResources(deltaTime) {
    gameData.buildings.forEach(b => {
        if (b.count === 0) return;

        let efficiency = 1.0; 

        if (b.inputs) {
            let maxPotential = 1.0; 
            for (let res in b.inputs) {
                let required = b.inputs[res] * b.count * deltaTime;
                if ((gameData.resources[res] || 0) < required) {
                    let ratio = (gameData.resources[res] || 0) / required; 
                    if (ratio < maxPotential) maxPotential = ratio;
                }
            }
            efficiency = maxPotential;

            if (efficiency > 0) {
                for (let res in b.inputs) {
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

// ⭐ [수정됨] 수동 채집 로직
export function manualGather(type) {
    const amount = 1 + gameData.houseLevel;
    
    // 1. 기초 자원 채집 (레벨 제한 제거)
    if (['wood', 'stone', 'ironOre', 'copperOre'].includes(type)) {
         // 철/구리는 여전히 도구가 필요할 수 있으니 레벨 체크 유지하되, 돌은 해제
         if (type === 'ironOre' && gameData.houseLevel < 2) return false;
         if (type === 'copperOre' && gameData.houseLevel < 3) return false;

         gameData.resources[type] += amount;
         return true;
    }
    
    // 2. 판자 가공 (나무 2 -> 판자 1)
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += 1;
            return true;
        }
    }
    return false;
}

// 건물 구매
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

// 집 업그레이드
export function tryUpgradeHouse(nextStage) {
    const req = nextStage.req;
    for (let r in req) {
        if ((gameData.resources[r] || 0) < req[r]) return false;
    }
    for (let r in req) {
        gameData.resources[r] -= req[r];
    }
    
    gameData.houseLevel++;
    return true;
}