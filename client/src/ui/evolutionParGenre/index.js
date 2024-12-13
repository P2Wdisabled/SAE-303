import * as echarts from 'echarts';

// src/ui/evolutionParGenre/index.js

let EvolutionParGenre = {};

EvolutionParGenre.render = function(rentEvolutionsPerGenre, soldEvolutionsPerGenre){
    
    // Rendu pour les locations
    const rentContainer = document.querySelector("#iteration6Rent");
    if (!rentContainer) {
        console.error("Element avec l'ID iteration6Rent introuvable.");
        return;
    }
    rentContainer.innerHTML = ""; // Reset the container
    rentEvolutionsPerGenre.forEach(genre => {
        let container = document.createElement("div");
        container.className = "bg-white p-6 rounded-lg shadow h-96 w-96";
        container.id = `${genre.genre}-evolutionrent`;
        let title = document.createElement("h3");
        title.className = "text-xl font-medium mb-4";
        title.textContent = genre.genre;
        let upperContainer = document.createElement("div");
        upperContainer.className = "flex flex-col";
        upperContainer.id = "rent-Genre-Evolution";
        upperContainer.appendChild(title);
        upperContainer.appendChild(container);
        rentContainer.appendChild(upperContainer);
        EvolutionParGenre.renderGraphLineChart(container.id, genre.evolution, "location");
    });

    // Rendu pour les ventes
    const soldContainer = document.querySelector("#iteration6Sold");
    if (!soldContainer) {
        console.error("Element avec l'ID iteration6Sold introuvable.");
        return;
    }
    soldContainer.innerHTML = ""; // Reset the container
    soldEvolutionsPerGenre.forEach(genre => {
        let container = document.createElement("div");
        container.className = "bg-white p-6 rounded-lg shadow h-96 w-96";
        container.id = `${genre.genre}-evolutionsold`;
        let title = document.createElement("h3");
        title.className = "text-xl font-medium mb-4";
        title.textContent = genre.genre;
        let upperContainer = document.createElement("div");
        upperContainer.className = "flex flex-col";
        upperContainer.id = "sold-genre-Evolution";
        upperContainer.appendChild(title);
        upperContainer.appendChild(container);
        soldContainer.appendChild(upperContainer);
        EvolutionParGenre.renderGraphLineChart(container.id, genre.evolution, "ventes");
    });
}

EvolutionParGenre.renderGraphLineChart = function(htmlId, data, type){
    var dom = document.getElementById(htmlId);
    if(!dom) {
        console.error(`EvolutionParGenre: Element avec l'ID ${htmlId} introuvable.`);
        return;
    }
    var myChart = echarts.init(dom, null, {
      renderer: 'canvas',
      useDirtyRect: false
    });

    let xData, yData;

    if(type === "location"){
        xData = data.map(e => e.mois);
        yData = data.map(e => e.location);
    } else if(type === "ventes"){
        xData = data.map(e => e.mois);
        yData = data.map(e => e.achat);
    } else {
        console.error(`EvolutionParGenre: Type inconnu pour renderGraphLineChart: ${type}`);
        return;
    }

    // Vérifiez que xData et yData sont valides
    if (!Array.isArray(xData) || xData.length === 0 || 
        !Array.isArray(yData) || yData.length === 0) {
        console.error(`EvolutionParGenre: xData ou yData invalides pour ${htmlId}:`, xData, yData);
        return;
    }

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: xData
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
              data: yData,
              type: 'line',
              smooth: true,
              lineStyle: {
                  color: type === "ventes" ? '#3B82F6' : '#10B981' // Bleu pour ventes, vert pour locations
              },
              areaStyle: {
                  color: type === "ventes" ? 'rgba(59, 130, 246, 0.2)' : 'rgba(16, 185, 129, 0.2)'
              }
            }
        ]
    };

    if (option && typeof option === 'object') {
      myChart.setOption(option);
    } else {
      console.error(`EvolutionParGenre: Option invalide pour ${htmlId}:`, option);
    }

    window.addEventListener('resize', myChart.resize);
}

export { EvolutionParGenre };
