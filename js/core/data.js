import { earthData } from '../planets/earth.js';
import { aureliaData } from '../planets/aurelia.js';
import { veridianData } from '../planets/veridian.js';
import { htreaData } from '../planets/htrea.js';


// === [1] 공통 게임 상태 정의 ===
export let gameData = {
    currentPlanet: 'earth', 
    resources: { 
        // 지구
        wood: 0, stone: 0, coal: 0, ironOre: 0, copperOre: 0, oil: 0, titaniumOre: 0, uraniumOre: 0,
        plank: 0, brick: 0, ironPlate: 0, copperPlate: 0, glass: 0, sulfur: 0,
        steel: 0, plastic: 0, concrete: 0, battery: 0, fuelCell: 0,
        gear: 0, circuit: 0, advCircuit: 0, processor: 0, optics: 0, titaniumPlate: 0,
        aiCore: 0, nanobots: 0, advAlloy: 0, rocketFuel: 0, warpCore: 0,
        quantumData: 0, gravityModule: 0,
        // 아우렐리아
        scrapMetal: 0, magnet: 0, chargedCrystal: 0, heavyAlloy: 0, fluxEnergy: 0,
        nanoSteel: 0, plasmaCore: 0, magConcrete: 0, fluxLogic: 0,
        // 베리디안
        bioFiber: 0, spore: 0, yeast: 0, livingWood: 0, bioFuel: 0, rootBrick: 0,
        mutantCell: 0, geneticCode: 0, pheromone: 0, biosphereCore: 0, neuralFiber: 0,
        
        // HTREA 행성 자원
        brokenParts: 0, radiation: 0, pureWater: 0, scrapCopper: 0, leadPlate: 0, bioSample: 0, dataCore: 0, microChip: 0, voidCrystal: 0,

        // 시스템
        energy: 0, energyMax: 0
    },
    unlockedResources: ['wood', 'stone', 'plank'], 
    houseLevel: 0,
    researches: [], 
    prestigeLevel: 0,
    cosmicData: 0,
    legacyUpgrades: [],
    lastTimestamp: Date.now(),
    buildings: [],
    planetClearCounts: {
        earth: 0,
        aurelia: 0,
        veridian: 0,
        htrea: 0
    }




};

// === [2] 행성 데이터 라우팅 ===
export function getActivePlanetData() {
    const planetMap = { earth: earthData, aurelia: aureliaData, veridian: veridianData, htrea: htreaData };
    return planetMap[gameData.currentPlanet] || earthData;
}
export const getActiveBuildings = () => getActivePlanetData().buildings;
export const getActiveResearch = () => getActivePlanetData().researchList;
export const getActiveStages = () => getActivePlanetData().houseStages;

// === [3] 데이터 동기화 (디버깅 강화 및 ID 매칭 수정) ===
export function setGameData(newData) {
    if (!newData) {
        console.warn("[데이터] 불러올 데이터가 없습니다. (Empty)");
        return;
    }

    console.log("[데이터] 세이브 파일 로드 시작...", newData);

    // 1. 행성 설정
    gameData.currentPlanet = newData.currentPlanet || 'earth';
    const planetTemplate = getActivePlanetData();

    // 2. 자원 데이터 복구
    if (newData.resources) {
        for (let key in gameData.resources) {
            if (newData.resources[key] !== undefined) {
                gameData.resources[key] = Number(newData.resources[key]);
            }
        }
    }

    // 3. 진행도 복구
    gameData.houseLevel = Number(newData.houseLevel) || 0;
    gameData.researches = Array.isArray(newData.researches) ? [...newData.researches] : [];
    
    gameData.unlockedResources = Array.isArray(newData.unlockedResources) 
        ? [...newData.unlockedResources] 
        : [...planetTemplate.initialResources];

    gameData.prestigeLevel = Number(newData.prestigeLevel) || 0;
    gameData.cosmicData = Number(newData.cosmicData) || 0;
    gameData.legacyUpgrades = Array.isArray(newData.legacyUpgrades) ? [...newData.legacyUpgrades] : [];
    gameData.planetClearCounts = newData.planetClearCounts || { earth: 0, aurelia: 0, veridian: 0, htrea: 0 };
    // 4. ⭐ 건물 데이터 매핑 (강력한 ID 비교)
    const currentPlanetBuildings = planetTemplate.buildings; 
    const savedBuildings = Array.isArray(newData.buildings) ? newData.buildings : [];
    const legacy = gameData.legacyUpgrades;

    let matchCount = 0;

    gameData.buildings = currentPlanetBuildings.map((templateB, index) => {
        
        const savedB = savedBuildings.find(b => String(b.id) === String(templateB.id));

        if (savedB) {
            matchCount++;
            return {
                ...templateB,
                count: Number(savedB.count) || 0,
                activeCount: (savedB.activeCount !== undefined) ? Number(savedB.activeCount) : (Number(savedB.count) || 0),
                on: (savedB.on !== undefined) ? savedB.on : true
            };
        } else {
            // 신규 초기화 (자율 건설 유산 적용)
            let startCount = 0;
             if (legacy.includes('legacy_auto_build1')) {
                if (index === 0 || index === 1 || index === 2) {
                    startCount = 5;
                }
            }
            if (legacy.includes('legacy_auto_build2')) {
                if (index === 0 || index === 1 || index === 2) {
                    startCount = 10;
                }
            }
            return {
                ...templateB,
                count: startCount,
                activeCount: startCount,
                on: true
            };
        }
    });

    // 5. 안전장치
    gameData.buildings.forEach(b => {
        if (b.activeCount > b.count) b.activeCount = b.count;
    });

    console.log(`[데이터] 로드 완료. 행성: ${gameData.currentPlanet}, 건물 매칭 성공: ${matchCount}/${currentPlanetBuildings.length}`);
}

