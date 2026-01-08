// js/logic.js

import { gameData, researchList } from './data.js';

export function getBuildingCost(building) {
    let multiplier = Math.pow(1.2, building.count);
    let currentCost = {};
    for (let r in building.cost) {
        currentCost[r] = Math.floor(building.cost[r] * multiplier);
    }
    return currentCost;
}

// ⭐ [신규] 건물의 생산 속도 배율 계산
export function getBuildingMultiplier(buildingId) {
    let multiplier = 1.0;
    
    // 완료된 연구들 확인
    researchList.forEach(r => {
        if (gameData.researches.includes(r.id)) {
            // 건물 버프형 연구이고, 이 건물이 대상이라면
            if (r.type === 'building' && r.target.includes(buildingId)) {
                multiplier *= r.value;
            }
        }
    });
    return multiplier;
}

// UI 표기를 위한 생산/소비량 계산
export function calculateNetMPS() {
    let stats = {};
    for(let key in gameData.resources) {
        stats[key] = { prod: 0, cons: 0 };
    }

    gameData.buildings.forEach(b => {
        if (b.count > 0) {
            // ⭐ 건물별 배율 적용
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

// 실제 자원 생산 로직
export function produceResources(deltaTime) {
    let totalEnergyProd = 0;
    let totalEnergyReq = 0;

    // 1. 전력 생산 (발전소)
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.outputs && b.outputs.energy) {
            // ⭐ 발전소 속도 배율 적용
            let speedMult = getBuildingMultiplier(b.id);
            let fuelEfficiency = 1.0;

            if(b.inputs) {
                for(let res in b.inputs) {
                    // 연료 소모량도 속도만큼 증가
                    let needed = b.inputs[res] * b.count * speedMult * deltaTime;
                    if((gameData.resources[res] || 0) < needed) {
                        fuelEfficiency = (gameData.resources[res] || 0) / needed;
                    }
                }
                if(fuelEfficiency > 0) {
                    for(let res in b.inputs) {
                        gameData.resources[res] -= (b.inputs[res] * b.count * speedMult * deltaTime) * fuelEfficiency;
                    }
                }
            }
            // 전력 생산량도 속도만큼 증가
            totalEnergyProd += (b.outputs.energy * b.count * speedMult) * fuelEfficiency;
        }
    });

    // 2. 전력 요구량 집계
    gameData.buildings.forEach(b => {
        if (b.count > 0 && b.inputs && b.inputs.energy) {
            // ⭐ 기계가 빨라지면 전기 소모량도 늘어나는게 팩토리오 고증이지만, 
            // 게임 난이도 조절을 위해 전기 소모량은 속도에 비례하지 않게 할 수도 있음.
            // 여기서는 "속도가 빨라지면 전기 더 먹음"으로 구현 (리얼하게)
            let speedMult = getBuildingMultiplier(b.id);
            totalEnergyReq += b.inputs.energy * b.count * speedMult;
        }
    });

    gameData.resources.energy = totalEnergyProd;
    gameData.resources.energyMax = totalEnergyReq;

    let powerFactor = 1.0;
    if (totalEnergyReq > 0) {
        powerFactor = totalEnergyProd / totalEnergyReq;
        if (powerFactor > 1) powerFactor = 1.0;
    }

    // 3. 일반 건물 가동
    gameData.buildings.forEach(b => {
        if (b.count === 0) return;
        if (b.outputs && b.outputs.energy) return; // 발전소 패스

        // ⭐ 건물 속도 배율
        let speedMult = getBuildingMultiplier(b.id);
        let efficiency = 1.0 * speedMult; // 기본 효율에 속도 곱함
        
        // 전력 체크
        if (b.inputs && b.inputs.energy) {
            efficiency *= powerFactor;
        }

        // 재료 체크
        if (b.inputs) {
            let maxPotential = 1.0; 
            for (let res in b.inputs) {
                if (res === 'energy') continue;
                // 요구량 = 기본요구 * 개수 * 시간 * (속도 * 전력효율)
                let required = b.inputs[res] * b.count * deltaTime * efficiency;
                
                // required가 0에 가까우면(재료없음) 패스
                if(required > 0) {
                    if ((gameData.resources[res] || 0) < required) {
                        let ratio = (gameData.resources[res] || 0) / required; 
                        if (ratio < maxPotential) maxPotential = ratio;
                    }
                }
            }
            efficiency *= maxPotential;

            if (efficiency > 0) {
                for (let res in b.inputs) {
                    if (res === 'energy') continue;
                    // 속도가 적용된 efficiency를 사용하여 차감
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

// 수동 채집 효율 (연구 반영)
export function getClickStrength() {
    let strength = 1; 
    researchList.forEach(r => {
        if (gameData.researches.includes(r.id)) {
            // manual 타입만 반영
            if (r.type === 'manual') {
                strength += r.value;
            }
        }
    });
    return strength;
}

export function manualGather(type) {
    const amount = getClickStrength(); 

    if (type === 'wood') {
        gameData.resources.wood += amount;
        return true;
    }
    if (type === 'stone') {
        if (gameData.houseLevel >= 1 || gameData.resources.wood >= 10) {
            gameData.resources.stone += amount;
            return true;
        }
        return false;
    }
    if (['coal', 'ironOre', 'copperOre'].includes(type)) {
        if (gameData.houseLevel < 1) return false;
        gameData.resources[type] += amount;
        return true;
    }
    if (type === 'plank') {
        if (gameData.resources.wood >= 2) {
            gameData.resources.wood -= 2;
            gameData.resources.plank += 1; // 판자는 항상 1개 (수동)
            return true;
        }
    }
    return false;
}

export function tryBuyResearch(id) {
    if (gameData.researches.includes(id)) return false;
    
    // 선행 연구 체크
    const research = researchList.find(r => r.id === id);
    if (!research) return false;
    
    if (research.reqResearch) {
        if (!gameData.researches.includes(research.reqResearch)) return false;
    }

    const cost = research.cost;
    for (let r in cost) {
        if ((gameData.resources[r] || 0) < cost[r]) return false;
    }
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