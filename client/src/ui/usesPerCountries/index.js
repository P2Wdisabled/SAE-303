const templateFile = await fetch("src/ui/usesPerCountries/template.html.inc");
const template = await templateFile.text();

let UsesPerCountriesView = {};

UsesPerCountriesView.renderUsesPerCountries = function(rentUsesPerCountries, soldUsesPerCountries){
    // Graphique des utilisations des locations par pays
    const domRent = document.querySelector("#rentUsesPerCountries");
    var myChartRent = echarts.init(domRent, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var optionRent = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: rentUsesPerCountries.map(e => e.country),
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: rentUsesPerCountries.map(e => e.value)
            }
        ]
    };

    if (optionRent && typeof optionRent === 'object') {
        myChartRent.setOption(optionRent);
    }

    window.addEventListener('resize', myChartRent.resize);

    // Graphique des utilisations des ventes par pays
    const domSold = document.querySelector("#SoldUsesPerCountries");
    var myChartSold = echarts.init(domSold, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    var optionSold = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: soldUsesPerCountries.map(e => e.country),
            axisTick: {
                alignWithLabel: true
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Direct',
                type: 'bar',
                barWidth: '60%',
                data: soldUsesPerCountries.map(e => e.value)
            }
        ]
    };

    if (optionSold && typeof optionSold === 'object') {
        myChartSold.setOption(optionSold);
    }

    window.addEventListener('resize', myChartSold.resize);
}

export { UsesPerCountriesView };
