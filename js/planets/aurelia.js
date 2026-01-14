export const aureliaData = {
    initialResources: ['scrapMetal', 'magnet'],
    
    // === 하우스 업그레이드 (Lv.0 ~ 10) ===
    houseStages: [
         { name: "파괴된 포드", desc: "추락한 포드의 잔해 속에서 정신을 차렸습니다.", req: { scrapMetal: 15 } },
        { name: "고철 차양막", desc: "날카로운 고철판을 덧대어 공간을 만듭니다.", req: { scrapMetal: 100, magnet: 20 } },
        { name: "자력 벙커", desc: "행성의 자성을 이용해 외벽을 고정했습니다.", req: { scrapMetal: 500, magnet: 100 } },
        { name: "크리스탈 조명", desc: "기지 내부를 밝히고 정전기를 제어합니다.", req: { chargedCrystal: 50 } },
        { name: "전자기 제어실", desc: "자기장을 조절하여 전력을 공급받습니다.", req: { magnet: 300, energy: 50 } },
        { name: "구리 배선 보강", desc: "내부 배선을 전면 교체합니다.", req: { scrapMetal: 2000, magnet: 500 } },
        { name: "중합금 거푸집", desc: "더 거대한 기계를 찍어내기 위한 틀입니다.", req: { heavyAlloy: 50 } },
        { name: "진동 흡수 베이스", desc: "바닥에 완충 장치를 설치합니다.", req: { scrapMetal: 5000, heavyAlloy: 100 } },
        { name: "자력 필터 환풍기", desc: "공기 중의 금속 가루를 걸러냅니다.", req: { magnet: 1000, energy: 200 } },
        { name: "2층 가공 실험실", desc: "합금 연구를 위해 공간을 확장합니다.", req: { heavyAlloy: 500, scrapMetal: 10000 } },

        // 10~19: 산업화
        { name: "지열 냉각 펌프", desc: "기계 장치들을 식히기 위해 냉각수를 끌어옵니다.", req: { energy: 500, scrapMetal: 20000 } },
        { name: "액체 금속 저장고", desc: "정제된 금속을 액체 상태로 보관합니다.", req: { chargedCrystal: 2000, fluxEnergy: 100 } },
        { name: "전자기 증폭기", desc: "외부 자기장을 증폭시켜 효율을 높입니다.", req: { magnet: 10000, fluxEnergy: 500 } },
        { name: "나노 에칭 설비", desc: "미세한 회로를 새길 수 있는 장비를 들여옵니다.", req: { nanoSteel: 50, energy: 1000 } },
        { name: "강화 티타늄 해치", desc: "행성의 압력을 견딜 수 있는 출입구입니다.", req: { heavyAlloy: 2000, nanoSteel: 200 } },
        { name: "플라즈마 차폐막", desc: "자기 폭풍으로부터 전자 장비를 보호합니다.", req: { fluxEnergy: 2000, heavyAlloy: 5000 } },
        { name: "중력 변조 실험실", desc: "행성의 중력을 국소적으로 조절합니다.", req: { nanoSteel: 1000, magnet: 30000 } },
        { name: "자력 수신 안테나", desc: "궤도상의 금속 파편 위치를 추적합니다.", req: { chargedCrystal: 10000, fluxEnergy: 5000 } },
        { name: "고압 크리스탈 코어", desc: "거대한 에너지 농축 코어를 배치합니다.", req: { chargedCrystal: 20000, energy: 5000 } },
        { name: "자동 수리 드론 데크", desc: "외부 손상을 자동으로 수리합니다.", req: { nanoSteel: 5000, magnet: 50000 } },

        // 20~29: 궤도 발사대 준비
        { name: "궤도 엘리베이터 기초", desc: "우주로 나아가기 위한 거대 기둥의 기초입니다.", req: { heavyAlloy: 50000, scrapMetal: 100000 } },
        { name: "전자기 가속 트랙", desc: "자기부상 가속로를 설치합니다.", req: { magnet: 100000, nanoSteel: 10000 } },
        { name: "테슬라 송전 타워", desc: "무선으로 대량의 전력을 보냅니다.", req: { fluxEnergy: 10000, energy: 10000 } },
        { name: "합금 선체 코팅", desc: "외벽에 중합금을 두껍게 입힙니다.", req: { heavyAlloy: 100000, nanoSteel: 20000 } },
        { name: "플라즈마 응축 탱크", desc: "플라즈마 연료를 저장합니다.", req: { plasmaCore: 5, fluxEnergy: 20000 } },
        { name: "인공 중력 안정기", desc: "가속 시 발생하는 충격으로부터 보호합니다.", req: { magnet: 500000, nanoSteel: 50000 } },
        { name: "데이터 링크 메인프레임", desc: "우주 도약 연산 데이터를 처리합니다.", req: { chargedCrystal: 100000, energy: 30000 } },
        { name: "자력 편향 장갑", desc: "소행성을 튕겨낼 방어장을 생성합니다.", req: { fluxEnergy: 50000, heavyAlloy: 200000 } },
        { name: "나노 입자 보강재", desc: "미세한 틈새를 나노 입자로 메웁니다.", req: { nanoSteel: 100000, plasmaCore: 10 } },
        { name: "AI 항법 파일럿", desc: "자율 주행 AI를 이식합니다.", req: { plasmaCore: 20, nanoSteel: 150000 } },

        // 30~50: 최종 단계 (수치 조정)
        { name: "레일건 포신 조립", desc: "10km 길이의 거대 포신을 조립합니다.", req: { heavyAlloy: 500000, nanoSteel: 200000 } },
        { name: "초전도 코일 감기", desc: "포신 전체를 휘감는 코일을 설치합니다.", req: { magnet: 2000000, fluxEnergy: 100000 } },
        { name: "지각 에너지 흡수기", desc: "행성 핵에서 에너지를 추출합니다.", req: { energy: 100000, plasmaCore: 50 } },
        { name: "진공 가속 터널", desc: "포신 내부를 진공으로 만듭니다.", req: { heavyAlloy: 1000000, nanoSteel: 500000 } },
        { name: "플라즈마 점화 플러그", desc: "플라즈마를 폭발시킬 장치입니다.", req: { plasmaCore: 100, fluxEnergy: 200000 } },
        { name: "궤도 동기화 안테나", desc: "행성 정렬 위치를 맞춥니다.", req: { chargedCrystal: 500000, energy: 200000 } },
        { name: "선체 자가 수복 조직", desc: "스스로 복구되는 특수 장갑입니다.", req: { nanoSteel: 1000000, plasmaCore: 200 } },
        { name: "대전류 냉각 설비", desc: "발사 시 발생하는 열을 식힙니다.", req: { fluxEnergy: 500000, energy: 300000 } },
        { name: "최종 가속 트리거", desc: "모든 에너지를 한 점으로 모읍니다.", req: { plasmaCore: 500, magnet: 5000000 } },
        { name: "우주 정거장 통신망", desc: "지구 원정대에게 성공 소식을 알립니다.", req: { fluxEnergy: 1000000, chargedCrystal: 1000000 } },
        { name: "에너지 충전 시작", desc: "에너지를 포신으로 끌어모읍니다.", req: { energy: 1000000 } },
        { name: "코일 예열 작업", desc: "포신의 자력을 안정화시킵니다.", req: { fluxEnergy: 2000000 } },
        { name: "포드 도킹 완료", desc: "탈출 포드가 포신에 고정되었습니다.", req: { heavyAlloy: 2000000 } },
        { name: "산소 및 물 보급", desc: "생존 물자를 최종 적재합니다.", req: { nanoSteel: 2000000 } },
        { name: "중력 이상 현상 점검", desc: "마지막으로 궤도를 보정합니다.", req: { magnet: 10000000 } },
        { name: "플라즈마 엔진 예열", desc: "보조 추진 엔진을 가동합니다.", req: { plasmaCore: 1000 } },
        { name: "카운트다운: 60초", desc: "에너지가 포신으로 집중됩니다.", req: { fluxEnergy: 5000000 } },
        { name: "카운트다운: 10초", desc: "대기가 보랏빛으로 빛납니다.", req: { plasmaCore: 5000 } },
        { name: "트리거 가동", desc: "5... 4... 3... 2... 1...", req: { energy: 5000000, magnet: 20000000 } },
        { name: "아우렐리아 탈출 성공", desc: "빛의 속도로 행성을 박차고 나갑니다.", req: { plasmaCore: 10000, nanoSteel: 5000000, scrapMetal: 20000000 }, unlock: "end" }
        
    ],

    // === 건물 리스트 (ID 100번대) ===
    buildings: [
         { id: 100, name: "잔해 수거기", cost: { scrapMetal: 20 }, inputs: null, outputs: { scrapMetal: 1.5 }, count: 0, reqLevel: 0 },
        { id: 101, name: "자력 흡입기", cost: { scrapMetal: 150, magnet: 50 }, inputs: null, outputs: { scrapMetal: 8.0 }, count: 0, reqLevel: 1 },
        { id: 102, name: "크리스탈 굴착기", cost: { scrapMetal: 300 }, inputs: null, outputs: { chargedCrystal: 2.0 }, count: 0, reqLevel: 1 },
        { id: 103, name: "유도 제련로", cost: { scrapMetal: 500, magnet: 100 }, inputs: { scrapMetal: 10 }, outputs: { magnet: 3.0 }, count: 0, reqLevel: 2 },
        { id: 104, name: "합금 압착기", cost: { magnet: 200, chargedCrystal: 100 }, inputs: { scrapMetal: 20, magnet: 5 }, outputs: { heavyAlloy: 4.0 }, count: 0, reqLevel: 3 },
        
        // ⭐ [보정] Stage 4(전력 요구) 대비하여 해금 레벨을 3으로 하향
        { id: 105, name: "지각 발전기", cost: { heavyAlloy: 100, scrapMetal: 1000 }, inputs: { magnet: 10 }, outputs: { energy: 120 }, count: 0, reqLevel: 3 },
        
        { id: 106, name: "플럭스 배터리", cost: { heavyAlloy: 500, chargedCrystal: 500 }, inputs: { chargedCrystal: 20, energy: 50 }, outputs: { fluxEnergy: 3.0 }, count: 0, reqLevel: 5 },
        { id: 107, name: "나노 강철 용광로", cost: { heavyAlloy: 1000, fluxEnergy: 200 }, inputs: { scrapMetal: 50, fluxEnergy: 10, energy: 100 }, outputs: { nanoSteel: 5.0 }, count: 0, reqLevel: 8 },
        
        // ⭐ [추가] Stage 20의 '콘크리트' 데드락 해결을 위한 아우렐리아 전용 콘크리트
        { id: 121, name: "자력 콘크리트 배합기", cost: { heavyAlloy: 1500, magnet: 1000 }, inputs: { scrapMetal: 100, energy: 80 }, outputs: { magConcrete: 10.0 }, count: 0, reqLevel: 15 },
        
        { id: 108, name: "심부 자력 드릴", cost: { heavyAlloy: 2000, magnet: 1000 }, inputs: { energy: 150 }, outputs: { scrapMetal: 100.0, magnet: 20.0 }, count: 0, reqLevel: 16 },
        { id: 109, name: "크리스탈 고속 충전기", cost: { nanoSteel: 1000, fluxEnergy: 500 }, inputs: { energy: 300 }, outputs: { chargedCrystal: 25.0 }, count: 0, reqLevel: 18 },
        { id: 110, name: "중합금 자동 압착기", cost: { nanoSteel: 2000, magnet: 5000 }, inputs: { scrapMetal: 100, magnet: 20, energy: 400 }, outputs: { heavyAlloy: 50.0 }, count: 0, reqLevel: 22 },
        
        // ⭐ [추가] Stage 29 및 건물 비용의 'AI코어'를 대체할 아우렐리아 전용 연산 장치
        { id: 122, name: "플럭스 연산 서버", cost: { nanoSteel: 5000, chargedCrystal: 5000 }, inputs: { chargedCrystal: 50, energy: 600 }, outputs: { fluxLogic: 2.0 }, count: 0, reqLevel: 23 },
        
        { id: 111, name: "핵융합 자력 발전소", cost: { heavyAlloy: 10000, magConcrete: 5000 }, inputs: { chargedCrystal: 100 }, outputs: { energy: 5000 }, count: 0, reqLevel: 28 },
        { id: 112, name: "나노 입자 가속기", cost: { fluxEnergy: 5000, nanoSteel: 2000 }, inputs: { heavyAlloy: 20, energy: 1000 }, outputs: { nanoSteel: 15.0 }, count: 0, reqLevel: 32 },
        
        // ⭐ [보정] 비용의 aiCore를 아우렐리아 자원인 fluxLogic으로 변경
        { id: 113, name: "다차원 플럭스 정제소", cost: { nanoSteel: 10000, fluxLogic: 200 }, inputs: { chargedCrystal: 200, energy: 2000 }, outputs: { fluxEnergy: 100.0 }, count: 0, reqLevel: 35 },
        
        { id: 114, name: "중합금 대형 주물소", cost: { heavyAlloy: 20000, nanoSteel: 10000 }, inputs: { scrapMetal: 500, magnet: 100, energy: 800 }, outputs: { heavyAlloy: 200.0 }, count: 0, reqLevel: 36 },
        { id: 115, name: "지열 플럭스 우물", cost: { nanoSteel: 30000, fluxEnergy: 10000 }, inputs: { energy: 1200 }, outputs: { fluxEnergy: 300.0 }, count: 0, reqLevel: 38 },
        { id: 116, name: "플라즈마 정제탑", cost: { fluxEnergy: 50000, fluxLogic: 500 }, inputs: { chargedCrystal: 1000, energy: 3000 }, outputs: { plasmaCore: 2.0 }, count: 0, reqLevel: 23},
        { id: 117, name: "마그네타 빔 타워", cost: { nanoSteel: 100000, plasmaCore: 100 }, inputs: { plasmaCore: 1 }, outputs: { energy: 50000 }, count: 0, reqLevel: 42 },
        { id: 118, name: "반물질 금속 파쇄기", cost: { nanoSteel: 200000, plasmaCore: 500 }, inputs: { energy: 10000 }, outputs: { scrapMetal: 10000.0, magnet: 2000.0 }, count: 0, reqLevel: 45 },
        { id: 119, name: "레일건 포신 가공기", cost: { heavyAlloy: 1000000, nanoSteel: 500000 }, inputs: { nanoSteel: 5000, energy: 15000 }, outputs: { plasmaCore: 10.0 }, count: 0, reqLevel: 48 },
        { id: 120, name: "행성 핵 에너지 빨대", cost: { plasmaCore: 5000, nanoSteel: 2000000 }, inputs: null, outputs: { energy: 200000, fluxEnergy: 5000.0 }, count: 0, reqLevel: 48 }
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
        { id: "a_core_sync", name: "행성핵 동기화", desc: "행성 핵 에너지 빨대 출력 2배 증가", cost: { plasmaCore: 1000, nanoSteel: 500000 }, type: 'building', target: [120], value: 2.0, reqResearch: "a_plasma_catalyst" },
        { id: "a_concrete_hardening", name: "자기장 양생 공법", desc: "자력 콘크리트 배합기(ID 121) 생산 속도 3배 증가", cost: { heavyAlloy: 5000, magnet: 20000 }, type: 'building', target: [121], value: 3.0, reqResearch: "a_alloy_mastery" },
        { id: "a_logic_optimization", name: "플럭스 연산 최적화", desc: "플럭스 연산 서버(ID 122)의 생산 효율 2.5배 증가", cost: { nanoSteel: 20000, fluxEnergy: 10000 }, type: 'building', target: [122], value: 2.5, reqResearch: "a_nano_assembly" },
        { id: "a_structure_efficiency", name: "나노 골조 설계", desc: "자력 콘크리트 소모 시설의 재료 사용량 30% 감소", cost: { fluxLogic: 1000, nanoSteel: 50000 }, type: 'consumption', target: [111, 119, 120], value: 0.7, reqResearch: "a_concrete_hardening" }
    ]
};