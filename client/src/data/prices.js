import {getRequest} from '../lib/api-request.js';


let PricesData = {};
PricesData.fetchLocations = async function(id){
    let data = await getRequest('ventes');
    return data;
}

PricesData.fetchVentes = async function(){
    let data = await getRequest('location');
    return data;
}


export {PricesData};