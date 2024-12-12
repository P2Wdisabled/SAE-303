// src/ui/topVentes/index.js
const templateFile = await fetch("ui/topVentes/template.html.inc");
const template = await templateFile.text();

let TopVentesView = {};

TopVentesView.render = async function(containerSelector, topventes){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.update(topventes);
}

TopVentesView.update = function(topventes){
    let topventesContainer = document.querySelector("#topventesContainer");
    topventesContainer.innerHTML = "";
    topventes.forEach(vente => {
        let div = document.createElement("div");
        div.textContent = `${vente.movie_title} : ${vente.nb}`;
        topventesContainer.appendChild(div);
    });
}

export { TopVentesView };
