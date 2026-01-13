import { gameData, getActiveResearch, getActiveBuildings } from './data.js';



const planetMaxPoints = {
    earth: 3,
    aurelia: 4,
    veridian: 5
};

/**
 * 현재 행성과 레벨에 따른 환생 포인트 계산
 * @param {number} level - 현재 하우스 레벨 (0~50)
 * @param {string} planet - 현재 행성 키 (earth, aurelia, veridian)
 */
export function calculateCurrentPrestigeGain(level, planet) {
    const maxPoints = planetMaxPoints[planet] || 3; // 기본값 3점
    
    // 공식: (현재 레벨 / 50) * 최대 점수
    // Math.floor를 사용하여 소수점은 버림 처리 (예: 지구 25렙이면 1.5점 -> 1점)
    const gain = Math.floor((level / 50) * maxPoints);
    
    return Math.max(0, gain);
}


/**
 * 1. 건물의 생산 속도 배수 계산 (연구 + 환생 + 유산)
 */
export function getBuildingMultiplier(buildingId) {
    let multiplier = 1.0;
    const researchList = getActiveResearch();
    const completed = gameData.researches || [];
    const legacy = gameData.legacyUpgrades || [];

    // [연구 보너스]
    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'building' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });

    // [환생 기본 보너스] 레벨당 20% 복리
    if (gameData.prestigeLevel > 0) multiplier *= Math.pow(1.2, gameData.prestigeLevel);

    // [유산 보너스]
    if (legacy.includes('infinite_storage')) multiplier *= 1.2; // 압축 창고
    if (legacy.includes('legacy_mutant_boost') && [207, 212].includes(buildingId)) multiplier *= 1.3; // 변이 적응 (ID 확인 필요)
    if (legacy.includes('legacy_gene_boost') && [214, 215, 218].includes(buildingId)) multiplier *= 1.25; // 유전자 기억

    return multiplier;
}

/**
 * 2. 건물의 현재 건설 비용 계산 (보유수 + 유산 보너스)
 */
export function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count || 0);
    const legacy = gameData.legacyUpgrades || [];
    
    let discount = 1.0;
    if (legacy.includes('cheap_build')) discount *= 0.8; // 나노 건축 (-20%)
    
    // 신속 기지 전개: 건물 레벨 2까지 비용 50% 추가 할인
    if (legacy.includes('aurelia_fast_setup') && (building.count || 0) < 2) {
        discount *= 0.5;
    }
    
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
    const legacy = gameData.legacyUpgrades || [];

    researchList.forEach(r => {
        if (completed.includes(r.id) && r.type === 'consumption' && r.target.includes(buildingId)) {
            multiplier *= r.value;
        }
    });

    // [유산 보너스: 소모 절감]
    if (legacy.includes('legacy_less_fiber') && [203, 204, 205, 212, 214].includes(buildingId)) multiplier *= 0.85; // 섬유 재활용
    if (legacy.includes('aurelia_scrap_recycle') && [103, 104, 107, 110, 112, 114].includes(buildingId)) multiplier *= 0.8; // 스크랩 재활용

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
 * ⭐ '공평 배분' 로직이 통계에도 반영되어 자원 부족 시 생산량이 정확히 깎여 보입니다.
 */
