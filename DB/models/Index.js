
const { countriesModel, countriesSchema } = require("./Country.model");


function setUpModels(sequelize){


    countriesModel.init(countriesSchema, countriesModel.config(sequelize))

}

module.exports= setUpModels;