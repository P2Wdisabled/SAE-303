
import * as echarts from 'echarts';

const templateFile = await fetch("src/ui/total/template.html.inc");
const template = await templateFile.text();

let TotalView = {};

TotalView.render = function(){
    document.querySelector("#total").innerHTML = template;
}

TotalView.renderPrices = function(ventes, location){
    document.querySelector("#ventesContainer").textContent = ventes + " €";
    document.querySelector("#locationContainer").textContent = location + " €";
}

export { TotalView };
