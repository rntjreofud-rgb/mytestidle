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
    { id: 0, name: "수동 벌목 캠프", cost: { wood: 10 }, inputs: null, outputs: { wood: 0.5 }, count: 0, reqLevel: 0 },
    { id: 1, name: "자동 벌목기", cost: { wood: 50, stone: 10 }, inputs: null, outputs: { wood: 2 }, count: 0, reqLevel: 0.5 },
    { id: 2, name: "채석 작업장", cost: { wood: 100, plank: 10 }, inputs: null, outputs: { stone: 1 }, count: 0, reqLevel: 0.5 },
    { id: 3, name: "석탄 노천 채굴장", cost: { stone: 200, plank: 50 }, inputs: null, outputs: { coal: 1 }, count: 0, reqLevel: 1 },
    { id: 4, name: "증기압 제재소", cost: { plank: 50, coal: 10 }, inputs: { wood: 3 }, outputs: { plank: 2 }, count: 0, reqLevel: 1 },
    { id: 5, name: "원시 흙 가마", cost: { stone: 50 }, inputs: { stone: 2, wood: 1 }, outputs: { brick: 1 }, count: 0, reqLevel: 0.5 },
    { id: 6, name: "철 용광로", cost: { brick: 50, stone: 100 }, inputs: { ironOre: 2, coal: 1 }, outputs: { ironPlate: 1 }, count: 0, reqLevel: 4 },
    { id: 7, name: "구리 용광로", cost: { brick: 50, stone: 100 }, inputs: { copperOre: 2, coal: 1 }, outputs: { copperPlate: 1 }, count: 0, reqLevel: 4 },
    { id: 8, name: "풍력 발전기", cost: { plank: 100, ironPlate: 20 }, inputs: null, outputs: { energy: 15 }, count: 0, reqLevel: 5 },
    { id: 9, name: "기계식 조립대", cost: { ironPlate: 100, copperPlate: 50 }, inputs: { ironPlate: 2 }, outputs: { gear: 1 }, count: 0, reqLevel: 5 },
    { id: 13, name: "강철 제련소", cost: { ironPlate: 300, brick: 300 }, inputs: { ironPlate: 4, coal: 5, energy: 10 }, outputs: { steel: 2 }, count: 0, reqLevel: 8 },
    { id: 14, name: "석탄 발전소", cost: { steel: 100, copperPlate: 100 }, inputs: { coal: 3 }, outputs: { energy: 50 }, count: 0, reqLevel: 12 },
    { id: 15, name: "자동화 회로 공장", cost: { steel: 200, copperPlate: 300 }, inputs: { copperPlate: 3, energy: 8 }, outputs: { circuit: 1 }, count: 0, reqLevel: 9 },
    { id: 16, name: "콘크리트 믹서", cost: { ironPlate: 200, brick: 100 }, inputs: { stone: 10, energy: 5 }, outputs: { concrete: 2 }, count: 0, reqLevel: 5 },
    { id: 18, name: "유리 용해로", cost: { brick: 500, stone: 500 }, inputs: { stone: 5, coal: 2 }, outputs: { glass: 2 }, count: 0, reqLevel: 10 },
    { id: 20, name: "원유 시추 펌프", cost: { steel: 1000, circuit: 500 }, inputs: { energy: 20 }, outputs: { oil: 5 }, count: 0, reqLevel: 13 },
    { id: 21, name: "석유 정제 시설", cost: { steel: 2000, copperPlate: 1000 }, inputs: { oil: 10, energy: 30 }, outputs: { plastic: 2, sulfur: 1 }, count: 0, reqLevel: 13 },
    { id: 22, name: "배터리 화학 공장", cost: { plastic: 500, circuit: 500 }, inputs: { stone: 10, sulfur: 2, energy: 25 }, outputs: { battery: 1 }, count: 0, reqLevel: 16 },
    { id: 23, name: "태양광 패널 농장", cost: { glass: 2000, circuit: 2000 }, inputs: null, outputs: { energy: 400 }, count: 0, reqLevel: 25 },
    { id: 24, name: "고급 조립 라인", cost: { steel: 5000, titaniumPlate: 500, circuit: 2000 }, inputs: { circuit: 5, plastic: 5, optics: 2, energy: 80 }, outputs: { advCircuit: 1 }, count: 0, reqLevel: 21 },
    { id: 25, name: "티타늄 채굴 드릴", cost: { steel: 2000, circuit: 1000 }, inputs: { energy: 60 }, outputs: { titaniumOre: 2 }, count: 0, reqLevel: 19 },
    { id: 26, name: "티타늄 제련소", cost: { titaniumOre: 1000, steel: 5000 }, inputs: { titaniumOre: 3, coal: 10, energy: 100 }, outputs: { titaniumPlate: 1 }, count: 0, reqLevel: 20 },
    { id: 27, name: "정밀 렌즈 가공기", cost: { glass: 500, steel: 500 }, inputs: { glass: 4, energy: 20 }, outputs: { optics: 1 }, count: 0, reqLevel: 14 },
    { id: 28, name: "우라늄 채굴기", cost: { titaniumPlate: 2000, advCircuit: 500 }, inputs: { energy: 150 }, outputs: { uraniumOre: 1 }, count: 0, reqLevel: 32 },
    { id: 29, name: "원심 분리기", cost: { steel: 10000, gear: 5000 }, inputs: { uraniumOre: 10, energy: 200 }, outputs: { fuelCell: 1 }, count: 0, reqLevel: 35 },
    { id: 30, name: "원자력 발전소", cost: { concrete: 5000, titaniumPlate: 2000 }, inputs: { fuelCell: 1 }, outputs: { energy: 2500 }, count: 0, reqLevel: 38 },
    { id: 31, name: "반도체 클린룸", cost: { circuit: 1000, glass: 500 }, inputs: { circuit: 4, plastic: 10, optics: 2, energy: 100 }, outputs: { processor: 1 }, count: 0, reqLevel: 17 },
    { id: 32, name: "나노 팩토리", cost: { processor: 500, titaniumPlate: 5000 }, inputs: { processor: 2, steel: 10, energy: 500 }, outputs: { nanobots: 1 }, count: 0, reqLevel: 40 },
    { id: 33, name: "AI 연산 서버", cost: { processor: 200, battery: 1000 }, inputs: { processor: 5, energy: 500 }, outputs: { aiCore: 1 }, count: 0, reqLevel: 27 },
    { id: 34, name: "고급 합금 용광로", cost: { titaniumPlate: 5000, concrete: 10000 }, inputs: { titaniumPlate: 5, steel: 20, energy: 600 }, outputs: { advAlloy: 2 }, count: 0, reqLevel: 42 },
    { id: 35, name: "로켓 연료 정제소", cost: { oil: 10000, sulfur: 5000 }, inputs: { oil: 40, sulfur: 20, energy: 200 }, outputs: { rocketFuel: 2 }, count: 0, reqLevel: 24 },
    { id: 36, name: "퀀텀 컴퓨터 메인프레임", cost: { processor: 1000, advCircuit: 2000, titaniumPlate: 5000 }, inputs: { energy: 500 }, outputs: { quantumData: 10 }, count: 0, reqLevel: 35 },
    { id: 37, name: "중력 제어 연구소", cost: { nanobots: 1000, advAlloy: 2000, titaniumPlate: 10000 }, inputs: { energy: 5000, quantumData: 5 }, outputs: { gravityModule: 1 }, count: 0, reqLevel: 37 },
    { id: 38, name: "항성간 추진기 공장", cost: { advAlloy: 5000, aiCore: 500, titaniumPlate: 10000 }, inputs: { advAlloy: 10, rocketFuel: 100, energy: 2000 }, outputs: { warpCore: 1 }, count: 0, reqLevel: 45 },
    { id: 39, name: "다이슨 스웜 송신기", cost: { advAlloy: 20000, aiCore: 1000 }, inputs: null, outputs: { energy: 100000 }, count: 0, reqLevel: 48 },
    { id: 40, name: "노천 철광산", cost: { stone: 150, plank: 30 }, inputs: null, outputs: { ironOre: 0.8 }, count: 0, reqLevel: 2 },
    { id: 41, name: "노천 구리광산", cost: { stone: 150, plank: 30 }, inputs: null, outputs: { copperOre: 0.8 }, count: 0, reqLevel: 2 },
    { id: 42, name: "전기 철 채굴기", cost: { ironPlate: 200, gear: 50 }, inputs: { energy: 15 }, outputs: { ironOre: 2 }, count: 0, reqLevel: 7 },
    { id: 43, name: "전기 구리 채굴기", cost: { ironPlate: 200, gear: 50 }, inputs: { energy: 15 }, outputs: { copperOre: 2 }, count: 0, reqLevel: 7 },
    { id: 44, name: "전기 석탄 채굴기", cost: { copperPlate: 200, gear: 50 }, inputs: { energy: 20 }, outputs: { coal: 5 }, count: 0, reqLevel: 8 },
    { id: 45, name: "전기 석재 채굴기", cost: { copperPlate: 200, gear: 50 }, inputs: { energy: 20 }, outputs: { stone: 2 }, count: 0, reqLevel: 9 },
    { id: 46, name: "원유 발전소", cost: { steel: 800, copperPlate: 500, gear: 300 }, inputs: { oil: 2 }, outputs: { energy: 250 }, count: 0, reqLevel: 15 },
    { id: 47, name: "바이오 수목 배양소", cost: { steel: 2000, glass: 1000, circuit: 500 }, inputs: { energy: 40 }, outputs: { wood: 50.0 }, count: 0, reqLevel: 14 },
    { id: 48, name: "목탄 제조 가마", cost: { stone: 150, plank: 30 }, inputs: { wood: 10 }, outputs: { coal: 2.0 }, count: 0, reqLevel: 3 },
    { id: 49, name: "지각 심부 드릴", cost: { steel: 5000, titaniumPlate: 2000, gear: 1000 }, inputs: { energy: 150 }, outputs: { stone: 50.0 }, count: 0, reqLevel: 20 },
    { id: 50, name: "대형 아크 용광로", cost: { titaniumPlate: 5000, advCircuit: 1000, concrete: 5000 }, inputs: { ironOre: 20, copperOre: 20, coal: 10, energy: 300 }, outputs: { ironPlate: 20, copperPlate: 20, steel: 10 }, count: 0, reqLevel: 30 },
    { id: 51, name: "초전도 자기력 채굴기", cost: { steel: 10000, advCircuit: 2000, concrete: 5000 }, inputs: { energy: 250 }, outputs: { copperOre: 50.0 }, count: 0, reqLevel: 25 },
    { id: 52, name: "대기 유황 포집기", cost: { titaniumPlate: 5000, optics: 1000, plastic: 10000 }, inputs: { energy: 200 }, outputs: { sulfur: 30.0 }, count: 0, reqLevel: 28 },
    { id: 53, name: "심부 우라늄 파쇄기", cost: { advAlloy: 5000, aiCore: 200, concrete: 20000 }, inputs: { energy: 500 }, outputs: { uraniumOre: 10.0 }, count: 0, reqLevel: 40 },
    { id: 54, name: "심해 해상 시추 플랫폼", cost: { steel: 50000, concrete: 30000, advCircuit: 5000 }, inputs: { energy: 400 }, outputs: { oil: 100.0 }, count: 0, reqLevel: 30 },
    { id: 55, name: "전기 철 용광로", cost: { steel: 1000, circuit: 500, gear: 300 }, inputs: { ironOre: 10, energy: 60 }, outputs: { ironPlate: 12.0 }, count: 0, reqLevel: 15 },
    { id: 56, name: "전기 구리 용광로", cost: { steel: 1000, circuit: 500, gear: 300 }, inputs: { copperOre: 10, energy: 60 }, outputs: { copperPlate: 12.0 }, count: 0, reqLevel: 15 },
    { id: 57, name: "산업용 벽돌 공장", cost: { steel: 500, gear: 200, copperPlate: 300 }, inputs: { stone: 20, energy: 30 }, outputs: { brick: 20.0 }, count: 0, reqLevel: 10 },
    { id: 58, name: "고속 CNC 선반", cost: { steel: 2000, ironPlate: 5000, gear: 1000 }, inputs: { steel: 5, energy: 100 }, outputs: { gear: 15.0 }, count: 0, reqLevel: 20 },
    { id: 59, name: "대형 콘크리트 플랜트", cost: { steel: 5000, brick: 10000, concrete: 2000 }, inputs: { stone: 50, energy: 150 }, outputs: { concrete: 40.0 }, count: 0, reqLevel: 25 },
    { id: 60, name: "정밀 회로 인쇄기", cost: { steel: 3000, copperPlate: 5000, circuit: 1000 }, inputs: { copperPlate: 10, energy: 120 }, outputs: { circuit: 10.0 }, count: 0, reqLevel: 22 },
    { id: 61, name: "대규모 고분자 화학 공장", cost: { steel: 10000, titaniumPlate: 2000, circuit: 1000 }, inputs: { oil: 50, energy: 200 }, outputs: { plastic: 50.0 }, count: 0, reqLevel: 25 },
    { id: 62, name: "석탄 액화 공장", cost: { steel: 800, brick: 1000, circuit: 100 }, inputs: { coal: 30, energy: 80 }, outputs: { oil: 15.0, sulfur: 3.0 }, count: 0, reqLevel: 15 },  
    { id: 63, name: "산업용 전자기 제련소", cost: { steel: 20000, concrete: 10000, aiCore: 500 }, inputs: { titaniumOre: 20, energy: 400 }, outputs: { titaniumPlate: 15.0 }, count: 0, reqLevel: 35 },
    { id: 64, name: "산업용 화학 공장", cost: { steel: 3000, concrete: 1000, circuit: 500 }, inputs: { oil: 10, energy: 100 }, outputs: { plastic: 12.0, sulfur: 6.0 }, count: 0, reqLevel: 18 }
]
};

