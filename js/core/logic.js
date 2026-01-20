import { gameData, getActiveResearch, getActiveBuildings } from './data.js';

/**
 * 1. 건물의 생산 및 가동 속도 배수 (연구 + 유산)
 * ⭐ 환생 보너스는 여기서 제외하여 소모량이 늘어나는 것을 방지합니다.
 */
export function getBuildingMultiplier(buildingId) {
    let multiplier = 1.0;
    const researchList = getActiveResearch(); 
    const completed = gameData.researches || [];
    const legacy = gameData.legacyUpgrades || [];
    
    // 연구 효과 적용
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'building' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });

    // [레거시 적용] legacy_mutant_boost: 변이세포(212) 및 관련 시설 생산 속도 30% 증가
    if (legacy.includes('legacy_mutant_boost')) {
        if ([212, 207].includes(buildingId)) multiplier *= 1.3;
    }

    // 기본 레거시: 전체 생산 효율 20% 증가
    if (legacy.includes('infinite_storage')) {
        multiplier *= 1.2;
    }

    if (legacy.includes('htrea_drone_overload')) {
        if ([300, 336].includes(buildingId)) multiplier *= 1.5;
    }

  
    if (legacy.includes('htrea_ancient_wisdom')) {
        if ([307, 340, 315, 327].includes(buildingId)) multiplier *= 1.3;
    }

    if (legacy.includes('htrea_void_resonance')) {
        if ([331, 346].includes(buildingId)) multiplier *= 1.25;
    }



    return multiplier;
}


/**
 * ⭐ [신규] 오직 "생산량"에만 적용되는 환생 보너스 배수
 * 전력 생산 및 자원 생산에 공통 적용됩니다.
 */
export function getProductionBonus() {
    return Math.pow(1.2, gameData.prestigeLevel || 0);
}

/**
 * 2. 건물의 현재 건설 비용 계산
 */
export function getBuildingCost(building) {
    // 기본 가격 공식: 기본가 * 1.2 ^ 현재보유수
    let multiplier = Math.pow(1.2, building.count || 0);
    const legacy = gameData.legacyUpgrades || [];
    
    let discount = 1.0;

    // [유산: 나노 건축 설계] 모든 건물 비용 20% 상시 할인
    if (legacy.includes('cheap_build')) {
        discount *= 0.8;
    }

    // ⭐ [유산: 신속 기지 전개] 건물 레벨 2 미만(0, 1레벨)일 때만 비용 50% 추가 할인
    if (legacy.includes('aurelia_fast_setup') && (building.count || 0) < 2) {
        discount *= 0.5;
    }
    
    if (legacy.includes('htrea_warp_drive')) {
        if ([334, 345, 335].includes(building.id)) discount *= 0.85;
    }


    let currentCost = {};
    for (let r in building.cost) {
        // 최종 비용 계산 (소수점 버림)
        currentCost[r] = Math.max(1, Math.floor(building.cost[r] * multiplier * discount));
    }
    return currentCost;
}

/**
 * 3. 자원 소모 절감 배수 (연구 전용)
 */
export function getBuildingConsumptionMultiplier(buildingId) {
    let multiplier = 1.0;
    const researchList = getActiveResearch();
    const completed = gameData.researches || [];
    const legacy = gameData.legacyUpgrades || [];

    // 연구 효과 적용
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'consumption' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });

    // legacy_less_fiber: 베리디안 유기섬유 소모량 15% 감소
    if (legacy.includes('legacy_less_fiber')) {
        if ([203, 204, 205].includes(buildingId)) multiplier *= 0.85;
    }

    // aurelia_scrap_recycle: 아우렐리아 고철 소모 20% 감소
    if (legacy.includes('aurelia_scrap_recycle')) {
        if ([103, 104, 107, 110, 114].includes(buildingId)) multiplier *= 0.8;
    }
    // htrea_rad_recycle: 방사능 소모 건물(정수기, 제련소, 담수화 등) 소모량 20% 감소
    if (legacy.includes('htrea_rad_recycle')) {
        
        if ([302, 304, 317, 318, 320, 326, 331].includes(buildingId)) multiplier *= 0.8;
    }


    return multiplier;
}

/**
 * 4. 전력 효율 모듈 배수 (연구 전용)
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
 * 5. 상단 자원 카드용 통계 계산 (환생 보너스 적용)
 */
