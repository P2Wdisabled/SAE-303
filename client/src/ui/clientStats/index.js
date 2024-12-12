// src/ui/clientStats/index.js
const templateFile = await fetch("ui/clientStats/template.html.inc");
const template = await templateFile.text();

import * as echarts from 'echarts'; // Assurez-vous d'avoir echarts installé ou inclus dans votre projet
import { ClientData } from "../../data/client.js";

let ClientStatsView = {};

ClientStatsView.render = async function(containerSelector, clients, clientStats){
    const container = document.querySelector(containerSelector);
    container.innerHTML = template;
    await this.populateClientList(clients);
    await this.renderClientTreeMap(clientStats);
}

ClientStatsView.populateClientList = async function(clients){
    let clientList = document.querySelector("#clientList");
    clientList.innerHTML = ''; // Clear previous options
    clients.forEach(client => {
        let option = document.createElement("option");
        option.textContent = `${client.first_name} ${client.last_name}`;
        option.value = client.id;
        clientList.appendChild(option);
    });
    
    clientList.addEventListener("change", this.updateClientStats.bind(this));

    // Déclencher la mise à jour pour le premier client par défaut
    if(clients.length > 0){
        clientList.value = clients[0].id;
        this.updateClientStats({ target: clientList });
    }
}

ClientStatsView.updateClientStats = async function(event){
    let selectedClientId = event.target.value;
    let clientStats = await ClientData.fetchStats(selectedClientId);
    this.renderClientTreeMap(clientStats);
}

ClientStatsView.renderClientTreeMap = function(transactions) {
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
                  <div class="tooltip-title">${echarts.format.encodeHTML(treePath)}</div>
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
                    formatter: '{b}'
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

    myChart.setOption(option);
}

export { ClientStatsView };
