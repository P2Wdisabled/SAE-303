
import * as echarts from 'echarts';

let Films = {};

Films.renderFilmHeatmap = async function(consumtion){
    var dom = document.getElementById('FilmsConsumtion');
        var myChart = echarts.init(dom, null, {
            renderer: 'canvas',
            useDirtyRect: false
        });
        var app = {};

        var option;

        // Fonction pour extraire les catégories uniques et trier les mois
        function extractCategories(data) {
            const paysSet = new Set();
            const moisSet = new Set();

            data.forEach(item => {
                paysSet.add(item.Pays);
                moisSet.add(item.Mois);
            });

            // Convertir les ensembles en tableaux et trier les mois
            const pays = Array.from(paysSet).sort();
            const mois = Array.from(moisSet).sort((a, b) => new Date(a) - new Date(b));

            return { pays, mois };
        }

        // Extraire les catégories
        const { pays, mois } = extractCategories(consumtion);

        // Préparer les données pour ECharts
        const data = consumtion.map(item => {
            return [item.Mois, item.Pays, parseFloat(item.Consommation_GB)];
        });

        // Définir l'option de la heatmap
        option = {
            tooltip: {
                position: 'top',
                formatter: function (params) {
                    return `${params.data[1]} - ${params.data[0]} : ${params.data[2]} Go`;
                }
            },
            grid: {
                height: '80%',
                top: '10%'
            },
            xAxis: {
                type: 'category',
                data: mois,
                axisLabel: {
                    rotate: 45,
                    formatter: function (value) {
                        // Optionnel : formater les labels des mois pour plus de lisibilité
                        return value;
                    }
                },
                splitArea: {
                    show: true
                }
            },
            yAxis: {
                type: 'category',
                data: pays,
                splitArea: {
                    show: true
                }
            },
            visualMap: {
                min: 0,
                max: Math.max(...consumtion.map(item => parseFloat(item.Consommation_GB))),
                calculable: true,
                orient: 'horizontal',
                left: 'center',
                bottom: '5%',
            },
            series: [
                {
                    name: 'Consommation (GB)',
                    type: 'heatmap',
                    data: data,
                    label: {
                        show: false
                    },
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        // Appliquer l'option à ECharts
        if (option && typeof option === 'object') {
            myChart.setOption(option);
        }
}

export { Films };