export function calculateNetMPS() {
    let stats = {};
    // 1. 현재 보유 중인 자원을 기준으로 통계 객체 초기화
    for(let key in gameData.resources) {
        stats[key] = { prod: 0, cons: 0 };
    }

    const prodBonus = getProductionBonus(); 
    const totalProd = gameData.resources.energy || 0;
    const totalReq = gameData.resources.energyMax || 0;
    const powerFactor = totalReq > 0 ? Math.min(1.0, totalProd / totalReq) : 1.0;

    // --- [1단계] 수요(Demand) 및 부족분(Shortage) 계산 ---
    let resourceDemand = {};
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.inputs) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let efficiency = speedMult * ((b.inputs.energy) ? powerFactor : 1.0);
            
            for (let res in b.inputs) {
                if(res === 'energy') continue;
                resourceDemand[res] = (resourceDemand[res] || 0) + (b.inputs[res] * consMult) * b.activeCount * efficiency;
            }
        }
    });

    let shortageFactor = {};
    for (let res in resourceDemand) {
        let available = gameData.resources[res] || 0;
        shortageFactor[res] = resourceDemand[res] > available ? Math.max(0, available / resourceDemand[res]) : 1.0;
    }

    // --- [2단계] 실제 소비(cons) 및 생산(prod) 계산 ---
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let baseEfficiency = speedMult * ((b.inputs && b.inputs.energy) ? powerFactor : 1.0);

            let inputShortage = 1.0;
            if (b.inputs) {
                for (let res in b.inputs) {
                    if (res === 'energy') continue;
                    inputShortage = Math.min(inputShortage, shortageFactor[res] || 1.0);
                }
            }
            let finalEfficiency = baseEfficiency * inputShortage;

            // [소비 계산]
            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') {
                        // ⭐ 안전장치: stats에 해당 자원이 없으면 즉석 생성
                        if (!stats[res]) stats[res] = { prod: 0, cons: 0 };
                        
                        stats[res].cons += (b.inputs[res] * consMult) * b.activeCount * finalEfficiency;
                    }
                }
            }

            // [생산 계산]
            if (b.outputs) {
                for (let res in b.outputs) {
                    if (res === 'energy') continue;

                    // ⭐ 안전장치: stats에 해당 자원이 없으면 즉석 생성 (이 부분이 에러 해결 핵심)
                    if (!stats[res]) stats[res] = { prod: 0, cons: 0 };

                    stats[res].prod += b.outputs[res] * b.activeCount * finalEfficiency * prodBonus;
                }
            }
        }
    });
    return stats;
}

/**
 * 6. 실제 자원 생산 엔진 (전력망 환생 보너스 포함)
 */
export function produceResources(deltaTime) {
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;
    const prodBonus = getProductionBonus(); 
    const legacy = gameData.legacyUpgrades || [];
    
    if (legacy.includes('legacy_biofuel_trickle')) gameData.resources.bioFiber += 0.1 * deltaTime;

    // --- 1단계: 전력 생산 시설 (에너지 + 바이오연료 등 복합 생산 처리) ---
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let inputEfficiency = 1.0;
            
            if (legacy.includes('aurelia_generator_boost')) speedMult *= 1.25;
            if (legacy.includes('aurelia_prestige_drive')) speedMult *= (1 + (gameData.prestigeLevel * 0.04));

            if(b.inputs) {
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    let needed = (b.inputs[res] * consMult) * b.activeCount * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) inputEfficiency = Math.min(inputEfficiency, (gameData.resources[res] || 0) / (needed || 1));
                }
                for(let res in b.inputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - (b.inputs[res] * consMult * b.activeCount * speedMult * deltaTime * inputEfficiency));
                }
            }

            // 전력 생산 합산
            totalEnergyProd += (b.outputs.energy * b.activeCount * speedMult) * inputEfficiency * prodBonus;

            // ⭐ [바이오연료 수정]: 에너지를 만드는 건물이 자원(바이오연료)도 만든다면 여기서 추가
            for (let res in b.outputs) {
                if (res !== 'energy') {
                    gameData.resources[res] += (b.outputs[res] * b.activeCount * speedMult * inputEfficiency * prodBonus * deltaTime);
                }
            }
        }
    });

    // --- 2단계: 전력 부하 계산 (환생 보너스 적용 안 함 = 소비 전력 유지) ---
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);
            if (legacy.includes('aurelia_fusion_eff') && [30, 111].includes(b.id)) energyEff *= 0.7;
            // 전력 요구량은 환생 보너스를 곱하지 않음
            totalEnergyReq += (b.inputs.energy * consMult * energyEff) * b.activeCount * speedMult;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;

    // --- 3단계: 일반 공정 (공평 배분 + 환생 보너스) ---
    let frameDemand = {};
    gameData.buildings.forEach(b => {
        if (b.activeCount <= 0 || (b.outputs && b.outputs.energy)) return;
        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id);
        let efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);
        if (b.inputs) {
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                frameDemand[res] = (frameDemand[res] || 0) + (b.inputs[res] * consMult) * b.activeCount * deltaTime * efficiency;
            }
        }
    });

    let shortageFactor = {};
    for (let res in frameDemand) {
        let available = gameData.resources[res] || 0;
        shortageFactor[res] = (frameDemand[res] > available && available >= 0) ? (available / frameDemand[res]) : 1.0;
    }

    gameData.buildings.forEach(b => {
        if (b.activeCount <= 0 || (b.outputs && b.outputs.energy)) return;
        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id);
        let energyEff = getEnergyEfficiencyMultiplier(b.id);
        if (legacy.includes('aurelia_miner_boost') && (b.id >= 40 && b.id <= 45 || b.id <= 3 || b.id >= 100 && b.id <= 102)) speedMult *= 1.3;

        let baseEfficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);
        let inputShortage = 1.0;
        if (b.inputs) {
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                inputShortage = Math.min(inputShortage, shortageFactor[res] || 1.0);
            }
        }
        let finalEfficiency = baseEfficiency * inputShortage;

        if (finalEfficiency > 0) {
            if (b.inputs) {
                for (let res in b.inputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - (b.inputs[res] * consMult * b.activeCount * deltaTime * finalEfficiency));
                }
            }
            if (b.outputs) {
                for (let res in b.outputs) {
                    if (res === 'energy') continue;
                    // ⭐ 일반 자원 생산량에 환생 보너스 적용
                    gameData.resources[res] += (b.outputs[res] * b.activeCount * deltaTime * finalEfficiency * prodBonus);
                }
            }
        }
    });
}

