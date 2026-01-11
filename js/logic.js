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

    if (gameData.prestigeLevel > 0) {
        multiplier *= Math.pow(1.2, gameData.prestigeLevel);
    }

    return multiplier;
}

export function calculateNetMPS() {
    let stats = {};
    for(let key in gameData.resources) {
        stats[key] = { prod: 0, cons: 0 };
    }

    // 현재 전력 상태 계산
    const totalProd = gameData.resources.energy || 0;
    const totalReq = gameData.resources.energyMax || 0;
    const powerFactor = totalReq > 0 ? Math.min(1.0, totalProd / totalReq) : 1.0;

    gameData.buildings.forEach(b => {
        // ⭐ [핵심 수정] count 대신 activeCount가 0보다 클 때만 계산
        if (b.activeCount > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            
            // 전력 공급률에 따른 효율 결정
            let efficiency = speedMult;
            if (b.inputs && b.inputs.energy) {
                efficiency *= powerFactor;
            }

            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') {
                        // ⭐ [수정] b.count 대신 b.activeCount를 곱함
                        stats[res].cons += (b.inputs[res] * consMult) * b.activeCount * efficiency;
                    }
                }
            }
            if (b.outputs && !b.outputs.energy) {
                for (let res in b.outputs) {
                    // ⭐ [수정] b.count 대신 b.activeCount를 곱함
                    stats[res].prod += b.outputs[res] * b.activeCount * efficiency;
                }
            }
        }
    });
    return stats;
}

export function produceResources(deltaTime) {
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;

    // 1단계: 전력 생산 시설 (activeCount 기준)
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let inputEfficiency = 1.0;
            
            if(b.inputs) {
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    // ⭐ activeCount 적용
                    let needed = (b.inputs[res] * consMult) * b.activeCount * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / needed);
                    }
                }
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    // ⭐ activeCount 적용
                    let actualConsume = (b.inputs[res] * consMult) * b.activeCount * speedMult * deltaTime * inputEfficiency;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - actualConsume);
                }
            }
            totalEnergyProd += (b.outputs.energy * b.activeCount * speedMult) * inputEfficiency;
        }
    });

    // 2단계: 전력 요구량 계산 (activeCount 기준)
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);
            // ⭐ activeCount 적용
            totalEnergyReq += (b.inputs.energy * consMult * energyEff) * b.activeCount * speedMult;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;

    // 3단계: 일반 생산 시설 (activeCount 기준)
    gameData.buildings.forEach(b => {
        // activeCount가 0이면 아예 연산 안 함
        if (b.activeCount <= 0 || (b.outputs && b.outputs.energy)) return;

        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id);
        let efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);

        if (b.inputs) {
            let inputEfficiency = 1.0;
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                // ⭐ activeCount 적용
                let needed = (b.inputs[res] * consMult) * b.activeCount * deltaTime * efficiency;
                if(needed > 0 && (gameData.resources[res] || 0) < needed) {
                    inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / needed);
                }
            }
            efficiency *= inputEfficiency;

            for (let res in b.inputs) {
                if (res === 'energy') continue;
                // ⭐ activeCount 적용
                let actualConsume = (b.inputs[res] * consMult) * b.activeCount * deltaTime * efficiency;
                gameData.resources[res] = Math.max(0, gameData.resources[res] - actualConsume);
            }
        }

        if (efficiency > 0 && b.outputs) {
            for (let res in b.outputs) {
                if (res === 'energy') continue;
                // ⭐ activeCount 적용
                gameData.resources[res] += (b.outputs[res] * b.activeCount * deltaTime * efficiency);
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
    const discovered = gameData.unlockedResources || ['wood', 'stone', 'plank'];

    // 발견되지 않은 자원이면 무시
    if (!discovered.includes(type)) return false;

    // 1. 나무 채집
    if (type === 'wood') {
        gameData.resources.wood += amount;
        return true;
    }

    // 2. ⭐ 판자 제작 (나무 2개 소모하여 1개 획득)
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += 1; // 제작은 클릭 강화 수치를 적용하지 않는 것이 일반적입니다.
            return true;
        }
        return false; // 나무 부족 시 실패
    }

    // 3. 기타 일반 자원 (돌, 석탄 등)
    if (gameData.resources[type] !== undefined) {
        gameData.resources[type] += amount;
        return true;
    }

    return false;
}

export function tryBuyResearch(id) {
    if (!gameData.researches) gameData.researches = [];
    if (gameData.researches.includes(id)) return { success: false, missing: [] };
    
    const research = researchList.find(r => r.id === id);
    if (!research) return { success: false, missing: [] };
    
    // 선행 연구 체크
    if (research.reqResearch && !gameData.researches.includes(research.reqResearch)) {
        return { success: false, missing: ["선행 연구"] }; // 특수 케이스 처리
    }

    // 부족한 자원 체크
    let missing = [];
    const cost = research.cost;
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) {
            missing.push(r);
        }
    }

    if (missing.length > 0) return { success: false, missing: missing };
    
    // 소모 및 저장
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }
    gameData.researches.push(id);
    return { success: true };
}

// 2. 건물 구매 로직 수정
export function tryBuyBuilding(index) {
    const b = gameData.buildings[index];
    const cost = getBuildingCost(b);
    
    // 부족한 자원 체크
    let missing = [];
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) {
            missing.push(r);
        }
    }

    if (missing.length > 0) return { success: false, missing: missing };

    // 자원 소모
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }
    
    b.count++;
    b.activeCount = (b.activeCount || 0) + 1;
    b.on = true;

    return { success: true };
}

// 3. 집 업그레이드 로직 수정
export function tryUpgradeHouse(nextStage) {
    const req = nextStage.req;
    let missing = [];

    // 부족한 자원 및 전력 체크
    for (let r in req) {
        if (r === 'energy') { 
            if (gameData.resources.energy < req[r]) {
                missing.push('energy');
            }
            continue; 
        }
        if ((gameData.resources[r] || 0) < req[r]) {
            missing.push(r);
        }
    }

    if (missing.length > 0) return { success: false, missing: missing };

    // 실제 소모 (전력 제외)
    for (let r in req) {
        if (r === 'energy') continue;
        gameData.resources[r] -= req[r];
    }
    gameData.houseLevel++;
    return { success: true };
}

export function getBuildingConsumptionMultiplier(buildingId) {
    let multiplier = 1.0;
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id)) {
            // 타입이 'consumption'인 연구만 찾아서 곱함 (0.5면 소모량 절반)
            if (r.type === 'consumption' && r.target.includes(buildingId)) {
                multiplier *= r.value;
            }
        }
    });
    return multiplier;
}

export function getEnergyEfficiencyMultiplier(buildingId) {
    let multiplier = 1.0;
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id)) {
            // 타입이 'energyEff'인 연구만 적용
            if (r.type === 'energyEff' && r.target.includes(buildingId)) {
                multiplier *= r.value;
            }
        }
    });
    return multiplier;
}