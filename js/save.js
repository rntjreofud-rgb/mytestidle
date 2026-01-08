import { gameData, setGameData } from './data.js';

const SAVE_KEY = 'civIdleModularSave';

export function saveGame() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(gameData));
    console.log("게임 저장됨");
}

export function loadGame() {
    const save = localStorage.getItem(SAVE_KEY);
    if (save) {
        try {
            const parsed = JSON.parse(save);
            setGameData(parsed);
            console.log("게임 불러옴");
            return true;
        } catch (e) {
            console.error("세이브 파일 손상", e);
            return false;
        }
    }
    return false;
}

export function resetGame() {
    localStorage.removeItem(SAVE_KEY);
    location.reload();
}