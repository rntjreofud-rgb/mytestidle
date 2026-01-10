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

    // 현재 전력 공급률 계산
    const totalProd = gameData.resources.energy || 0;
    const totalReq = gameData.resources.energyMax || 0;
    const powerFactor = totalReq > 0 ? Math.min(1.0, totalProd / totalReq) : 1.0;

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);

            // ⭐ 전력을 사용하는 건물은 powerFactor만큼 효율이 떨어짐
            let currentEfficiency = speedMult;
            if (b.inputs && b.inputs.energy) {
                currentEfficiency *= powerFactor;
            }

            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') {
                        // 통계에 실시간 효율(powerFactor) 반영
                        stats[res].cons += (b.inputs[res] * consMult) * b.count * currentEfficiency;
                    }
                }
            }
            if (b.outputs && !b.outputs.energy) { // 전력 생산 시설은 제외
                for (let res in b.outputs) {
                    stats[res].prod += b.outputs[res] * b.count * currentEfficiency;
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
            let consMult = getBuildingConsumptionMultiplier(b.id); // 연구에 의한 소모량 감소 배수
            let inputEfficiency = 1.0;
            
            if(b.inputs) {
                for(let res in b.inputs) {
                    if (res === 'energy') continue; 
                    let needed = (b.inputs[res] * consMult) * b.count * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / needed);
                    }
                }
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    let actualConsume = (b.inputs[res] * consMult) * b.count * speedMult * deltaTime * inputEfficiency;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - actualConsume);
                }
            }
            totalEnergyProd += (b.outputs.energy * b.count * speedMult) * inputEfficiency;
        }
    });

    // --- 2단계: 전체 전력 요구량 계산 ---
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id); 
            // ⭐ [추가] 전기 효율 연구 배수 가져오기
            let energyEff = getEnergyEfficiencyMultiplier(b.id); 
            
            // ⭐ [수정] 전기 소모량 계산 시 energyEff를 추가로 곱함
            totalEnergyReq += (b.inputs.energy * consMult * energyEff) * b.count * speedMult;
        }
    });

    // 전력망 상태 저장
    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    
    // 전력 공급률 계산 (1.0이면 100%, 미만이면 공장 속도 저하)
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;

    // --- 3단계: 일반 생산 시설 가동 ---
    gameData.buildings.forEach(b => {
        if (b.count === 0 || (b.outputs && b.outputs.energy)) return;

        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id); 
        
        let efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);

        if (b.inputs) {
            let inputEfficiency = 1.0;
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                
                let needed = (b.inputs[res] * consMult) * b.count * deltaTime * efficiency;
                if(needed > 0 && (gameData.resources[res] || 0) < needed) {
                    inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / needed);
                }
            }
            efficiency *= inputEfficiency;

            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let actualConsume = (b.inputs[res] * consMult) * b.count * deltaTime * efficiency;
                gameData.resources[res] = Math.max(0, gameData.resources[res] - actualConsume);
            }
        }

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
    
    // 자원 체크
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) return false;
    }
    // 자원 소모
    for (let r in cost) {
        gameData.resources[r] -= cost[r];
    }
    
    b.count++;
    
    // ⭐ [추가] 건물을 지으면 무조건 전원을 켭니다.
    if (b.on === undefined) b.on = true;
    b.on = true;

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