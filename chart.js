const ctx = document.getElementById('weeklychart');

new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['월', '화', '수', '목', '금', '토', '일'],
        datasets: [{
            data: [88, 68, 72, 64, 88, 58, 78],
            borderColor: '#5F32E1',
            borderWidth: 2,
            pointRadius: 4,
            pointBackgroundColor: '#fff',
            pointBorderColor: '#5F32E1',
            pointBorderWidth: 2
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            y: {
                min: 0,
                max: 100
            }
        }
    }
});