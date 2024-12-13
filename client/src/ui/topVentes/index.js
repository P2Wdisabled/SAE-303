import * as echarts from 'echarts';

const templateFile = await fetch("src/ui/topventes/template.html.inc");
const template = await templateFile.text();

let TopVentesView = {};

TopVentesView.renderTopventes = function(topventes){
    const container = document.querySelector("#topventesContainer");
    container.innerHTML = "";
    topventes.forEach(vente => {
        let div = document.createElement("div");
        div.textContent = `${vente.movie_title} : ${vente.nb}`;
        container.appendChild(div);
    });
}

export { TopVentesView };
