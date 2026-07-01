document.getElementById("homebtn").addEventListener("click", function () {
    window.location.href = "main.html";
});

document.getElementById("alertbtn").addEventListener("click", function () {
    window.location.href = "alert.html";
});

document.getElementById("settingbtn").addEventListener("click", function () {
    window.location.href = "setting.html";
});

document.querySelector(".alarmbtn").addEventListener("click", () => {
    window.location.href = "alert.html";
});

document.querySelector(".backbtn").addEventListener("click", () => {
    history.back();
});


// 날짜 선택 → 원래 페이지로 날짜 전달
document.querySelectorAll(".calendar .day").forEach((dayBtn) => {
    // 이전/다음 달의 비활성 날짜는 제외
    if (dayBtn.classList.contains("disable")) return;

    dayBtn.addEventListener("click", () => {
        const date = dayBtn.querySelector(".date").textContent.trim();

        // 선택한 날짜를 저장
        sessionStorage.setItem("selectedDate", date);

        // 원래 페이지로 돌아가기
        history.back();
    });
});


// 현재 날짜 불러오기
const month = document.getElementById("month");

function printMonth() {
    var currentDate = new Date();

    var year = currentDate.getFullYear();
    var MonthNum = currentDate.getMonth() + 1;

    month.textContent = `${MonthNum}월 ${year}`;
}

printMonth();

// 날짜 버튼 생성








// 오늘 날짜 표시
const today = new Date();

const todaycheck = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

sessionStorage.setItem("alertSelectedDate", todaycheck);


