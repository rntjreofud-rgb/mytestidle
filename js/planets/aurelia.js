export const aureliaData = {
    initialResources: ['scrapMetal', 'magnet'],
    houseStages: [
        { name: "파괴된 포드", desc: "금속 파편이 가득한 황무지입니다.", req: { scrapMetal: 10 } },
        // ... 50단계까지 추가
    ],
    buildings: [
        { id: 100, name: "잔해 수거기", cost: { scrapMetal: 15 }, outputs: { scrapMetal: 1 }, reqLevel: 0 },
        // ... 행성 전용 건물들
    ],
    researchList: [
        { id: "magnetic_tuning", name: "자력 조율", desc: "수거기 효율 2배", cost: { scrapMetal: 100 }, type: 'building', target: [100], value: 2, reqResearch: null },
        // ... 행성 전용 연구들
    ]
};