// js/data.js

export let gameData = {
    resources: { 
        // 원자재 (석탄 추가)
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0,
        // 가공품
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0,
        // 고급 부품
        gear: 0, circuit: 0,
        // 시스템 자원 (저장 안 됨, 매 프레임 계산)
        energy: 0, energyMax: 0 
    },
    houseLevel: 0,
    buildings: [
        // === 1. 기초 채집 (연료/전력 없음) ===
        { id: 0, name: "자동 벌목기", cost: { wood: 10 }, inputs: null, outputs: { wood: 1 }, count: 0 },
        { id: 1, name: "채석 드릴", cost: { wood: 50, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0 },
        { id: 2, name: "석탄 채굴기", cost: { wood: 50, stone: 20 }, inputs: null, outputs: { coal: 1 }, count: 0 }, // 신규

        // === 2. 전력 시스템 ===
        { 
            id: 3, name: "석탄 발전소", 
            cost: { stone: 100, brick: 20, plank: 20 }, 
            inputs: { coal: 1 }, // 석탄 1 소모
            outputs: { energy: 10 }, // 전력 10 생산
            count: 0,
            desc: "석탄을 태워 전력을 생산합니다."
        },

        // === 3. 전력 사용 채굴 (전력 소모 추가) ===
        { 
            id: 4, name: "전기 철광석 채굴기", 
            cost: { brick: 50, gear: 10 }, 
            inputs: { energy: 2 }, // 전력 2 소모
            outputs: { ironOre: 1 }, 
            count: 0 
        },
        { 
            id: 5, name: "전기 구리 채굴기", 
            cost: { brick: 50, gear: 10 }, 
            inputs: { energy: 2 }, // 전력 2 소모
            outputs: { copperOre: 1 }, 
            count: 0 
        },

        // === 4. 가공 (용광로) ===
        { id: 6, name: "제재소 (판자)", cost: { wood: 100, stone: 50 }, inputs: { wood: 2 }, outputs: { plank: 1 }, count: 0 },
        { id: 7, name: "돌 용광로 (벽돌)", cost: { stone: 100, wood: 50 }, inputs: { stone: 2 }, outputs: { brick: 1 }, count: 0 },
        { id: 8, name: "철 용광로 (철판)", cost: { brick: 100, stone: 100 }, inputs: { ironOre: 2, coal: 0.5 }, outputs: { ironPlate: 1 }, count: 0 }, // 연료로 석탄 소모 추가
        { id: 9, name: "구리 용광로 (구리판)", cost: { brick: 100, stone: 100 }, inputs: { copperOre: 2, coal: 0.5 }, outputs: { copperPlate: 1 }, count: 0 },

        // === 5. 조립 ===
        { id: 10, name: "부품 조립기 (톱니)", cost: { ironPlate: 50, brick: 50 }, inputs: { ironPlate: 2, energy: 1 }, outputs: { gear: 1 }, count: 0 },
        { id: 11, name: "전자 공장 (회로)", cost: { ironPlate: 100, copperPlate: 100, gear: 20 }, inputs: { ironPlate: 1, copperPlate: 2, energy: 2 }, outputs: { circuit: 1 }, count: 0 }
    ]
};

export const houseStages = [
    { name: "야영지", desc: "나무를 모아 판자를 만드세요.", req: { wood: 20 }, unlock: "basic" },
    { name: "목조 주택", desc: "석탄을 발견하고 채굴을 시작하세요.", req: { plank: 50, stone: 20 }, unlock: "coal" }, // Lv.1
    { name: "산업 혁명", desc: "발전소를 짓고 전력으로 광물을 캐세요.", req: { brick: 100, coal: 100 }, unlock: "power" }, // Lv.2 (전력 시작)
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
    if (newData.buildings) {
        newData.buildings.forEach((savedB, i) => {
            if (gameData.buildings[i]) {
                gameData.buildings[i].count = savedB.count;
            }
        });
    }
}