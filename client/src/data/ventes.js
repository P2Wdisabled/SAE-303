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


export {VentesData};