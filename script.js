// 게임 상태 변수
let gameData = {
    resources: 0,
    buildings: [
        { id: 0, name: "텐트", cost: 15, production: 0.5, count: 0, icon: "⛺" },
        { id: 1, name: "나무 집", cost: 100, production: 2, count: 0, icon: "🏠" },
        { id: 2, name: "벽돌 집", cost: 500, production: 10, count: 0, icon: "🏡" },
        { id: 3, name: "아파트", cost: 2000, production: 40, count: 0, icon: "🏢" },
        { id: 4, name: "연구소", cost: 10000, production: 150, count: 0, icon: "🔬" },
        { id: 5, name: "로켓 발사대", cost: 50000, production: 500, count: 0, icon: "🚀" },
        { id: 6, name: "우주선 (엔딩)", cost: 1000000, production: 0, count: 0, icon: "🛸" } // 엔딩 조건
    ]
};

// DOM 요소 가져오기
const resourceDisplay = document.getElementById('resource-display');
const mpsDisplay = document.getElementById('mps-display');
const clickBtn = document.getElementById('click-btn');
const buildingList = document.getElementById('building-list');
const messageLog = document.getElementById('message-log');

// 초기화
function init() {
    loadGame();
    renderShop();
    updateDisplay();

    // 1초마다 자동 생산 (방치형 요소)
    setInterval(() => {
        let mps = calculateMPS();
        gameData.resources += mps;
        updateDisplay();
        checkShopStatus();
    }, 1000);

    // 30초마다 자동 저장
    setInterval(saveGame, 30000);
}

// 초당 생산량 계산 (Money Per Second)
function calculateMPS() {
    let mps = 0;
    gameData.buildings.forEach(b => {
        mps += b.production * b.count;
    });
    return mps;
}

// 화면 업데이트
function updateDisplay() {
    resourceDisplay.innerText = Math.floor(gameData.resources).toLocaleString() + " 자원";
    mpsDisplay.innerText = "초당 생산량: " + calculateMPS().toFixed(1);
}

// 로그 메시지 출력
function log(msg) {
    messageLog.innerText = msg;
    setTimeout(() => { messageLog.innerText = ""; }, 3000);
}

// 클릭 이벤트
clickBtn.addEventListener('click', () => {
    gameData.resources += 1;
    updateDisplay();
    checkShopStatus();

    // 클릭 애니메이션 효과 (선택사항)
    clickBtn.style.transform = "scale(0.95)";
    setTimeout(() => clickBtn.style.transform = "scale(1)", 50);
});

// 상점 렌더링
function renderShop() {
    buildingList.innerHTML = "";
    gameData.buildings.forEach((building, index) => {
        const div = document.createElement('div');
        div.className = 'building-item disabled';
        div.id = `building-${index}`;
        div.onclick = () => buyBuilding(index);

        div.innerHTML = `
            <div class="building-info">
                <h4>${building.icon} ${building.name}</h4>
                <span>보유: ${building.count} | +${building.production}/초</span>
            </div>
            <div class="building-cost">
                ${building.cost.toLocaleString()} 자원
            </div>
        `;
        buildingList.appendChild(div);
    });
}

// 구매 가능 여부 체크 및 스타일 변경
function checkShopStatus() {
    gameData.buildings.forEach((building, index) => {
        const div = document.getElementById(`building-${index}`);
        if (gameData.resources >= building.cost) {
            div.classList.remove('disabled');
        } else {
            div.classList.add('disabled');
        }
    });
}

// 건물 구매 로직
function buyBuilding(index) {
    const building = gameData.buildings[index];

    if (gameData.resources >= building.cost) {
        // 엔딩 조건 체크
        if (building.id === 6) {
            if (confirm("정말로 우주선을 발사하시겠습니까? 지구를 떠납니다!")) {
                alert("축하합니다! 우주선을 타고 지구를 탈출했습니다! 게임 클리어!");
                resetGame();
                return;
            } else {
                return;
            }
        }

        gameData.resources -= building.cost;
        building.count++;

        // 가격 상승 로직 (구매할 때마다 1.15배 비싸짐)
        building.cost = Math.ceil(building.cost * 1.15);

        log(`${building.name} 구매 완료!`);
        updateDisplay();
        renderShop(); // 가격이 바뀌었으므로 다시 렌더링
    } else {
        log("자원이 부족합니다.");
    }
}

// 저장 기능 (로컬 스토리지 사용)
function saveGame() {
    localStorage.setItem('earthToSpaceSave', JSON.stringify(gameData));
    log("게임이 저장되었습니다.");
}

function loadGame() {
    const save = localStorage.getItem('earthToSpaceSave');
    if (save) {
        const savedData = JSON.parse(save);
        // 저장된 데이터 불러오되, 구조가 바뀌었을 수 있으므로 병합
        gameData = { ...gameData, ...savedData };
        // buildings 배열 내부 객체들도 업데이트
        gameData.buildings = gameData.buildings.map((b, i) => {
            return { ...b, ...savedData.buildings[i] };
        });
    }
}

function resetGame() {
    localStorage.removeItem('earthToSpaceSave');
    location.reload();
}

// 게임 시작
init();