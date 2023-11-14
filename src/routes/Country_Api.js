const express = require('express')
const routerr= express.Router();
// Importa la función 'uuidv4' del módulo 'uuid' para generar identificadores únicos
const { v4: uuidv4 } = require('uuid');
// Importa los módulos creados internamente, en este caso, el módulo 'files' en la carpeta 'src'
const { readFile, writeFile } = require('../files.js');
// Ruta del archivo donde se almacenarán los datos de los países
const FILE_NAME = './DB/Country.txt';
//rutas de la API 
const path = require('path');
const fs = require('fs');
const PDFDocument = require('pdfkit');



const Joi = require('joi');


// Define un esquema de validación utilizando Joi
const countrySchema = Joi.object({
    Nombre: Joi.string().required(),
    Capital: Joi.string().required(),
    Edad: Joi.number().integer().required(),
    EsIndependiente: Joi.boolean().required(),
    ComidasTipicas: Joi.array().items(Joi.object({
        Nombre: Joi.string()
    })),
    Poblacion: Joi.number().required(),
    Presidente: Joi.string().required(),
    Continente: Joi.string().required()
});

// Define rutas de la API y Express...

// Obtener todos los países
routerr.get('/Country', (req, res) => {
    // Lee los datos del archivo especificado en FILE_NAME
    const data = readFile(FILE_NAME);

    // Envía una respuesta JSON al cliente con los datos leídos del archivo
    res.json(data);
});

// Crear un nuevo país
routerr.post('/Country', (req, res) => {
    try {
        // Obtener el nuevo país desde la solicitud POST
        const newCountry = req.body;

        // Validar los datos con el esquema definido
        const { error } = countrySchema.validate(newCountry);

        if (error) {
            // Generar un nuevo ID único para el país utilizando 'uuid'
            newCountry.id = uuidv4();

            // Leer los datos actuales de los países desde el archivo
            const data = readFile(FILE_NAME);

            // Agregar el nuevo país al conjunto de datos existente
            data.push(newCountry);

            // Escribir los datos actualizados en el archivo
            writeFile(FILE_NAME, data);

            // Responder con un mensaje de éxito
            res.json({ message: 'El país fue creado exitosamente' });
        } else {
            // Los datos no cumplen con los requisitos, muestra un mensaje de error
            console.error('Los datos de la solicitud POST no cumplen con los requisitos especificados.');
            res.status(400).json({ message: 'Los datos de la solicitud POST no cumplen con los requisitos especificados.' });
        }
    } catch (error) {
        // Manejar errores, como problemas de lectura/escritura en el archivo
        console.error(error);
        res.json({ message: 'Error al almacenar país' });
    }
});

// Obtener un solo país por su ID
routerr.get('/Country/:id', (req, res) => {
    // Guardar el ID proporcionado en la URL
    const id = req.params.id;

    // Leer el contenido del archivo que contiene los países
    const countries = readFile(FILE_NAME);

    // Buscar el país con el ID proporcionado
    const countryFound = countries.find(country => country.id === id);

    // Comprobar si el país fue encontrado
    if (!countryFound) {
        res.status(404).json({ 'ok': false, message: 'Country not found' });
    }

    // Responder con los datos del país encontrado
    res.json({ 'ok': true, country: countryFound });
});

// Ruta para actualizar un país por su ID
routerr.put('/Country/:id', (req, res) => {
    // Obtener el ID proporcionado en la URL
    const id = req.params.id;

    // Leer el contenido del archivo que contiene los países
    const countries = readFile(FILE_NAME);

    // Buscar el país con el ID proporcionado
    const countryIndex = countries.findIndex(country => country.id === id);

    // Comprobar si el país fue encontrado
    if (countryIndex < 0) {
        res.status(404).json({ 'ok': false, message: 'Country not found' });
        return;
    }

    // Obtener el país actual
    let country = countries[countryIndex];

    // Actualizar los datos del país con los datos proporcionados en la solicitud
    country = { ...country, ...req.body };

    // Reemplazar el país en la lista con el país actualizado
    countries[countryIndex] = country;

    // Escribir los datos actualizados en el archivo
    writeFile(FILE_NAME, countries);

    // Responder con los datos del país actualizado
    res.json({ 'ok': true, country: country });
});

routerr.delete('/Country/:id', (req, res) => {
    // Obtener el ID proporcionado en la URL
    const id = req.params.id;

    // Leer el contenido del archivo que contiene los países
    const countries = readFile(FILE_NAME);

    // Buscar el país con el ID proporcionado
    const countryIndex = countries.findIndex(country => country.id === id);

    // Comprobar si el país fue encontrado
    if (countryIndex < 0) {
        res.status(404).json({ 'ok': false, message: 'Country not found' });
        return;
    }

    // Eliminar el país del conjunto de datos
    countries.splice(countryIndex, 1);

    // Escribir los datos actualizados en el archivo
    writeFile(FILE_NAME, countries);

    // Responder con un mensaje de éxito
    res.json({ 'ok': true });

});

//http://localhost:3000/Countryy/CountryFilter?filterKey=Capital&filterValue=Brasilia
routerr.get('/CountryFilter', (req, res) => {
   
    const data = readFile(FILE_NAME);

    
    const { filterKey, filterValue } = req.query;

    if (filterKey && filterValue) {
      
        const filteredData = data.filter(country => country[filterKey] === filterValue);

        if (filteredData.length === 0) {
           
            res.status(404).json({ message: 'No se encontraron registros que coincidan con el filtro.' });
        } else {
       
            res.json(filteredData);
        }
    } else {
        
        res.json(data);
    }
});
module.exports=routerr;
