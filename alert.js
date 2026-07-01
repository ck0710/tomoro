document.getElementById("homebtn").addEventListener("click", function () {
    window.location.href = "main.html";
});

document.getElementById("alertbtn").addEventListener("click", function () {
    window.location.href = "alert.html";
});

document.getElementById("settingbtn").addEventListener("click", function () {
    window.location.href = "setting.html";
});

document.querySelector(".calendarbtn").addEventListener("click", () => {
    // 현재 선택된 날짜를 캘린더에 기본 선택으로
    const activeCard = document.querySelector(".date_card.active");
    if (activeCard) {
        sessionStorage.setItem("SelectedDate", activeCard.dataset.date);
    }
    window.location.href = "calendar.html";
});

document.querySelector(".backbtn").addEventListener("click", () => {
    history.back();
});

// 카테고리 선택 + 필터
const categoryBtns = document.querySelectorAll(".category button");
const alertCards = document.querySelectorAll(".alert_card");

categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {

        // 누른 버튼만 보라색
        categoryBtns.forEach((b) => (b.className = "categorybtn"));
        btn.className = "categorybtn_active";

        // 해당 종류만 보이기
        const filter = btn.textContent.trim();
        alertCards.forEach((card) => {
            const label = card.querySelector("span").textContent.trim();
            if (filter === "All" || label === filter) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        });
    });
});


// 현재 날짜 기준 월 날짜 표시
const dateList = document.getElementById("dateList");
const week = ["일", "월", "화", "수", "목", "금", "토"];

function formatDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

// 저장된 선택 날짜를 기준 날짜로
function getCenterDate() {
    const saved = sessionStorage.getItem("SelectedDate");
    if (saved) {
        const [y, m, d] = saved.split("-").map(Number);
        if (y && m && d) return new Date(y, m - 1, d);
    }
    return new Date();
}

function createDateList(centerDate = getCenterDate()) {

    dateList.innerHTML = "";

    for (let i = -3; i <= 3; i++) {
        const date = new Date(centerDate);
        date.setDate(centerDate.getDate() + i);

        const btn = document.createElement("button");
        btn.className = "date_card";
        btn.dataset.date = formatDate(date);

        // 가운데 카드 활성화
        if (i === 0) {
            btn.classList.add("active");
        }

        // 버튼 안에 내용 추가
        const monthSpan = document.createElement("span");
        monthSpan.className = "month";
        monthSpan.textContent = `${date.getMonth() + 1}월`;

        const h3 = document.createElement("h3");
        h3.textContent = date.getDate();

        const daySpan = document.createElement("span");
        daySpan.className = "day";
        daySpan.textContent = week[date.getDay()];

        btn.appendChild(monthSpan);
        btn.appendChild(h3);
        btn.appendChild(daySpan);

        // 누른 날짜를 가운데로
        btn.addEventListener("click", () => {
            createDateList(date);
        });

        dateList.appendChild(btn);
    }

    centerActiveCard();
}

function centerActiveCard() {
    const active = dateList.querySelector(".date_card.active");
    if (!active) return;
    const listRect = dateList.getBoundingClientRect();
    const cardRect = active.getBoundingClientRect();
    dateList.scrollLeft += (cardRect.left - listRect.left) - (listRect.width - cardRect.width) / 2;
}

window.addEventListener("resize", centerActiveCard);

// 캘린더에서 넘어온 날짜
createDateList();
sessionStorage.removeItem("SelectedDate");

// 뒤로가기(bfcache) 복원 시엔 오늘 날짜로 초기화
window.addEventListener("pageshow", (e) => {
    if (e.persisted) {
        createDateList(new Date());
    }
});
