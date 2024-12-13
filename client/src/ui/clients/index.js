
import { ClientData } from "../../data/client.js";
import * as echarts from 'echarts';

// src/ui/evolutionParGenre/index.js

let Clients = {};

Clients.renderClientList = async function(clients){
    const clientList = document.querySelector("#clientList");
    if (!clientList) {
        console.error("Element avec l'ID clientList introuvable.");
        return;
    }

    clientList.innerHTML = ""; // Reset the list
    clients.forEach(client => {
        let option = document.createElement("option");
        option.textContent = `${client.first_name} ${client.last_name}`;
        option.value = client.id;
        clientList.appendChild(option);
    });

    clientList.addEventListener("change", Clients.updateClientStats);

    // Déclencher la mise à jour pour le premier client par défaut
    if(clients.length > 0){
        clientList.value = clients[0].id;
        Clients.updateClientStats({ target: clientList });
    }
}


Clients.updateClientStats = async function(event){
    const selectedClientId = event.target.value;
    try {
        const clientStats = await ClientData.fetchStats(selectedClientId);
        Clients.renderClientTreeMap(clientStats);
    } catch (error) {
        console.error("Erreur lors de la mise à jour des stats du client :", error);
    }
}

Clients.renderClientTreeMap = function(transactions) {
    const genreColors = {
        "Action": "#c23531",
        "Animation": "#2f4554",
        "Comedy": "#61a0a8",
        "Drama": "#d48265",
        "Horror": "#91c7ae",
        "Romance": "#749f83",
        "Sci-Fi": "#ca8622",
        "Thriller": "#bda29a"
    };

    const genreMap = {};

    transactions.forEach(tx => {
        const genre = tx.genre;
        const type = tx.transaction_type; // "Sale" ou "Rental"

        if (!genreMap[genre]) {
            genreMap[genre] = {};
        }

        if (!genreMap[genre][type]) {
            genreMap[genre][type] = [];
        }

        genreMap[genre][type].push({
            name: tx.movie_title,
            value: parseFloat(tx.price)
        });
    });

    const treemapData = Object.keys(genreMap).map(genre => ({
        name: genre,
        itemStyle: {
            color: genreColors[genre] || '#000000'
        },
        children: Object.keys(genreMap[genre]).map(type => ({
            name: type,
            children: genreMap[genre][type],
            itemStyle: {
                color: genreColors[genre]
            }
        }))
    }));

    const dom = document.getElementById('ClientStats');
    if (!dom) {
        console.error("Element avec l'ID ClientStats introuvable.");
        return;
    }

    let myChart = echarts.getInstanceByDom(dom);
    if (myChart) {
        myChart.dispose();
    }
    myChart = echarts.init(dom, null, {
        renderer: 'canvas',
        useDirtyRect: false
    });

    const option = {
        title: {
            text: 'Films Regardés par Genre et Type de Transaction',
            left: 'center'
        },
        tooltip: {
            formatter: function (info) {
                const value = info.value;
                const treePathInfo = info.treePathInfo;
                const treePath = treePathInfo.map(item => item.name).join(' / ');
                return `
                    <div class="tooltip-title font-bold">${echarts.format.encodeHTML(treePath)}</div>
                    <div>Prix: ${echarts.format.addCommas(value)} €</div>
                `;
            }
        },
        series: [
            {
                name: 'Transactions',
                type: 'treemap',
                visibleMin: 300,
                label: {
                    show: true,
                    formatter: '{b}',
                    color: '#000',
                    fontSize: 12
                },
                itemStyle: {
                    borderColor: '#fff'
                },
                data: treemapData,
                levels: [
                    {
                        // Niveau pour le genre
                        colorSaturation: [0.35, 0.5],
                        itemStyle: {
                            borderColor: '#000',
                            borderWidth: 2,
                            gapWidth: 5
                        },
                        upperLabel: {
                            show: true,
                            formatter: '{b}',
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    {
                        // Niveau pour le type de transaction
                        itemStyle: {
                            gapWidth: 1,
                            borderColorSaturation: 0.6
                        },
                        upperLabel: {
                            show: true,
                            formatter: '{b}',
                            fontSize: 14,
                            fontWeight: 'bold'
                        }
                    },
                    {
                        // Niveau pour les films
                        itemStyle: {
                            gapWidth: 1
                        },
                        label: {
                            show: true,
                            formatter: '{b}',
                            fontSize: 12
                        }
                    }
                ]
            }
        ]
    };

    if (option && typeof option === 'object') {
        myChart.setOption(option);
    } else {
        console.error("Option invalide pour le treemap ClientStats:", option);
    }

    window.addEventListener('resize', myChart.resize);
}

export { Clients };