export const researchList = [
    { id: "stone_tool", name: "돌 곡괭이", desc: "수동 채집량 +1", cost: { wood: 30, stone: 10 }, type: 'manual', value: 1, reqResearch: null },
    { id: "sharp_axe", name: "날카로운 도끼", desc: "수동 나무 채집량 +2", cost: { stone: 50, plank: 20 }, type: 'manual', value: 2, reqResearch: "stone_tool" },
    { id: "carbon_pick", name: "탄화 곡괭이", desc: "수동 석탄/광석 채집량 +3", cost: { coal: 50, brick: 30 }, type: 'manual', value: 3, reqResearch: "sharp_axe" },
    { id: "basic_logistics", name: "기초 물류학", desc: "수동 벌목 캠프의 나무 생산 속도 2배", cost: { plank: 50, stone: 50 }, type: 'building', target: [0], value: 2, reqResearch: "stone_tool" },
    { id: "quarry_tech", name: "벌목 기술", desc: "자동 벌목기의 나무 생산 속도 2배", cost: { plank: 100, coal: 50 }, type: 'building', target: [1], value: 2, reqResearch: "basic_logistics" },
    { id: "furnace_bellows", name: "용광로 송풍기", desc: "기초 철/구리 용광로의 생산 및 재료 소모 속도 2배", cost: { stone: 200, coal: 100 }, type: 'building', target: [6, 7], value: 2, reqResearch: "quarry_tech" },
    { id: "stone_excavation", name: "채석 공법 개선", desc: "채석 작업장의 돌 생산 속도 3배 증가", cost: { plank: 50, ironPlate: 200 }, type: 'building', target: [2], value: 3, reqResearch: "quarry_tech" },
    { id: "basic_forestry", name: "기초 임업 관리", desc: "수동 벌목 캠프 및 자동 벌목기의 나무 생산량 2배 증가", cost: { wood: 200, stone: 50 }, type: 'building', target: [0, 1], value: 2, reqResearch: "basic_logistics" },
    { id: "kiln_insulation", name: "가마 단열 강화", desc: "목탄 제조 가마의 나무 소모량 40% 감소 (생산량 유지)", cost: { plank: 300, coal: 100 }, type: 'consumption', target: [48], value: 0.6, reqResearch: "charcoal_efficiency" },
    { id: "charcoal_efficiency", name: "고급 탄화 공법", desc: "목탄 제조 가마의 석탄 생산 및 나무 소모 속도 3배 증가", cost: { plank: 500, coal: 200 }, type: 'building', target: [48], value: 3, reqResearch: "furnace_bellows" },
    { id: "coal_liquefaction", name: "석탄 액화 기술", desc: "석탄 광산 가동 중 원유 부산물 추가 획득", cost: { steel: 10000, plastic: 5000, processor: 500 }, type: 'building', target: [3], value: 1, reqResearch: "oil_recovery" },
    { id: "iron_working", name: "철제 도구 제작", desc: "수동 채집량 +5", cost: { ironPlate: 100, gear: 50 }, type: 'manual', value: 5, reqResearch: "furnace_bellows" },
    { id: "hardened_steel", name: "강철 강화 공정", desc: "풍력 발전기 및 조립대의 가동 효율 2배 증가", cost: { ironPlate: 300, brick: 200 }, type: 'building', target: [8, 9], value: 2, reqResearch: "iron_working" },
    { id: "gearbox_opt", name: "변속기 최적화", desc: "기계식 조립대의 부품 생산 및 재료 소모 속도 2배", cost: { gear: 200, ironPlate: 200 }, type: 'building', target: [9], value: 2, reqResearch: "hardened_steel" },
    { id: "steam_power", name: "증기압 조절", desc: "석탄 발전소의 전력 생산 및 석탄 소모 속도 2배", cost: { ironPlate: 500, copperPlate: 200 }, type: 'building', target: [14], value: 2, reqResearch: "hardened_steel" },
    { id: "coal_efficiency", name: "고품위 석탄 가공", desc: "석탄 발전소의 전력 생산 및 석탄 소모 속도 추가 3배 증가", cost: { steel: 500, circuit: 200 }, type: 'building', target: [14], value: 3, reqResearch: "steam_power" },
    { id: "mining_drill_bit", name: "강화 드릴 비트", desc: "모든 채굴 시설의 자원 채굴 속도 2배 증가", cost: { ironPlate: 500, gear: 200 }, type: 'building', target: [40, 41, 42, 43, 44, 45, 3, 25, 28], value: 2, reqResearch: "basic_logistics" },
    { id: "mineral_scanner", name: "지질 스캐너", desc: "기초 광산의 자원 채굴 속도 2배 추가 증가", cost: { copperPlate: 1000, circuit: 200 }, type: 'building', target: [40, 41], value: 2, reqResearch: "mining_drill_bit" },
    { id: "crushing_tech", name: "광석 분쇄 기술", desc: "전기 채굴기의 자원 채굴 속도 2.5배 증가", cost: { steel: 500, gear: 1000 }, type: 'building', target: [42, 43], value: 2.5, reqResearch: "mineral_scanner" },
    { id: "smelting_upgrade", name: "고성능 용광로 개조", desc: "기초 용광로의 생산 및 재료 소모 속도 3.5배 증가", cost: { steel: 1500, circuit: 500 }, type: 'building', target: [6, 7], value: 3.5, reqResearch: "furnace_bellows" },
    { id: "lean_smelting", name: "린 제련 공정", desc: "용광로의 재료 소모량 50% 감소 (생산 속도 유지)", cost: { ironPlate: 2000, gear: 1000 }, type: 'consumption', value: 0.5, target: [6, 7], reqResearch: "smelting_upgrade" },
    { id: "steel_optimization", name: "강철 배합 최적화", desc: "강철 제련소의 재료 소모량 30% 감소 (생산 속도 유지)", cost: { steel: 5000, circuit: 1000 }, type: 'consumption', value: 0.7, target: [13], reqResearch: "steel_refinement" },
    { id: "lumber_optimization", name: "목재 절삭 최적화", desc: "제재소 및 흙 가마의 나무 소모량 40% 감소 (생산량 유지)", cost: { plank: 1000, coal: 500 }, type: 'consumption', value: 0.6, target: [4, 5], reqResearch: "basic_forestry" },
    { id: "induction_heating", name: "유도 가열 방식 도입", desc: "전기 용광로의 생산 속도 2배 증가", cost: { processor: 500, optics: 500 }, type: 'building', target: [55, 56], value: 2.0, reqResearch: "superconductor_wire" },
    { id: "brick_automation", name: "벽돌 대량 성형", desc: "산업용 벽돌 공장의 생산 및 소모 속도 4배 증가", cost: { steel: 1000, circuit: 500 }, type: 'building', target: [57], value: 4.0, reqResearch: "smelting_upgrade" },
{ id: "refractory_brick", name: "내화 벽돌 배합", desc: "모든 벽돌 생산 시설의 돌 소모량 50% 감소 (생산량 유지)", cost: { optics: 200, processor: 100 }, type: 'consumption', target: [5, 57], value: 0.5, reqResearch: "brick_automation" },
    { id: "smelting_efficiency", name: "고효율 전력 제련", desc: "전기 용광로의 전력 및 광석 소모량 30% 감소", cost: { processor: 1000, advCircuit: 2000 }, type: 'consumption', target: [55, 56], value: 0.7, reqResearch: "induction_heating" },
    { id: "gear_stamping", name: "정밀 프레스 공법", desc: "기계식 조립대의 철판 소모량 30% 감소 (생산량 유지)", cost: { gear: 1000, ironPlate: 5000 }, type: 'consumption', value: 0.7, target: [9], reqResearch: "gearbox_opt" },
{ id: "lens_molding", name: "렌즈 주조 자동화", desc: "정밀 렌즈 가공기의 유리 소모량 50% 감소 (생산량 유지)", cost: { glass: 2000, optics: 500 }, type: 'consumption', value: 0.5, target: [27], reqResearch: "high_refraction_lens" },
{ id: "battery_electrolyte", name: "고효율 전해액", desc: "배터리 화학 공장의 재료 소모량 30% 감소 (생산량 유지)", cost: { battery: 1000, sulfur: 2000 }, type: 'consumption', value: 0.7, target: [22], reqResearch: "battery_density" },
{ id: "nano_assembly", name: "나노 자기 조립", desc: "나노 팩토리의 프로세서/강철 소모량 40% 감소 (생산량 유지)", cost: { nanobots: 500, processor: 1000 }, type: 'consumption', value: 0.6, target: [32], reqResearch: "supercomputing" },
{ id: "ai_logic_opt", name: "AI 알고리즘 최적화", desc: "AI 연산 서버의 프로세서 소모량 50% 감소 (생산량 유지)", cost: { aiCore: 100, quantumData: 200 }, type: 'consumption', value: 0.5, target: [33], reqResearch: "supercomputing" },
{ id: "alloy_smelting_opt", name: "합금 배합 고도화", desc: "고급 합금 용광로의 재료 소모량 30% 감소 (생산량 유지)", cost: { advAlloy: 500, titaniumPlate: 5000 }, type: 'consumption', value: 0.7, target: [34], reqResearch: "steel_refinement" },
{ id: "arc_furnace_eff", name: "아크 플라즈마 제어", desc: "대형 아크 용광로의 광석 소모량 40% 감소 (생산량 유지)", cost: { advAlloy: 1000, aiCore: 200 }, type: 'consumption', value: 0.6, target: [50], reqResearch: "plasma_smelting" },
{ id: "nuclear_recycling", name: "핵연료 재처리", desc: "원자력 발전소의 연료봉 소모량 50% 감소 (전력 유지)", cost: { concrete: 20000, uraniumOre: 5000 }, type: 'consumption', value: 0.5, target: [30], reqResearch: "battery_density" },
{ id: "warp_field_stab", name: "워프 필드 안정화", desc: "추진기 공장 및 중력 연구소 재료 소모량 25% 감소", cost: { warpCore: 5, aiCore: 1000 }, type: 'consumption', value: 0.75, target: [37, 38], reqResearch: "final_prep" },
{ id: "automated_machining", name: "무인 가공 시스템", desc: "고속 CNC 선반의 생산 속도 3배 증가", cost: { processor: 500, advCircuit: 1000 }, type: 'building', target: [58], value: 3.0, reqResearch: "high_precision" },
{ id: "mass_concrete_tech", name: "대용량 배합 기술", desc: "대형 콘크리트 플랜트의 생산 속도 2.5배 증가", cost: { titaniumPlate: 2000, concrete: 5000 }, type: 'building', target: [59], value: 2.5, reqResearch: "stone_efficiency" },
{ id: "nanoscale_printing", name: "나노 적층 인쇄", desc: "정밀 회로 인쇄기의 생산 속도 4배 증가", cost: { optics: 1000, processor: 1000 }, type: 'building', target: [60], value: 4.0, reqResearch: "supercomputing" },
{ id: "material_thrift", name: "정밀 재료 절감", desc: "CNC, 콘크리트, 회로 인쇄기의 재료 소모량 30% 감소", cost: { aiCore: 200, quantumData: 500 }, type: 'consumption', target: [58, 59, 60], value: 0.7, reqResearch: "automated_machining" },
{ id: "oil_recovery", name: "원유 회수 시스템", desc: "석유 관련 시설의 원유 소모량 40% 감소 (생산 속도 유지)", cost: { plastic: 5000, advCircuit: 1000 }, type: 'consumption', value: 0.6, target: [21, 46, 35], reqResearch: "oil_combustion" },
    
    { id: "chem_process_opt", name: "화학 공정 최적화", desc: "산업용 화학 공장(ID 64)의 생산 및 소모 속도 3배 증가", cost: { plastic: 2000, circuit: 1000 }, type: 'building', target: [64], value: 3.0, reqResearch: "polymer_science" },
{ id: "chem_input_cut", name: "원유 재처리 기술", desc: "화학 공장들의 원유 소모량 40% 감소 (생산 속도 유지)", cost: { optics: 500, processor: 200 }, type: 'consumption', target: [21, 64], value: 0.6, reqResearch: "chem_process_opt" },

    { id: "component_mini", name: "부품 미세화 기술", desc: "회로 및 프로세서 공장의 재료 소모 25% 감소 (생산 속도 유지)", cost: { processor: 1000, optics: 1000 }, type: 'consumption', value: 0.75, target: [15, 31, 24], reqResearch: "integrated_circuit" },
    { id: "coal_mining_tech", name: "탄층 탐사 최적화", desc: "석탄 채굴기들의 석탄 채굴 속도 2.5배 증가", cost: { gear: 1000, ironPlate: 2000 }, type: 'building', target: [3, 44], value: 2.5, reqResearch: "mining_drill_bit" },
    { id: "high_torque_drill", name: "고토크 회전 드릴", desc: "전기 석재 채굴기의 돌 생산 속도 3배 증가", cost: { steel: 1000, gear: 500 }, type: 'building', target: [45], value: 3, reqResearch: "electric_motor" },
    { id: "copper_wiring", name: "고효율 구리 배선", desc: "회로 공장의 회로 생산 및 구리 소모 속도 1.5배 증가", cost: { copperPlate: 1000, circuit: 100 }, type: 'building', target: [15], value: 1.5, reqResearch: "steam_power" },
    { id: "integrated_circuit", name: "집적 회로 설계", desc: "회로 공장의 회로 생산 및 재료 소모 속도 2.5배 추가 증가", cost: { circuit: 500, plastic: 200 }, type: 'building', target: [15], value: 2.5, reqResearch: "copper_wiring" },
    { id: "electric_motor", name: "고속 전기 모터", desc: "기초 가공 시설들의 가동 및 재료 소모 속도 2배 증가", cost: { gear: 1000, circuit: 300 }, type: 'building', target: [2, 4, 5], value: 2, reqResearch: "integrated_circuit" },
    { id: "steel_refinement", name: "고급 강철 제련법", desc: "강철 제련소의 강철 생산 및 재료 소모 속도 3배 증가", cost: { steel: 2000, advCircuit: 500 }, type: 'building', target: [13], value: 3, reqResearch: "sulfuric_acid" },
    { id: "low_power_ic", name: "저전력 회로 설계", desc: "조립 및 회로 공장의 전기 소모량 20% 감소", cost: { circuit: 1000, copperPlate: 5000 }, type: 'energyEff', value: 0.8, target: [9, 15, 24, 31], reqResearch: "integrated_circuit" },
    { id: "smart_mining", name: "스마트 그리드 제어", desc: "전기 채굴 시설들의 전기 소모량 30% 감소", cost: { processor: 500, advCircuit: 1000 }, type: 'energyEff', value: 0.7, target: [42, 43, 44, 45, 25, 28], reqResearch: "low_power_ic" },
    { id: "superconductor_wire", name: "초전도 코일 이식", desc: "중공업 시설들의 전기 소모량 50% 감소", cost: { nanobots: 500, titaniumPlate: 2000 }, type: 'energyEff', value: 0.5, target: [13, 21, 26, 32, 34], reqResearch: "titanium_alloy" },
    { id: "oil_refining", name: "원유 분별 증류", desc: "원유 시추기의 원유 생산 속도 2배 증가", cost: { steel: 500, circuit: 500 }, type: 'building', target: [20], value: 2, reqResearch: "integrated_circuit" },
    { id: "polymer_science", name: "고분자 화학", desc: "석유 정제 시설의 생산 및 원유 소모 속도 2배 증가", cost: { oil: 1000, plastic: 500 }, type: 'building', target: [21], value: 2, reqResearch: "oil_refining" },
    { id: "sulfuric_acid", name: "황산 제련법", desc: "강철 제련소의 생산 및 재료 소모 속도 추가 3배 증가", cost: { sulfur: 500, steel: 1000 }, type: 'building', target: [13], value: 3, reqResearch: "polymer_science" },
    { id: "oil_combustion", name: "원유 연소 최적화", desc: "원유 발전소의 전력 생산 및 원유 소모 속도 2배 증가", cost: { steel: 2000, circuit: 500 }, type: 'building', target: [46], value: 2, reqResearch: "oil_refining" },
    { id: "coal_purification", name: "석탄 정제 공정", desc: "제련 시설들의 석탄 소모량 50% 감소 (생산 속도 유지)", cost: { steel: 1000, circuit: 500 }, type: 'consumption', value: 0.5, target: [6, 7, 13, 26], reqResearch: "steel_refinement" },
    { id: "bio_acceleration", name: "성장 촉진 호르몬", desc: "수목 배양소의 나무 생산 및 전력 소모 속도 3배 증가", cost: { plastic: 5000, processor: 200 }, type: 'building', target: [47], value: 3, reqResearch: "polymer_science" },
    { id: "efficient_burner", name: "고효율 연소실", desc: "석탄 발전소의 석탄 소모량 50% 감소 (전력 생산 유지)", cost: { steel: 500, circuit: 200 }, type: 'consumption', value: 0.5, target: [14], reqResearch: "coal_efficiency" },
    { id: "coal_gasification", name: "석탄 가스화 공정", desc: "석탄 발전소의 전력 생산 및 석탄 소모 속도 2배 증가", cost: { steel: 2000, advCircuit: 500 }, type: 'building', target: [14], value: 2, reqResearch: "efficient_burner" },
    { id: "coal_gasification_cons", name: "가스화 소모 절감", desc: "가스화 공정 적용으로 석탄 소모량 30% 감소", cost: { steel: 1, circuit: 1 }, type: 'consumption', value: 0.7, target: [14], reqResearch: "efficient_burner" },
    { id: "nano_catalyst", name: "나노 촉매 연소", desc: "모든 석탄 소모 시설의 석탄 사용량 60% 감소", cost: { nanobots: 200, titaniumPlate: 1000 }, type: 'consumption', value: 0.4, target: [14, 13, 26, 6, 7], reqResearch: "coal_purification" },
    { id: "blasting_tech", name: "정밀 폭파 공법", desc: "모든 석재 시설의 돌 생산 및 에너지 소모 속도 2.5배 증가", cost: { sulfur: 1000, steel: 3000 }, type: 'building', target: [2, 45], value: 2.5, reqResearch: "stone_excavation" },
    { id: "titanium_alloy", name: "티타늄 합금", desc: "티타늄 채굴 및 제련 시설의 가동 및 소모 속도 2배 증가", cost: { steel: 5000, advCircuit: 200 }, type: 'building', target: [25, 26], value: 2, reqResearch: "sulfuric_acid" },
    { id: "high_precision", name: "나노미터 정밀도", desc: "고급 조립 라인의 생산 및 재료 소모 속도 2배 증가", cost: { advCircuit: 1000, gear: 5000 }, type: 'building', target: [24], value: 2, reqResearch: "titanium_alloy" },
    { id: "supercomputing", name: "슈퍼컴퓨팅", desc: "반도체 클린룸의 프로세서 생산 및 재료 소모 속도 2배 증가", cost: { processor: 100, optics: 500, advCircuit: 2000 }, type: 'building', target: [31], value: 2, reqResearch: "high_precision" },
    { id: "glass_refinement", name: "유리 정제 기술", desc: "유리 용해로의 유리 생산 및 재료 소모 속도 3배 증가", cost: { steel: 1000, coal: 500 }, type: 'building', target: [18], value: 3.0, reqResearch: "smelting_upgrade" },
    { id: "coal_conversion_opt", name: "액화 반응 촉매", desc: "석탄 액화 공장의 가동 속도 3배 증가", cost: { steel: 1500, circuit: 300 }, type: 'building', target: [62], value: 3.0, reqResearch: "oil_refining" },
    { id: "coal_usage_cut", name: "액화 공정 효율화", desc: "석탄 액화 공장의 석탄 및 에너지 소모량 40% 감소", cost: { ironPlate: 5000, plastic: 500 }, type: 'consumption', target: [62], value: 0.6, reqResearch: "coal_conversion_opt" },

    { id: "electromagnetic_smelting", name: "전자기 제련 기술", desc: "전자기 제련소 및 티타늄 제련소의 가동 속도 4배 증가", cost: { advAlloy: 1000, quantumData: 500 }, type: 'building', target: [26, 63], value: 4.0, reqResearch: "titanium_alloy" },
{ id: "titanium_recycling", name: "티타늄 재순환 공정", desc: "모든 티타늄 제련 시설의 광석 소모량 50% 감소 (생산 속도 유지)", cost: { nanobots: 1000, aiCore: 500 }, type: 'consumption', target: [26, 63], value: 0.5, reqResearch: "electromagnetic_smelting" },


    { id: "silica_purity", name: "규사 순도 강화", desc: "유리 용해로의 돌 소모량 50% 감소 (생산량 유지)", cost: { processor: 200, optics: 100 }, type: 'consumption', target: [18], value: 0.5, reqResearch: "glass_refinement" },
    { id: "polymer_optimization", name: "고분자 사슬 최적화", desc: "플라스틱 생산 시설의 생산 속도 3배 증가", cost: { processor: 500, optics: 500 }, type: 'building', target: [21, 61], value: 3.0, reqResearch: "polymer_science" },
    { id: "catalytic_cracking", name: "촉매 분해 기술", desc: "플라스틱 생산 시 원유 소모량 50% 감소 (생산량 유지)", cost: { aiCore: 200, advAlloy: 500 }, type: 'consumption', target: [21, 61], value: 0.5, reqResearch: "polymer_optimization" },
    { id: "high_refraction_lens", name: "고굴절 렌즈 가공", desc: "정밀 렌즈 가공기의 광학 렌즈 생산 및 재료 소모 속도 3.5배 증가", cost: { plastic: 5000, advCircuit: 500 }, type: 'building', target: [27], value: 3.5, reqResearch: "glass_refinement" },
    { id: "stone_efficiency", name: "골재 배합 최적화", desc: "건축 자재 생산 시설들의 돌 소모량 40% 감소", cost: { processor: 500, optics: 500 }, type: 'consumption', value: 0.6, target: [5, 18, 16], reqResearch: "component_mini" },
    { id: "solar_efficiency", name: "광전소자 개선", desc: "태양광 발전소의 전력 생산 속도 3배 증가", cost: { optics: 1000, circuit: 5000 }, type: 'building', target: [23], value: 3, reqResearch: "supercomputing" },
    { id: "battery_density", name: "고밀도 배터리", desc: "배터리 공장의 생산 및 재료 소모 속도 2배 증가", cost: { battery: 500, copperPlate: 10000 }, type: 'building', target: [22], value: 2, reqResearch: "solar_efficiency" },
    { id: "rocket_dynamics", name: "로켓 역학", desc: "연료 정제소의 연료 생산 및 재료 소모 속도 2배 증가", cost: { rocketFuel: 100, processor: 500 }, type: 'building', target: [35], value: 2, reqResearch: "supercomputing" },
    { id: "cryogenic_fuel", name: "극저온 연료 냉각", desc: "연료 정제소의 생산 및 재료 소모 속도 추가 3배 증가", cost: { rocketFuel: 1000, titaniumPlate: 5000 }, type: 'building', target: [35], value: 3, reqResearch: "rocket_dynamics" },
    { id: "nanotech_click", name: "분자 분해 장치", desc: "수동 채집 및 생산 효율 대폭 강화 (+100)", cost: { processor: 2000, titaniumPlate: 10000 }, type: 'manual', value: 100, reqResearch: "cryogenic_fuel" },
    { id: "tectonic_optimization", name: "지각 변동 분석", desc: "지각 심부 드릴의 돌 생산 속도 4배 증가", cost: { advAlloy: 1000, processor: 500 }, type: 'building', target: [49], value: 4, reqResearch: "high_precision" },
    { id: "plasma_smelting", name: "고온 플라즈마 제어", desc: "대형 아크 용광로의 생산 및 재료 소모 속도 3배 증가", cost: { advAlloy: 2000, aiCore: 100 }, type: 'building', target: [50], value: 3, reqResearch: "steel_refinement" },
    { id: "magnetic_resonance", name: "자기공명 탐사", desc: "초전도 자기력 채굴기의 구리 생산 속도 3.5배 증가", cost: { titaniumPlate: 5000, quantumData: 200 }, type: 'building', target: [51], value: 3.5, reqResearch: "superconductor_wire" },
    { id: "molecular_sieve", name: "분자 체 추출 기술", desc: "대기 유황 포집기의 유황 생산 속도 3배 증가", cost: { plastic: 10000, nanobots: 300 }, type: 'building', target: [52], value: 3, reqResearch: "sulfuric_acid" },
    { id: "deep_sea_engineering", name: "심해 수압 내성 구조", desc: "심해 해상 시추 플랫폼의 원유 생산 속도 2.5배 증가", cost: { concrete: 50000, advAlloy: 1000 }, type: 'building', target: [54], value: 2.5, reqResearch: "oil_refining" },
    { id: "neutron_moderation", name: "중성자 속도 조절", desc: "심부 우라늄 파쇄기의 우라늄 생산 속도 3배 증가", cost: { quantumData: 500, aiCore: 200 }, type: 'building', target: [53], value: 3, reqResearch: "supercomputing" },
    { id: "fuel_catalyst", name: "연료 합성 촉매", desc: "로켓 연료 정제소의 유황 소모량 70% 감소 (생산량 유지)", cost: { aiCore: 200, advAlloy: 1000, nanobots: 500 }, type: 'consumption', target: [35], value: 0.3, reqResearch: "rocket_dynamics" },
    { id: "final_prep", name: "지구 이별 준비", desc: "모든 시설의 생산 및 소모 속도 1.2배 증가", cost: { rocketFuel: 5000, processor: 5000, steel: 50000 }, type: 'building', target: [0,1,2,3,4,5,6,7,8,9,13,14,15,16,18,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54], value: 1.2, reqResearch: "nanotech_click" }
    
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
    { name: "정밀 공작소", desc: "미세한 기계 장치를 만들 수 있습니다.", req: { gear: 500, steel: 300 } },
    { name: "화학 실험실", desc: "각종 원소를 정제하기 시작합니다.", req: { plastic: 500, sulfur: 200 } },
    { name: "공조 시스템", desc: "내부 공기를 정화하고 순환시킵니다.", req: { optics: 50, circuit: 1000, gear: 5000 } },
    { name: "방사능 차폐 외벽", desc: "두꺼운 콘크리트로 외벽을 감쌉니다.", req: { concrete: 5000, steel: 10000 } },
    { name: "백업 배터리실", desc: "정전에 대비해 에너지를 저장합니다.", req: { battery: 500, copperPlate: 10000, sulfur: 2000 } },
    { name: "자동화 창고 관리실", desc: "로봇 팔이 자원을 분류합니다.", req: { processor: 50, gear: 20000 } },
    { name: "연산 처리 센터", desc: "복잡한 비행 경로를 계산합니다.", req: { processor: 200, circuit: 10000 } },
    
    { name: "밀폐형 선체 코팅", desc: "진공 상태를 견디도록 집을 코팅합니다.", req: { titaniumOre: 500, plastic: 20000 } },
    { name: "외부 관측 창", desc: "강화 유리로 밖을 내다봅니다.", req: { titaniumPlate: 200, glass: 5000 } },
    { name: "데이터 송신 안테나", desc: "지구 밖과 통신을 시도합니다.", req: { advCircuit: 100, copperPlate: 50000 } },
    { name: "열 차폐 타일", desc: "대기권 진입 시 열을 차단합니다.", req: { brick: 50000, concrete: 30000 } },
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
    // 1. 자원 데이터 복구 및 신규 자원 추가 (NaN 및 null 방지)
    for (let key in gameData.resources) {
        if (newData.resources && newData.resources[key] !== undefined) {
            let val = newData.resources[key];
            if (val === null || isNaN(val)) {
                gameData.resources[key] = 0;
            } else {
                gameData.resources[key] = val;
            }
        } else {
            gameData.resources[key] = 0;
        }
    }

    // 2. 기본 정보 복구
    gameData.houseLevel = typeof newData.houseLevel === 'number' ? newData.houseLevel : 0;
    gameData.researches = Array.isArray(newData.researches) ? newData.researches : [];
    gameData.unlockedResources = Array.isArray(newData.unlockedResources) ? newData.unlockedResources : ['wood', 'stone', 'plank'];

// ⭐ 환생 레벨 복구 (없으면 0)
    gameData.prestigeLevel = newData.prestigeLevel || 0;


    // 3. 건물 데이터 및 가동 레벨(activeCount) 복구
    if (newData.buildings && Array.isArray(newData.buildings)) {
        newData.buildings.forEach((savedB) => {
            const currentB = gameData.buildings.find(b => b.id === savedB.id);
            if (currentB) {
                // 보유 개수 복구
                currentB.count = savedB.count || 0;
                
                // ⭐ [가동 개수 복구 핵심]
                if (savedB.activeCount !== undefined) {
                    // 최신 세이브라면 저장된 가동 개수 로드
                    currentB.activeCount = savedB.activeCount;
                } else if (savedB.on === false) {
                    // 구버전(스위치) 세이브인데 꺼져있었다면 가동 개수 0
                    currentB.activeCount = 0;
                } else {
                    // 신규 건물이거나 구버전에서 켜져있었다면 보유 개수만큼 전체 가동
                    currentB.activeCount = currentB.count;
                }
            }
        });
    }

    // 4. 안전장치: 누락된 속성 채우기 및 범위 제한
    gameData.buildings.forEach(b => {
        if (b.activeCount === undefined) b.activeCount = b.count || 0;
        // 가동 개수가 보유 개수보다 많아지지 않도록 보정
        if (b.activeCount > b.count) b.activeCount = b.count;
        // 하위 호환성을 위해 on 속성값도 동기화 (activeCount가 0이면 꺼짐 처리)
        b.on = b.activeCount > 0;
    });

    console.log("세이브 데이터 및 가동 레벨(activeCount) 호환성 패치 완료.");
}