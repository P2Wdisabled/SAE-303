const templateFile = await fetch("src/ui/soldEvolutions/template.html.inc");
const template = await templateFile.text();

let SoldEvolutionsView = {};

SoldEvolutionsView.renderEvolutions = function(soldEvolutions){
    const container = document.querySelector("#soldEvolutions");
    container.innerHTML = template;
    var myChart = echarts.init(container, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var option = {
        xAxis: {
            type: 'category',
            data: soldEvolutions.map(e => e.mois)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: soldEvolutions.map(e => e.achat),
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

export { SoldEvolutionsView };
