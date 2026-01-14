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
    oil: "🛢️ 원유", titaniumOre: "💎 티타늄광", uraniumOre: "💚 우라늄광",
    plank: "🪵 판자", brick: "🧱 벽돌", ironPlate: "⬜ 철판", copperPlate: "🟧 구리판", 
    glass: "🍷 유리", sulfur: "💛 유황", steel: "🏗️ 강철", plastic: "🧪 플라스틱", 
    concrete: "🏢 콘크리트", battery: "🔋 배터리", fuelCell: "☢️ 연료봉",
    gear: "⚙️ 톱니", circuit: "📟 회로", advCircuit: "🔴 고급회로", 
    processor: "🔵 프로세서", aiCore: "🧠 AI코어", rocketFuel: "🚀 로켓연료", 
    nanobots: "🤖 나노봇", warpCore: "🌀 워프코어", energy: "⚡ 전력",
    titaniumPlate: "💎 티타늄판", optics: "🔭 광학렌즈", advAlloy: "🛡️ 고급합금",
    quantumData: "💾 양자데이터", gravityModule: "🛸 중력모듈",

    bioFiber: "🌿 유기섬유", spore: "🍄 포자", yeast: "🦠 효모", livingWood: "🌳 생명목",
    bioFuel: "🧪 바이오연료", rootBrick: "🪵 뿌리벽돌", neuralFiber: "🧠 신경섬유",
    mutantCell: "🌑 변이세포", geneticCode: "🧬 유전코드", pheromone: "🧪 페로몬",
    biosphereCore: "🌐 생태코어",
    
    scrapMetal: "🔩 고철파편", magnet: "🧲 자석", chargedCrystal: "💎 대전수정",
    heavyAlloy: "🛡️ 중합금", fluxEnergy: "🌀 플럭스에너지", nanoSteel: "🌑 나노강철",
    plasmaCore: "⚛️ 플라즈마코어", magConcrete: "🧱 자력콘크리트", fluxLogic: "💾 플럭스회로"
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
        items: ['heavyAlloy', 'fluxEnergy', 'nanoSteel'] 
    },
    aurelia_comp: { 
        planet: 'aurelia', title: "⚛️ 에너지 코어 (High-Tech)", 
        items: ['plasmaCore'] 
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
    }
};

export const buildingGroups = {
    extraction: {
        title: "🚜 채집 및 채굴 (Extraction)",
        ids: [
            0, 1, 2, 3, 20, 25, 28, 40, 41, 42, 43, 44, 45, 49, 51, 53, 54, // 지구
            100, 101, 102, 108, 115, 118,                                   // 아우렐리아
            200, 201, 202, 208, 210, 211, 220                               // 베리디안
        ]
    },
    refining: {
        title: "🔥 기초 공정 및 제련 (Refining)",
        ids: [
            4, 5, 6, 7, 13, 16, 18, 21, 26, 29, 34, 48, 50, 52, 55, 56, 57, 59, 61, 62, 63, 64, // 지구
            103, 104, 106, 107, 110, 112, 113, 114, 116, 121,                                       // 아우렐리아
            203, 204, 205, 207, 209, 213, 215                                                   // 베리디안
        ]
    },
    production: {
        title: "🔬 첨단 제조 및 부품 (Manufacturing)",
        ids: [
            9, 15, 22, 24, 27, 31, 32, 33, 35, 36, 37, 38, 47, 58, 60, // 지구
            109, 119, 122,                                                 // 아우렐리아
            212, 214, 217, 218                                         // 베리디안
        ]
    },
    power: {
        title: "⚡ 에너지 발전 (Power Generation)",
        ids: [
            8, 14, 23, 30, 39, 46, // 지구
            105, 111, 117, 120,    // 아우렐리아
            206, 216, 219          // 베리디안
        ]
    }
};