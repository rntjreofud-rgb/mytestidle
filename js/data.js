// js/data.js

export let gameData = {
    // 자원 목록 (기본값 0)
    resources: { 
        wood: 0, stone: 0, ironOre: 0, copperOre: 0,
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0,
        gear: 0, circuit: 0
    },
    houseLevel: 0,
    buildings: [
        // 1. 채집
        { id: 0, name: "자동 벌목기", cost: { wood: 10 }, inputs: null, outputs: { wood: 1 }, count: 0 },
        { id: 1, name: "채석 드릴", cost: { wood: 50, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0 },
        { id: 2, name: "철광석 채굴기", cost: { wood: 100, brick: 20 }, inputs: null, outputs: { ironOre: 1 }, count: 0 },
        { id: 3, name: "구리 채굴기", cost: { wood: 100, brick: 20 }, inputs: null, outputs: { copperOre: 1 }, count: 0 },

        // 2. 가공
        { id: 4, name: "제재소 (판자)", cost: { wood: 100, stone: 50 }, inputs: { wood: 2 }, outputs: { plank: 1 }, count: 0 },
        { id: 5, name: "돌 용광로 (벽돌)", cost: { stone: 100, wood: 50 }, inputs: { stone: 2 }, outputs: { brick: 1 }, count: 0 },
        { id: 6, name: "철 용광로 (철판)", cost: { brick: 100, stone: 100 }, inputs: { ironOre: 2 }, outputs: { ironPlate: 1 }, count: 0 },
        { id: 7, name: "구리 용광로 (구리판)", cost: { brick: 100, stone: 100 }, inputs: { copperOre: 2 }, outputs: { copperPlate: 1 }, count: 0 },

        // 3. 조립
        { id: 8, name: "부품 조립기 (톱니)", cost: { ironPlate: 50, brick: 50 }, inputs: { ironPlate: 2 }, outputs: { gear: 1 }, count: 0 },
        { id: 9, name: "전자 공장 (회로)", cost: { ironPlate: 100, copperPlate: 100, gear: 20 }, inputs: { ironPlate: 1, copperPlate: 2 }, outputs: { circuit: 1 }, count: 0 }
    ]
};

export const houseStages = [
    { name: "야영지", desc: "나무를 모아 판자를 만드세요.", req: { wood: 20 }, unlock: "basic" },
    { name: "목조 주택", desc: "제재소를 건설하여 판자를 자동화하세요.", req: { plank: 50, stone: 20 }, unlock: "stone" },
    { name: "벽돌 집", desc: "철광석을 제련하여 철판을 만드세요.", req: { brick: 100, plank: 100 }, unlock: "iron" },
    { name: "공장 단지", desc: "자동화 공정의 시작입니다.", req: { ironPlate: 200, copperPlate: 200 }, unlock: "copper" },
    { name: "하이테크 연구소", desc: "정밀 부품을 생산하세요.", req: { gear: 100, circuit: 50 }, unlock: "advanced" },
    { name: "로켓 발사대 (엔딩)", desc: "이 행성을 탈출합니다.", req: { circuit: 2000, gear: 5000, ironPlate: 10000 }, unlock: "end" }
];

// ⭐ 데이터 병합 로직 강화 (세이브 파일 충돌 방지)
export function setGameData(newData) {
    // 자원 병합: 저장된 데이터에 없으면 기본값(0) 사용
    for (let key in gameData.resources) {
        if (newData.resources && newData.resources[key] !== undefined) {
            gameData.resources[key] = newData.resources[key];
        } else {
            gameData.resources[key] = 0; // 안전장치
        }
    }

    gameData.houseLevel = newData.houseLevel || 0;
    
    // 건물 병합
    if (newData.buildings) {
        newData.buildings.forEach((savedB, i) => {
            if (gameData.buildings[i]) {
                gameData.buildings[i].count = savedB.count;
            }
        });
    }
}