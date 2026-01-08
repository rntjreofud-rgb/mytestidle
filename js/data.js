export let gameData = {
    resources: { wood: 0, stone: 0, iron: 0 },
    houseLevel: 0,
    buildings: [
        { id: 0, name: "나무꾼 오두막", type: "wood", baseCost: { wood: 15 }, production: 1, count: 0 },
        { id: 1, name: "채석장", type: "stone", baseCost: { wood: 50, stone: 10 }, production: 1, count: 0 },
        { id: 2, name: "제철소", type: "iron", baseCost: { wood: 200, stone: 100, iron: 20 }, production: 1, count: 0 },
        { id: 3, name: "고급 벌목 기계", type: "wood", baseCost: { wood: 500, iron: 50 }, production: 10, count: 0 },
        { id: 4, name: "자동 채굴 드릴", type: "stone", baseCost: { wood: 1000, stone: 500, iron: 100 }, production: 10, count: 0 }
    ]
};

// 집 업그레이드 설정 (상수)
export const houseStages = [
    { name: "텐트", desc: "야생의 시작입니다.", req: { wood: 20 }, unlock: "none" },
    { name: "나무 오두막", desc: "이제 돌을 캘 수 있습니다.", req: { wood: 100, stone: 0 }, unlock: "stone" },
    { name: "석조 주택", desc: "단단한 집입니다. 철을 발견하세요.", req: { wood: 300, stone: 150 }, unlock: "iron" },
    { name: "현대식 아파트", desc: "자동화 기계를 늘리세요.", req: { wood: 1000, stone: 500, iron: 100 }, unlock: "all" },
    { name: "우주 센터", desc: "우주선을 건조할 준비가 되었습니다.", req: { wood: 5000, stone: 3000, iron: 2000 }, unlock: "rocket" },
    { name: "우주선 발사 (엔딩)", desc: "지구를 떠납니다!", req: { wood: 50000, stone: 50000, iron: 50000 }, unlock: "end" }
];

// 데이터를 통째로 교체할 때 사용 (로드 기능용)
export function setGameData(newData) {
    // 객체 병합
    gameData.resources = { ...gameData.resources, ...newData.resources };
    gameData.houseLevel = newData.houseLevel || 0;
    
    // 건물 정보 병합 (새 버전 업데이트 대응)
    if (newData.buildings) {
        newData.buildings.forEach((savedB, i) => {
            if (gameData.buildings[i]) {
                gameData.buildings[i].count = savedB.count;
            }
        });
    }
}