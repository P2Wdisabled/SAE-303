// src/ui/topLocations/index.js
const templateFile = await fetch("ui/topLocations/template.html.inc");
const template = await templateFile.text();

let TopLocationsView = {};

TopLocationsView.render = async function(containerSelector, toplocations){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    this.update(toplocations);
}

TopLocationsView.update = function(toplocations){
    let toplocationsContainer = document.querySelector("#toplocationsContainer");
    toplocationsContainer.innerHTML = "";
    toplocations.forEach(location => {
        let div = document.createElement("div");
        div.textContent = `${location.movie_title} : ${location.nb}`;
        toplocationsContainer.appendChild(div);
    });
}

export { TopLocationsView };
