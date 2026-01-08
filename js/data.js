// js/data.js

export let gameData = {
    resources: { 
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0,
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0,
        gear: 0, circuit: 0,
        energy: 0, energyMax: 0 
    },
    houseLevel: 0,
    researches: [], 
    buildings: [
        // (기존 건물 데이터와 동일, ID 순서 유지)
        { id: 0, name: "자동 벌목기", cost: { wood: 10 }, inputs: null, outputs: { wood: 1 }, count: 0, reqLevel: 0 },
        { id: 1, name: "채석 드릴", cost: { wood: 50, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0, reqLevel: 0.5 },
        { id: 2, name: "석탄 채굴기", cost: { wood: 50, stone: 20 }, inputs: null, outputs: { coal: 1 }, count: 0, reqLevel: 1 },
        { id: 3, name: "석탄 발전소", cost: { stone: 100, brick: 20, plank: 20 }, inputs: { coal: 1 }, outputs: { energy: 10 }, count: 0, reqLevel: 2 },
        { id: 4, name: "전기 철광석 채굴기", cost: { brick: 50, gear: 10 }, inputs: { energy: 2 }, outputs: { ironOre: 1 }, count: 0, reqLevel: 2 },
        { id: 5, name: "전기 구리 채굴기", cost: { brick: 50, gear: 10 }, inputs: { energy: 2 }, outputs: { copperOre: 1 }, count: 0, reqLevel: 2 },
        { id: 6, name: "제재소 (판자)", cost: { wood: 100, stone: 50 }, inputs: { wood: 2 }, outputs: { plank: 1 }, count: 0, reqLevel: 0.5 },
        { id: 7, name: "돌 용광로 (벽돌)", cost: { stone: 100, wood: 50 }, inputs: { stone: 2 }, outputs: { brick: 1 }, count: 0, reqLevel: 0.5 },
        { id: 8, name: "철 용광로 (철판)", cost: { brick: 100, stone: 100 }, inputs: { ironOre: 2, coal: 0.5 }, outputs: { ironPlate: 1 }, count: 0, reqLevel: 1 },
        { id: 9, name: "구리 용광로 (구리판)", cost: { brick: 100, stone: 100 }, inputs: { copperOre: 2, coal: 0.5 }, outputs: { copperPlate: 1 }, count: 0, reqLevel: 1 },
        { id: 10, name: "부품 조립기 (톱니)", cost: { ironPlate: 50, brick: 50 }, inputs: { ironPlate: 2, energy: 1 }, outputs: { gear: 1 }, count: 0, reqLevel: 2 },
        { id: 11, name: "전자 공장 (회로)", cost: { ironPlate: 100, copperPlate: 100, gear: 20 }, inputs: { ironPlate: 1, copperPlate: 2, energy: 2 }, outputs: { circuit: 1 }, count: 0, reqLevel: 2 }
    ]
};

// ⭐ 연구 트리 데이터 (reqResearch: 선행 연구 ID)
// type: 'manual'(클릭버프) | 'building'(건물버프)
// target: 건물 ID 배열 (어떤 건물이 빨라지는지)
// value: 배율 (2는 2배, 1.5는 1.5배)
export const researchList = [
    // 1. 수동 채집 강화 (초반)
    { 
        id: "stone_tool", name: "돌 곡괭이 연마", desc: "수동 채집량이 +1 증가합니다.", 
        cost: { wood: 50, stone: 20 }, type: 'manual', value: 1, reqResearch: null 
    },
    
    // 2. 기초 자동화 (벌목기, 채석드릴 속도 2배) - 선행: 돌 곡괭이
    { 
        id: "basic_logistics", name: "기초 물류학", desc: "벌목기와 채석 드릴의 속도가 2배 빨라집니다.", 
        cost: { plank: 100, stone: 100 }, type: 'building', target: [0, 1], value: 2, reqResearch: "stone_tool" 
    },

    // 3. 철제 도구 (수동 +2) - 선행: 기초 물류학
    { 
        id: "iron_pickaxe", name: "철제 도구 제작", desc: "수동 채집량이 +2 증가합니다.", 
        cost: { plank: 200, ironPlate: 20 }, type: 'manual', value: 2, reqResearch: "basic_logistics" 
    },

    // 4. 제련 기술 (용광로 속도 2배) - 선행: 철제 도구
    { 
        id: "advanced_smelting", name: "고온 제련법", desc: "모든 용광로의 작업 속도가 2배 빨라집니다.", 
        cost: { brick: 200, ironPlate: 50 }, type: 'building', target: [7, 8, 9], value: 2, reqResearch: "iron_pickaxe" 
    },

    // 5. 전력 효율 (발전소 효율 2배 = 석탄1개로 전력 2배 생산이 아니라, 속도가 2배라 전력 생산량 2배)
    // 선행: 고온 제련법
    {
        id: "steam_engine_v2", name: "고압 터빈", desc: "석탄 발전소의 출력이 2배 증가합니다.",
        cost: { ironPlate: 200, gear: 50 }, type: 'building', target: [3], value: 2, reqResearch: "advanced_smelting"
    },

    // 6. 고급 채광 (전기 채굴기 속도 2배)
    {
        id: "electric_mining", name: "고속 모터", desc: "전기 채굴기의 속도가 2배 증가합니다.",
        cost: { gear: 100, copperPlate: 100 }, type: 'building', target: [4, 5, 2], value: 2, reqResearch: "steam_engine_v2"
    },

    // 7. 자동화 2 (조립기 속도 2배)
    {
        id: "mass_production", name: "대량 생산", desc: "제재소와 조립 공장의 속도가 2배 증가합니다.",
        cost: { circuit: 50, gear: 200 }, type: 'building', target: [6, 10, 11], value: 2, reqResearch: "electric_mining"
    },
    
    // 8. 레이저 채광 (최종 수동 버프)
    { 
        id: "laser_mining", name: "레이저 채광 기술", desc: "수동 채집량이 +10 증가합니다.", 
        cost: { circuit: 200, energy: 0 }, type: 'manual', value: 10, reqResearch: "mass_production" 
    }
];

export const houseStages = [
    { 
        name: "임시 야영지", 
        desc: "지구 탈출을 위한 첫 걸음입니다. 나무를 모아 거주지를 확보하세요.", 
        req: { wood: 20 }, 
        unlock: "basic" 
    },
    { 
        name: "목재 작업장", 
        desc: "비와 바람을 피할 지붕을 만들었습니다. 이제 광물을 캘 도구를 만드세요.", 
        req: { plank: 50, stone: 20 }, 
        unlock: "coal" 
    },
    { 
        name: "강철 요새", 
        desc: "집이라기보단 벙커에 가깝습니다. 발전기를 설치하고 공장화를 시작하세요.", 
        req: { brick: 100, coal: 100 }, 
        unlock: "power" 
    },
    { 
        name: "발사체 조립동", 
        desc: "거주 구역을 개조하여 로켓 엔진을 부착할 프레임을 짰습니다.", 
        req: { ironPlate: 300, copperPlate: 300, energy: 0 }, 
        unlock: "copper" 
    },
    { 
        name: "우주선 본체 (Starship)", 
        desc: "이것은 더 이상 집이 아닙니다. 궤도 진입을 위한 정밀 부품을 장착하세요.", 
        req: { gear: 200, circuit: 100 }, 
        unlock: "advanced" 
    },
    { 
        name: "지구 탈출 (Launch)", 
        desc: "모든 준비가 끝났습니다. 카운트다운을 시작합니다.", 
        req: { circuit: 2000, gear: 5000, ironPlate: 10000 }, 
        unlock: "end" 
    }
];

export function setGameData(newData) {
    for (let key in gameData.resources) {
        if (newData.resources && newData.resources[key] !== undefined) {
            gameData.resources[key] = newData.resources[key];
        } else {
            gameData.resources[key] = 0;
        }
    }
    gameData.houseLevel = newData.houseLevel || 0;
    gameData.researches = newData.researches || [];
    if (newData.buildings) {
        newData.buildings.forEach((savedB, i) => {
            if (gameData.buildings[i]) {
                gameData.buildings[i].count = savedB.count;
            }
        });
    }
}