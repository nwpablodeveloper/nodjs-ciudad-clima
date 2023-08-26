const inquirer = require('inquirer');
require('colors');

const preguntas = [
    {
        type: 'list',
        name: 'opcion',
        message: 'Mensaje del menu',
        choices: [
            {
                value: 1,
                name: `${ '1.'.green } Buscar ciudad`
            },
            {
                value: 2,
                name: `${ '2.'.green } Historial`
            },
            {
                value: 0,
                name: `${ '0.'.green } Salir`
            }
        ]
    }
]



const inquirerMenu = async () => {

    console.log();
    console.log('=============================='.green );
    console.log('    Seleccione una opción     ');
    console.log('=============================='.green );
    console.log();

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;

}

const leerInput = async ( message = '' ) => {

    const preguntas = [
        {
            type: 'input',
            name: 'desc',
            message,
            validate( value ) {
                if ( value.length === 0 ) {
                    return 'Por favor ingrese el nombre de una ciudad';
                }
                return true;
            }
        }
    ];

    const { desc } = await inquirer.prompt(preguntas);
    return desc;

}

const listarLugares = async ( lugares = [] ) => {


    const choices = lugares.map( ( lugar, i ) => {

        const idx = `${ i + 1 }.`.green;
        return  {
                value: lugar.id,
                name: `${ idx } ${lugar.nombre}`
            }   
    });

    choices.push({
        name: 0,
        value: '0. Volver'.green
    })

    const preguntas = [
        {
            type: 'list',
            name: 'id',
            message: 'Seleccione el lugar',
            choices
        }
    ]


    const  { id }  = await inquirer.prompt( preguntas )
    return id;
    
}

const pausa = async () => {

    const preguntas = [
        {
            type: 'input',
            name: 'enter',
            message: `Presione ${ 'ENTER'.green } para continuar`
        }
    ]

    await inquirer.prompt(preguntas);

}

module.exports = {
    inquirerMenu,
    leerInput,
    pausa,
    listarLugares
}