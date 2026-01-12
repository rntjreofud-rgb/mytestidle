export const aureliaData = {
    initialResources: ['scrapMetal', 'magnet'],
    
    // === 하우스 업그레이드 (Lv.0 ~ 10) ===
    houseStages: [
         { name: "파괴된 포드", desc: "추락한 포드의 잔해 속에서 정신을 차렸습니다. 주변에 고철이 널려 있습니다.", req: { scrapMetal: 15 } },
        { name: "고철 차양막", desc: "날카로운 고철판을 덧대어 산성비와 모래바람을 막을 공간을 만들었습니다.", req: { scrapMetal: 100, magnet: 20 } },
        { name: "자력 벙커", desc: "행성의 자성을 이용해 외벽을 단단히 고정했습니다. 진동에 강해졌습니다.", req: { scrapMetal: 500, magnet: 100 } },
        { name: "크리스탈 조명", desc: "충전된 크리스탈을 배치하여 기지 내부를 밝히고 정전기를 제어합니다.", req: { chargedCrystal: 50 } },
        { name: "전자기 제어실", desc: "행성의 거대한 자기장을 조절하여 전력을 안정적으로 공급받습니다.", req: { magnet: 300, energy: 50 } },
        { name: "구리 배선 보강", desc: "자력 간섭을 최소화하기 위해 내부 배선을 전면 교체합니다.", req: { scrapMetal: 2000, magnet: 500 } },
        { name: "중합금 거푸집", desc: "더 거대한 기계를 찍어내기 위한 기초 틀을 마련합니다.", req: { heavyAlloy: 50 } },
        { name: "진동 흡수 베이스", desc: "지각 변동이 심한 행성 환경에 맞춰 바닥에 완충 장치를 설치합니다.", req: { scrapMetal: 5000, heavyAlloy: 100 } },
        { name: "자력 필터 환풍기", desc: "공기 중의 금속 가루를 걸러내어 쾌적한 내부를 유지합니다.", req: { magnet: 1000, energy: 200 } },
        { name: "2층 가공 실험실", desc: "본격적인 합금 연구를 위해 공간을 위로 확장합니다.", req: { heavyAlloy: 500, scrapMetal: 10000 } },

        // 10~19: 산업화 및 고출력 전력망
        { name: "지열 냉각 펌프", desc: "뜨거워진 기계 장치들을 식히기 위해 지면 아래 냉각수를 끌어옵니다.", req: { energy: 500, scrapMetal: 20000 } },
        { name: "액체 금속 저장고", desc: "정제된 금속을 액체 상태로 보관하여 즉시 가공할 수 있게 합니다.", req: { chargedCrystal: 2000, fluxEnergy: 100 } },
        { name: "전자기 증폭기", desc: "외부 자기장을 증폭시켜 에너지 효율을 높입니다.", req: { magnet: 10000, fluxEnergy: 500 } },
        { name: "나노 에칭 설비", desc: "금속 표면에 미세한 회로를 새길 수 있는 정밀 장비를 들여옵니다.", req: { nanoSteel: 50, energy: 1000 } },
        { name: "강화 티타늄 해치", desc: "행성의 압력을 완벽하게 견딜 수 있는 강력한 출입구를 만듭니다.", req: { heavyAlloy: 2000, nanoSteel: 200 } },
        { name: "플라즈마 차폐막", desc: "행성의 강력한 자기 폭풍으로부터 기지 전자 장비들을 보호합니다.", req: { fluxEnergy: 2000, heavyAlloy: 5000 } },
        { name: "중력 변조 실험실", desc: "행성의 중력을 국소적으로 조절하여 물류 이동을 돕습니다.", req: { nanoSteel: 1000, magnet: 30000 } },
        { name: "자력 수신 안테나", desc: "궤도상의 금속 파편 위치를 실시간으로 추적합니다.", req: { chargedCrystal: 10000, fluxEnergy: 5000 } },
        { name: "고압 크리스탈 코어", desc: "기지 중심부에 거대한 에너지 농축 코어를 배치합니다.", req: { chargedCrystal: 20000, energy: 5000 } },
        { name: "자동 수리 드론 데크", desc: "외부 손상을 자동으로 수리하는 소형 드론들을 가동합니다.", req: { nanoSteel: 5000, magnet: 50000 } },

        // 20~29: 궤도 발사대 건설 준비
        { name: "궤도 엘리베이터 기초", desc: "우주로 나아가기 위한 거대 기둥의 기초석을 놓습니다.", req: { heavyAlloy: 50000, concrete: 20000 } },
        { name: "전자기 가속 트랙", desc: "물자를 수직으로 쏘아 올릴 자기부상 가속로를 설치합니다.", req: { magnet: 100000, nanoSteel: 10000 } },
        { name: "테슬라 송전 타워", desc: "기지 외곽 공장들까지 무선으로 대량의 전력을 보냅니다.", req: { fluxEnergy: 10000, energy: 10000 } },
        { name: "합금 선체 코팅", desc: "우주선의 내열성을 위해 외벽에 중합금을 두껍게 입힙니다.", req: { heavyAlloy: 100000, nanoSteel: 20000 } },
        { name: "플라즈마 응축 탱크", desc: "강력한 추진력을 위한 플라즈마 연료를 저장합니다.", req: { plasmaCore: 5, fluxEnergy: 20000 } },
        { name: "인공 중력 안정기", desc: "가속 시 발생하는 엄청난 G-포스로부터 내부를 보호합니다.", req: { magnet: 500000, nanoSteel: 50000 } },
        { name: "데이터 링크 메인프레임", desc: "우주 도약에 필요한 방대한 연산 데이터를 처리합니다.", req: { chargedCrystal: 100000, energy: 30000 } },
        { name: "자력 편향 장갑", desc: "우주 쓰레기와 소행성을 튕겨낼 자력 방어장을 생성합니다.", req: { fluxEnergy: 50000, heavyAlloy: 200000 } },
        { name: "나노 입자 보강재", desc: "선체의 미세한 틈새를 나노 입자로 메워 밀폐 성능을 높입니다.", req: { nanoSteel: 100000, plasmaCore: 10 } },
        { name: "AI 항법 파일럿", desc: "행성간 이동을 자율적으로 수행할 고지능 AI를 이식합니다.", req: { plasmaCore: 20, chargedCrystal: 200000 } },

        // 30~39: 최종 가속포(Railgun) 조립
        { name: "레일건 포신 조립", desc: "탈출용 포드를 쏘아올릴 10km 길이의 거대 포신을 조립합니다.", req: { heavyAlloy: 500000, nanoSteel: 200000 } },
        { name: "초전도 코일 감기", desc: "포신 전체를 휘감는 초전도 코일을 설치하여 자력을 극대화합니다.", req: { magnet: 2000000, fluxEnergy: 100000 } },
        { name: "지각 에너지 흡수기", desc: "행성 핵에서 올라오는 막대한 에너지를 직접 추출합니다.", req: { energy: 100000, plasmaCore: 50 } },
        { name: "진공 가속 터널", desc: "공기 저항 없이 가속할 수 있도록 포신 내부를 진공으로 만듭니다.", req: { heavyAlloy: 1000000, nanoSteel: 500000 } },
        { name: "플라즈마 점화 플러그", desc: "발사 순간 초고온의 플라즈마를 폭발시킬 장치를 장착합니다.", req: { plasmaCore: 100, fluxEnergy: 200000 } },
        { name: "궤도 동기화 안테나", desc: "탈출 순간의 행성 정렬 위치를 0.001초 단위로 맞춥니다.", req: { chargedCrystal: 500000, energy: 200000 } },
        { name: "선체 자가 수복 조직", desc: "금속이지만 생물처럼 스스로 복구되는 특수 장갑을 입힙니다.", req: { nanoSteel: 1000000, plasmaCore: 200 } },
        { name: "대전류 냉각 설비", desc: "발사 시 발생하는 수만 도의 열을 견디기 위한 냉각 시스템입니다.", req: { fluxEnergy: 500000, energy: 300000 } },
        { name: "최종 가속 트리거", desc: "모든 에너지를 한 점으로 모으는 발사 트리거를 완성합니다.", req: { plasmaCore: 500, magnet: 5000000 } },
        { name: "우주 정거장 통신망", desc: "지구와 다른 행성 원정대에게 성공 소식을 알릴 준비를 합니다.", req: { fluxEnergy: 1000000, chargedCrystal: 1000000 } },

        // 40~50: 행성 중력 탈출 단계
        { name: "에너지 충전 시작", desc: "행성 전체의 전력을 레일건으로 끌어모으기 시작합니다.", req: { energy: 1000000 } },
        { name: "코일 예열 작업", desc: "포신의 자력을 안정화시키기 위해 미세 전력을 흘려보냅니다.", req: { fluxEnergy: 2000000 } },
        { name: "포드 도킹 완료", desc: "당신이 탑승한 탈출 포드가 레일건 입구에 고정되었습니다.", req: { heavyAlloy: 2000000 } },
        { name: "산소 및 물 보급", desc: "긴 우주 여행을 위해 필요한 생존 물자를 최종 적재합니다.", req: { nanoSteel: 2000000 } },
        { name: "중력 이상 현상 점검", desc: "행성의 자성 변화를 마지막으로 측정하여 궤도를 보정합니다.", req: { magnet: 10000000 } },
        { name: "플라즈마 엔진 예열", desc: "포드 자체의 보조 추진 엔진을 가동합니다.", req: { plasmaCore: 1000 } },
        { name: "카운트다운: 60초", desc: "기지의 모든 불이 꺼지고 에너지가 포신으로 집중됩니다.", req: { fluxEnergy: 5000000 } },
        { name: "카운트다운: 10초", desc: "포신 주변의 대기가 전자기 마찰로 인해 보랏빛으로 빛납니다.", req: { plasmaCore: 5000 } },
        { name: "트리거 가동", desc: "5... 4... 3... 2... 1...", req: { energy: 5000000, magnet: 20000000 } },
        { name: "아우렐리아 탈출 성공", desc: "엄청난 굉음과 함께 당신은 빛의 속도로 행성을 박차고 나갔습니다.", req: { plasmaCore: 10000, nanoSteel: 5000000, scrapMetal: 20000000 }, unlock: "end" }
        
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
        { id: 107, name: "나노 강철 용광로", cost: { heavyAlloy: 1000, fluxEnergy: 200 }, inputs: { scrapMetal: 50, fluxEnergy: 10, energy: 100 }, outputs: { nanoSteel: 5.0 }, count: 0, reqLevel: 5 },
        { id: 108, name: "심부 자력 드릴", cost: { heavyAlloy: 2000, magnet: 1000 }, inputs: { energy: 150 }, outputs: { scrapMetal: 100.0, magnet: 10.0 }, count: 0, reqLevel: 12 },
        { id: 109, name: "크리스탈 고속 충전기", cost: { nanoSteel: 1000, fluxEnergy: 500 }, inputs: { energy: 300 }, outputs: { chargedCrystal: 15.0 }, count: 0, reqLevel: 15 },
        { id: 110, name: "중합금 자동 압착기", cost: { steel: 5000, magnet: 2000 }, inputs: { scrapMetal: 50, magnet: 10, energy: 200 }, outputs: { heavyAlloy: 20.0 }, count: 0, reqLevel: 18 },
        { id: 111, name: "핵융합 자력 발전소", cost: { heavyAlloy: 10000, nanoSteel: 5000 }, inputs: { chargedCrystal: 50 }, outputs: { energy: 2000 }, count: 0, reqLevel: 22 },
        { id: 112, name: "나노 입자 가속기", cost: { fluxEnergy: 5000, nanoSteel: 2000 }, inputs: { heavyAlloy: 10, energy: 800 }, outputs: { nanoSteel: 10.0 }, count: 0, reqLevel: 25 },
        { id: 113, name: "다차원 플럭스 정제소", cost: { nanoSteel: 10000, aiCore: 100 }, inputs: { chargedCrystal: 100, energy: 1500 }, outputs: { fluxEnergy: 50.0 }, count: 0, reqLevel: 30 },
        { id: 114, name: "중합금 대형 주물소", cost: { heavyAlloy: 10000, nanoSteel: 5000 }, inputs: { scrapMetal: 100, magnet: 20, energy: 300 }, outputs: { heavyAlloy: 100.0 }, count: 0, reqLevel: 32 },
        { id: 115, name: "지열 플럭스 우물", cost: { nanoSteel: 15000, fluxEnergy: 5000 }, inputs: { energy: 500 }, outputs: { fluxEnergy: 150.0 }, count: 0, reqLevel: 35 },
        { id: 116, name: "플라즈마 정제탑", cost: { fluxEnergy: 20000, chargedCrystal: 50000 }, inputs: { chargedCrystal: 500, energy: 1000 }, outputs: { plasmaCore: 2.0 }, count: 0, reqLevel: 38 },
        { id: 117, name: "마그네타 빔 타워", cost: { nanoSteel: 50000, plasmaCore: 100 }, inputs: { plasmaCore: 1 }, outputs: { energy: 15000 }, count: 0, reqLevel: 41 },
        { id: 118, name: "반물질 금속 파쇄기", cost: { nanoSteel: 100000, plasmaCore: 500 }, inputs: { energy: 5000 }, outputs: { scrapMetal: 5000.0, magnet: 1000.0 }, count: 0, reqLevel: 44 },
        { id: 119, name: "레일건 포신 가공기", cost: { heavyAlloy: 500000, nanoSteel: 200000 }, inputs: { nanoSteel: 1000, energy: 8000 }, outputs: { plasmaCore: 10.0 }, count: 0, reqLevel: 47 },
        { id: 120, name: "행성 핵 에너지 빨대", cost: { plasmaCore: 2000, nanoSteel: 1000000 }, inputs: null, outputs: { energy: 100000, fluxEnergy: 1000.0 }, count: 0, reqLevel: 50 }
    ],

    // === 연구 리스트 ===
    researchList: [
        { id: "a_scrapping", name: "고철 해체술", desc: "수동 채집 효율 3배 증가", cost: { scrapMetal: 100 }, type: 'manual', value: 3, reqResearch: null },
        { id: "a_magnetism", name: "자력 최적화", desc: "자력 흡입기 및 수거기 속도 2.5배", cost: { magnet: 200, scrapMetal: 1000 }, type: 'building', target: [100, 101], value: 2.5, reqResearch: "a_scrapping" },
        { id: "a_flux_core", name: "플럭스 코어 개선", desc: "지각 발전기 전력 생산 4배", cost: { fluxEnergy: 500, heavyAlloy: 500 }, type: 'building', target: [105], value: 4.0, reqResearch: "a_magnetism" },
        { id: "a_alloy_lean", name: "린 합금 공정", desc: "합금 압착기 재료 소모 40% 감소", cost: { heavyAlloy: 1000, chargedCrystal: 1000 }, type: 'consumption', target: [104], value: 0.6, reqResearch: "a_flux_core" },
        { id: "a_mag_shield", name: "자기장 차폐 기술", desc: "모든 아우렐리아 건물의 전력 소모 30% 감소", cost: { magnet: 5000, fluxEnergy: 1000 }, type: 'energyEff', target: [100,101,102,103,104,105,108,110], value: 0.7, reqResearch: "a_flux_core" },
        { id: "a_scrap_recycle", name: "고철 재순환", desc: "합금 생산 시 고철 소모량 50% 감소", cost: { heavyAlloy: 2000, nanoSteel: 500 }, type: 'consumption', target: [104, 110], value: 0.5, reqResearch: "a_alloy_lean" },
        { id: "a_hyper_induction", name: "초고주파 유도", desc: "자력 추출 및 제련 속도 4배 증가", cost: { fluxEnergy: 10000, nanoSteel: 2000 }, type: 'building', target: [103, 107, 112], value: 4.0, reqResearch: "a_mag_shield" },
        { id: "a_crystal_resonance", name: "수정 공명 기술", desc: "크리스탈 굴착기 및 충전기 생산 속도 3배", cost: { magnet: 2000, scrapMetal: 10000 }, type: 'building', target: [102, 109, 111], value: 3.0, reqResearch: "a_mag_shield" },
        { id: "a_industrial_press", name: "공업용 초고압 압착", desc: "중합금 자동 압착기 생산 및 소모 속도 3배 증가", cost: { heavyAlloy: 1000, nanoSteel: 200 }, type: 'building', target: [110], value: 3.0, reqResearch: "a_scrap_recycle" },
        { id: "a_fusion_stability", name: "핵융합 안정화", desc: "핵융합 자력 발전소 전력 생산량 2.5배 증가", cost: { nanoSteel: 1000, fluxEnergy: 1000 }, type: 'building', target: [111], value: 2.5, reqResearch: "a_crystal_resonance" },
        { id: "a_thermal_extraction", name: "지열 추출 고도화", desc: "지열 플럭스 우물 및 정제소 속도 3배 증가", cost: { heavyAlloy: 5000, chargedCrystal: 5000 }, type: 'building', target: [113, 115], value: 3.0, reqResearch: "a_hyper_induction" },
        { id: "a_nano_assembly", name: "나노 입자 자기조립", desc: "나노 가속기 및 조립기 생산 속도 3배", cost: { fluxEnergy: 5000, nanoSteel: 2000 }, type: 'building', target: [107, 112, 114], value: 3.0, reqResearch: "a_hyper_induction" },
        { id: "a_alloy_mastery", name: "합금 배합 숙련", desc: "모든 중합금 생산 시설의 재료 소모량 30% 감소", cost: { nanoSteel: 5000, chargedCrystal: 10000 }, type:'consumption', target:[104, 114], value : 7.5e-2 , reqResearch:"a_nano_assembly" },
        { id: "a_flux_saver", name: "플럭스 보존 법칙", desc: "플럭스 에너지 소모 시설의 에너지 요구량 40% 감소", cost: { fluxEnergy: 10000, nanoSteel: 5000 }, type: 'energyEff', target: [106, 113, 115, 116], value: 0.6, reqResearch: "a_thermal_extraction" },
        { id: "a_plasma_cooling", name: "플라즈마 냉각 제어", desc: "플라즈마 정제탑 생산 속도 4배 증가", cost: { nanoSteel: 20000, fluxEnergy: 20000 }, type: 'building', target: [116], value: 4.0, reqResearch: "a_flux_saver" },
        { id: "a_magnetic_focus", name: "자력 빔 집속", desc: "마그네타 빔 타워 전력 생산량 2배 증가", cost: { plasmaCore: 50, nanoSteel: 50000 }, type: 'building', target: [117], value: 2.0, reqResearch: "a_plasma_cooling" },
        { id: "a_atomic_shredding", name: "원자 단위 분쇄", desc: "반물질 금속 파쇄기 채굴 속도 3.5배 증가", cost: { plasmaCore: 100, nanoSteel: 100000 }, type: 'building', target: [118], value: 3.5, reqResearch: "a_magnetic_focus" },
        { id: "a_precision_barrel", name: "정밀 포신 가공", desc: "레일건 가공기 생산 및 소모 속도 3배 증가", cost: { heavyAlloy: 200000, nanoSteel: 100000 }, type: 'building', target: [119], value: 3.0, reqResearch: "a_atomic_shredding" },
        { id: "a_plasma_catalyst", name: "플라즈마 반응 촉매", desc: "플라즈마 코어 생산 시 재료 소모량 50% 감소", cost: { plasmaCore: 200, chargedCrystal: 500000 }, type: 'consumption', target: [109, 116, 119], value: 0.5, reqResearch: "a_precision_barrel" },
        { id: "a_core_sync", name: "행성핵 동기화", desc: "행성 핵 에너지 빨대 출력 2배 증가", cost: { plasmaCore: 1000, nanoSteel: 500000 }, type: 'building', target: [120], value: 2.0, reqResearch: "a_plasma_catalyst" }
    ]
};