const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("ReservaEquipamento", {

    IdReservaEquip: {

        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true

    },

    IdUser: {

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

    DataCriacao: {

        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW

    }

}, {

    tableName: "ReservaEquipamento",
    timestamps: false

});
