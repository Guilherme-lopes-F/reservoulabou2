const {DataTypes}=require("sequelize");
const sequelize=require("../config/database");

const ReservaEquipamentoItem=sequelize.define("Reserva_Equipamento",{

    IdReservaEquip:{

        type:DataTypes.INTEGER,

        primaryKey:true

    },

    IdEquip:{

        type:DataTypes.INTEGER,

        primaryKey:true

    },

    Quantidade:{

        type:DataTypes.INTEGER,

        defaultValue:1

    }

},{
    timestamps:false
});

module.exports=ReservaEquipamentoItem;
