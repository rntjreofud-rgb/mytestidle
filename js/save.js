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

export function exportToFile() {
    const dataStr = JSON.stringify(gameData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `escape_earth_save_${new Date().toISOString().slice(0,10)}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    console.log("파일 내보내기 완료");
}

// 2. 파일에서 가져오기 (Import)
export function importFromFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                // 최소한의 데이터 검증 (건물 데이터가 있는지 확인 등)
                if (parsed.resources && parsed.buildings) {
                    setGameData(parsed);
                    saveGame(); // 로컬 스토리지에도 즉시 저장
                    resolve(true);
                } else {
                    reject("유효하지 않은 세이브 파일입니다.");
                }
            } catch (err) {
                reject("파일을 읽는 중 오류가 발생했습니다.");
            }
        };
        reader.readAsText(file);
    });
}