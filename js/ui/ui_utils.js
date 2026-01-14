import { elements, resNames } from './ui_constants.js';

export function getResNameOnly(key) {
    const full = resNames[key];
    if (!full) return key;
    const parts = full.split(' ');
    return parts.length > 1 ? parts[1] : parts[0];
}

export function getResEmoji(key) {
    const full = resNames[key];
    if (!full) return key;
    // 공백으로 나눈 후 첫 번째 부분(이모지)만 반환
    return full.split(' ')[0];
}


export function formatNumber(num) {
    if (num == null || isNaN(num) || num === 0) return "0";
    
    // 1000 미만 처리
    if (num < 1000) {
        if (num < 10 && num % 1 !== 0) return num.toFixed(1); 
        return Math.round(num).toLocaleString();
    }

    const suffixes = [
        "k", "M", "B", "T", "Qa", "Qi", "Sx", "Sp", "Oc", "No", 
        "Dc", "Ud", "Dd", "Td", "qad", "qid", "sxd", "spd", "Ocd", "Nod", "vg"
    ];

    const exp = Math.floor(Math.log10(num) / 3);
    const suffixIndex = exp - 1;

    if (suffixIndex >= suffixes.length) {
        return num.toExponential(2);
    }

    const suffix = suffixes[suffixIndex];
    const shortValue = num / Math.pow(10, exp * 3);

    let formatted;
    if (shortValue >= 100) formatted = shortValue.toFixed(0);
    else if (shortValue >= 10) formatted = shortValue.toFixed(1);
    else formatted = shortValue.toFixed(2);

    return formatted.replace(/\.0+$/, '') + suffix;
}

export function log(msg, isImportant = false) {
    if(elements.headerLog) {
        elements.headerLog.innerText = msg;
        elements.headerLog.style.opacity = 1;
        setTimeout(() => { elements.headerLog.style.opacity = 0.5; }, 3000);
    }
    if(elements.logList) {
        const li = document.createElement('li');
        li.className = 'log-entry';
        const time = new Date().toLocaleTimeString('ko-KR', { hour12: false });
        const contentClass = isImportant ? 'log-msg log-highlight' : 'log-msg';
        li.innerHTML = `<span class="log-time">${time}</span><span class="${contentClass}">${msg}</span>`;
        elements.logList.prepend(li);
        if (elements.logList.children.length > 50) elements.logList.removeChild(elements.logList.lastChild);
    }
}