import { gameData, getActiveResearch, getActiveBuildings } from './data.js';

/**
 * 1. 건물의 생산 속도 배수 계산 (연구 + 환생 + 유산)
 */
export function getBuildingMultiplier(buildingId) {
    let multiplier = 1.0;
    const researchList = getActiveResearch(); // 현재 행성 연구 가져오기
    const completed = gameData.researches || [];
    
    // [연구 보너스]
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'building' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });

    // [환생 보너스] 레벨당 20% 복리
    if (gameData.prestigeLevel > 0) {
        multiplier *= Math.pow(1.2, gameData.prestigeLevel);
    }

    // [유산 보너스] '압축 창고' 보유 시 20% 추가
    if (gameData.legacyUpgrades && gameData.legacyUpgrades.includes('infinite_storage')) {
        multiplier *= 1.2;
    }

    return multiplier;
}

/**
 * 2. 건물의 현재 건설 비용 계산 (보유수 + 유산 보너스)
 */
export function getBuildingCost(building) {
    // 비용 증가 공식: 기본가 * 1.2^보유수
    let multiplier = Math.pow(1.2, building.count || 0);
    
    // [유산 보너스] '나노 건축 설계' 보유 시 비용 20% 감소
    let discount = (gameData.legacyUpgrades && gameData.legacyUpgrades.includes('cheap_build')) ? 0.8 : 1.0;
    
    let currentCost = {};
    for (let r in building.cost) {
        currentCost[r] = Math.floor(building.cost[r] * multiplier * discount);
    }
    return currentCost;
}

/**
 * 3. 자원 소모 절감 배수 계산 (연구 전용)
 */
export function getBuildingConsumptionMultiplier(buildingId) {
    let multiplier = 1.0;
    const researchList = getActiveResearch();
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'consumption' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });
    return multiplier;
}

/**
 * 4. 전력 효율 모듈 배수 계산 (연구 전용)
 */
export function getEnergyEfficiencyMultiplier(buildingId) {
    let multiplier = 1.0;
    const researchList = getActiveResearch();
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'energyEff' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });
    return multiplier;
}

/**
 * 5. 상단 자원 카드용 초당 순수 변동량(Net MPS) 통계 계산
 */
export function calculateNetMPS() {
    let stats = {};
    for(let key in gameData.resources) {
        stats[key] = { prod: 0, cons: 0 };
    }

    const totalProd = gameData.resources.energy || 0;
    const totalReq = gameData.resources.energyMax || 0;
    const powerFactor = totalReq > 0 ? Math.min(1.0, totalProd / totalReq) : 1.0;

    gameData.buildings.forEach(b => {
        if (b.activeCount > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);
            
            let efficiency = speedMult;
            if (b.inputs && b.inputs.energy) {
                efficiency *= powerFactor;
            }

            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') {
                        stats[res].cons += (b.inputs[res] * consMult) * b.activeCount * efficiency;
                    }
                }
            }
            if (b.outputs && !b.outputs.energy) {
                for (let res in b.outputs) {
                    stats[res].prod += b.outputs[res] * b.activeCount * efficiency;
                }
            }
        }
    });
    return stats;
}

/**
 * 6. 실제 자원 생산 및 소모 엔진 (매 프레임 실행)
 */
export function produceResources(deltaTime) {
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;

    // A. 전력 생산 시설
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let inputEfficiency = 1.0;
            
            if(b.inputs) {
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    let needed = (b.inputs[res] * consMult) * b.activeCount * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / (needed || 1));
                    }
                }
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - (b.inputs[res] * consMult * b.activeCount * speedMult * deltaTime * inputEfficiency));
                }
            }
            totalEnergyProd += (b.outputs.energy * b.activeCount * speedMult) * inputEfficiency;
        }
    });

    // B. 전체 전력 요구량 계산
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);
            totalEnergyReq += (b.inputs.energy * consMult * energyEff) * b.activeCount * speedMult;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;

    // C. 일반 가공 및 제조 시설
    gameData.buildings.forEach(b => {
        if (b.activeCount <= 0 || (b.outputs && b.outputs.energy)) return;

        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id);
        let energyEff = getEnergyEfficiencyMultiplier(b.id);
        let efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);

        if (b.inputs) {
            let inputEfficiency = 1.0;
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let needed = (b.inputs[res] * consMult) * b.activeCount * deltaTime * efficiency;
                if(needed > 0 && (gameData.resources[res] || 0) < needed) {
                    inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / (needed || 1));
                }
            }
            efficiency *= inputEfficiency;

            for (let res in b.inputs) {
                if (res === 'energy') continue;
                gameData.resources[res] = Math.max(0, gameData.resources[res] - (b.inputs[res] * consMult * b.activeCount * deltaTime * efficiency));
            }
        }

        if (efficiency > 0 && b.outputs) {
            for (let res in b.outputs) {
                if (res === 'energy') continue;
                gameData.resources[res] += (b.outputs[res] * b.activeCount * deltaTime * efficiency);
            }
        }
    });
}

/**
 * 7. 수동 채집 효율 계산 (연구 + 유산)
 */
export function getClickStrength() {
    let strength = 1; 
    const researchList = getActiveResearch();
    const completed = gameData.researches || [];
    
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'manual') {
            strength += r.value;
        }
    });

    if (gameData.legacyUpgrades && gameData.legacyUpgrades.includes('fast_click')) {
        strength *= 5;
    }
    return strength;
}

/**
 * 8. 수동 클릭 처리
 */
export function manualGather(type) {
    const amount = getClickStrength(); 
    if (type === 'wood') {
        gameData.resources.wood += amount;
        return true;
    }
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += Math.max(1, Math.floor(amount / 2)); 
            return true;
        }
        return false;
    }
    if (gameData.resources[type] !== undefined) {
        gameData.resources[type] += amount;
        return true;
    }
    return false;
}

/**
 * 9. 구매 및 업그레이드 검증 (결과 객체 반환)
 */
export function tryBuyResearch(id) {
    const researchList = getActiveResearch();
    if (gameData.researches.includes(id)) return { success: false, missing: [] };
    
    const research = researchList.find(r => r.id === id);
    if (!research) return { success: false, missing: [] };
    
    if (research.reqResearch && !gameData.researches.includes(research.reqResearch)) {
        return { success: false, missing: ["선행 연구"] };
    }

    let missing = [];
    for (let r in research.cost) {
        if ((gameData.resources[r] || 0) < research.cost[r]) missing.push(r);
    }
    if (missing.length > 0) return { success: false, missing };
    
    for (let r in research.cost) { gameData.resources[r] -= research.cost[r]; }
    gameData.researches.push(id);
    return { success: true };
}

export function tryBuyBuilding(index) {
    const b = gameData.buildings[index];
    const cost = getBuildingCost(b);
    
    let missing = [];
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) missing.push(r);
    }
    if (missing.length > 0) return { success: false, missing };

    for (let r in cost) { gameData.resources[r] -= cost[r]; }
    b.count = (b.count || 0) + 1;
    b.activeCount = (b.activeCount || 0) + 1;
    return { success: true };
}

export function tryUpgradeHouse(nextStage) {
    let missing = [];
    for (let r in nextStage.req) {
        if (r === 'energy') { 
            if (gameData.resources.energy < nextStage.req[r]) missing.push('energy');
        } else if ((gameData.resources[r] || 0) < nextStage.req[r]) {
            missing.push(r);
        }
    }
    if (missing.length > 0) return { success: false, missing };

    for (let r in nextStage.req) {
        if (r !== 'energy') gameData.resources[r] -= nextStage.req[r];
    }
    gameData.houseLevel++;
    return { success: true };
}