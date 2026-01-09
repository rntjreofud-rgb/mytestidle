// js/data.js

export let gameData = {
    resources: { 
        // 원재료
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0, oil: 0, titaniumOre: 0, uraniumOre: 0,
        // 1차 가공품
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0, glass: 0, sulfur: 0,
        // 2차 가공품
        steel: 0, plastic: 0, concrete: 0, battery: 0, fuelCell: 0,
        // 부품 및 하이테크 (여기 누락된 것들 추가됨)
        gear: 0, circuit: 0, advCircuit: 0, processor: 0, optics: 0, titaniumPlate: 0,
        // 최종 단계 자원
        aiCore: 0, nanobots: 0, advAlloy: 0, rocketFuel: 0, warpCore: 0,
        quantumData: 0, gravityModule: 0,
        // 시스템
        energy: 0, energyMax: 0 
    },
    // ⭐ 'plank'를 기본 해금 목록에 추가합니다.
    unlockedResources: ['wood', 'stone', 'plank'], 
    houseLevel: 0,
    researches: [], 
   buildings: [
    // === TIER 1: 원시 및 기초 (Lv.0 ~ 5) ===
    { id: 0, name: "수동 벌목 캠프", cost: { wood: 10 }, inputs: null, outputs: { wood: 0.5 }, count: 0, reqLevel: 0 },
    { id: 1, name: "자동 벌목기", cost: { wood: 50, stone: 10 }, inputs: null, outputs: { wood: 2 }, count: 0, reqLevel: 0.5 },
    { id: 2, name: "채석 작업장", cost: { wood: 100, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0, reqLevel: 0.5 },
    { id: 40, name: "노천 철광산", cost: { stone: 150, plank: 30 }, inputs: null, outputs: { ironOre: 0.8 }, count: 0, reqLevel: 2 },
    { id: 41, name: "노천 구리광산", cost: { stone: 150, plank: 30 }, inputs: null, outputs: { copperOre: 0.8 }, count: 0, reqLevel: 2 },
    { id: 3, name: "석탄 노천 채굴장", cost: { stone: 200, plank: 50 }, inputs: null, outputs: { coal: 1 }, count: 0, reqLevel: 1 },
    { id: 4, name: "증기압 제재소", cost: { plank: 50, coal: 10 }, inputs: { wood: 3 }, outputs: { plank: 2 }, count: 0, reqLevel: 1 },
    { id: 5, name: "원시 흙 가마", cost: { stone: 50 }, inputs: { stone: 2, wood: 1 }, outputs: { brick: 1 }, count: 0, reqLevel: 0.5 },
    
    // === TIER 2: 산업 기초 및 전력 (Lv.5 ~ 10) ===
    { id: 16, name: "콘크리트 믹서", cost: { ironPlate: 200, brick: 100 }, inputs: { stone: 10, energy: 5 }, outputs: { concrete: 2 }, count: 0, reqLevel: 5 }, // 집 Lv.6 대비
    { id: 6, name: "기초 철 용광로", cost: { brick: 50, stone: 100 }, inputs: { ironOre: 2, coal: 1 }, outputs: { ironPlate: 1 }, count: 0, reqLevel: 4 },
    { id: 7, name: "기초 구리 용광로", cost: { brick: 50, stone: 100 }, inputs: { copperOre: 2, coal: 1 }, outputs: { copperPlate: 1 }, count: 0, reqLevel: 4 },
    { id: 8, name: "풍력 발전기", cost: { plank: 100, ironPlate: 20 }, inputs: null, outputs: { energy: 15 }, count: 0, reqLevel: 5 },
    { id: 9, name: "기계식 조립대", cost: { ironPlate: 100, copperPlate: 50 }, inputs: { ironPlate: 2 }, outputs: { gear: 1 }, count: 0, reqLevel: 5 }, // Gear 비용 제거로 데드락 해제
    { id: 42, name: "전기 철 채굴기", cost: { ironPlate: 200, gear: 50 }, inputs: { energy: 15 }, outputs: { ironOre: 2 }, count: 0, reqLevel: 7},
    { id: 43, name: "전기 구리 채굴기", cost: { ironPlate: 200, gear: 50 }, inputs: { energy: 15 }, outputs: { copperOre: 2 }, count: 0, reqLevel: 7},
    { id: 44, name: "전기 석탄 채굴기", cost: { copperPlate: 200, gear: 50 }, inputs: { energy: 20 }, outputs: { coal: 2 }, count: 0, reqLevel: 8},
    { id: 45, name: "전기 석재 채굴기", cost: { copperPlate: 200, gear: 50 }, inputs: { energy: 20 }, outputs: { stone: 2 }, count: 0, reqLevel: 9},
    // === TIER 3: 금속 공학 (Lv.10 ~ 20) ===
    { id: 13, name: "강철 제련소", cost: { ironPlate: 300, brick: 300 }, inputs: { ironPlate: 4, coal: 5, energy: 10 }, outputs: { steel: 2 }, count: 0, reqLevel: 8 }, // 집 Lv.11 대비
    { id: 18, name: "유리 용해로", cost: { brick: 500, stone: 500 }, inputs: { stone: 5, coal: 2 }, outputs: { glass: 2 }, count: 0, reqLevel: 10 }, // 집 Lv.12 대비
    { id: 14, name: "석탄 발전소", cost: { steel: 100, copperPlate: 100 }, inputs: { coal: 3 }, outputs: { energy: 50 }, count: 0, reqLevel: 12 },
    { id: 15, name: "자동화 회로 공장", cost: { steel: 200, copperPlate: 300 }, inputs: { copperPlate: 3, energy: 8 }, outputs: { circuit: 1 }, count: 0, reqLevel: 9 }, // 집 Lv.10 대비
    { id: 27, name: "정밀 렌즈 가공기", cost: { glass: 500, steel: 500 }, inputs: { glass: 4, energy: 20 }, outputs: { optics: 1 }, count: 0, reqLevel: 15 },
    { id: 31, name: "반도체 클린룸", cost: { circuit: 1000, glass: 500 }, inputs: { circuit: 4, plastic: 10, optics: 2, energy: 100 }, outputs: { processor: 1 }, count: 0, reqLevel: 18 }, // 집 Lv.19 대비
    { id: 22, name: "배터리 화학 공장", cost: { plastic: 500, circuit: 500 }, inputs: { stone: 10, sulfur: 2, energy: 25 }, outputs: { battery: 1 }, count: 0, reqLevel: 18 }, // 집 Lv.19 대비
    { id: 46, name: "원유 발전소", cost: { steel: 800, copperPlate: 500, gear: 300 }, inputs: { oil: 2 }, outputs: { energy: 250 }, count: 0, reqLevel: 15 },
    // === TIER 4: 석유 및 고급 소재 (Lv.20 ~ 30) ===
    { id: 25, name: "티타늄 채굴 드릴", cost: { steel: 2000, circuit: 1000 }, inputs: { energy: 60 }, outputs: { titaniumOre: 2 }, count: 0, reqLevel: 20 }, // 집 Lv.21 대비
    { id: 20, name: "원유 시추 펌프", cost: { steel: 1000, circuit: 500 }, inputs: { energy: 20 }, outputs: { oil: 5 }, count: 0, reqLevel: 13 }, // 집 Lv.14 대비 하향
    { id: 21, name: "석유 정제 시설", cost: { steel: 2000, copperPlate: 1000 }, inputs: { oil: 10, energy: 30 }, outputs: { plastic: 2, sulfur: 1 }, count: 0, reqLevel: 13 }, // 집 Lv.14 대비 하향
    { id: 24, name: "고급 조립 라인", cost: { steel: 5000, circuit: 2000 }, inputs: { circuit: 5, plastic: 5, energy: 80 }, outputs: { advCircuit: 1 }, count: 0, reqLevel: 22 }, // 집 Lv.23 대비
    { id: 35, name: "로켓 연료 정제소", cost: { oil: 10000, sulfur: 5000 }, inputs: { oil: 50, sulfur: 30, energy: 200 }, outputs: { rocketFuel: 2 }, count: 0, reqLevel: 25 }, // 집 Lv.26 대비
    { id: 33, name: "AI 연산 서버", cost: { processor: 200, battery: 1000 }, inputs: { processor: 5, energy: 500 }, outputs: { aiCore: 1 }, count: 0, reqLevel: 28 }, // 집 Lv.29 대비
    { id: 23, name: "태양광 패널 농장", cost: { glass: 2000, circuit: 2000 }, inputs: null, outputs: { energy: 400 }, count: 0, reqLevel: 25 },
    { id: 26, name: "티타늄 제련소", cost: { titaniumOre: 1000, steel: 5000 }, inputs: { titaniumOre: 3, coal: 10, energy: 100 }, outputs: { titaniumPlate: 1 }, count: 0, reqLevel: 25 },
    { 
    id: 36, 
    name: "퀀텀 컴퓨터 메인프레임", 
    cost: { processor: 1000, advCircuit: 2000, titaniumPlate: 5000 }, 
    inputs: { energy: 1000 }, 
    outputs: { quantumData: 10 }, 
    count: 0, 
    reqLevel: 35 
},
{ 
    id: 37, 
    name: "중력 제어 연구소", 
    cost: { nanobots: 1000, advAlloy: 2000, titaniumPlate: 10000 }, 
    inputs: { energy: 5000, quantumData: 5 }, 
    outputs: { gravityModule: 1 }, 
    count: 0, 
    reqLevel: 37 
},
    // === TIER 5: 원자력 및 우주 기술 (Lv.30 ~ 50) ===
    { id: 28, name: "우라늄 채굴기", cost: { titaniumPlate: 2000, advCircuit: 500 }, inputs: { energy: 150 }, outputs: { uraniumOre: 1 }, count: 0, reqLevel: 32 },
    { id: 29, name: "원심 분리기", cost: { steel: 10000, gear: 5000 }, inputs: { uraniumOre: 10, energy: 200 }, outputs: { fuelCell: 1 }, count: 0, reqLevel: 35 },
    { id: 30, name: "원자력 발전소", cost: { concrete: 5000, titaniumPlate: 2000 }, inputs: { fuelCell: 1 }, outputs: { energy: 2500 }, count: 0, reqLevel: 38 },
    { id: 32, name: "나노 팩토리", cost: { processor: 500, titaniumPlate: 5000 }, inputs: { processor: 2, steel: 10, energy: 500 }, outputs: { nanobots: 1 }, count: 0, reqLevel: 40 },
    { id: 34, name: "고급 합금 용광로", cost: { titaniumPlate: 5000, concrete: 10000 }, inputs: { titaniumPlate: 5, steel: 20, energy: 600 }, outputs: { advAlloy: 2 }, count: 0, reqLevel: 42 },
    { id: 38, name: "항성간 추진기 공장", cost: { advAlloy: 5000, aiCore: 500, titaniumPlate: 10000 }, inputs: { advAlloy: 10, rocketFuel: 100, energy: 2000 }, outputs: { warpCore: 1 }, count: 0, reqLevel: 45 },
    { id: 39, name: "다이슨 스웜 송신기", cost: { advAlloy: 20000, aiCore: 1000 }, inputs: null, outputs: { energy: 100000 }, count: 0, reqLevel: 48 }
    
]
};

export const researchList = [
    // === [Tier 1: 생존 및 수동 도구] ===
    { id: "stone_tool", name: "돌 곡괭이", desc: "수동 채집량 +1", cost: { wood: 30, stone: 10 }, type: 'manual', value: 1, reqResearch: null },
    { id: "sharp_axe", name: "날카로운 도끼", desc: "수동 나무 채집량 +2", cost: { stone: 50, plank: 20 }, type: 'manual', value: 2, reqResearch: "stone_tool" },
    { id: "carbon_pick", name: "탄화 곡괭이", desc: "수동 석탄/광석 채집량 +3", cost: { coal: 50, brick: 30 }, type: 'manual', value: 3, reqResearch: "sharp_axe" },

    // === [Tier 2: 기초 산업 자동화] ===
    { id: "basic_logistics", name: "기초 물류학", desc: "수동 벌목 캠프 속도 2배", cost: { plank: 50, stone: 50 }, type: 'building', target: [0], value: 2, reqResearch: "stone_tool" },
    { id: "quarry_tech", name: "채석 기술", desc: "자동 벌목기 속도 2배", cost: { plank: 100, coal: 50 }, type: 'building', target: [1], value: 2, reqResearch: "basic_logistics" },
    { id: "furnace_bellows", name: "용광로 송풍기", desc: "기초 철/구리 용광로 속도 2배", cost: { stone: 200, coal: 100 }, type: 'building', target: [6, 7], value: 2, reqResearch: "quarry_tech" },

    // === [Tier 3: 금속 및 기계 공학] ===
    { id: "iron_working", name: "철제 도구 제작", desc: "수동 채집량 +5", cost: { ironPlate: 100, gear: 50 }, type: 'manual', value: 5, reqResearch: "furnace_bellows" },
    { id: "hardened_steel", name: "강철 강화 공정", desc: "풍력 발전기 및 조립대 효율 2배", cost: { ironPlate: 300, brick: 200 }, type: 'building', target: [8, 9], value: 2, reqResearch: "iron_working" },
    { id: "gearbox_opt", name: "변속기 최적화", desc: "기계식 조립대 속도 2배", cost: { gear: 200, ironPlate: 200 }, type: 'building', target: [9], value: 2, reqResearch: "hardened_steel" },
    { id: "steam_power", name: "증기압 조절", desc: "석탄 발전소 출력 2배", cost: { ironPlate: 500, copperPlate: 200 }, type: 'building', target: [14], value: 2, reqResearch: "hardened_steel" },
    
    // 채굴 특화 연구
    { id: "mining_drill_bit", name: "강화 드릴 비트", desc: "모든 채굴기(노천/전기) 속도 2배", cost: { ironPlate: 500, gear: 200 }, type: 'building', target: [40, 41, 42, 43, 44, 45, 3, 25, 28], value: 2, reqResearch: "basic_logistics" },
    { id: "mineral_scanner", name: "지질 스캐너", desc: "기초 광산(철/구리) 채굴 속도 2배", cost: { copperPlate: 1000, circuit: 200 }, type: 'building', target: [40, 41], value: 2, reqResearch: "mining_drill_bit" },
    { id: "crushing_tech", name: "광석 분쇄 기술", desc: "전기 채굴기(철/구리) 출력 2.5배", cost: { steel: 500, gear: 1000 }, type: 'building', target: [42, 43], value: 2.5, reqResearch: "mineral_scanner" },

    // === [Tier 4: 전기 및 회로 기술] ===
    { id: "copper_wiring", name: "고효율 구리 배선", desc: "회로 공장 속도 1.5배", cost: { copperPlate: 1000, circuit: 100 }, type: 'building', target: [15], value: 1.5, reqResearch: "steam_power" },
    { id: "integrated_circuit", name: "집적 회로 설계", desc: "회로 공장 속도 추가 2.5배", cost: { circuit: 500, plastic: 200 }, type: 'building', target: [15], value: 2.5, reqResearch: "copper_wiring" },
    { id: "electric_motor", name: "고속 전기 모터", desc: "채석/제재소/가마 속도 2배", cost: { gear: 1000, circuit: 300 }, type: 'building', target: [2, 4, 5], value: 2, reqResearch: "integrated_circuit" },

    // === [Tier 5: 화학 및 정유 공정] ===
    { id: "oil_refining", name: "원유 분별 증류", desc: "원유 시추기 속도 2배", cost: { steel: 500, circuit: 500 }, type: 'building', target: [20], value: 2, reqResearch: "integrated_circuit" },
    { id: "polymer_science", name: "고분자 화학", desc: "석유 정제 시설 속도 2배", cost: { oil: 1000, plastic: 500 }, type: 'building', target: [21], value: 2, reqResearch: "oil_refining" },
    { id: "sulfuric_acid", name: "황산 제련법", desc: "강철 제련소 속도 3배", cost: { sulfur: 500, steel: 1000 }, type: 'building', target: [13], value: 3, reqResearch: "polymer_science" },
    { 
    id: "oil_combustion", 
    name: "원유 연소 최적화", 
    desc: "원유 발전소의 전력 출력 2배", 
    cost: { steel: 2000, circuit: 500 }, 
    type: 'building', 
    target: [46], 
    value: 2, 
    reqResearch: "oil_refining" 
},
    // === [Tier 6: 첨단 재료 및 티타늄] ===
    { id: "titanium_alloy", name: "티타늄 합금", desc: "티타늄 채굴기/제련소 속도 2배", cost: { steel: 5000, advCircuit: 200 }, type: 'building', target: [25, 26], value: 2, reqResearch: "sulfuric_acid" },
    { id: "high_precision", name: "나노미터 정밀도", desc: "고급 조립 라인 속도 2배", cost: { advCircuit: 1000, gear: 5000 }, type: 'building', target: [24], value: 2, reqResearch: "titanium_alloy" },
    { id: "supercomputing", name: "슈퍼컴퓨팅", desc: "반도체 클린룸 속도 2배", cost: { processor: 100, optics: 500, advCircuit: 2000 }, type: 'building', target: [31], value: 2, reqResearch: "high_precision" },

    // === [Tier 7: 에너지 혁명] ===
    { id: "solar_efficiency", name: "광전소자 개선", desc: "태양광 발전소 출력 3배", cost: { optics: 1000, circuit: 5000 }, type: 'building', target: [23], value: 3, reqResearch: "supercomputing" },
    { id: "battery_density", name: "고밀도 배터리", desc: "배터리 공장 생산량 2배", cost: { battery: 500, copperPlate: 10000 }, type: 'building', target: [22], value: 2, reqResearch: "solar_efficiency" },

    // === [Tier 8: 우주 항행 및 엔딩 준비] ===
    { id: "rocket_dynamics", name: "로켓 역학", desc: "로켓 연료 정제소 속도 2배", cost: { rocketFuel: 100, processor: 500 }, type: 'building', target: [35], value: 2, reqResearch: "supercomputing" },
    { 
    id: "cryogenic_fuel", 
    name: "극저온 연료 냉각", 
    desc: "로켓 연료 정제소 속도 추가 3배", 
    cost: { rocketFuel: 1000, titaniumPlate: 5000 }, 
    type: 'building', 
    target: [35], 
    value: 3, 
    reqResearch: "rocket_dynamics" 
},
    { 
    id: "nanotech_click", 
    name: "분자 분해 장치", 
    desc: "수동 채집량 +100", 
    cost: { processor: 2000, titaniumPlate: 10000 }, 
    type: 'manual', 
    value: 100, 
    reqResearch: "cryogenic_fuel" 
},
    { id: "final_prep", name: "지구 이별 준비", desc: "모든 주요 건물 속도 1.2배", cost: { rocketFuel: 5000, processor: 5000, steel: 50000 }, type: 'building', target: [0,1,2,3,4,5,6,7,8,9,13,14,15,16,18,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,38,39,40,41,42,43,44,45,46], value: 1.2, reqResearch: "nanotech_click" }
];

export const houseStages = [
    // 0~9: 기초
    { name: "임시 야영지", desc: "지구 탈출을 위한 아주 긴 여정의 시작입니다.", req: { wood: 10 } },
    { name: "나뭇잎 텐트", desc: "이제 밤이슬은 피할 수 있습니다.", req: { wood: 50 } },
    { name: "통나무 오두막", desc: "제법 집 같은 모양새가 되었습니다.", req: { wood: 100, plank: 20 } },
    { name: "돌 벽 난로", desc: "겨울을 날 준비가 되었습니다.", req: { stone: 100, plank: 50 } },
    { name: "단단한 석조 주택", desc: "집의 기초를 돌로 튼튼히 다졌습니다.", req: { stone: 300, brick: 50 } },
    { name: "강철 보강문", desc: "외부의 침입으로부터 안전합니다.", req: { ironPlate: 50, plank: 100 } },
    { name: "지하 대피소", desc: "지하실을 파서 공간을 확보했습니다.", req: { stone: 500, concrete: 20 } },
    { name: "산업용 굴뚝", desc: "집에서 매연이 나오기 시작합니다.", req: { brick: 300, ironPlate: 100 } },
    { name: "구리 배선함", desc: "전기를 들여올 준비를 마쳤습니다.", req: { copperPlate: 100, gear: 50 } },
    { name: "2층 조립동", desc: "작업 공간을 위로 확장했습니다.", req: { ironPlate: 300, plank: 500 } },

    // 10~19: 산업화
    { name: "전력 수신탑", desc: "외부로부터 전력을 끌어옵니다.", req: { copperPlate: 500, circuit: 50 } },
    { name: "강철 프레임", desc: "집의 하중을 철골이 견디게 합니다.", req: { steel: 100, gear: 100 } },
    { name: "유리 온실", desc: "자체적으로 식량을 조달합니다.", req: { glass: 500, wood: 10000, steel: 500 } },

// 14레벨 -> 15레벨 업그레이드 (플라스틱 공장이 13렙에 이미 열려있음)
    { name: "화학 실험실", desc: "각종 원소를 정제하기 시작합니다.", req: { plastic: 500, sulfur: 200 } },

// 15레벨 -> 16레벨 업그레이드 (광학 렌즈 공장이 15렙에 딱 열림)
    { name: "공조 시스템", desc: "내부 공기를 정화하고 순환시킵니다.", req: { optics: 50, circuit: 1000, gear: 5000 } },

// 16레벨 -> 17레벨 업그레이드 (프로세서 아직 없음! 콘크리트와 강철로 진행)
    { name: "방사능 차폐 외벽", desc: "두꺼운 콘크리트로 외벽을 감쌉니다.", req: { concrete: 5000, steel: 10000 } },

// 17레벨 -> 18레벨 업그레이드 (아직 프로세서 못 만듦! 배터리와 구리판으로 진행)
    { name: "백업 배터리실", desc: "정전에 대비해 에너지를 저장합니다.", req: { battery: 500, copperPlate: 10000, sulfur: 2000 } },

// 18레벨 -> 19레벨 업그레이드 (⭐ 프로세서 공장이 18렙에 열렸으므로 이제 사용 가능!)
    { name: "자동화 창고 관리실", desc: "로봇 팔이 자원을 분류합니다.", req: { processor: 50, gear: 20000 } },

// 19레벨 -> 20레벨 업그레이드
    { name: "연산 처리 센터", desc: "복잡한 비행 경로를 계산합니다.", req: { processor: 200, circuit: 10000 } },

// 20레벨 -> 21레벨 업그레이드 (티타늄 드릴이 20렙에 열림)
    { name: "밀폐형 선체 코팅", desc: "진공 상태를 견디도록 집을 코팅합니다.", req: { titaniumOre: 500, plastic: 20000 } },

// 21레벨 -> 22레벨 업그레이드 (티타늄 제련소가 21렙에 열림)
    { name: "외부 관측 창", desc: "강화 유리로 밖을 내다봅니다.", req: { titaniumPlate: 200, glass: 5000 } },

// 22레벨 -> 23레벨 업그레이드 (⭐ 고급 회로 공장이 22렙에 열렸으므로 이제 사용 가능!)
    { name: "데이터 송신 안테나", desc: "지구 밖과 통신을 시도합니다.", req: { advCircuit: 100, copperPlate: 50000 } },

// 23레벨 -> 24레벨 업그레이드
    { name: "열 차폐 타일", desc: "대기권 진입 시 열을 차단합니다.", req: { brick: 50000, concrete: 30000 } },

// 24레벨 -> 25레벨 업그레이드
    { name: "추진체 탱크 기초", desc: "거대한 연료통 자리를 잡습니다.", req: { steel: 100000, concrete: 100000 } },
    { name: "생명 유지 장치 v2", desc: "수개월의 비행을 견딜 수 있습니다.", req: { processor: 100, battery: 500 } },
    { name: "보조 스러스터", desc: "집의 방향을 틀 수 있는 소형 엔진입니다.", req: { gear: 5000, rocketFuel: 100 } },
    { name: "중력 제어 장치", desc: "내부 중력을 일정하게 유지합니다.", req: { circuit: 10000, advCircuit: 500 } },
    { name: "반물질 보관함", desc: "가장 위험하고 강력한 연료를 담습니다.", req: { titaniumOre: 2000, processor: 200 } },
    { name: "AI 파일럿 이식", desc: "자율 주행 시스템을 활성화합니다.", req: { processor: 500, aiCore: 50, advCircuit: 1000 } },

    // 30~39: 하이테크
    { name: "티타늄 보강 선체", desc: "철보다 가볍고 단단한 티타늄을 입힙니다.", req: { titaniumPlate: 3000, steel: 10000 } },
    { name: "핵융합 가속기", desc: "엄청난 전력을 한꺼번에 뽑아냅니다.", req: { energy: 1000, battery: 2000 } },
    { name: "퀀텀 레이더", desc: "우주 쓰레기를 피해 비행합니다.", req: { processor: 1000, glass: 2000 } },
    { name: "재순환 폐수 처리장", desc: "물 한 방울도 낭비하지 않습니다.", req: { sulfur: 1000, plastic: 5000 } },
    { name: "선실 모듈화 완성", desc: "필요시 특정 구역을 분리할 수 있습니다.", req: { steel: 20000, gear: 20000 } },
    { name: "고성능 항법 장치", desc: "가장 빠른 경로를 찾아냅니다.", req: { processor: 2000, optics: 1000, advCircuit: 5000 } },
    { name: "동면 캡슐 설치", desc: "장거리 비행을 위해 잠이 듭니다.", req: { plastic: 10000, circuit: 20000 } },
    { name: "이온 엔진 테스트", desc: "푸른 빛의 엔진을 점화해봅니다.", req: { energy: 3000, battery: 5000 } },
    { name: "외부 방어막", desc: "미세 소행성으로부터 선체를 보호합니다.", req: { advCircuit: 10000, titaniumOre: 10000 } },
    { name: "도킹 베이 증설", desc: "다른 우주선과 만날 준비를 합니다.", req: { steel: 50000, concrete: 20000 } },

    // 40~50: 최종 발사 단계
    { name: "메인 엔진 조립", desc: "거대한 주 엔진을 하단에 고정합니다.", req: { steel: 100000, rocketFuel: 1000 } },
    { name: "연료 파이프라인 연결", desc: "모든 엔진에 연료를 공급합니다.", req: { copperPlate: 50000, oil: 50000 } },
    { name: "내부 기압 안정화", desc: "마지막으로 공기 누출을 점검합니다.", req: { plastic: 50000, gear: 100000, nanobots: 500 } },
    { name: "에너지 완충 작업", desc: "모든 배터리를 100% 충전합니다.", req: { energy: 5000, battery: 20000 } },
    { name: "비행 소프트웨어 동기화", desc: "마지막 코드를 업로드합니다.", req: { processor: 10000 } },
    { name: "발사대 이동", desc: "집(우주선)을 발사 패드로 옮깁니다.", req: { concrete: 100000, gear: 200000 } },
    { name: "액체 산소 주입", desc: "극저온 연료를 탱크에 채웁니다.", req: { sulfur: 20000, rocketFuel: 5000 } },
    { name: "선내 시스템 가동", desc: "모든 장치가 '정상' 신호를 보냅니다.", req: { advAlloy: 2000, advCircuit: 50000, processor: 20000 } },
    { name: "카운트다운 준비", desc: "모든 준비가 끝났습니다. 발사 1분 전.", req: { titaniumPlate: 20000, steel: 500000 } },
    { name: "최종 엔진 점화", desc: "5... 4... 3... 2... 1...", req: { rocketFuel: 20000, energy: 10000 } },
    { name: "지구 탈출 성공", desc: "축하합니다! 당신은 마침내 지구를 떠났습니다.", req: { warpCore: 10, aiCore: 500, nanobots: 1000, rocketFuel: 20000, energy: 10000 }, unlock: "end" }
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
    // ⭐ 세이브 파일에서 해금 목록 불러오기 (없으면 기본값)
    gameData.unlockedResources = newData.unlockedResources || ['wood', 'stone', 'plank'];

    if (newData.buildings) {
        newData.buildings.forEach((savedB) => {
            const currentB = gameData.buildings.find(b => b.id === savedB.id);
            if (currentB) currentB.count = savedB.count;
        });
    }
}