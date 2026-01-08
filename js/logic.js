import { gameData } from './data.js';

// 건물 비용 계산 (1.2배씩 증가)
export function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count);
    let currentCost = {};
    for (let r in building.baseCost) {
        currentCost[r] = Math.floor(building.baseCost[r] * multiplier);
    }
    return currentCost;
}

// 초당 생산량 계산
export function calculateMPS() {
    let mps = { wood: 0, stone: 0, iron: 0 };
    gameData.buildings.forEach(b => {
        mps[b.type] += b.production * b.count;
    });
    return mps;
}

// 자원 생산 (델타타임 적용)
export function produceResources(deltaTime) {
    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            gameData.resources[b.type] += (b.production * b.count) * deltaTime;
        }
    });
}

// 수동 채집
export function manualGather(type) {
    // 잠금 조건 체크
    if (type === 'stone' && gameData.houseLevel < 1) return false;
    if (type === 'iron' && gameData.houseLevel < 2) return false;

    const amount = 1 + gameData.houseLevel;
    gameData.resources[type] += amount;
    return true; // 성공 여부 반환
}

// 건물 구매
export function tryBuyBuilding(index) {
    const b = gameData.buildings[index];
    const cost = getBuildingCost(b);

    if (gameData.resources.wood >= (cost.wood || 0) &&
        gameData.resources.stone >= (cost.stone || 0) &&
        gameData.resources.iron >= (cost.iron || 0)) {
        
        gameData.resources.wood -= (cost.wood || 0);
        gameData.resources.stone -= (cost.stone || 0);
        gameData.resources.iron -= (cost.iron || 0);
        
        b.count++;
        return true;
    }
    return false;
}

// 집 업그레이드
export function tryUpgradeHouse(nextStage) {
    const req = nextStage.req;
    if (gameData.resources.wood >= (req.wood || 0) &&
        gameData.resources.stone >= (req.stone || 0) &&
        gameData.resources.iron >= (req.iron || 0)) {
        
        gameData.resources.wood -= (req.wood || 0);
        gameData.resources.stone -= (req.stone || 0);
        gameData.resources.iron -= (req.iron || 0);
        
        gameData.houseLevel++;
        return true;
    }
    return false;
}