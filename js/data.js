// js/data.js

export let gameData = {
    // [1] 모든 자원 초기화 (총 29종)
    resources: { 
        // 원자재
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0, oil: 0, titaniumOre: 0, uraniumOre: 0,
        // 1차 가공품
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0, glass: 0, sulfur: 0, concrete: 0,
        // 2차 가공품 및 부품
        steel: 0, plastic: 0, gear: 0, circuit: 0, battery: 0, 
        // 고성능 부품
        advCircuit: 0, processor: 0, optics: 0, aiCore: 0, 
        // 우주 항행 부품
        rocketFuel: 0, nanobots: 0, advAlloy: 0, warpCore: 0,
        // 시스템 수치 (비저장/실시간 계산)
        energy: 0, energyMax: 0 
    },
    // [2] 발견된 자원 목록 (나무, 돌, 판자는 기본 해금)
    unlockedResources: ['wood', 'stone', 'plank'], 
    houseLevel: 0,
    researches: [], 
    
    // [3] 건물 데이터 (총 40개 - 진행 막힘 방지 밸런스 적용)
    buildings: [
        // --- TIER 1: 기초 (Lv.0 ~ Lv.10) ---
        { id: 0, name: "수동 벌목 캠프", cost: { wood: 10 }, inputs: null, outputs: { wood: 0.5 }, count: 0, reqLevel: 0 },
        { id: 1, name: "자동 벌목기", cost: { wood: 50, stone: 10 }, inputs: null, outputs: { wood: 2 }, count: 0, reqLevel: 0.5 },
        { id: 2, name: "채석 작업장", cost: { wood: 100, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0, reqLevel: 0.5 },
        { id: 3, name: "석탄 노천 채굴장", cost: { stone: 100, plank: 20 }, inputs: null, outputs: { coal: 1 }, count: 0, reqLevel: 1 },
        { id: 4, name: "증기압 제재소", cost: { plank: 50, coal: 10 }, inputs: { wood: 3 }, outputs: { plank: 2 }, count: 0, reqLevel: 1 },
        { id: 5, name: "원시 흙 가마", cost: { stone: 50 }, inputs: { stone: 2, wood: 1 }, outputs: { brick: 1 }, count: 0, reqLevel: 0.5 },
        
        // ⭐ 핵심: 4레벨에 철판 생산 가능 (레벨업 막힘 방지)
        { id: 6, name: "기초 철 용광로", cost: { brick: 50, stone: 100 }, inputs: { ironOre: 2, coal: 1 }, outputs: { ironPlate: 1 }, count: 0, reqLevel: 4 },
        { id: 7, name: "기초 구리 용광로", cost: { brick: 50, stone: 100 }, inputs: { copperOre: 2, coal: 1 }, outputs: { copperPlate: 1 }, count: 0, reqLevel: 4 },
        
        // ⭐ 핵심: 5레벨에 풍력 발전 및 콘크리트 가능 (레벨업 막힘 방지)
        { id: 8, name: "소형 풍력 발전기", cost: { plank: 100, ironPlate: 20 }, inputs: null, outputs: { energy: 5 }, count: 0, reqLevel: 5 },
        { id: 9, name: "콘크리트 믹서", cost: { ironPlate: 100, plank: 100 }, inputs: { stone: 10, energy: 3 }, outputs: { concrete: 1 }, count: 0, reqLevel: 5 },
        { id: 10, name: "기계식 조립대", cost: { ironPlate: 50, gear: 10 }, inputs: { ironPlate: 2 }, outputs: { gear: 1 }, count: 0, reqLevel: 8 },

        // --- TIER 2: 산업 (Lv.10 ~ Lv.25) ---
        { id: 11, name: "심부 채석 드릴", cost: { ironPlate: 200, gear: 50 }, inputs: { energy: 2 }, outputs: { stone: 5 }, count: 0, reqLevel: 10 },
        { id: 12, name: "강철 제련소", cost: { ironPlate: 500, brick: 500 }, inputs: { ironPlate: 4, coal: 5, energy: 10 }, outputs: { steel: 1 }, count: 0, reqLevel: 11 },
        { id: 13, name: "화력 발전소", cost: { steel: 10, ironPlate: 100 }, inputs: { coal: 3 }, outputs: { energy: 50 }, count: 0, reqLevel: 13 },
        { id: 14, name: "자동화 회로 공장", cost: { steel: 200, copperPlate: 300 }, inputs: { copperPlate: 3, energy: 15 }, outputs: { circuit: 1 }, count: 0, reqLevel: 15 },
        { id: 15, name: "대형 유압 프레스", cost: { steel: 500, gear: 200 }, inputs: { steel: 2, energy: 20 }, outputs: { gear: 8 }, count: 0, reqLevel: 17 },
        { id: 16, name: "유리 용해로", cost: { brick: 1000, steel: 300 }, inputs: { stone: 10, coal: 5 }, outputs: { glass: 3 }, count: 0, reqLevel: 20 },
        { id: 17, name: "화학 정제소", cost: { steel: 1000, circuit: 200 }, inputs: { oil: 10, energy: 30 }, outputs: { plastic: 2, sulfur: 1 }, count: 0, reqLevel: 24 },

        // --- TIER 3: 석유 및 고분자 (Lv.25 ~ Lv.40) ---
        { id: 18, name: "원유 시추 펌프", cost: { steel: 2000, circuit: 500 }, inputs: { energy: 40 }, outputs: { oil: 8 }, count: 0, reqLevel: 25 },
        { id: 19, name: "배터리 생산 라인", cost: { plastic: 1000, circuit: 500 }, inputs: { sulfur: 5, energy: 50 }, outputs: { battery: 2 }, count: 0, reqLevel: 28 },
        { id: 20, name: "태양광 패널 농장", cost: { glass: 2000, circuit: 1000 }, inputs: null, outputs: { energy: 200 }, count: 0, reqLevel: 30 },
        { id: 21, name: "고급 조립실", cost: { steel: 10000, circuit: 2000 }, inputs: { circuit: 10, plastic: 10, energy: 100 }, outputs: { advCircuit: 1 }, count: 0, reqLevel: 32 },
        { id: 22, name: "티타늄 채굴 드릴", cost: { steel: 20000, advCircuit: 500 }, inputs: { energy: 150 }, outputs: { titaniumOre: 3 }, count: 0, reqLevel: 35 },
        { id: 23, name: "정밀 렌즈 가공기", cost: { glass: 5000, steel: 5000 }, inputs: { glass: 10, energy: 80 }, outputs: { optics: 1 }, count: 0, reqLevel: 37 },

        // --- TIER 4: 우주 및 원자력 (Lv.40 ~ Lv.50) ---
        { id: 24, name: "우라늄 채굴기", cost: { titaniumOre: 5000, advCircuit: 1000 }, inputs: { energy: 300 }, outputs: { uraniumOre: 1 }, count: 0, reqLevel: 40 },
        { id: 25, name: "반도체 클린룸", cost: { advCircuit: 5000, optics: 2000 }, inputs: { advCircuit: 5, energy: 500 }, outputs: { processor: 1 }, count: 0, reqLevel: 42 },
        { id: 26, name: "나노 공장", cost: { processor: 200, titaniumOre: 10000 }, inputs: { processor: 2, energy: 800 }, outputs: { nanobots: 1 }, count: 0, reqLevel: 44 },
        { id: 27, name: "AI 연산 코어실", cost: { processor: 1000, battery: 5000 }, inputs: { processor: 5, energy: 1500 }, outputs: { aiCore: 1 }, count: 0, reqLevel: 46 },
        { id: 28, name: "로켓 연료 정제소", cost: { oil: 50000, sulfur: 20000 }, inputs: { oil: 100, sulfur: 50, energy: 2000 }, outputs: { rocketFuel: 10 }, count: 0, reqLevel: 47 },
        { id: 29, name: "워프 코어 합성기", cost: { aiCore: 200, nanobots: 500 }, inputs: { aiCore: 1, energy: 10000 }, outputs: { warpCore: 1 }, count: 0, reqLevel: 49 }
    ],

    // [4] 연구 목록 (총 25개 - 계통도 방식)
    researchListData: [
        // Tier 1
        { id: "stone_tool", name: "돌 곡괭이", desc: "수동 채집량 +1", cost: { wood: 50, stone: 20 }, type: 'manual', value: 1, reqResearch: null },
        { id: "basic_auto", name: "기초 자동화", desc: "벌목기/채석기 속도 2배", cost: { plank: 50 }, type: 'building', target: [0, 1, 2], value: 2, reqResearch: "stone_tool" },
        { id: "furnace_bellows", name: "용광로 송풍기", desc: "흙 가마 속도 2배", cost: { stone: 100, coal: 50 }, type: 'building', target: [5], value: 2, reqResearch: "basic_auto" },
        
        // Tier 2
        { id: "iron_tool", name: "철제 도구", desc: "수동 채집량 +4", cost: { ironPlate: 50, plank: 100 }, type: 'manual', value: 4, reqResearch: "furnace_bellows" },
        { id: "smelting_up", name: "고온 제련", desc: "모든 용광로 속도 2배", cost: { brick: 200, ironPlate: 100 }, type: 'building', target: [6, 7, 12], value: 2, reqResearch: "iron_tool" },
        { id: "mass_logger", name: "벌목량 증폭", desc: "벌목기 효율 3배", cost: { ironPlate: 300, gear: 50 }, type: 'building', target: [1], value: 3, reqResearch: "smelting_up" },
        
        // Tier 3
        { id: "power_grid", name: "전력망 최적화", desc: "발전 출력 2.5배", cost: { copperPlate: 500, circuit: 50 }, type: 'building', target: [8, 13], value: 2.5, reqResearch: "smelting_up" },
        { id: "integrated_circuit", name: "집적 회로", desc: "회로 공장 속도 3배", cost: { circuit: 200, gear: 500 }, type: 'building', target: [14, 15], value: 3, reqResearch: "power_grid" },
        { id: "drill_hard", name: "다이아몬드 드릴", desc: "모든 채굴기 속도 3배", cost: { steel: 500, circuit: 500 }, type: 'building', target: [3, 10, 11, 22], value: 3, reqResearch: "integrated_circuit" },

        // Tier 4
        { id: "oil_cracking", name: "원유 분해공학", desc: "시추 및 정제 속도 2배", cost: { plastic: 500, steel: 1000 }, type: 'building', target: [18, 17], value: 2, reqResearch: "drill_hard" },
        { id: "high_precision", name: "나노 정밀도", desc: "조립 속도 4배", cost: { advCircuit: 500, optics: 200 }, type: 'building', target: [10, 21], value: 4, reqResearch: "oil_cracking" },
        { id: "super_battery", name: "고밀도 배터리", desc: "발전 시설 출력 2배", cost: { battery: 1000, processor: 100 }, type: 'building', target: [8, 13, 20], value: 2, reqResearch: "high_precision" },

        // Tier 5
        { id: "rocket_dynamics", name: "로켓 역학", desc: "연료 정제 속도 5배", cost: { rocketFuel: 200, aiCore: 50 }, type: 'building', target: [28], value: 5, reqResearch: "super_battery" },
        { id: "warp_theory", name: "워프 이론", desc: "워프 코어 합성 속도 10배", cost: { warpCore: 5, processor: 5000 }, type: 'building', target: [29], value: 10, reqResearch: "rocket_dynamics" }
    ],

    // [5] 50단계 하우스(우주선) 발전 단계 (전체 생략 없음)
    houseStages: [
        { name: "임시 야영지", desc: "비를 피할 곳이 필요합니다.", req: { wood: 10 } },
        { name: "나뭇잎 움막", desc: "조금 더 따뜻해졌습니다.", req: { wood: 50 } },
        { name: "통나무 오두막", desc: "제법 집 같은 모양새입니다.", req: { wood: 100, plank: 20 } },
        { name: "돌담집", desc: "돌로 벽을 보강했습니다.", req: { wood: 300, stone: 100 } },
        { name: "벽돌집", desc: "벽돌로 단단한 집을 지으세요.", req: { stone: 500, brick: 50 } },
        { name: "강철 보강문", desc: "철판을 모아 문을 보강하세요.", req: { ironPlate: 20, plank: 100 } }, // Lv.5
        { name: "지하 대피소", desc: "콘크리트로 벙커를 만드세요.", req: { stone: 1000, concrete: 20 } },
        { name: "산업용 굴뚝", desc: "본격적으로 매연을 뿜습니다.", req: { brick: 1000, ironPlate: 200 } },
        { name: "구리 배선실", desc: "전기를 중앙에서 관리합니다.", req: { copperPlate: 200, gear: 50 } },
        { name: "2층 조립실", desc: "공간을 위로 확장했습니다.", req: { ironPlate: 500, plank: 1000 } },
        { name: "강철 뼈대", desc: "집의 하중을 강철이 견딥니다.", req: { steel: 50, gear: 100 } },
        { name: "중앙 통제실", desc: "모든 기계를 모니터링합니다.", req: { circuit: 50, copperPlate: 1000 } },
        { name: "유리 온실", desc: "자체적으로 식량을 조달합니다.", req: { glass: 100, wood: 5000 } },
        { name: "자동화 창고", desc: "로봇 팔이 자원을 분류합니다.", req: { gear: 1000, steel: 500 } },
        { name: "화학 반응로", desc: "특수 물질을 정제합니다.", req: { plastic: 200, sulfur: 100 } },
        { name: "방사능 차폐벽", desc: "콘크리트로 외벽을 감쌉니다.", req: { concrete: 2000, steel: 500 } },
        { name: "백업 배터리실", desc: "대규모 전력을 저장합니다.", req: { battery: 200, copperPlate: 5000 } },
        { name: "연산 센터", desc: "비행 경로를 계산하기 시작합니다.", req: { circuit: 5000, processor: 20 } },
        { name: "밀폐형 선체", desc: "진공 상태를 견딜 수 있습니다.", req: { plastic: 2000, steel: 5000 } },
        { name: "외부 관측창", desc: "강화 유리로 밖을 봅니다.", req: { glass: 1000, titaniumOre: 500 } },
        { name: "하부 지지대", desc: "집을 들어 올릴 프레임을 짭니다.", req: { steel: 10000, concrete: 5000 } },
        { name: "보조 스러스터", desc: "방향 전환용 소형 엔진입니다.", req: { gear: 5000, rocketFuel: 100 } },
        { name: "열 차폐 코팅", desc: "대기권 진입 시 열을 차단합니다.", req: { brick: 20000, stone: 50000 } },
        { name: "통신 안테나", desc: "지구 밖과 교신을 시도합니다.", req: { advCircuit: 100, copperPlate: 20000 } },
        { name: "생명 유지 장치", desc: "내부 기압과 산소를 조절합니다.", req: { processor: 100, battery: 2000 } },
        { name: "도킹 포트", desc: "다른 모듈과 결합할 수 있습니다.", req: { gear: 20000, steel: 30000 } },
        { name: "중력 제어기", desc: "내부 중력을 1G로 유지합니다.", req: { circuit: 50000, advCircuit: 500 } },
        { name: "AI 파일럿", desc: "자율 비행 시스템을 깨웁니다.", req: { aiCore: 10, processor: 1000 } },
        { name: "티타늄 장갑", desc: "선체를 티타늄으로 덮습니다.", req: { titaniumOre: 10000, steel: 50000 } },
        { name: "핵융합 가속기", desc: "폭발적인 에너지를 생산합니다.", req: { uraniumOre: 1000, energy: 1000 } },
        { name: "메인 엔진 장착", desc: "집 하단에 거대 엔진을 답니다.", req: { steel: 200000, rocketFuel: 5000 } },
        { name: "연료 파이프라인", desc: "모든 노즐에 연료를 공급합니다.", req: { oil: 100000, copperPlate: 100000 } },
        { name: "나노봇 수리반", desc: "자동 수리 시스템을 가동합니다.", req: { nanobots: 200, processor: 5000 } },
        { name: "에너지 충전 50%", desc: "메인 배터리를 충전 중입니다.", req: { energy: 5000, battery: 10000 } },
        { name: "에너지 충전 100%", desc: "모든 시스템 출력 정상.", req: { energy: 10000, battery: 20000 } },
        { name: "발사 패드 이동", desc: "집을 발사대로 옮깁니다.", req: { concrete: 200000, gear: 100000 } },
        { name: "시스템 동기화", desc: "모든 모듈의 연결을 확인합니다.", req: { aiCore: 100, advCircuit: 10000 } },
        { name: "최종 카운트다운", desc: "T-minus 60 seconds.", req: { rocketFuel: 20000, nanobots: 500 } },
        { name: "엔진 점화", desc: "3... 2... 1...", req: { warpCore: 1, energy: 20000 } },
        { name: "지구 탈출 성공", desc: "성공입니다! 새로운 행성을 향해!", req: { warpCore: 10, processor: 50000, steel: 1000000 }, unlock: "end" }
    ]
};

// ⚠️ 참고: 연구 리스트 변수 이름을 logic.js와 ui.js에서 호출하기 좋게 researchList로 내보냅니다.
export const researchList = gameData.researchListData;
export const houseStages = gameData.houseStages;

export function setGameData(newData) {
    for (let key in gameData.resources) {
        gameData.resources[key] = (newData.resources && newData.resources[key] !== undefined) ? newData.resources[key] : 0;
    }
    gameData.houseLevel = newData.houseLevel || 0;
    gameData.researches = newData.researches || [];
    const savedUnlocked = newData.unlockedResources || [];
    gameData.unlockedResources = [...new Set(['wood', 'stone', 'plank', ...savedUnlocked])];
    if (newData.buildings) {
        newData.buildings.forEach(savedB => {
            const currentB = gameData.buildings.find(b => b.id === savedB.id);
            if (currentB) currentB.count = savedB.count;
        });
    }
}