/**
 * 7. 수동 채집 효율 계산
 */
export function getClickStrength() {
    let strength = 1; 
    const researchList = getActiveResearch();
    const completed = gameData.researches || [];
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'manual') strength += r.value;
    });
    if (gameData.legacyUpgrades && gameData.legacyUpgrades.includes('fast_click')) strength *= 5;
    return strength;
}

/**
 * 8. 행성 대응 수동 클릭
 */
export function manualGather(type) {
    const amount = getClickStrength(); 
    const p = gameData.currentPlanet || 'earth';
    if (type === 'wood') {
        if (p === 'earth') gameData.resources.wood += amount;
        else if (p === 'aurelia') gameData.resources.scrapMetal += amount;
        else if (p === 'veridian') gameData.resources.bioFiber += amount;
        else if (p === 'htrea') gameData.resources.brokenParts += amount; 
        return true;
    }
    if (type === 'stone') {
        if (p === 'earth') gameData.resources.stone += amount;
        else if (p === 'aurelia') gameData.resources.magnet += amount;
        else if (p === 'veridian') gameData.resources.spore += amount;
        else if (p === 'htrea') gameData.resources.radiation += amount;
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
 * 9. 구매 및 업그레이드 검증
 */
export function tryBuyResearch(id) {
    const researchList = getActiveResearch();
    if (gameData.researches.includes(id)) return { success: false, missing: [] };
    const research = researchList.find(r => r.id === id);
    if (!research) return { success: false, missing: [] };
    if (research.reqResearch && !gameData.researches.includes(research.reqResearch)) return { success: false, missing: ["선행 연구"] };
    let missing = [];
    for (let r in research.cost) { if ((gameData.resources[r] || 0) < research.cost[r]) missing.push(r); }
    if (missing.length > 0) return { success: false, missing };
    for (let r in research.cost) { gameData.resources[r] -= research.cost[r]; }
    gameData.researches.push(id);
    return { success: true };
}

export function tryBuyBuilding(index) {
    const b = gameData.buildings[index];
    const cost = getBuildingCost(b);
    let missing = [];
    for (let r in cost) { if ((gameData.resources[r] || 0) < cost[r]) missing.push(r); }
    if (missing.length > 0) return { success: false, missing };
    for (let r in cost) { gameData.resources[r] -= cost[r]; }
    b.count = (b.count || 0) + 1;
    b.activeCount = (b.activeCount || 0) + 1;
    return { success: true };
}

export function tryUpgradeHouse(nextStage) {
    // 1. 가능 여부 재확인
    if (!canUpgradeHouse(nextStage)) {
        // 불가능하면 부족한 자원 목록 리턴 (로그용)
        let missing = [];
        const epsilon = 0.0001;
        for (let r in nextStage.req) {
            let val = (r === 'energy') ? gameData.resources.energy : gameData.resources[r];
            if (val < nextStage.req[r] - epsilon) missing.push(r);
        }
        return { success: false, missing };
    }

    // 2. 자원 소모 실행
    for (let r in nextStage.req) { 
        if (r !== 'energy') {
            gameData.resources[r] = Math.max(0, gameData.resources[r] - nextStage.req[r]);
        }
    }
    
    gameData.houseLevel++;
    return { success: true };
}

const planetMaxPoints = { earth: 3, aurelia: 4, veridian: 5 };
export function calculateCurrentPrestigeGain(level, planet) {
    const maxPoints = planetMaxPoints[planet] || 3;
    const gain = Math.floor((level / 50) * maxPoints);
    return Math.max(0, gain);
}

export function canUpgradeHouse(nextStage) {
    if (!nextStage) return false;
    const epsilon = 0.0001; // 소수점 오차 허용

    for (let r in nextStage.req) {
        let reqAmount = nextStage.req[r];
        
        if (r === 'energy') { 
            // 전력은 현재 생산량 기준 (오차 없이 비교)
            if ((gameData.resources.energy || 0) < reqAmount) return false;
        } else { 
            // 일반 자원은 보유량 기준 (오차 허용)
            let currentAmount = gameData.resources[r] || 0;
            if (currentAmount < reqAmount - epsilon) return false;
        }
    }
    return true;
}
