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

    // --- 1단계: 전력 생산 시설(발전기) 연산 ---
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id); // 연구에 의한 속도 배수
            let consMult = getBuildingConsumptionMultiplier(b.id); // ⭐ 연구에 의한 소모량 감소 배수 (0.5 등)
            let inputEfficiency = 1.0;
            
            // 발전기 재료(석탄, 원유 등) 체크 및 소모
            if(b.inputs) {
                for(let res in b.inputs) {
                    if (res === 'energy') continue; // 발전기가 전기를 먹는 경우는 제외 (혹시 있다면)
                    
                    // ⭐ 소모량 감소(consMult)가 적용된 실제 필요량 계산
                    let needed = (b.inputs[res] * consMult) * b.count * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        // 재료 부족 시 효율 감소
                        inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / needed);
                    }
                }
                // 실제 재료 소모 적용
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    let actualConsume = (b.inputs[res] * consMult) * b.count * speedMult * deltaTime * inputEfficiency;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - actualConsume);
                }
            }
            // 전력 생산량 합산 (생산량은 속도에만 영향을 받음)
            totalEnergyProd += (b.outputs.energy * b.count * speedMult) * inputEfficiency;
        }
    });

    // --- 2단계: 전체 전력 요구량 계산 ---
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            // 전력 소모량도 재료 소모 감소 연구의 영향을 받게 하려면 consMult를 여기서도 곱합니다.
            let consMult = getBuildingConsumptionMultiplier(b.id); 
            totalEnergyReq += (b.inputs.energy * consMult) * b.count * speedMult;
        }
    });

    // 전력망 상태 저장
    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    
    // 전력 공급률 계산 (1.0이면 100%, 미만이면 공장 속도 저하)
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;

    // --- 3단계: 일반 생산 시설 가동 ---
    gameData.buildings.forEach(b => {
        // 건물이 없거나 전력 생산 시설이면 건너뜀 (이미 1단계에서 처리)
        if (b.count === 0 || (b.outputs && b.outputs.energy)) return;

        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id); // ⭐ 소모량 감소 배수 적용
        
        // 최종 효율 = 연구 속도 * 전력 공급률
        let efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);

        if (b.inputs) {
            let inputEfficiency = 1.0;
            // 재료(철광석, 판자 등) 부족 여부 확인
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                
                // ⭐ 필요 재료 계산 시 consMult(0.7 등)를 곱해 소모량을 줄임
                let needed = (b.inputs[res] * consMult) * b.count * deltaTime * efficiency;
                if(needed > 0 && (gameData.resources[res] || 0) < needed) {
                    inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / needed);
                }
            }
            efficiency *= inputEfficiency;

            // 실제 재료 차감
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let actualConsume = (b.inputs[res] * consMult) * b.count * deltaTime * efficiency;
                gameData.resources[res] = Math.max(0, gameData.resources[res] - actualConsume);
            }
        }

        // 실제 자원 생산 (생산량은 소모량 감소 연구와 상관없이 동일)
        if (efficiency > 0 && b.outputs) {
            for (let res in b.outputs) {
                if (res === 'energy') continue;
                gameData.resources[res] += (b.outputs[res] * b.count * deltaTime * efficiency);
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
    if (gameData.researches.includes(id)) return false;
    
    const research = researchList.find(r => r.id === id);
    if (!research) return false;
    
    // 선행 연구 체크 (안전장치)
    if (research.reqResearch && !gameData.researches.includes(research.reqResearch)) {
        return false;
    }

    const cost = research.cost;
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) return false;
    }
    
    // 소모
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