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
        scrapMetal: 0, magnet: 0, chargedCrystal: 0, heavyAlloy: 0, fluxEnergy: 0, nanoSteel: 0,
        // 행성3(베리디안) 자원
        bioFiber: 0, spore: 0, yeast: 0, livingWood: 0, bioFuel: 0, rootBrick: 0,
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
    // 모든 행성의 자원 키를 안전하게 0 또는 저장된 값으로 동기화
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
    
    // 행성별 초기 자원 해금 목록 가져오기
    const planetTemplate = getActivePlanetData(); // 현재 행성 데이터(earthData 등) 가져옴
    gameData.unlockedResources = Array.isArray(newData.unlockedResources) 
        ? newData.unlockedResources 
        : [...planetTemplate.initialResources];

    // 4. 환생 및 유산 데이터 복구
    gameData.prestigeLevel = newData.prestigeLevel || 0;
    gameData.legacyUpgrades = newData.legacyUpgrades || [];
    
    // [환생 점수 보정: 5점 -> 3점]
    const correctPoints = gameData.prestigeLevel * 3;
    if (newData.cosmicData === undefined || (gameData.legacyUpgrades.length === 0 && newData.cosmicData > correctPoints)) {
        gameData.cosmicData = correctPoints;
        console.log(`포인트 보정 완료: ${gameData.cosmicData} 데이터로 재설정됨.`);
    } else {
        gameData.cosmicData = newData.cosmicData || 0;
    }

    // 5. ⭐ [핵심 수정] 행성별 건물 템플릿에 맞춘 데이터 초기화
    // 저장된 건물 데이터가 아닌, "현재 행성의 엔진 건물 리스트"를 기준으로 만듭니다.
    const currentPlanetBuildings = planetTemplate.buildings; 

    gameData.buildings = currentPlanetBuildings.map((templateB) => {
        // 세이브 데이터에서 현재 템플릿 건물과 ID가 같은 것을 찾습니다.
        const savedB = newData.buildings ? newData.buildings.find(b => b.id === templateB.id) : null;

        if (savedB) {
            // 기존 유저 데이터 적용
            return {
                ...templateB,
                count: savedB.count || 0,
                activeCount: (savedB.activeCount !== undefined) ? savedB.activeCount : (savedB.count || 0),
                on: (savedB.on !== undefined) ? savedB.on : true
            };
        } else {
            // 신규 유저 또는 이 행성에 처음 온 경우: 기본값(0)으로 초기화
            return {
                ...templateB,
                count: 0,
                activeCount: 0,
                on: true
            };
        }
    });

    // 6. 최종 안전장치: 가동 개수 보정 및 켜짐 상태 확인
    gameData.buildings.forEach(b => {
        if (b.activeCount > b.count) b.activeCount = b.count;
        if (b.on === undefined) b.on = true;
    });

    console.log(`[시스템] ${gameData.currentPlanet.toUpperCase()} 행성 데이터 동기화 완료.`);
}

export const legacyList = [
    { id: "start_resource", name: "선구자의 보급품", desc: "매 회차 시작 시 나무 500, 돌 500, 판자 100 보유", cost: 1 },
    { id: "fast_click", name: "초공간 클릭", desc: "수동 채집 효율 5배 영구 증가", cost: 2 },
    { id: "cheap_build", name: "나노 건축 설계", desc: "모든 건물 건설 비용 20% 영구 감소", cost: 3 },
    { id: "infinite_storage", name: "압축 창고", desc: "모든 자원 생산 효율 20% 추가 증가", cost: 10 }
];