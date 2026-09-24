const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const DiasDispo = sequelize.define(
    "DiasDispo",
    {
        IdDia: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        Dia: {
            type: DataTypes.STRING(15),
            allowNull: false
        }
    },
    {
        tableName: "DiasDispo",
        timestamps: false
    }
);

module.exports = DiasDispo;