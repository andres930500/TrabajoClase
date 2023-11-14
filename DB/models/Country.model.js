const {Model,DataTypes } = require('sequelize');

const Country_TABLE = 'countries';

const countriesSchema = {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    Nombre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Capital: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Edad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    EsIndependiente: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
  
    Poblacion: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    Presidente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    Continente: {
        type: DataTypes.STRING,
        allowNull: false,
    },
};

class countriesModel extends Model {
    static associate(models) {
        // Aquí puedes definir las asociaciones con otros modelos si es necesario.
    }

    static config(sequelize) {
        return {
            sequelize,
            modelName: 'countries',
            tableName: Country_TABLE,
            timestamps: false,
        };
    }
}

module.exports = { countriesModel, countriesSchema, Country_TABLE };
