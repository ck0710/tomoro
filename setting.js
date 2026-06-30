const timeBtn = document.getElementById("timeBtn");
const timeDefault = document.getElementById("timeDefault");
const timePicker = document.getElementById("timePicker");
const confirmBtn = document.getElementById("confirmBtn");
const selectedTime = document.getElementById("selectedTime");

const hourCol = document.getElementById("hourCol");
const minuteCol = document.getElementById("minuteCol");
const secondCol = document.getElementById("secondCol");
const periodCol = document.getElementById("periodCol");

const leftBtn = document.getElementById("leftBtn");
const rightBtn = document.getElementById("rightBtn");
const cycleText = document.getElementById("cycleText");

const ITEM_H = 38; // .picker_item 높이와 동일
const STORE_KEY = "tomoro_test_time"; // 저장 키

// 각 컬럼에 들어갈 값들
const pad = (n) => String(n).padStart(2, "0");
const hours = Array.from({ length: 12 }, (_, i) => pad(i + 1));     // 01~12
const minutes = Array.from({ length: 60 }, (_, i) => pad(i));        // 00~59
const seconds = Array.from({ length: 60 }, (_, i) => pad(i));        // 00~59
const periods = ["AM", "PM"];

// 주기(매일, 2일 ~ 10일) - 순환 없이 끝에서 멈춤
const cycles = ["매일", "2일", "3일", "4일", "5일", "6일", "7일", "8일", "9일", "10일"];
let cycleIdx = 0;

const makeOdd = (n) => (n % 2 === 0 ? n + 1 : n);

// 컬럼에 항목 생성 (loop=true면 무한 반복용으로 값을 여러 번 이어붙임)
function buildColumn(col, values, loop) {
    col.innerHTML = "";
    col._len = values.length;
    col._loop = loop;

    let list = values;
    if (loop) {
        // 한 번에 크게 스크롤해도 가장자리에 닿지 않도록 충분히 반복
        const repeat = makeOdd(Math.max(7, Math.ceil(300 / values.length)));
        col._middle = Math.floor(repeat / 2) * values.length; // 가운데 블록 시작 오프셋
        list = [];
        for (let r = 0; r < repeat; r++) list = list.concat(values);
    } else {
        col._middle = 0;
    }

    list.forEach((v) => {
        const item = document.createElement("div");
        item.className = "picker_item";
        item.textContent = v;
        col.appendChild(item);
    });
}

// 현재 가운데에 온 (전체 리스트 기준) 인덱스
function getRow(col) {
    return Math.round(col.scrollTop / ITEM_H);
}

// 현재 선택된 '값'의 인덱스 (0 ~ len-1)
function getValueIndex(col) {
    const len = col._len;
    return ((getRow(col) % len) + len) % len;
}

// 가운데 선택된 값 텍스트
function getValue(col) {
    const row = getRow(col);
    return col.children[row] ? col.children[row].textContent : "";
}

// 가운데 항목에 active 표시
function updateActive(col) {
    const row = getRow(col);
    [...col.children].forEach((item, i) => {
        item.classList.toggle("active", i === row);
    });
}

// 무한 반복: 가장자리에 가까워지면 같은 값의 가운데 블록으로 순간이동
function loopCorrect(col) {
    const len = col._len;
    const total = col.children.length;
    const row = getRow(col);

    if (row < len * 2 || row > total - len * 2) {
        const newRow = (row % len) + col._middle;
        col.scrollTop = newRow * ITEM_H; // 같은 값이라 시각적으론 그대로
    }
}

// 값 인덱스로 스크롤 위치 맞추기
function setValue(col, valueIdx, smooth = false) {
    const target = col._middle + valueIdx;
    col.scrollTo({ top: target * ITEM_H, behavior: smooth ? "smooth" : "auto" });
    updateActive(col);
}

// 스크롤하면 무한보정 + 가운데 항목 active 갱신
[hourCol, minuteCol, secondCol, periodCol].forEach((col) => {
    let ticking = false;
    col.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            if (col._loop) loopCorrect(col);
            updateActive(col);
            ticking = false;
        });
    });
});

// 컬럼 초기 생성 (시/분/초 = 무한반복, AM/PM = 고정)
buildColumn(hourCol, hours, true);
buildColumn(minuteCol, minutes, true);
buildColumn(secondCol, seconds, true);
buildColumn(periodCol, periods, false);

// 기본 선택값: 12 : 00 : 00 AM  (12는 hours 배열에서 index 11)
let currentSel = { hour: 11, minute: 0, second: 0, period: 0, cycle: 0 };

// 선택값으로 컬럼 위치 잡기
function applySelection(sel) {
    setValue(hourCol, sel.hour);
    setValue(minuteCol, sel.minute);
    setValue(secondCol, sel.second);
    setValue(periodCol, sel.period);
    cycleIdx = sel.cycle;
    renderCycle();
}

