// src/ui/evolutions/index.js
import * as echarts from 'echarts'; // Assurez-vous d'installer echarts via npm ou autre

const templateFile = await fetch("src/ui/evolutions/template.html.inc");
const template = await templateFile.text();

let EvolutionsView = {};

EvolutionsView.render = function(){
    return template;
}

EvolutionsView.updateSoldEvolutions = function(soldEvolutions){
    V.renderGraphLineChart("soldEvolutions", soldEvolutions, "ventes");
}

EvolutionsView.updateRentEvolutions = function(rentEvolutions){
    V.renderGraphLineChart("rentEvolutions", rentEvolutions, "location");
}

export { EvolutionsView };
