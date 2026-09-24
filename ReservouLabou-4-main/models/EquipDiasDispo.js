const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Equip_DiasDispo", {

    IdEquip: {

        type: DataTypes.INTEGER,
        primaryKey: true

    },

    IdDia: {

        type: DataTypes.INTEGER,
        primaryKey: true

    }

}, {

    tableName: "Equip_DiasDispo",
    timestamps: false

});
