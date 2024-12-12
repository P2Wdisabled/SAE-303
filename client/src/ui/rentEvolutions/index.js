const templateFile = await fetch("src/ui/rentEvolutions/template.html.inc");
const template = await templateFile.text();

let RentEvolutionsView = {};

RentEvolutionsView.renderEvolutions = function(rentEvolutions){
    const container = document.querySelector("#rentEvolutions");
    container.innerHTML = template;
    var myChart = echarts.init(container, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var option = {
        xAxis: {
            type: 'category',
            data: rentEvolutions.map(e => e.mois)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: rentEvolutions.map(e => e.location),
                type: 'line',
                smooth: true
            }
        ]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    }

    window.addEventListener('resize', myChart.resize);
}

export { RentEvolutionsView };
