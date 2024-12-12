const templateFile = await fetch("src/ui/toplocations/template.html.inc");
const template = await templateFile.text();

let TopLocationsView = {};

TopLocationsView.renderToplocations = function(toplocations){
    const container = document.querySelector("#toplocationsContainer");
    container.innerHTML = "";
    toplocations.forEach(location => {
        let div = document.createElement("div");
        div.textContent = `${location.movie_title} : ${location.nb}`;
        container.appendChild(div);
    });
}

export { TopLocationsView };
