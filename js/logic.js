// js/logic.js

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

// 초당 변동량 계산 (UI 표시용: 생산량 - 소비량)
export function calculateNetMPS() {
    let net = {};
    // 모든 자원 0으로 초기화
    for(let key in gameData.resources) net[key] = 0;

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            // 소비량 계산 (재료가 충분하다는 가정 하에 표기)
            if (b.inputs) {
                for (let res in b.inputs) {
                    net[res] -= b.inputs[res] * b.count;
                }
            }
            // 생산량 계산
            if (b.outputs) {
                for (let res in b.outputs) {
                    net[res] += b.outputs[res] * b.count;
                }
            }
        }
    });
    return net;
}

// 핵심 로직: 자원 생산 및 소비 (델타타임 적용)
export function produceResources(deltaTime) {
    gameData.buildings.forEach(b => {
        if (b.count === 0) return;

        // 1. 소비 자원이 있는지 체크
        let efficiency = 1.0; // 효율 (재료 부족하면 0이 됨)

        if (b.inputs) {
            // 이번 프레임에 필요한 총 소모량
            // 예: 철광석 2개 소모 * 건물 10개 * 0.1초 = 2.0 소모
            
            // 먼저 재료가 충분한지 비율(ratio) 계산
            let maxPotential = 1.0; 
            
            for (let res in b.inputs) {
                let required = b.inputs[res] * b.count * deltaTime;
                if (gameData.resources[res] < required) {
                    // 재료가 부족하면 생산 효율이 떨어짐 (병목 현상)
                    let ratio = gameData.resources[res] / required; 
                    if (ratio < maxPotential) maxPotential = ratio;
                }
            }
            efficiency = maxPotential;

            // 실제 소모 (효율만큼만 소모)
            if (efficiency > 0) {
                for (let res in b.inputs) {
                    gameData.resources[res] -= (b.inputs[res] * b.count * deltaTime) * efficiency;
                }
            }
        }

        // 2. 결과물 생산 (효율 적용)
        if (efficiency > 0 && b.outputs) {
            for (let res in b.outputs) {
                gameData.resources[res] += (b.outputs[res] * b.count * deltaTime) * efficiency;
            }
        }
    });
}

// 수동 채집 (클릭)
export function manualGather(type) {
    const amount = 1 + gameData.houseLevel;
    
    // 단순 채집 자원
    if (['wood', 'stone', 'ironOre', 'copperOre'].includes(type)) {
         gameData.resources[type] += amount;
         return true;
    }
    
    // 수동 가공 (판자 등) - 재료가 있어야 함
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

    // 비용 체크
    for (let r in cost) {
        if (gameData.resources[r] < cost[r]) return false;
    }

    // 비용 차감
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }
    
    b.count++;
    return true;
}

// 집 업그레이드
export function tryUpgradeHouse(nextStage) {
    const req = nextStage.req;
    // 비용 체크
    for (let r in req) {
        if (gameData.resources[r] < req[r]) return false;
    }
    // 비용 차감
    for (let r in req) {
        gameData.resources[r] -= req[r];
    }
    
    gameData.houseLevel++;
    return true;
}