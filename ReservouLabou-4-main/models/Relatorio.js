const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Relatorio", {

    IdRelatorio: {

        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },

    IdUser: {

        type: DataTypes.INTEGER,
        allowNull: false

    },

    IdReservaLab: {

        type: DataTypes.INTEGER,
        allowNull: true

    },

    DataGeracao: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW

    },

    Descricao: {

        type: DataTypes.TEXT

    }

}, {

    tableName: "Relatorio",
    timestamps: false

});
