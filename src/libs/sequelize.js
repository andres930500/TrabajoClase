const {Sequelize } =require('sequelize');
const setUpModels = require('../../DB/models/Index.js'); // Asegúrate de importar el método setUpModels adecuadamente

// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize('Country_DB', 'postgres', '123', {
    host: 'localhost',
    dialect: 'postgres',
    logging: true,
});

setUpModels(sequelize); // Llamar a la función setUpModels para configurar tus modelos

module.exports = sequelize;