export function calculateNetMPS() {
    let stats = {};
    for(let key in gameData.resources) {
        stats[key] = { prod: 0, cons: 0 };
    }

    const totalProd = gameData.resources.energy || 0;
    const totalReq = gameData.resources.energyMax || 0;
    const powerFactor = totalReq > 0 ? Math.min(1.0, totalProd / totalReq) : 1.0;

    // A. 전체 자원 수요량(1초 기준) 먼저 계산
    let resourceDemand = {};
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);
            let efficiency = speedMult * ((b.inputs && b.inputs.energy) ? powerFactor : 1.0);

            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res === 'energy') continue;
                    let demand = (b.inputs[res] * consMult) * b.activeCount * efficiency;
                    resourceDemand[res] = (resourceDemand[res] || 0) + demand;
                }
            }
        }
    });

    // B. 자원별 공급 가능 비율(Shortage Factor) 계산
    let shortageFactor = {};
    for (let res in resourceDemand) {
        let available = gameData.resources[res] || 0;
        // 통계용이므로 1초치 수요와 현재 보유량을 비교
        shortageFactor[res] = resourceDemand[res] > available ? Math.max(0, available / resourceDemand[res]) : 1.0;
    }

    // C. 실제 통계치 합산
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let baseEfficiency = speedMult * ((b.inputs && b.inputs.energy) ? powerFactor : 1.0);

            // 해당 건물의 재료 중 가장 부족한 비율 적용
            let inputShortage = 1.0;
            if (b.inputs) {
                for (let res in b.inputs) {
                    if(res !== 'energy') {
                        // 자원 유무와 상관없이 요구량(Demand)을 통계에 표시
                        stats[res].cons += (b.inputs[res] * consMult) * b.activeCount * baseEfficiency;
                    }
                }
            }
            if (b.outputs && !b.outputs.energy) {
                // 생산량은 실제 자원이 있어야 돌아가므로 여기는 기존 로직(공평 배분)을 어느 정도 따르거나, 
                // 혹은 생산 잠재력을 보여주기 위해 baseEfficiency를 쓸 수 있습니다.
                // 여기서는 "잠재 생산량"을 보여주기 위해 baseEfficiency를 적용합니다.
                
                let inputShortage = 1.0;
                // 실제 생산량을 보고 싶다면 아래 로직 유지, 잠재량을 보고 싶다면 삭제
                /*
                if (b.inputs) {
                    for (let r in b.inputs) {
                        if (r === 'energy') continue;
                        let available = gameData.resources[r] || 0;
                        let demand = (b.inputs[r] * consMult) * b.activeCount * baseEfficiency;
                        if (demand > available) inputShortage = Math.min(inputShortage, available / demand);
                    }
                }
                */

                for (let res in b.outputs) {
                    stats[res].prod += b.outputs[res] * b.activeCount * baseEfficiency * inputShortage;
                }
            }
        }
    });
    return stats;
}

/**
 * 6. ⭐ 실제 자원 생산 및 소모 엔진 (Proportional Allocation)
 */
