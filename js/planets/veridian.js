export const veridianData = {
    initialResources: ['bioFiber', 'spore'],
    
    // === 하우스 업그레이드 (Lv.0 ~ 10) ===
    houseStages: [
        { name: "덩굴 은신처", desc: "추락한 포드가 거대 덩굴에 뒤덮였습니다. 일단 덩굴을 치워야 합니다.", req: { bioFiber: 10 } },
        { name: "이끼 침대", desc: "폭신한 이끼로 바닥을 깔았습니다. 조금은 살만해졌습니다.", req: { bioFiber: 50, spore: 20 } },
        { name: "나무 구멍 집", desc: "거대 고목의 옹이 구멍을 파내어 안전한 거처를 만들었습니다.", req: { bioFiber: 200, livingWood: 50 } },
        { name: "효모 배양실", desc: "에너지를 얻기 위해 미생물을 키울 전용 공간을 마련했습니다.", req: { spore: 300, yeast: 100 } },
        { name: "생체 발효탑", desc: "건물 전체가 숨을 쉬며 에너지를 순환시키기 시작합니다.", req: { livingWood: 500, bioFuel: 200 } },
        { name: "발광 식물 가로등", desc: "밤에도 기지 주변을 밝게 비출 수 있습니다.", req: { bioFiber: 1000, energy: 50 } },
        // ... (이후 50레벨까지 기획 가능)
    ],

    // === 건물 리스트 (ID 200번대) ===
    buildings: [
        { id: 200, name: "덩굴 채집 캠프", cost: { bioFiber: 15 }, inputs: null, outputs: { bioFiber: 1.0 }, count: 0, reqLevel: 0 },
        { id: 201, name: "자동 가시 낫", cost: { bioFiber: 100, spore: 50 }, inputs: null, outputs: { bioFiber: 5.0 }, count: 0, reqLevel: 1 },
        { id: 202, name: "포자 포집기", cost: { bioFiber: 200 }, inputs: null, outputs: { spore: 2.0 }, count: 0, reqLevel: 1 },
        { id: 203, name: "균사체 인큐베이터", cost: { bioFiber: 500, spore: 200 }, inputs: { bioFiber: 5 }, outputs: { yeast: 2.0 }, count: 0, reqLevel: 2 },
        { id: 204, name: "압축 섬유 분쇄기", cost: { spore: 500, yeast: 50 }, inputs: { bioFiber: 10 }, outputs: { livingWood: 3.0 }, count: 0, reqLevel: 3 },
        { id: 205, name: "미생물 발효조", cost: { livingWood: 200, yeast: 100 }, inputs: { yeast: 5, bioFiber: 10 }, outputs: { bioFuel: 1.5, energy: 10 }, count: 0, reqLevel: 4 },
        { id: 206, name: "생체 태양광 잎", cost: { livingWood: 500, yeast: 200 }, inputs: null, outputs: { energy: 30 }, count: 0, reqLevel: 5 },
        { id: 207, name: "뿌리 벽돌 가마", cost: { spore: 1000, bioFuel: 100 }, inputs: { spore: 20, bioFuel: 5 }, outputs: { rootBrick: 5.0 }, count: 0, reqLevel: 5 }
    ],

    // === 연구 리스트 ===
    researchList: [
        { id: "v_botany", name: "외계 식물학", desc: "수동 채집 효율 2배 증가", cost: { bioFiber: 100 }, type: 'manual', value: 2, reqResearch: null },
        { id: "v_photosynthesis", name: "광합성 촉진", desc: "생체 태양광 잎(ID 206) 에너지 생산 3배", cost: { yeast: 500, livingWood: 200 }, type: 'building', target: [206], value: 3.0, reqResearch: "v_botany" },
        { id: "v_fermentation", name: "효소 공학", desc: "발효조(ID 205)의 바이오 연료 생산 2배", cost: { yeast: 1000, spore: 500 }, type: 'building', target: [205], value: 2.0, reqResearch: "v_botany" },
        { id: "v_root_hardening", name: "뿌리 강화 기술", desc: "뿌리 벽돌 생산 시설 속도 2.5배", cost: { bioFuel: 500, rootBrick: 100 }, type: 'building', target: [207], value: 2.5, reqResearch: "v_fermentation" }
    ]
};