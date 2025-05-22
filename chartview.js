
const ctx = document.getElementById('myChart');
const myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ["Swing", "Buy", "Sell", "Long Term"],
        datasets: [{
            label: '# of Probelityes',
            data: [0, 0, 0, 0],
            borderWidth: 1,
            backgroundColor: ["#6a8ffc", "#3bff41", "#fc6a6a", "#924cfc"]
        }]
    },
    options: {

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
function data(numbers) {
    myChart.data.datasets[0].data = numbers;
    myChart.update(); 
}
