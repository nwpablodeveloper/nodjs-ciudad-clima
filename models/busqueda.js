const fs = require('fs');
const axios = require('axios');
require('colors');

class Busqueda {

    historial = [];
    historialCapit = [];
    dbPath = './db/database.json';

    constructor() {
        this.leerDb();
    }

    get paramsMapBox() {

        return {
                'access_token': process.env.MAPBOX_KEY,
                'limit': 5,
                'language': 'es',
        }

    }

    get paramsWeather() {
        return {
            appid: process.env.OPENWATHER_KEY,
            units: 'metric',
            lang: 'es'
        }
    }

    get historialCapitalizado() {

        return this.historial.map( lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0].toUpperCase() + p.substring(1) );
            return palabras.join(' ');
        });

        // this.historial.forEach( lugar => {
        //     this.historialCapit.unshift( lugar.toUpperCase() )
        // });

        // return this.historialCapit;

    }


    async buscarCiudad( lugar = '' ) {
        
        try {

            const intance = axios.create({
                baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapBox,
            });

            const resp = await intance.get();
            
            return resp.data.features.map( lugar => ({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }));
                            
        } catch (error) {
            return [];
        }

        
    }


    async climaLugar ( lat, lon ) {
        
        
        try {

            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: { ...this.paramsWeather, lat, lon } 
            })

            const resp = await instance.get();
            const { weather, main } = resp.data;

            return {
                desc: weather[0],
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp,
                hume: main.humidity
            }
            


        } catch (error) {
            return [];
        }

    }

    imprimirResultados( lugar, lat, lng, desc, temp, min, max, hume ) {
        
        
        // console.clear();

                
        console.log('\ninformacion de la ciudad ciudad \n'.green);
        console.log('Ciudad:', lugar.blue );
        console.log('Estado: ', desc.green );
        console.log('Temperatura: ', temp );
        console.log(`Temperatura: ${ temp } °C. `);
        console.log('Minima: ', min );
        console.log('Máxima: ', max );
        console.log('Humedad: ', hume );
        console.log('Lat: ', lat );
        console.log('lng: ', lng );

        console.log();

    }

    agregarHistorial ( lugar = '') {

        if( this.historial.includes( lugar.toLocaleLowerCase() ) ) {
            return;
        }

        
        this.historial.unshift( lugar.toLocaleLowerCase() );

        this.historial = this.historial.slice(0, 5);
        
        this.guardarDb();

    }

    guardarDb() {

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync( this.dbPath, JSON.stringify( payload ) )

    }

    leerDb() {

        if( !fs.existsSync( this.dbPath ) ) return;

        const info = fs.readFileSync( this.dbPath, { encoding: 'utf-8' } )
        
        const data = JSON.parse(info);

        this.historial = data.historial;

    }

}



module.exports = Busqueda;