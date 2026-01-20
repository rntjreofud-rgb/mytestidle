export const htreaData = {
    initialResources: ['brokenParts', 'radiation'],
    
    // === 하우스 업그레이드 (Lv.0 ~ 50) ===
    houseStages: [
            
    // 0~9: 초기 폐허 생존 (기초 자원)
    { name: "무너진 방공호", desc: "먼지와 방사능뿐입니다. 일단 입구를 확보해야 합니다.", req: { brokenParts: 500 } },
    { name: "녹슨 환풍구", desc: "공기 정화 장치를 수리하여 숨을 쉴 수 있게 만듭니다.", req: { brokenParts: 5000 } },
    { name: "낡은 전선 복구", desc: "수천 미터의 구리선을 다시 이어야 합니다.", req: { scrapCopper: 10000, energy: 500 } },
    { name: "방사능 차폐막", desc: "외부의 오염된 공기를 완벽히 차단합니다.", req: { leadPlate: 20000, radiation: 5000 } },
    { name: "지하 거주구역", desc: "잠을 잘 수 있는 개인 공간을 마련했습니다.", req: { brokenParts: 100000, leadPlate: 50000 } },
    { name: "오염수 필터링", desc: "지하수를 정제하여 더 많은 식수를 확보합니다.", req: { pureWater: 200000, scrapCopper: 100000 } },
    { name: "납 보강 외벽", desc: "강력한 방사능 폭풍에 대비해 벽을 두껍게 보강합니다.", req: { leadPlate: 500000, brokenParts: 1000000 } },
    { name: "비상 발전기", desc: "폐기물을 태워 기지의 전력을 안정화합니다.", req: { energy: 10000, scrapCopper: 500000 } },
    { name: "기계 해체 작업대", desc: "더 복잡한 기계를 뜯어낼 수 있는 정밀 도구를 갖춥니다.", req: { brokenParts: 5000000, scrapCopper: 1000000 } },
    { name: "지하 수경 재배실", desc: "오염되지 않은 흙을 찾아 식물을 키우기 시작합니다.", req: { pureWater: 1000000, bioSample: 10000 } },

    // 10~19: 지구의 기억 (목탄, 정화 구역 가동)
    { name: "생태 복원 구역", desc: "정화된 토양에서 지구의 식물이 자라기 시작합니다.", req: { bioSample: 50000, wood: 10000 } },
    { name: "골재 재처리장", desc: "도시의 잔해를 부숴 돌을 생산합니다.", req: { stone: 100000, energy: 50000 } },
    { name: "구시대 용광로", desc: "인양된 도면을 바탕으로 철과 구리판을 생산합니다.", req: { ironPlate: 500000, copperPlate: 500000 } },
    { name: "정화된 묘목장", desc: "기지 내부를 푸른 숲으로 채워 산소를 공급합니다.", req: { wood: 1000000, bioSample: 200000 } },
    { name: "납 유리 관측창", desc: "방사능을 막으면서 밖을 내다볼 수 있는 창을 만듭니다.", req: { leadPlate: 2000000, stone: 5000000 } },
    { name: "데이터 아카이브", desc: "과거 인류의 지식이 담긴 저장 장치들을 수집합니다.", req: { dataCore: 5000, scrapCopper: 10000000 } },
    { name: "나노 입자 연구소", desc: "물질을 분자 단위로 재조합하는 실험을 시작합니다.", req: { microChip: 5000, energy: 100000 } },
    { name: "중공업 조립동", desc: "대형 부품을 제작하기 위해 천장을 높입니다.", req: { leadPlate: 10000000, ironPlate: 5000000 } },
    { name: "방사능 농축기", desc: "오염물을 역이용해 강력한 에너지를 뽑아냅니다.", req: { radiation: 5000000, energy: 500000 } },
    { name: "메모리 뱅크 복구", desc: "소실되었던 항법 데이터를 일부 복원합니다.", req: { dataCore: 20000, microChip: 10000 } },

    // 20~29: 재건의 시대 (강철/플라스틱/유리 본격 소모)
    { name: "강철 복원 공정", desc: "인양된 유물로 강철을 생산합니다.", req: { steel: 50000, leadPlate: 50000000, stone: 10000000 } },
    { name: "반도체 라인 가동", desc: "버려진 공장에서 칩을 찍어냅니다.", req: { microChip: 50000, scrapCopper: 100000000 } },
    { name: "심부 지각 채굴정", desc: "지하 깊은 곳에서 철광석과 석탄을 퍼올립니다.", req: { ironOre: 5000000, coal: 5000000, pureWater: 5000000 } },
    { name: "자동 수리 드론", desc: "기지의 노후화된 부분을 수리합니다.", req: { microChip: 100000, brokenParts: 50000000 } },
    // [수정] 자원량 현실화
    { name: "고온 플라즈마 화로", desc: "방사능과 전기를 결합해 초고온을 만듭니다.", req: { energy: 2000000, radiation: 5000000, oil: 50000 } },
    { name: "인공지능 메인프레임", desc: "거대 지능을 깨웁니다.", req: { dataCore: 100000, microChip: 200000, plastic: 500000 } },
    { name: "강화 강철 선체", desc: "방주의 뼈대를 강철로 단단히 다집니다.", req: { steel: 500000, leadPlate: 10000000, circuit: 50000 } },
    { name: "생체 연산 모듈", desc: "기계와 유기물을 융합합니다.", req: { bioSample: 5000000, dataCore: 500000, sulfur: 2000000 } },
    // Lv 28: 공허 수정 필요 (ID 346 건물이 27레벨에 해금되므로 가능)
    { name: "공허 수정 합성조", desc: "물리 법칙을 무시하는 수정을 만듭니다.", req: { voidCrystal: 50, energy: 10000000, glass: 5000000 } },
    { name: "중력 역전 테스트", desc: "도시 전체를 공중에 띄우는 실험에 성공합니다.", req: { voidCrystal: 200, steel: 5000000, titaniumPlate: 2000 } },

    // 30~39: 인류의 유산 (고티어 자원: 티타늄판, 반도체, 연산)
    { name: "프로세서 조립라인", desc: "고성능 연산 장치를 생산합니다.", req: { processor: 10000, microChip: 2000000, titaniumPlate: 50000 } },
    { name: "반물질 차폐 용기", desc: "우주 에너지를 억제합니다.", req: { leadPlate: 1000000000, steel: 50000000, advCircuit: 10000 } },
    // [수정] 우라늄 소모량 증가 (ID 326이 32레벨 해금으로 변경됨)
    { name: "지구 생태계 복원", desc: "행성 전체에 산소가 흐르기 시작합니다.", req: { wood: 50000000, bioSample: 20000000, uraniumOre: 5000 } },
    { name: "퀀텀 데이터 링크", desc: "새로운 도면을 얻습니다.", req: { dataCore: 1000000, processor: 50000, quantumData: 100 } },
    { name: "공허 에너지 엔진", desc: "공간을 밀어내는 추진력을 얻습니다.", req: { voidCrystal: 1000, radiation: 100000000, nanobots: 2000 } },
    { name: "나노 입자 코팅", desc: "보랏빛 은하수처럼 빛나는 장갑을 입힙니다.", req: { microChip: 5000000, steel: 100000000, gravityModule: 500 } },
    { name: "시간 왜곡 시뮬레이터", desc: "탈출 후의 수만 년을 1초 만에 계산합니다.", req: { dataCore: 5000000, processor: 200000, aiCore: 500 } },
    { name: "초고압 여과 탱크", desc: "행성 최후의 오염까지 씻어냅니다.", req: { pureWater: 100000000, leadPlate: 500000000, advAlloy: 5000 } },
    { name: "뉴 에덴의 설계도", desc: "우리의 고향을 찾았습니다.", req: { voidCrystal: 5000, processor: 500000, quantumData: 5000 } },
    { name: "중력 닻 해제", desc: "구속 장치를 해제합니다.", req: { steel: 500000000, energy: 10000000, gravityModule: 5000 } },

    // 40~50: 폐허 탈출 (최종 공정: 합금, 워프코어, 뉴에덴)
    { name: "최종 항법 동기화", desc: "인류의 모든 지식을 주입합니다.", req: { dataCore: 10000000, processor: 1000000, advAlloy: 50000 } },
    { name: "산소 발생 코어", desc: "영겁의 세월을 견딜 심장입니다.", req: { bioSample: 100000000, wood: 200000000, warpCore: 100 } },
    { name: "공허 수정 과부하", desc: "수정들이 눈부신 빛을 냅니다.", req: { voidCrystal: 20000, energy: 50000000, quantumData: 50000 } },
    { name: "선실 가압 시스템", desc: "내부 공기 누출을 확인합니다.", req: { brokenParts: 5000000000, microChip: 50000000, nanobots: 100000 } },
    { name: "과거의 기억 전송", desc: "은하 전역으로 신호를 송출합니다.", req: { dataCore: 20000000, scrapCopper: 1000000000, aiCore: 5000 } },
    { name: "방사능 폭발 추진", desc: "독을 약으로 바꾸어 비상합니다.", req: { radiation: 500000000, energy: 100000000, warpCore: 500 } },
    { name: "강철의 방주 완성", desc: "거대 방주가 빛을 냅니다.", req: { steel: 100000000, leadPlate: 2000000000, advAlloy: 200000 } },
    { name: "뉴 에덴 카운트다운", desc: "안녕, 나의 멸망한 요람.", req: { voidCrystal: 100000, processor: 5000000, quantumData: 200000 } },
    { name: "차원 도약 준비", desc: "우주의 문이 열립니다.", req: { dataCore: 50000000, energy: 500000000, warpCore: 2000 } },
    { name: "별의 숨결 주입", desc: "엔진이 생명처럼 박동합니다.", req: { voidCrystal: 500000, bioSample: 500000000, aiCore: 20000 } },
    { name: "흐트레아 재건 성공", desc: "멸망한 지구를 떠나 우주의 신화가 되었습니다.", req: { voidCrystal: 1000000, dataCore: 100000000, steel: 1000000000, warpCore: 10000 }, unlock: "end" }

    ],

    // === 건물 리스트 (ID 300번대) ===
    buildings: [
       { id: 300, name: "잔해 해체 드론", cost: { brokenParts: 15 }, inputs: null, outputs: { brokenParts: 2.0 }, count: 0, reqLevel: 0 },
        { id: 301, name: "방사능 포집기", cost: { brokenParts: 100 }, inputs: null, outputs: { radiation: 1.0 }, count: 0, reqLevel: 1 },
        { id: 302, name: "여과 정수기", cost: { brokenParts: 200, radiation: 50 }, inputs: { radiation: 2 }, outputs: { pureWater: 3.0 }, count: 0, reqLevel: 1 },
        { id: 303, name: "고철 추출기", cost: { pureWater: 500, brokenParts: 1000 }, inputs: { brokenParts: 10 }, outputs: { scrapCopper: 5.0 }, count: 0, reqLevel: 1 },
        { id: 304, name: "납 제련소", cost: { scrapCopper: 500 }, inputs: { brokenParts: 20, radiation: 5 }, outputs: { leadPlate: 4.0 }, count: 0, reqLevel: 2 },
        { id: 305, name: "폐기물 발전소", cost: { leadPlate: 300 }, inputs: { brokenParts: 50 }, outputs: { energy: 150 }, count: 0, reqLevel: 2 },
        { id: 306, name: "바이오 실험실", cost: { pureWater: 2000, leadPlate: 500 }, inputs: { pureWater: 10, energy: 100 }, outputs: { bioSample: 2.0 }, count: 0, reqLevel: 9 },
        { id: 311, name: "폐건물 골재 파쇄기", cost: { brokenParts: 5000, scrapCopper: 1000 }, inputs: { energy: 100 }, outputs: { stone: 10.0 }, count: 0, reqLevel: 10 },
        { id: 307, name: "메모리 뱅크 복구기", cost: { scrapCopper: 5000, bioSample: 100 }, inputs: { energy: 300 }, outputs: { dataCore: 1.0 }, count: 0, reqLevel: 15 },
        { id: 310, name: "오염 토양 정화구역", cost: { pureWater: 1000, bioSample: 100 }, inputs: { pureWater: 10, energy: 50 }, outputs: { wood: 5.0 }, count: 0, reqLevel: 12 },
        { id: 312, name: "고대 용광로 인양본", cost: { leadPlate: 2000, dataCore: 50 }, inputs: { brokenParts: 50, energy: 200 }, outputs: { ironPlate: 3.0, copperPlate: 3.0 }, count: 0, reqLevel: 12 },
        { id: 313, name: "심부 지각 채굴정", cost: { leadPlate: 5000, microChip: 100 }, inputs: { energy: 500 }, outputs: { ironOre: 20.0, coal: 20.0 }, count: 0, reqLevel: 22 },
        { id: 316, name: "고대 자동화 채석장", cost: { leadPlate: 50000, scrapCopper: 20000 }, inputs: { energy: 1000 }, outputs: { stone: 5000.0 }, count: 0, reqLevel: 18 },
        { id: 317, name: "대형 고철 용해로", cost: { leadPlate: 100000, steel: 5000 }, inputs: { ironOre: 50, coal: 30, energy: 2000 }, outputs: { ironPlate: 1000.0, copperPlate: 1000.0 }, count: 0, reqLevel: 20 },
        { id: 318, name: "오염 해수 담수화 플랜트", cost: { pureWater: 50000, bioSample: 5000 }, inputs: { radiation: 500, energy: 3000 }, outputs: { pureWater: 10000.0 }, count: 0, reqLevel: 22 },
        { id: 319, name: "심해 유전 인양정", cost: { steel: 20000, microChip: 500 }, inputs: { energy: 5000 }, outputs: { oil: 2000.0 }, count: 0, reqLevel: 24 },
        
        
        { id: 320, name: "고대 화학 복합단지", cost: { steel: 50000, pureWater: 100000 }, inputs: { oil: 500, energy: 8000 }, outputs: { plastic: 500.0, sulfur: 300.0, rocketFuel: 100.0 }, count: 0, reqLevel: 26 },
        
        { id: 321, name: "유물 회로 인쇄기", cost: { microChip: 2000, dataCore: 500 }, inputs: { copperPlate: 500, plastic: 200, energy: 10000 }, outputs: { circuit: 100.0, microChip: 10.0 }, count: 0, reqLevel: 16 },
        { id: 322, name: "버려진 강철 압연기", cost: { steel: 50000, leadPlate: 500000 }, inputs: { ironPlate: 2000, coal: 1000, energy: 12000 }, outputs: { steel: 1000.0 }, count: 0, reqLevel: 20 },
        { id: 346, name: "불안정한 공허 균열", cost: { plastic: 50000, circuit: 10000 }, inputs: { energy: 100000, radiation: 10000 }, outputs: { voidCrystal: 0.5 }, count: 0, reqLevel: 27 },
        { id: 323, name: "대형 납 유리 용해로", cost: { leadPlate: 1000000, stone: 500000 }, inputs: { stone: 10000, energy: 15000 }, outputs: { glass: 1000.0 }, count: 0, reqLevel: 32 },
        { id: 324, name: "티타늄 잔해 정제소", cost: { steel: 200000, voidCrystal: 10 }, inputs: { brokenParts: 50000,sulfur: 100, energy: 20000 }, outputs: { titaniumPlate: 200.0 }, count: 0, reqLevel: 33 },
        { id: 325, name: "고대 반도체 클린룸", cost: { microChip: 50000, processor: 1000 }, inputs: { circuit: 500, glass: 200, energy: 30000 }, outputs: { advCircuit: 100.0 }, count: 0, reqLevel: 35 },
        { id: 326, name: "방사능 농축 가속기", cost: { leadPlate: 5000000, voidCrystal: 50 }, inputs: { radiation: 50000, sulfur: 200, energy: 50000 }, outputs: { uraniumOre: 200.0 }, count: 0, reqLevel: 32 },
        { id: 327, name: "고대 연산 센터", cost: { processor: 5000, dataCore: 20000 }, inputs: { advCircuit: 50, energy: 80000 }, outputs: { processor: 500.0 }, count: 0, reqLevel: 38 },
        { id: 328, name: "나노 입자 복제기", cost: { processor: 10000, steel: 1000000 }, inputs: { titaniumPlate: 500, energy: 100000 }, outputs: { nanobots: 100.0 }, count: 0, reqLevel: 36 },
        { id: 329, name: "중력 변조 엔진 조립대", cost: { voidCrystal: 500, titaniumPlate: 50000 }, inputs: { titaniumPlate: 1000, voidCrystal: 10, energy: 150000 }, outputs: { gravityModule: 5.0 }, count: 0, reqLevel: 41 },
        { id: 330, name: "고대 AI 메인프레임", cost: { processor: 50000, dataCore: 100000 }, inputs: { advCircuit: 200, dataCore: 1000, energy: 200000 }, outputs: { aiCore: 2.0 }, count: 0, reqLevel: 42 },
        
        // [수정] outputs에 scrapCopper 대량 추가 (10억개 수급용)
        { id: 336, name: "도시 잔해 파쇄 플랜트", cost: { steel: 1000000, titaniumPlate: 100000 }, inputs: { energy: 500000 }, outputs: { brokenParts: 1000000.0, scrapCopper: 100000.0 }, count: 0, reqLevel: 43 }, 
        
        { id: 331, name: "공허 에너지 추출기", cost: { voidCrystal: 2000, aiCore: 100 }, inputs: { radiation: 500000, energy: 300000 }, outputs: { voidCrystal: 20.0 }, count: 0, reqLevel: 43 },
        { id: 332, name: "양자 데이터 동기화기", cost: { dataCore: 500000, aiCore: 500 }, inputs: { dataCore: 10000, aiCore: 1, energy: 500000 }, outputs: { quantumData: 100.0 }, count: 0, reqLevel: 44 },
        { id: 333, name: "최종 합금 용광로", cost: { titaniumPlate: 1000000, nanobots: 10000 }, inputs: { titaniumPlate: 5000, steel: 5000, uraniumOre: 100, energy: 800000 }, outputs: { advAlloy: 50.0 }, count: 0, reqLevel: 45 },
        { id: 334, name: "워프 추진기 유물", cost: { advAlloy: 10000, gravityModule: 1000 }, inputs: { rocketFuel: 2000, uraniumOre: 500, energy: 1000000 }, outputs: { warpCore: 1.0 }, count: 0, reqLevel: 46 },
        { id: 335, name: "뉴 에덴의 심장", cost: { warpCore: 5000, quantumData: 100000 }, inputs: null, outputs: { energy: 10000000, radiation: -500000 }, count: 0, reqLevel: 48 },
        { id: 337, name: "대형 폐기물 처리장", cost: { leadPlate: 10000, scrapCopper: 5000 }, inputs: { energy: 1000 }, outputs: { brokenParts: 5000.0, scrapCopper: 500.0 }, count: 0, reqLevel: 21 },     
        { id: 338, name: "중앙 수경재배 단지", cost: { pureWater: 100000, plastic: 5000 }, inputs: { pureWater: 5000, energy: 3000 }, outputs: { bioSample: 1000.0, wood: 2000.0 }, count: 0, reqLevel: 25 },
        { id: 339, name: "지열 발전 플랜트", cost: { steel: 30000, glass: 10000 }, inputs: { pureWater: 10000 }, outputs: { energy: 50000 }, count: 0, reqLevel: 27 },
        { id: 315, name: "기초 반도체 조립기", cost: { microChip: 1000, steel: 100000 }, inputs: { microChip: 50, energy: 15000 }, outputs: { processor: 10.0 }, count: 0, reqLevel: 29 }, 
        { id: 340, name: "데이터 센터 유적", cost: { processor: 2000, advCircuit: 500 }, inputs: { energy: 40000 }, outputs: { dataCore: 500.0 }, count: 0, reqLevel: 34 },
        { id: 341, name: "복합 합금 정제소", cost: { titaniumPlate: 10000, steel: 500000 }, inputs: { ironOre: 5000, coal: 5000, energy: 60000 }, outputs: { steel: 5000.0, titaniumPlate: 500.0 }, count: 0, reqLevel: 37 },
        { id: 342, name: "핵분열 재가동로", cost: { leadPlate: 10000000, advCircuit: 5000 }, inputs: { uraniumOre: 100, pureWater: 50000 }, outputs: { energy: 1000000, radiation: 1000 }, count: 0, reqLevel: 39 },
        { id: 343, name: "나노 입자 군집 탱크", cost: { nanobots: 1000, titaniumPlate: 500000 }, inputs: { processor: 1000, energy: 200000 }, outputs: { nanobots: 500.0 }, count: 0, reqLevel: 43 },
        { id: 344, name: "차원 간섭 관측소", cost: { aiCore: 1000, voidCrystal: 5000 }, inputs: { quantumData: 10, energy: 1000000 }, outputs: { quantumData: 500.0, dataCore: 10000.0 }, count: 0, reqLevel: 45 },      
        { id: 345, name: "오메가 공정 센터", cost: { advAlloy: 50000, warpCore: 10 }, inputs: { brokenParts: 1000000, energy: 5000000 }, outputs: { advAlloy: 1000.0, processor: 2000.0, nanobots: 1000.0 }, count: 0, reqLevel: 47 }
    ],

    // === 연구 리스트 ===
    researchList: [
            { id: "h_scavenge", name: "고급 스캐닝", desc: "수동 해체 효율 3배 증가", cost: { brokenParts: 500 }, type: 'manual', value: 3, reqResearch: null },
        
        { id: "h_mag_separation", name: "자력 선별 기술", desc: "고철 추출기 생산 속도 2배 증가", cost: { scrapCopper: 1000, energy: 100 }, type: 'building', target: [303], value: 2.0, reqResearch: "h_scavenge" },
        
        { id: "h_filter", name: "나노 필터", desc: "방사능 포집 및 정수 시설 속도 3배 증가", cost: { pureWater: 1000 }, type: 'building', target: [301, 302, 318], value: 3.0, reqResearch: "h_scavenge" },
        
        { id: "h_waste_burn", name: "완전 연소", desc: "폐기물 발전소 및 대형 처리장의 전력 효율 2배", cost: { brokenParts: 5000, leadPlate: 1000 }, type: 'building', target: [305, 337], value: 2.0, reqResearch: "h_mag_separation" },
       
        { id: "h_lead_lining", name: "방연 가공", desc: "기초 가공 건물들의 방사능 소모량 50% 감소", cost: { leadPlate: 2000 }, type: 'consumption', target: [302, 304, 317], value: 0.5, reqResearch: "h_filter" },
        
        { id: "h_restoration", name: "생태 복원 프로젝트", desc: "지구 자원(흙, 나무, 바이오) 복구 시설 속도 4배 증가", cost: { bioSample: 5000 }, type: 'building', target: [306, 310, 311, 338], value: 4.0, reqResearch: "h_filter" },
        
        { id: "h_automation_logic", name: "기초 자동화 논리", desc: "초반 건물(파쇄기, 용광로)의 에너지 소모량 20% 감소", cost: { dataCore: 500, scrapCopper: 10000 }, type: 'energyEff', target: [311, 312, 304], value: 0.8, reqResearch: "h_waste_burn" },

        { id: "h_old_tech", name: "과거 기술 복구", desc: "고대 용광로 및 채굴정 생산 속도 3.5배 증가", cost: { dataCore: 1000, microChip: 200 }, type: 'building', target: [312, 313, 317], value: 3.5, reqResearch: "h_restoration" },
        
        { id: "h_energy_recycling", name: "폐기물 재순환", desc: "폐기물 발전 시설의 전력 생산량 3배 증가", cost: { brokenParts: 100000, leadPlate: 50000 }, type: 'building', target: [305, 337], value: 3.0, reqResearch: "h_lead_lining" },
      
        { id: "h_overclock", name: "회로 오버클럭", desc: "연산 및 인쇄 장치 속도 3배 증가", cost: { dataCore: 100, microChip: 50 }, type: 'building', target: [307, 321], value: 3.0, reqResearch: "h_lead_lining" },

        { id: "h_steel_salvage", name: "강철 제련 복원", desc: "강철 복원 시설 생산 속도 4배 증가", cost: { microChip: 1000, leadPlate: 20000 }, type: 'building', target: [314, 322, 341], value: 4.0, reqResearch: "h_old_tech" },
        
        { id: "h_chem_catalyst", name: "고분자 촉매", desc: "화학 단지 및 유전 인양 속도 3배 증가", cost: { plastic: 5000, oil: 10000 }, type: 'building', target: [319, 320], value: 3.0, reqResearch: "h_steel_salvage" },
        
        { id: "h_deep_oil", name: "심해 시추 기술", desc: "유전 및 화학 시설의 에너지 소모량 30% 감소", cost: { steel: 10000, microChip: 2000 }, type: 'energyEff', target: [319, 320], value: 0.7, reqResearch: "h_chem_catalyst" },

        { id: "h_data_mining", name: "심층 데이터 복구", desc: "회로 인쇄 및 데이터 복구 속도 4배 증가", cost: { dataCore: 5000, microChip: 5000 }, type: 'building', target: [307, 321, 340], value: 4.0, reqResearch: "h_overclock" },
        
        { id: "h_glass_strength", name: "강화 납 유리", desc: "납 유리 용해로 생산 속도 3배 및 돌 소모 40% 감소", cost: { stone: 500000, leadPlate: 200000 }, type: 'building', target: [323], value: 3.0, reqResearch: "h_restoration" },

        { id: "h_clean_room", name: "무균 공정", desc: "반도체 클린룸 및 기초 조립기 속도 3배 증가", cost: { glass: 10000, pureWater: 50000 }, type: 'building', target: [315, 325], value: 3.0, reqResearch: "h_data_mining" },
       
        { id: "h_titanium_salvage", name: "티타늄 파편 재처리", desc: "티타늄 정제소 및 합금 정제소 속도 4배 증가", cost: { steel: 100000, voidCrystal: 20 }, type: 'building', target: [324, 341], value: 4.0, reqResearch: "h_steel_salvage" },

        { id: "h_nano_replication", name: "나노 분자 복제", desc: "나노 입자 및 반도체 시설 속도 3.5배 증가", cost: { microChip: 50000, processor: 1000 }, type: 'building', target: [325, 328, 343], value: 3.5, reqResearch: "h_clean_room" },
        
        { id: "h_void_catalyst", name: "공허 촉매 합성", desc: "공허 수정 합성 시설 속도 5배 증가", cost: { voidCrystal: 5 }, type: 'building', target: [309, 331, 346], value: 5.0, reqResearch: "h_overclock" },

        { id: "h_rad_acceleration", name: "방사능 입자 가속", desc: "농축기 및 우라늄 시설 속도 4배 증가", cost: { radiation: 1000000, leadPlate: 500000 }, type: 'building', target: [326, 342], value: 4.0, reqResearch: "h_filter" },
        
        { id: "h_nuclear_safety", name: "원자력 안전 프로토콜", desc: "핵분열 재가동로 에너지 생산량 2배 증가", cost: { leadPlate: 5000000, advCircuit: 2000 }, type: 'building', target: [342], value: 2.0, reqResearch: "h_rad_acceleration" },

        { id: "h_ancient_ai", name: "고대 지성 복원", desc:"고대 연산 센터 및 AI 속도 3배 증가", cost:{ dataCore :10000 , processor :5 , microChip :1 } , type :'building' , target :[327 ,330 ] , value :3.0 , reqResearch :"h_nano_replication" },

        { id: "h_scavenge_mastery", name: "해체의 달인", desc: "모든 흐트레아 시설의 기계잔해 소모량 60% 감소", cost: { brokenParts: 10000000, microChip: 100000 }, type: 'consumption', target: [300, 303, 312, 317, 324], value: 0.4, reqResearch: "h_deep_oil" },
    
        { id: "h_gravity_anchor", name: "중력 닻 해제", desc: "중력 변조 및 워프 시설 속도 2.5배 증가", cost: { voidCrystal: 500, gravityModule: 50 }, type: 'building', target: [329, 334], value: 2.5, reqResearch: "h_void_catalyst" },

        { id: "h_quantum_sync", name: "양자 데이터 동기", desc: "양자 데이터 시설 속도 4배 증가", cost: { dataCore: 1000000, aiCore: 200 }, type: 'building', target: [332, 344], value: 4.0, reqResearch: "h_ancient_ai" },
        
        { id: "h_dim_observation", name: "차원 관측", desc: "차원 간섭 관측소의 데이터 생산량 3배 증가", cost: { quantumData: 500, aiCore: 1000 }, type: 'building', target: [344], value: 3.0, reqResearch: "h_quantum_sync" },

        { id: "h_alloy_final", name: "최종 합금 배합", desc: "최종 합금 용광로 및 오메가 센터 속도 3배 증가", cost: { titaniumPlate: 500000, nanobots: 5000 }, type: 'building', target: [333, 345], value: 3.0, reqResearch: "h_titanium_salvage" },

        { id: "h_fuel_compression", name: "연료 압축 기술", desc: "로켓 연료 생산량 5배 증가", cost: { plastic: 100000, oil: 500000 }, type: 'building', target: [320], value: 5.0, reqResearch: "h_chem_catalyst" },

        { id: "h_energy_efficiency", name: "회로 저전력화", desc: "모든 흐트레아 시설의 전력 소모량 40% 감소", cost: { microChip: 500000, dataCore: 500000 }, type: 'energyEff', target: [300, 306, 315, 320, 325, 330, 333, 334, 342, 345], value: 0.6, reqResearch: "h_nano_replication" },

        { id: "h_void_eco", name: "공허 에너지 절약", desc: "공허 수정 소모 시설의 재료 사용량 30% 감소", cost: { voidCrystal: 1000, aiCore: 500 }, type: 'consumption', target: [309, 329, 331, 346], value: 0.7, reqResearch: "h_void_catalyst" },

        { id: "h_mass_breakdown", name: "대량 분쇄 공정", desc: "도시 잔해 파쇄 플랜트의 생산량 5배 증가", cost: { steel: 5000000, titaniumPlate: 1000000 }, type: 'building', target: [336], value: 5.0, reqResearch: "h_titanium_salvage" },

        { id: "h_click_final", name: "차원 해체 장치", desc: "수동 채집 및 생산 효율 극대화 (+500)", cost: { voidCrystal: 5000, quantumData: 2000 }, type: 'manual', value: 500, reqResearch: "h_void_catalyst" },

        { id: "h_eden_power", name: "에덴의 무한 동력", desc: "뉴 에덴의 심장 전력 생산량 2.5배 증가", cost: { warpCore: 10000, quantumData: 100000 }, type: 'building', target: [335], value: 2.5, reqResearch: "h_quantum_sync" },

        { id: "h_copper_molecular", name: "구리 분자 재배열", desc: "구리 관련 시설(추출기, 용광로) 생산 속도 3배 증가", cost: { scrapCopper: 500000, energy: 50000 }, type: 'building', target: [303, 337, 312, 317], value: 3.0, reqResearch: "h_old_tech" },
        
        { id: "h_plasma_containment", name: "플라즈마 가동", desc: "고온 플라즈마 화로(House Upgrade) 가동을 돕기 위해 전력 생산 시설 효율 20% 증가", cost: { plastic: 50000, magnet: 1000 }, type: 'building', target: [305, 339, 342], value: 1.2, reqResearch: "h_nuclear_safety" },
        
        { id: "h_void_siphon", name: "공허 사이펀", desc: "공허 에너지 추출기 및 균열의 생산 속도 3배 증가", cost: { voidCrystal: 500, gravityModule: 50 }, type: 'building', target: [331, 346], value: 3.0, reqResearch: "h_void_catalyst" },

        { id: "h_warp_stabilizer", name: "워프장 안정화", desc: "워프 추진기 유물 속도 4배 증가 및 에너지 소모 30% 감소", cost: { warpCore: 50, quantumData: 5000 }, type: 'building', target: [334], value: 4.0, reqResearch: "h_gravity_anchor" },

        { id: "h_omega_protocol", name: "오메가 프로토콜", desc: "오메가 공정 센터 생산량 5배 증가", cost: { advAlloy: 100000, aiCore: 10000 }, type: 'building', target: [345], value: 5.0, reqResearch: "h_alloy_final" },

        { id: "h_final_arch", name: "인류 최후의 설계", desc: "흐트레아의 모든 시설 생산 속도 2배 증가", cost: { warpCore: 50, aiCore: 5000, dataCore: 10000000 }, type: 'building', target: [300,301,302,303,304,305,306,307,310,311,312,313,314,315,316,317,318,319,320,321,322,323,324,325,326,327,328,329,330,331,332,333,334,335,336,337,338,339,340,341,342,343,344,345,346], value: 2.0, reqResearch: "h_eden_power" },
    ]
};