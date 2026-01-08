// js/data.js

export let gameData = {
    resources: { 
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0,
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0,
        gear: 0, circuit: 0,
        energy: 0, energyMax: 0 
    },
    houseLevel: 0,
    // ⭐ [신규] 완료된 연구 ID 목록 저장
    researches: [], 
    buildings: [
        // (기존 건물 데이터 유지...)
        { id: 0, name: "자동 벌목기", cost: { wood: 10 }, inputs: null, outputs: { wood: 1 }, count: 0 },
        { id: 1, name: "채석 드릴", cost: { wood: 50, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0 },
        { id: 2, name: "석탄 채굴기", cost: { wood: 50, stone: 20 }, inputs: null, outputs: { coal: 1 }, count: 0 },
        { id: 3, name: "석탄 발전소", cost: { stone: 100, brick: 20, plank: 20 }, inputs: { coal: 1 }, outputs: { energy: 10 }, count: 0 },
        { id: 4, name: "전기 철광석 채굴기", cost: { brick: 50, gear: 10 }, inputs: { energy: 2 }, outputs: { ironOre: 1 }, count: 0 },
        { id: 5, name: "전기 구리 채굴기", cost: { brick: 50, gear: 10 }, inputs: { energy: 2 }, outputs: { copperOre: 1 }, count: 0 },
        { id: 6, name: "제재소 (판자)", cost: { wood: 100, stone: 50 }, inputs: { wood: 2 }, outputs: { plank: 1 }, count: 0 },
        { id: 7, name: "돌 용광로 (벽돌)", cost: { stone: 100, wood: 50 }, inputs: { stone: 2 }, outputs: { brick: 1 }, count: 0 },
        { id: 8, name: "철 용광로 (철판)", cost: { brick: 100, stone: 100 }, inputs: { ironOre: 2, coal: 0.5 }, outputs: { ironPlate: 1 }, count: 0 },
        { id: 9, name: "구리 용광로 (구리판)", cost: { brick: 100, stone: 100 }, inputs: { copperOre: 2, coal: 0.5 }, outputs: { copperPlate: 1 }, count: 0 },
        { id: 10, name: "부품 조립기 (톱니)", cost: { ironPlate: 50, brick: 50 }, inputs: { ironPlate: 2, energy: 1 }, outputs: { gear: 1 }, count: 0 },
        { id: 11, name: "전자 공장 (회로)", cost: { ironPlate: 100, copperPlate: 100, gear: 20 }, inputs: { ironPlate: 1, copperPlate: 2, energy: 2 }, outputs: { circuit: 1 }, count: 0 }
    ]
};

// ⭐ [신규] 연구 목록 (Static Data)
export const researchList = [
    { 
        id: "stone_tool", 
        name: "돌 곡괭이 연마", 
        desc: "수동 채집량이 +1 증가합니다.", 
        cost: { wood: 50, stone: 20 },
        bonus: 1 
    },
    { 
        id: "iron_pickaxe", 
        name: "철제 도구 제작", 
        desc: "수동 채집량이 +2 증가합니다.", 
        cost: { plank: 100, ironPlate: 20 },
        bonus: 2 
    },
    { 
        id: "mining_drill", 
        name: "강철 드릴 헤드", 
        desc: "수동 채집량이 +5 증가합니다.", 
        cost: { gear: 50, copperPlate: 50 },
        bonus: 5 
    },
    { 
        id: "laser_mining", 
        name: "레이저 채광 기술", 
        desc: "수동 채집량이 +10 증가합니다.", 
        cost: { circuit: 100, energy: 0 }, // 에너지 조건 없음
        bonus: 10 
    }
];

export const houseStages = [
    { name: "야영지", desc: "나무를 모아 판자를 만드세요.", req: { wood: 20 }, unlock: "basic" },
    { name: "목조 주택", desc: "석탄을 발견하고 채굴을 시작하세요.", req: { plank: 50, stone: 20 }, unlock: "coal" },
    { name: "산업 혁명", desc: "발전소를 짓고 전력으로 광물을 캐세요.", req: { brick: 100, coal: 100 }, unlock: "power" },
    { name: "공장 단지", desc: "구리와 회로를 양산하세요.", req: { ironPlate: 200, copperPlate: 200, energy: 0 }, unlock: "copper" },
    { name: "하이테크 연구소", desc: "정밀 부품을 생산하세요.", req: { gear: 100, circuit: 50 }, unlock: "advanced" },
    { name: "로켓 발사대 (엔딩)", desc: "이 행성을 탈출합니다.", req: { circuit: 2000, gear: 5000, ironPlate: 10000 }, unlock: "end" }
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
    // ⭐ 연구 데이터 로드 (없으면 빈 배열)
    gameData.researches = newData.researches || [];
    
    if (newData.buildings) {
        newData.buildings.forEach((savedB, i) => {
            if (gameData.buildings[i]) {
                gameData.buildings[i].count = savedB.count;
            }
        });
    }
}