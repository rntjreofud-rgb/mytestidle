import { gameData, getActiveStages } from './core/data.js';
import * as UI from './ui/ui_manager.js';
import * as Logic from './core/logic.js';
import * as Storage from './core/save.js';

window.gameData = gameData;

function applyLegacyStartBonuses() {
    const legacy = gameData.legacyUpgrades || []; const p = gameData.currentPlanet;
    if (legacy.includes('start_resource') && p === 'earth') { gameData.resources.wood = 500; gameData.resources.stone = 500; gameData.resources.plank = 100; }
    if (legacy.includes('legacy_spore_start') && p === 'veridian') gameData.resources.spore = 200;
    if (legacy.includes('aurelia_start_metal') && p === 'aurelia') gameData.resources.scrapMetal = 300;
}

window.landOnPlanet = function(planetKey) {
    const planetName = { earth: '지구', aurelia: '아우렐리아', veridian: '베리디안' }[planetKey];
    UI.triggerWarpEffect(planetName, () => {
        const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
        gameData.cosmicData = (gameData.cosmicData || 0) + gain;
        if (gameData.houseLevel >= 50) gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;
        gameData.currentPlanet = planetKey; gameData.houseLevel = 0; gameData.researches = [];
        for (let k in gameData.resources) gameData.resources[k] = 0;
        gameData.buildings = []; 
        applyLegacyStartBonuses(); Storage.saveGame(); location.reload(); 
    });
};

window.performPrestige = function() {
    UI.triggerWarpEffect("지구", () => {
        const gain = Logic.calculateCurrentPrestigeGain(gameData.houseLevel, gameData.currentPlanet);
        gameData.cosmicData = (gameData.cosmicData || 0) + gain;
        gameData.prestigeLevel = (gameData.prestigeLevel || 0) + 1;
        gameData.currentPlanet = 'earth'; gameData.houseLevel = 0; gameData.researches = [];
        for (let k in gameData.resources) gameData.resources[k] = 0;
        gameData.buildings = []; applyLegacyStartBonuses(); Storage.saveGame(); location.reload();
    });
};

window.adjustActiveCount = (id, delta) => {
    const b = gameData.buildings.find(build => build.id === id);
    if (b) { b.activeCount = Math.max(0, Math.min(b.count, b.activeCount + delta)); UI.updateScreen(Logic.calculateNetMPS()); }
};

function init() {
    const offlineSeconds = Storage.loadGame(); 
    setupEvents();
    if (offlineSeconds > 10) { Logic.produceResources(Math.min(offlineSeconds, 43200)); UI.log("오프라인 자원이 생산되었습니다.", true); }
    requestAnimationFrame(gameLoop);
    setInterval(() => Storage.saveGame(), 10000);
}

function setupEvents() {
    UI.uiElements.navDashboard.onclick = () => UI.switchTab('dashboard');
    UI.uiElements.navPower.onclick = () => UI.switchTab('power');
    UI.uiElements.navResearch.onclick = () => UI.switchTab('research');
    UI.uiElements.navTechTree.onclick = () => UI.switchTab('tech-tree');
    UI.uiElements.navLegacy.onclick = () => UI.switchTab('legacy');
    UI.uiElements.btns.wood.onclick = () => handleGather('wood');
    UI.uiElements.btns.stone.onclick = () => handleGather('stone');
    document.getElementById('btn-export').onclick = () => Storage.exportToFile();
    document.getElementById('btn-import').onclick = () => document.getElementById('import-file').click();
    document.getElementById('import-file').onchange = (e) => Storage.importFromFile(e.target.files[0]).then(() => location.reload());
}

function handleGather(type) { if (Logic.manualGather(type)) UI.updateScreen(Logic.calculateNetMPS()); }

function gameLoop(currentTime) {
    const deltaTime = (currentTime - (window._lastTime || currentTime)) / 1000;
    window._lastTime = currentTime;
    Logic.produceResources(deltaTime);
    UI.updateScreen(Logic.calculateNetMPS());
    UI.updateHouseUI((stage) => { if(Logic.tryUpgradeHouse(stage)) { UI.renderShop(null, Logic.getBuildingCost); UI.updateHouseUI(); } });
    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", init);