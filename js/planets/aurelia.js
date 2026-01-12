export const aureliaData = {
    initialResources: ['scrapMetal', 'magnet'],
    
    // === 하우스 업그레이드 (Lv.0 ~ 10) ===
    houseStages: [
        { name: "파괴된 포드", desc: "추락한 포드의 잔해 속에서 정신을 차렸습니다. 주변에 고철이 널려 있습니다.", req: { scrapMetal: 15 } },
        { name: "고철 차양막", desc: "날카로운 고철판을 덧대어 산성비와 모래바람을 막을 공간을 만들었습니다.", req: { scrapMetal: 100, magnet: 20 } },
        { name: "자력 벙커", desc: "행성의 자성을 이용해 외벽을 단단히 고정했습니다. 진동에 강해졌습니다.", req: { scrapMetal: 500, magnet: 100 } },
        { name: "크리스탈 조명", desc: "충전된 크리스탈을 배치하여 기지 내부를 밝히고 정전기를 제어합니다.", req: { chargedCrystal: 50, heavyAlloy: 20 } },
        { name: "전자기 제어실", desc: "행성의 거대한 자기장을 조절하여 전력을 안정적으로 공급받습니다.", req: { heavyAlloy: 200, fluxEnergy: 100 } },
        { name: "강화 티타늄 해치", desc: "지구에서 쓰던 기술을 개량해 행성의 압력을 견딜 수 있는 입구를 만들었습니다.", req: { scrapMetal: 5000, energy: 100 } },
        // ... (50레벨까지 기획 가능)
    ],

    // === 건물 리스트 (ID 100번대) ===
    buildings: [
        { id: 100, name: "잔해 수거기", cost: { scrapMetal: 20 }, inputs: null, outputs: { scrapMetal: 1.5 }, count: 0, reqLevel: 0 },
        { id: 101, name: "자력 흡입기", cost: { scrapMetal: 150, magnet: 50 }, inputs: null, outputs: { scrapMetal: 6.0 }, count: 0, reqLevel: 1 },
        { id: 102, name: "크리스탈 굴착기", cost: { scrapMetal: 300 }, inputs: null, outputs: { chargedCrystal: 2.0 }, count: 0, reqLevel: 1 },
        { id: 103, name: "유도 제련로", cost: { scrapMetal: 500, magnet: 100 }, inputs: { scrapMetal: 10 }, outputs: { magnet: 2.5 }, count: 0, reqLevel: 2 },
        { id: 104, name: "합금 압착기", cost: { magnet: 200, chargedCrystal: 100 }, inputs: { scrapMetal: 20, magnet: 5 }, outputs: { heavyAlloy: 4.0 }, count: 0, reqLevel: 3 },
        { id: 105, name: "지각 발전기", cost: { heavyAlloy: 100, scrapMetal: 1000 }, inputs: { magnet: 10 }, outputs: { energy: 40 }, count: 0, reqLevel: 4 },
        { id: 106, name: "플럭스 배터리", cost: { heavyAlloy: 500, chargedCrystal: 500 }, inputs: { chargedCrystal: 20, energy: 50 }, outputs: { fluxEnergy: 2.0 }, count: 0, reqLevel: 5 },
        { id: 107, name: "나노 강철 용광로", cost: { heavyAlloy: 1000, fluxEnergy: 200 }, inputs: { scrapMetal: 50, fluxEnergy: 10, energy: 100 }, outputs: { nanoSteel: 5.0 }, count: 0, reqLevel: 5 }
    ],

    // === 연구 리스트 ===
    researchList: [
        { id: "a_scrapping", name: "고철 해체술", desc: "수동 채집 효율 3배 증가", cost: { scrapMetal: 100 }, type: 'manual', value: 3, reqResearch: null },
        { id: "a_magnetism", name: "자력 최적화", desc: "자력 흡입기(ID 101) 및 수거기 속도 2.5배", cost: { magnet: 200, scrapMetal: 1000 }, type: 'building', target: [100, 101], value: 2.5, reqResearch: "a_scrapping" },
        { id: "a_flux_core", name: "플럭스 코어 개선", desc: "지각 발전기(ID 105) 전력 생산 4배", cost: { fluxEnergy: 500, heavyAlloy: 500 }, type: 'building', target: [105], value: 4.0, reqResearch: "a_magnetism" },
        { id: "a_alloy_lean", name: "린 합금 공정", desc: "합금 압착기 재료 소모 40% 감소", cost: { heavyAlloy: 1000, chargedCrystal: 1000 }, type: 'consumption', target: [104], value: 0.6, reqResearch: "a_flux_core" }
    ]
};