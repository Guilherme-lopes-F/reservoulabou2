const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Reserva_Equipamento", {

    IdReservaEquip: {

        type: DataTypes.INTEGER,
        primaryKey: true

    },

    IdEquip: {

        type: DataTypes.INTEGER,
        primaryKey: true

    },

    Quantidade: {

        type: DataTypes.INTEGER,
        defaultValue: 1

    }

}, {

    tableName: "Reserva_Equipamento",
    timestamps: false

});