// 표시 텍스트 만들기
function formatText(sel) {
    const h = parseInt(hours[sel.hour], 10);
    const m = parseInt(minutes[sel.minute], 10);
    const s = parseInt(seconds[sel.second], 10);
    const ampm = periods[sel.period] === "AM" ? "오전" : "오후";
    return `${cycles[sel.cycle]} ${ampm} ${h}시 ${m}분 ${s}초`;
}

// 저장 / 불러오기
function saveSelection(sel) {
    localStorage.setItem(STORE_KEY, JSON.stringify(sel));
}
function loadSelection() {
    try {
        return JSON.parse(localStorage.getItem(STORE_KEY));
    } catch (e) {
        return null;
    }
}

// 주기 화살표 (양 끝에서는 멈춤)
function renderCycle() {
    cycleText.textContent = cycles[cycleIdx];
    leftBtn.disabled = cycleIdx === 0;
    rightBtn.disabled = cycleIdx === cycles.length - 1;
}
leftBtn.onclick = function () {
    if (cycleIdx > 0) {
        cycleIdx--;
        renderCycle();
    }
};
rightBtn.onclick = function () {
    if (cycleIdx < cycles.length - 1) {
        cycleIdx++;
        renderCycle();
    }
};

// 저장된 값이 있으면 복원, 없으면 기본값(12:00:00 AM)
const saved = loadSelection();
if (saved) {
    currentSel = saved;
    selectedTime.textContent = formatText(saved);
}
renderCycle();

// 시간 선택 열기/닫기 토글
timeBtn.onclick = function () {
    if (timePicker.classList.contains("show")) {
        timePicker.classList.remove("show");
        timeDefault.style.display = "block";
    } else {
        timeDefault.style.display = "none";
        timePicker.classList.add("show");
        // 보인 뒤에 스크롤 위치를 잡아야 정확함
        requestAnimationFrame(() => applySelection(currentSel));
    }
};

// 확인 → 선택값 반영 + 저장
confirmBtn.onclick = function () {
    currentSel = {
        hour: getValueIndex(hourCol),
        minute: getValueIndex(minuteCol),
        second: getValueIndex(secondCol),
        period: getValueIndex(periodCol),
        cycle: cycleIdx,
    };

    selectedTime.textContent = formatText(currentSel);
    saveSelection(currentSel); // 시간 저장

    timePicker.classList.remove("show");
    timeDefault.style.display = "block";
};


document.getElementById("homebtn").addEventListener("click", function () {
    window.location.href = "main.html";
});

document.getElementById("alertbtn").addEventListener("click", function () {
    window.location.href = "alert.html";
});

document.getElementById("settingbtn").addEventListener("click", function () {
    window.location.href = "setting.html";
});

document.querySelector(".backbtn").addEventListener("click", () => {
    history.back();
});

document.querySelector(".alarmbtn").addEventListener("click", () => {
    window.location.href = "alert.html";
});


/* 초기화 버튼 */
const resetBtn = document.querySelector(".reset_btn");

resetBtn.addEventListener("click", () => {
    // 기본값
    currentSel = {
        hour: 11,      // 12시
        minute: 0,
        second: 0,
        period: 0,     // AM
        cycle: 0       // 매일
    };

    // 피커 위치 변경
    applySelection(currentSel);

    // 화면 텍스트 변경
    selectedTime.textContent = formatText(currentSel);

    // localStorage도 기본값으로 저장
    saveSelection(currentSel);

    // 피커 닫기
    timePicker.classList.remove("show");
    timeDefault.style.display = "block";
});


/* 테스트 난이도 토글 */
const diffToggle = document.querySelector(".switch input");
const diffSlider = document.querySelector(".slider");

// 꺼짐 상태
const toggleStyle = document.createElement("style");
toggleStyle.textContent =
    ".slider.off{ background:#ccc; }" +
    ".slider.off::before{ right:auto; left:2px; }";
document.head.appendChild(toggleStyle);

// 체크 상태에 맞춰 색/노브 위치 갱신
function renderToggle() {
    diffSlider.classList.toggle("off", !diffToggle.checked);
}

diffToggle.addEventListener("change", renderToggle);
renderToggle();


/* 새로고침 버튼 회전 */
const refreshBtns = document.querySelectorAll(".refreshbtn");

// 회전 애니메이션을 JS로 주입 (css/html 안 건드림)
const spinStyle = document.createElement("style");
spinStyle.textContent =
    "@keyframes spin{ to { transform: rotate(-360deg); } }" +
    ".refreshbtn.spin img{ animation: spin .6s linear; }";
document.head.appendChild(spinStyle);

refreshBtns.forEach((btn) => {
    // 누르면 한 바퀴 회전
    btn.addEventListener("click", () => btn.classList.add("spin"));
    // 끝나면 클래스 제거 → 다시 누를 수 있음
    btn.addEventListener("animationend", () => btn.classList.remove("spin"));
});