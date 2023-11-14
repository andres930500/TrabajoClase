// Importa el módulo 'express' para crear una aplicación web
const express = require('express');

const path = require('path');

// Crea una instancia de la aplicación Express
const app = express();

const Country = require('./src/routes/Country.js');
const Country_Api = require('./src/routes/Country_Api.js');

// Configura Express para analizar datos de formularios y JSON en las solicitudes
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configura el motor de vistas y la carpeta de vistas
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'ejs');

app.use('/Countryy',Country_Api);

app.use('/Country',Country);

// Iniciar el servidor y escuchar en el puerto 3000
app.listen(3000, () => {
    console.log(`Server is running on http://localhost:3000`);
});


