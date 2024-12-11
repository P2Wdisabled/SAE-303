import {getRequest} from '../lib/api-request.js';


let VentesData = {};

VentesData.fetchVentes = async function(){
    let data = await getRequest('ventes?param=lastmonth');
    return data;
}

VentesData.fetchMostVentes = async function(){
    let data = await getRequest('ventes?param=top3');
    return data; 
}

VentesData.fetchSoldEvolutions = async function(){
    let data = await getRequest('ventes?param=evolution');
    return data;
}


VentesData.fetchSoldEvolutionsPerGenre = async function(){
let data = await getRequest('ventes?param=evolutionPerGenre');
return data;
}


VentesData.fetchSoldUsesPerCountries = async function(){
    let data = await getRequest('ventes?param=UsesPerCountries');
    return data;
}
export {VentesData};