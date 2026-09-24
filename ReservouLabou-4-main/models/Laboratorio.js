const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

module.exports=sequelize.define("Laboratorio",{

    IdLab:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },

    NomeLab:{
        type:DataTypes.STRING(30),
        allowNull:false,
        unique:true
    },

    HoraEntrada:{
        type:DataTypes.TIME,
        allowNull:false
    },

    HoraSaida:{
        type:DataTypes.TIME,
        allowNull:false
    }

},{
    tableName:"Laboratorio",
    timestamps:false
});
