// js/data.js

import { earthData } from './planets/earth.js';
import { aureliaData } from './planets/aurelia.js';
import { veridianData } from './planets/veridian.js';

// === [1] 공통 게임 상태 정의 ===
export let gameData = {
    currentPlanet: 'earth', // 현재 활성화된 행성
    resources: { 
        // 지구 자원
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0, oil: 0, titaniumOre: 0, uraniumOre: 0,
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0, glass: 0, sulfur: 0,
        steel: 0, plastic: 0, concrete: 0, battery: 0, fuelCell: 0,
        gear: 0, circuit: 0, advCircuit: 0, processor: 0, optics: 0, titaniumPlate: 0,
        aiCore: 0, nanobots: 0, advAlloy: 0, rocketFuel: 0, warpCore: 0,
        quantumData: 0, gravityModule: 0,
        // 행성2(아우렐리아) 자원
        scrapMetal: 0,      // 고철파편
        magnet: 0,          // 자석
        chargedCrystal: 0,  // 대전수정
        heavyAlloy: 0,      // 중합금
        fluxEnergy: 0,      // 플럭스에너지
        nanoSteel: 0,       // 나노강철
        plasmaCore: 0,      // 플라즈마코어
        // 베리디안
        bioFiber: 0, spore: 0, yeast: 0, livingWood: 0, bioFuel: 0, rootBrick: 0, mutantCell: 0, geneticCode: 0, pheromone: 0, biosphereCore: 0,
        // 시스템
        energy: 0, energyMax: 0
    },
    unlockedResources: ['wood', 'stone', 'plank'], 
    houseLevel: 0,
    researches: [], 
    prestigeLevel: 0,
    cosmicData: 0,
    legacyUpgrades: [],
    lastTimestamp: Date.now(),
    
    // ⭐ 현재 행성에서 가동 중인 건물들의 실시간 상태 (setGameData에서 동기화됨)
    buildings: [] 
};

// === [2] 행성 데이터 라우팅 (Getters) ===
// 이 함수들은 Logic.js나 UI.js에서 호출되어 현재 행성에 맞는 데이터를 반환합니다.
export function getActivePlanetData() {
    const planetMap = { earth: earthData, aurelia: aureliaData, veridian: veridianData };
    return planetMap[gameData.currentPlanet] || earthData;
}

// 현재 행성의 건물 템플릿
export const getActiveBuildings = () => getActivePlanetData().buildings;
// 현재 행성의 연구 리스트
export const getActiveResearch = () => getActivePlanetData().researchList;
// 현재 행성의 업그레이드 단계
export const getActiveStages = () => getActivePlanetData().houseStages;

export function setGameData(newData) {
    // 1. 행성 설정 (지구가 기본값)
    gameData.currentPlanet = newData.currentPlanet || 'earth';

    // 2. 자원 데이터 복구 (NaN/null 방지)
    for (let key in gameData.resources) {
        if (newData.resources && newData.resources[key] !== undefined) {
            let val = newData.resources[key];
            gameData.resources[key] = (val === null || isNaN(val)) ? 0 : val;
        } else {
            gameData.resources[key] = 0;
        }
    }

    // 3. 기초 진행도 복구
    gameData.houseLevel = newData.houseLevel || 0;
    gameData.researches = Array.isArray(newData.researches) ? newData.researches : [];
    
    const planetTemplate = getActivePlanetData(); 
    gameData.unlockedResources = Array.isArray(newData.unlockedResources) 
        ? newData.unlockedResources 
        : [...planetTemplate.initialResources];

    // 4. ⭐ 환생 및 유산 데이터 복구 (포인트 소급 적용 핵심)
    gameData.prestigeLevel = newData.prestigeLevel || 0;
    gameData.legacyUpgrades = newData.legacyUpgrades || [];
    
    // [보정 A] 지구가 아닌 행성에 왔다면 최소 지구 50렙을 찍은 것이므로 숙련도 보정
    if (gameData.currentPlanet !== 'earth' && gameData.prestigeLevel === 0) {
        gameData.prestigeLevel = 1;
        console.log("외계 행성 거주 확인: 숙련도 Lv.1 강제 적용");
    }

    // [보정 B] 환생 점수 보정 및 미지급 포인트 정산
    const correctPoints = gameData.prestigeLevel * 3; // 현재 기준: 환생당 3점
    let savedPoints = newData.cosmicData !== undefined ? newData.cosmicData : 0;

    // 유산 업그레이드를 하나도 안 샀는데, 포인트가 숙련도 기준보다 낮다면 (예: 0점이라면)
    if (gameData.legacyUpgrades.length === 0 && savedPoints < correctPoints) {
        gameData.cosmicData = correctPoints;
        console.log(`포인트 소급 지급 완료: ${correctPoints} 데이터로 설정됨.`);
    } else {
        // 이미 업그레이드를 샀거나 포인트가 충분하다면 세이브 데이터를 존중
        gameData.cosmicData = savedPoints;
    }

    // 5. 행성별 건물 템플릿에 맞춘 데이터 초기화
    const currentPlanetBuildings = planetTemplate.buildings; 

    gameData.buildings = currentPlanetBuildings.map((templateB) => {
        const savedB = newData.buildings ? newData.buildings.find(b => b.id === templateB.id) : null;
        if (savedB) {
            return {
                ...templateB,
                count: savedB.count || 0,
                activeCount: (savedB.activeCount !== undefined) ? savedB.activeCount : (savedB.count || 0),
                on: (savedB.on !== undefined) ? savedB.on : true
            };
        } else {
            return {
                ...templateB,
                count: 0,
                activeCount: 0,
                on: true
            };
        }
    });

    // 6. 최종 안전장치
    gameData.buildings.forEach(b => {
        if (b.activeCount > b.count) b.activeCount = b.count;
        if (b.on === undefined) b.on = true;
    });

    console.log(`[시스템] ${gameData.currentPlanet.toUpperCase()} 데이터 동기화 완료.`);
}



export const legacyList = [
    { id: "start_resource", name: "선구자의 보급품", desc: "매 회차 시작 시 나무 500, 돌 500, 판자 100 보유", cost: 1 },
    { id: "fast_click", name: "초공간 클릭", desc: "수동 채집 효율 5배 영구 증가", cost: 2 },
    { id: "cheap_build", name: "나노 건축 설계", desc: "모든 건물 건설 비용 20% 영구 감소", cost: 3 },
    { id: "infinite_storage", name: "압축 창고", desc: "모든 자원 생산 효율 20% 추가 증가", cost: 10 }
];