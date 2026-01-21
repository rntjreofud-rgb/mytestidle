export const elements = {
    viewDashboard: document.getElementById('view-dashboard'),
    viewPower: document.getElementById('view-power'),
    viewResearch: document.getElementById('view-research'),
    navDashboard: document.getElementById('nav-dashboard'),
    viewTechTree: document.getElementById('view-tech-tree'),
    navTechTree: document.getElementById('nav-tech-tree'),
    navPower: document.getElementById('nav-power'),
    navResearch: document.getElementById('nav-research'),

    viewLegacy: document.getElementById('view-legacy'),
    navLegacy: document.getElementById('nav-legacy'),

    dashPowerPanel: document.getElementById('dash-power-panel'),
    dashPowerText: document.getElementById('dash-power-text'),
    dashPowerFill: document.getElementById('dash-power-fill'),
    logList: document.getElementById('game-log-list'),
    resGrid: document.querySelector('.resource-grid'),
    houseName: document.getElementById('header-title'),
    houseDesc: document.getElementById('house-desc'),
    upgradeBtn: document.getElementById('upgrade-btn'),
    btns: {
        wood: document.getElementById('btn-gather-wood'),
        stone: document.getElementById('btn-gather-stone'),
        coal: document.getElementById('btn-gather-coal'),
        ironOre: document.getElementById('btn-gather-iron'),
        copperOre: document.getElementById('btn-gather-copper'),
        plank: document.getElementById('btn-craft-plank')
    },
    buildingList: document.getElementById('building-list'),
    headerLog: document.getElementById('message-log'),
    powerDisplay: document.getElementById('power-display-text'), 
    powerBar: document.getElementById('power-fill-bar')
};

export const resNames = {
    wood: "🌲 나무", stone: "🪨 돌", coal: "⚫ 석탄", ironOre: "🥈 철광", copperOre: "🥉 구리광", 
    oil: "🛢️ 원유", titaniumOre: "💠 티타늄광", uraniumOre: "💚 우라늄광",
    plank: "🪵 판자", brick: "🧱 벽돌", ironPlate: "⬜ 철판", copperPlate: "🟧 구리판", 
    glass: "🍷 유리", sulfur: "💛 유황", steel: "🏗️ 강철", plastic: "🧪 플라스틱", 
    concrete: "🏢 콘크리트", battery: "🔋 배터리", fuelCell: "☢️ 연료봉",
    gear: "⚙️ 톱니", circuit: "📟 회로", advCircuit: "🔴 고급회로", 
    processor: "🔵 프로세서", aiCore: "🧠 AI코어", rocketFuel: "🚀 로켓연료", 
    nanobots: "🤖 나노봇", warpCore: "🌀 워프코어", energy: "⚡ 전력",
    titaniumPlate: "🟦 티타늄판", optics: "🔭 광학렌즈", advAlloy: "🛡️ 고급합금",
    quantumData: "💾 양자데이터", gravityModule: "🛸 중력모듈",

    bioFiber: "🌿 유기섬유", spore: "🍄 포자", yeast: "🦠 효모", livingWood: "🌳 생명목",
    bioFuel: "🧪 바이오연료", rootBrick: "🪵 뿌리벽돌", neuralFiber: "🧠 신경섬유",
    mutantCell: "🌑 변이세포", geneticCode: "🧬 유전코드", pheromone: "🏺 페로몬",
    biosphereCore: "🌐 생태코어",
    
    scrapMetal: "🔩 고철파편", magnet: "🧲 자석", chargedCrystal: "💎 대전수정",
    heavyAlloy: "🛡️ 중합금", fluxEnergy: "🌀 플럭스에너지", nanoSteel: "🌑 나노강철",
    plasmaCore: "⚛️ 플라즈마코어", magConcrete: "🧱 자력콘크리트", fluxLogic: "💾 플럭스회로",


    brokenParts: "🔩 기계잔해",
    radiation: "☢️ 방사능",
    pureWater: "💧 정제수",
    scrapCopper: "🧵 구리조각",
    leadPlate: "🧱 납판",
    voidCrystal: "🔮 공허수정",
    bioSample: "🧫 생체표본", 
    dataCore: "💽 데이터코어", 
    microChip: "💳 마이크로칩" 
};

