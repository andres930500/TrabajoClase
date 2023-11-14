const express = require('express')
const router= express.Router();
// Importa la función 'uuidv4' del módulo 'uuid' para generar identificadores únicos
const { v4: uuidv4 } = require('uuid');
// Importa los módulos creados internamente, en este caso, el módulo 'files' en la carpeta 'src'
const { readFile, writeFile } = require('../files.js');
// Ruta del archivo donde se almacenarán los datos de los países
const FILE_NAME = './DB/Country.txt';
//rutas de la API 
const path = require('path');
const fs = require('fs');

const sequelize = require('../libs/sequelize.js');

    

router.get("/",  async(req, res) => {
    //let pets = readFile(FILE_NAME);

    const { search } = req.query;
    // if (search) {
    //     pets = pets.filter(pet => pet.name.toLowerCase().includes(search.toLowerCase()))
    // }
  //  const [countries, metadata] = await sequelize.query('SELECT * FROM countries');
    //console.log(countries);
    //console.log(metadata);
    
    let countries = await sequelize.models.countries.findAll(); 
    res.render('country/index', { countries: countries });
   
});









// /countries


router.post('/', async (req, res) => {
    try {
        const newCountry = req.body;

        // Crea el nuevo país en la base de datos utilizando el modelo correspondiente
        await sequelize.models.countries.create(newCountry);

        res.redirect('/Country');
    } catch (error) {
        console.error(error);
        res.json({ message: 'Error al almacenar país' });
    }
});


// /countries/create
router.get('/create', (req, res) => {
  
    res.render('Country/create');
});
// /countries/delete/:id
router.post('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Busca el país en la base de datos
        const country = await sequelize.models.countries.findByPk(id);

        // Verifica si el país existe
        if (!country) {
            res.status(404).json({ ok: false, message: "Country not found" });
            return;
        }

        // Elimina el país de la base de datos
        await country.destroy();

        res.redirect('/Country');
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error deleting country" });
    }
});

// /countriess
router.get('/Country', async (req, res) => {
    try {
        const filterKey = req.query.filterKey;
        const filterValue = req.query.filterValue;

        let countries;

        if (filterKey && filterValue) {
            // Recupera los países filtrados de la base de datos
            countries = await sequelize.models.countries.findAll({
                where: {
                    [filterKey]: filterValue,
                },
            });
        } else {
            // Recupera todos los países de la base de datos
            countries = await sequelize.models.countries.findAll();
        }

        res.render('country/index', { countries });
    } catch (error) {
        console.error(error);
        res.status(500).json({ ok: false, message: "Error fetching countries" });
    }
});






router.use(async (req, res, next) => {
    const accessLogPath = path.join(__dirname, 'access_log.txt');

    const now = new Date();
    const formattedDate = now.toISOString().replace('T', ' ').split('.')[0];

    const requestInfo = `${formattedDate} [${req.method}] [${req.path}]`;

    try {
        // Utiliza Sequelize para registrar información de acceso en la base de datos
        await sequelize.models.accessLogs.create({ info: requestInfo });
    } catch (error) {
        console.error('Error al escribir en la base de datos:', error);
    }

    next();
});


async function getCountryByID(id) {
    try {
        // Utiliza Sequelize para buscar el país por ID en la base de datos
        const country = await sequelize.models.countries.findByPk(id);

        return country;
    } catch (error) {
        console.error('Error al buscar país por ID:', error);
        throw error;
    }
}


// ...

const PDFDocument = require('pdfkit');

router.get('/generate-pdf/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Utiliza la función async getCountryByID para obtener el país por ID
        const country = await getCountryByID(id);

        if (!country) {
            res.status(404).json({ message: 'Country not found' });
            return;
        }

        const pdfDoc = new PDFDocument();
        const pdfFileName = `${country.Nombre}.pdf`;
        const pdfFilePath = path.join(__dirname, 'PDFs', pdfFileName);

        pdfDoc.pipe(res); // Stream the PDF directly to the response

        // Handle errors
        pdfDoc.on('error', (err) => {
            console.error(err);
            res.status(500).json({ message: 'Error generating PDF' });
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${country.Nombre}.pdf"`);

        pdfDoc
            .fontSize(12)
            .text(`Nombre: ${country.Nombre}`)
            .text(`Capital: ${country.Capital}`)
            .text(`Edad: ${country.Edad}`)
            .text(`Es Independiente: ${country.EsIndependiente ? 'Sí' : 'No'}`)
           
            .text(`Población: ${country.Poblacion}`)
            .text(`Presidente: ${country.Presidente}`)
            .text(`Continente: ${country.Continente}`);

        pdfDoc.end(); // Finalize the PDF

        // Wait for the PDF to finish and send the response
        pdfDoc.on('end', () => {
            res.end();
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating PDF' });
    }
});

async function getAllCountries() {
    try {
        // Utiliza Sequelize para obtener todos los países de la base de datos
        const countries = await sequelize.models.countries.findAll();

        return countries;
    } catch (error) {
        console.error(error);
        return [];
    }
}


 
// Ruta para mostrar el formulario de actualización de un país

router.get('/update/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Utiliza el método findByPk de Sequelize para obtener el país por ID
        const country = await sequelize.models.countries.findByPk(id);

        if (!country) {
            res.status(404).json({ message: 'Country not found' });
        } else {
            res.render('country/update', { country });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching country data' });
    }
});

// Ruta para procesar la actualización de un país
router.post('/update/:id', async (req, res) => {
    const id = req.params.id;

    try {
        // Utiliza el método findByPk de Sequelize para obtener el país por ID
        const country = await sequelize.models.countries.findByPk(id);

        if (!country) {
            res.status(404).json({ message: 'Country not found' });
        } else {
            // Utiliza el método update de Sequelize para actualizar el país
            await country.update(req.body);
            res.redirect('/Country'); // Redirige a la lista de países o la página que desees
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating country data' });
    }
});

module.exports=router;