// === [4] 유산 목록 정의 ===
export const legacyList = [
  { id: "start_resource", name: "선구자의 보급품", desc: "매 회차 시작 시 나무 500, 돌 500, 판자 100 보유", cost: 1 },
  { id: "fast_click", name: "초공간 클릭", desc: "수동 채집 효율 5배 영구 증가", cost: 2 },
  { id: "cheap_build", name: "나노 건축 설계", desc: "모든 건물 건설 비용 20% 영구 감소", cost: 3 },
  { id: "legacy_auto_build1", name: "초기 자율 건설", desc: "최초 시작건물 3개 5레벨로 시작", cost: 5, req: null },
  { id: "legacy_auto_build2", name: "고급 자율 건설", desc: "최초 시작건물 3개 10레벨로 시작", cost: 7, req: "legacy_auto_build1" },
  { id: "legacy_spore_start", name: "포자 보존 주머니", desc: "회차 시작 시 포자 200 보유", cost: 1 },
  { id: "legacy_biofuel_trickle", name: "발효 잔열", desc: "유기섬유를 초당 0.1 자동 생산", cost: 4 }, 
  { id: "legacy_less_fiber", name: "섬유 재활용", desc: "유기섬유 소모량 15% 감소", cost: 3 },
  { id: "legacy_mutant_boost", name: "변이 적응 기억", desc: "변이세포 생산 속도 30% 증가", cost: 6 },
  { id: "legacy_gene_boost", name: "유전자 기억 각인", desc: "유전코드 생산 속도 25% 증가", cost: 6 },
  { id: "aurelia_start_metal", name: "개척자 합금 상자", desc: "회차 시작 시 고철 300 보유", cost: 1 },
  { id: "aurelia_fast_setup", name: "신속 기지 전개", desc: "건물 레벨 2까지 요구 자원 50% 감소", cost: 6 },
  { id: "aurelia_generator_boost", name: "과충전 프로토콜", desc: "발전기 생산량 25% 증가", cost: 3 },
  { id: "aurelia_miner_boost", name: "자동 채굴 알고리즘", desc: "채굴 생산량 30% 증가", cost: 3 },
  { id: "aurelia_scrap_recycle", name: "스크랩 재활용", desc: "고철 소모 20% 감소", cost: 4 },
  { id: "aurelia_fusion_eff", name: "핵융합 최적화", desc: "고급 에너지 시설 전력 소모 30% 감소", cost: 6 },  
  { id: "aurelia_prestige_drive", name: "항성 항해 데이터", desc: "환생 1회당 전기 생산 +4%", cost: 10 },  
  { id: "infinite_storage", name: "압축 창고", desc: "모든 자원 생산 효율 20% 추가 증가", cost: 10 },
  { id: "htrea_starter_kit", name: "폐허의 생존자", desc: "흐트레아 시작 시 기계잔해 10,000개, 방사능 500 보유", cost: 2 },
  { id: "htrea_drone_overload", name: "드론 과부하 제어", desc: "잔해 해체 드론 및 파쇄 플랜트 생산량 50% 증가", cost: 4 },
  { id: "htrea_rad_recycle", name: "방사능 재순환", desc: "방사능을 소모하는 모든 건물의 소모량 20% 감소", cost: 5 },
  { id: "htrea_ancient_wisdom", name: "고대인의 지혜", desc: "데이터 코어 및 프로세서 생산 속도 30% 증가", cost: 6 },
  { id: "htrea_void_resonance", name: "공허 공명 장치", desc: "공허 수정(Void Crystal) 생산량 25% 증가", cost: 8 },
  { id: "htrea_warp_drive", name: "차원 도약 가속", desc: "워프 코어 및 엔딩 건물 건설 비용 15% 감소", cost: 12 }
];