export const resourceGroups = {
    // === [1] 지구 (Earth) 자원 그룹 ===
    earth_raw: { 
        planet: 'earth', title: "⛏️ 원자재 (Raw Materials)", 
        items: ['wood', 'stone', 'coal', 'ironOre', 'copperOre', 'oil', 'titaniumOre', 'uraniumOre'] 
    },
    earth_mat: { 
        planet: 'earth', title: "🧱 가공 자재 (Materials)", 
        items: ['plank', 'brick', 'glass', 'concrete', 'ironPlate', 'copperPlate', 'steel', 'titaniumPlate', 'advAlloy', 'sulfur', 'plastic'] 
    },
    earth_comp: { 
        planet: 'earth', title: "⚙️ 부품 및 첨단 (High-Tech)", 
        items: ['gear', 'circuit', 'battery', 'optics', 'advCircuit', 'processor', 'fuelCell', 'rocketFuel', 'nanobots', 'aiCore', 'quantumData', 'gravityModule', 'warpCore'] 
    },
    // === [2] 아우렐리아 (Aurelia) 자원 그룹 ===
    aurelia_raw: { 
        planet: 'aurelia', title: "🧲 행성 자원 (Aurelia Resources)", 
        items: ['scrapMetal', 'magnet', 'chargedCrystal'] 
    },
    aurelia_mat: { 
        planet: 'aurelia', title: "🌑 특수 제련 (Aurelia Metals)", 
        // ⭐ [수정] magConcrete(자력 콘크리트) 추가됨
        items: ['heavyAlloy', 'fluxEnergy', 'nanoSteel', 'magConcrete'] 
    },
    aurelia_comp: { 
        planet: 'aurelia', title: "⚛️ 에너지 코어 (High-Tech)", 
        // ⭐ [수정] fluxLogic(플럭스 회로) 추가됨 (미리 대비)
        items: ['plasmaCore', 'fluxLogic'] 
    },
    // === [3] 베리디안 (Veridian) 자원 그룹 ===
    veridian_raw: { 
        planet: 'veridian', title: "🌿 유기 자원 (Veridian Life)", 
        items: ['bioFiber', 'spore', 'yeast'] 
    },
    veridian_mat: { 
        planet: 'veridian', title: "🧪 바이오 가공 (Bio-Processing)", 
        items: ['livingWood', 'bioFuel', 'rootBrick', 'mutantCell', 'neuralFiber'] 
    },
    veridian_comp: { 
        planet: 'veridian', title: "🧬 유전 공학 (Evolutionary Tech)", 
        items: ['geneticCode', 'pheromone', 'biosphereCore'] 
    },

       htrea_raw: { 
        planet: 'htrea', title: "🏚️ 폐허 잔해 (Scavenged)", 
        // [수정] 초기 생존에 필수적인 기초 자원들
        items: ['brokenParts', 'radiation', 'pureWater', 'scrapCopper'] 
    },
    htrea_earth: { 
        planet: 'htrea', title: "🌳 복구된 지구 자원 (Restored)", 
        // [수정] 오일, 우라늄 등 채굴/복원된 지구 유래 천연 자원 추가
        items: ['wood', 'stone', 'coal', 'ironOre', 'oil', 'uraniumOre'] 
    },
    htrea_mat: { 
        planet: 'htrea', title: "⚒️ 산업 가공재 (Industrial)", 
        // [수정] 금속 판재, 화학물, 합금, 연료 등 중간 생산품 대거 추가
        items: ['leadPlate', 'ironPlate', 'copperPlate', 'steel', 'glass', 'plastic', 'sulfur', 'titaniumPlate', 'bioSample', 'rocketFuel', 'advAlloy'] 
    },
    htrea_comp: { 
        planet: 'htrea', title: "🌌 초월적 기술 (Transcendence)", 
        // [수정] 회로, 반도체, AI, 나노봇, 공허, 워프 등 하이테크 부품 완비
        items: ['circuit', 'microChip', 'advCircuit', 'processor', 'dataCore', 'aiCore', 'nanobots', 'voidCrystal', 'gravityModule', 'quantumData', 'warpCore'] 
    }

};

export const buildingGroups = {
    extraction: {
        title: "🚜 채집 및 채굴 (Extraction)",
        ids: [
            // [Earth]
            0, 1, 2, 3, 20, 25, 28, 40, 41, 42, 43, 44, 45, 49, 51, 53, 54, 
            // [Aurelia]
            100, 101, 102, 108, 115, 118, 
            // [Veridian]
            200, 201, 202, 208, 210, 211, 220,
            // [Htrea] (잔해 드론, 방사능 포집, 고철 추출, 수경재배, 파쇄기 등)
            300, 301, 303, 306, 310, 311, 313, 316, 319, 331, 336, 337, 338, 344, 346
        ]
    },
    refining: {
        title: "🔥 기초 공정 및 제련 (Refining)",
        ids: [
            // [Earth]
            4, 5, 6, 7, 13, 16, 18, 21, 26, 29, 34, 48, 50, 52, 55, 56, 57, 59, 61, 62, 63, 64, 
            // [Aurelia]
            103, 104, 106, 107, 110, 112, 113, 114, 116, 121, 
            // [Veridian]
            203, 204, 205, 207, 209, 213, 215,
            // [Htrea] (정수기, 제련소, 화학단지, 용광로, 티타늄 정제 등)
            302, 304, 312, 317, 318, 320, 322, 323, 324, 326, 333, 341, 345
        ]
    },
    production: {
        title: "🔬 첨단 제조 및 부품 (Manufacturing)",
        ids: [
            // [Earth]
            9, 15, 22, 24, 27, 31, 32, 33, 35, 36, 37, 38, 47, 58, 60, 
            // [Aurelia]
            109, 119, 122, 
            // [Veridian]
            212, 214, 217, 218,
            // [Htrea] (메모리, 회로, 반도체, AI, 나노봇, 워프, 뉴에덴 등)
            307, 315, 321, 325, 327, 328, 329, 330, 332, 334, 335, 340, 343
        ]
    },
    power: {
        title: "⚡ 에너지 발전 (Power Generation)",
        ids: [
            // [Earth]
            8, 14, 23, 30, 39, 46, 
            // [Aurelia]
            105, 111, 117, 120, 
            // [Veridian]
            206, 216, 219,
            // [Htrea] (폐기물, 지열, 핵분열)
            305, 339, 342
        ]
    }
};