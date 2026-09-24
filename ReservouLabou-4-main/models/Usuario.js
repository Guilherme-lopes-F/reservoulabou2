const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

module.exports=sequelize.define("Usuario",{

    IdUser:{
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },

    Login:{
        type:DataTypes.STRING(30),
        unique:true,
        allowNull:false
    },

    Senha:{
        type:DataTypes.STRING(255),
        allowNull:false
    },

    StatusADM:{
        type:DataTypes.BOOLEAN,
        defaultValue:false
    }

},{
    tableName:"Usuario",
    timestamps:false
});
