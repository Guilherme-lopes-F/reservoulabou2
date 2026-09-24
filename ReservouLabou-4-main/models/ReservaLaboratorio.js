const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("ReservaLaboratorio", {

    IdReservaLab: {

        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },

    IdUser: {

        type: DataTypes.INTEGER,
        allowNull: false

    },

    IdLab: {

        type: DataTypes.INTEGER,
        allowNull: false

    },

    DataReserva: {

        type: DataTypes.DATEONLY,
        allowNull: false

    },

    HoraEntrada: {

        type: DataTypes.TIME,
        allowNull: false

    },

    HoraSaida: {

        type: DataTypes.TIME,
        allowNull: false

    },

    QuantidadePessoas: {

        type: DataTypes.INTEGER,
        allowNull: false

    },

    DataCriacao: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW

    }

}, {

    tableName: "ReservaLaboratorio",
    timestamps: false

});
