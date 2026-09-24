const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

module.exports = sequelize.define("Lab_DiasDispo", {

    IdLab: {

        type: DataTypes.INTEGER,
        primaryKey: true

    },

    IdDia: {

        type: DataTypes.INTEGER,
        primaryKey: true

    }

}, {

    tableName: "Lab_DiasDispo",
    timestamps: false

});
