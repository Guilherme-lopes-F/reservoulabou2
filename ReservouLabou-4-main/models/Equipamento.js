const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

module.exports=sequelize.define("Equipamento",{

    IdEquip:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },

    NomeEquip:{
        type:DataTypes.STRING(30),
        unique:true
    },

    Durabilidade:{
        type:DataTypes.STRING(12)
    },

    Quantidade:{
        type:DataTypes.INTEGER
    },

    HoraEntrada:{
        type:DataTypes.TIME
    },

    HoraSaida:{
        type:DataTypes.TIME
    }

},{
    tableName:"Equipamento",
    timestamps:false
});
