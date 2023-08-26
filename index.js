require('dotenv').config();
require('colors');

const { 
    inquirerMenu, 
    pausa, 
    leerInput,
    listarLugares} = require("./helpers/inquirer");
    const Busqueda = require("./models/busqueda");




const main = async () => {
    
    const busqueda = new Busqueda();
    let opt;
    
    do {

        
        opt = await inquirerMenu();

        switch ( opt ) {
            case 1:
                
                // Buscar ciudades
                const ciudad = await leerInput('Ciudad: ');

                // Seleccionar ciudad
                const lugares = await busqueda.buscarCiudad( ciudad );
                const id = await listarLugares( lugares );
                if ( id === '0' ) continue;
                
                const lugarSeleccionado  = lugares.find( l => l.id === id );
                busqueda.agregarHistorial( lugarSeleccionado.nombre );

                // Buscar el estado del clima por geolocalización de la ciudad
                const { desc, temp, min, max, hume } = await busqueda.climaLugar( lugarSeleccionado.lat, lugarSeleccionado.lng)
                
                busqueda.imprimirResultados( 
                        lugarSeleccionado.nombre, 
                        lugarSeleccionado.lat,
                        lugarSeleccionado.lng,
                        desc.description,
                        temp,
                        min,
                        max,
                        hume );

                break;

            case 2:
                
                // busqueda.historial.forEach( ( lugar, i ) => {
                busqueda.historialCapitalizado.forEach( ( lugar, i ) => {
                    const idx = `${ i + 1 }.`.green;
                    console.log(`${ idx } ${ lugar }`);
                });
                break;
            default:
                break;
        }

        
        if( opt !== 0 )  await pausa();
        
    } while ( opt !== 0 );


    
}

main();