export function produceResources(deltaTime) {
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;
    const legacy = gameData.legacyUpgrades || [];
    
    // [유산: 발효 잔열] 유기섬유 자동 생산
    if (legacy.includes('legacy_biofuel_trickle')) {
        gameData.resources.bioFiber += 0.1 * deltaTime;
    }

    // --- 1단계: 전력 생산 시설 (발전기) ---
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.outputs && b.outputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let inputEfficiency = 1.0;
            
            // [유산: 과충전 프로토콜] 발전기 생산량 25% 증가
            if (legacy.includes('aurelia_generator_boost')) speedMult *= 1.25;
            // [유산: 항성 항해 데이터] 환생 1회당 전기 생산 +4%
            if (legacy.includes('aurelia_prestige_drive')) speedMult *= (1 + (gameData.prestigeLevel * 0.04));

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

    // --- 2단계: 전력망 부하 계산 ---
    gameData.buildings.forEach(b => {
        if (b.activeCount > 0 && b.inputs && b.inputs.energy) {
            let speedMult = getBuildingMultiplier(b.id);
            let consMult = getBuildingConsumptionMultiplier(b.id);
            let energyEff = getEnergyEfficiencyMultiplier(b.id);

            // ⭐ [추가] [유산: 핵융합 최적화] 고급 에너지 시설(ID 30, 111 등) 전력 소모 30% 감소
            if (legacy.includes('aurelia_fusion_eff') && [30, 111].includes(b.id)) energyEff *= 0.7;

            totalEnergyReq += (b.inputs.energy * consMult * energyEff) * b.activeCount * speedMult;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;
    let powerFactor = totalEnergyReq > 0 ? Math.min(1.0, totalEnergyProd / totalEnergyReq) : 1.0;

    // --- 3단계: 일반 공정 (공평 배분) ---

    // A. 전체 수요량 파악
    let frameDemand = {};
    gameData.buildings.forEach(b => {
        if (b.activeCount <= 0 || (b.outputs && b.outputs.energy)) return;
        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id);
        let efficiency = speedMult * (b.inputs && b.inputs.energy ? powerFactor : 1.0);
        if (b.inputs) {
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                let needed = (b.inputs[res] * consMult) * b.activeCount * deltaTime * efficiency;
                frameDemand[res] = (frameDemand[res] || 0) + needed;
            }
        }
    });

    // B. 공급 비율 계산
    let shortageFactor = {};
    for (let res in frameDemand) {
        let available = gameData.resources[res] || 0;
        shortageFactor[res] = (frameDemand[res] > available && available >= 0) ? (available / frameDemand[res]) : 1.0;
    }

    // C. 실제 생산/소모
    gameData.buildings.forEach(b => {
        if (b.activeCount <= 0 || (b.outputs && b.outputs.energy)) return;

        let speedMult = getBuildingMultiplier(b.id);
        let consMult = getBuildingConsumptionMultiplier(b.id);
        let energyEff = getEnergyEfficiencyMultiplier(b.id);
        
        // ⭐ [추가] [유산: 자동 채굴 알고리즘] 채굴 건물(ID 40~45, 100~102 등) 생산량 30% 증가
        if (legacy.includes('aurelia_miner_boost') && (b.id >= 40 && b.id <= 45 || b.id <= 3 || b.id >= 100 && b.id <= 102)) {
            speedMult *= 1.3;
        }

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
                    let consume = (b.inputs[res] * consMult) * b.activeCount * deltaTime * finalEfficiency;
                    gameData.resources[res] = Math.max(0, gameData.resources[res] - consume);
                }
            }
            if (b.outputs) {
                for (let res in b.outputs) {
                    if (res === 'energy') continue;
                    gameData.resources[res] += (b.outputs[res] * b.activeCount * deltaTime * finalEfficiency);
                }
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

    // [유산 보너스] 초공간 클릭 보유 시 5배
    if (gameData.legacyUpgrades && gameData.legacyUpgrades.includes('fast_click')) {
        strength *= 5;
    }
    return strength;
}

/**
 * 8. ⭐ 행성 대응 수동 클릭 처리 (Planet Aware)
 */
export function manualGather(type) {
    const amount = getClickStrength(); 
    const p = gameData.currentPlanet || 'earth';

    // 첫 번째 버튼 (지구: 나무, 아우렐리아: 고철, 베리디안: 섬유)
    if (type === 'wood') {
        if (p === 'earth') gameData.resources.wood += amount;
        else if (p === 'aurelia') gameData.resources.scrapMetal += amount;
        else if (p === 'veridian') gameData.resources.bioFiber += amount;
        return true;
    }

    // 두 번째 버튼 (지구: 돌, 아우렐리아: 자석, 베리디안: 포자)
    if (type === 'stone') {
        if (p === 'earth') gameData.resources.stone += amount;
        else if (p === 'aurelia') gameData.resources.magnet += amount;
        else if (p === 'veridian') gameData.resources.spore += amount;
        return true;
    }

    // 지구 전용 판자 제작 (행성 이동 시 버튼이 숨겨지므로 안전함)
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += Math.max(1, Math.floor(amount / 2)); 
            return true;
        }
        return false;
    }

    // 기타 자원 처리
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
    let missing = [];
    for (let r in nextStage.req) {
        if (r === 'energy') { if (gameData.resources.energy < nextStage.req[r]) missing.push('energy'); }
        else { if ((gameData.resources[r] || 0) < nextStage.req[r]) missing.push(r); }
    }
    if (missing.length > 0) return { success: false, missing };

    for (let r in nextStage.req) { if (r !== 'energy') gameData.resources[r] -= nextStage.req[r]; }
    gameData.houseLevel++;
    return { success: true };
}