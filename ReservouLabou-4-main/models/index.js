const Usuario = require("./Usuario");
const Laboratorio = require("./Laboratorio");
const Equipamento = require("./Equipamento");
const DiasDispo = require("./DiasDispo");
const LabDiasDispo = require("./LabDiasDispo");
const EquipDiasDispo = require("./EquipDiasDispo");
const ReservaLaboratorio = require("./ReservaLaboratorio");
const ReservaEquipamento = require("./ReservaEquipamento");
//const Reserva_Equipamento = require("./Reserva_Equipamento");
const Relatorio = require("./Relatorio");

/* ==========================================
   USUÁRIO
========================================== */

Usuario.hasMany(ReservaLaboratorio,{
    foreignKey:"IdUser"
});

ReservaLaboratorio.belongsTo(Usuario,{
    foreignKey:"IdUser"
});

Usuario.hasMany(ReservaEquipamento,{
    foreignKey:"IdUser"
});

ReservaEquipamento.belongsTo(Usuario,{
    foreignKey:"IdUser"
});

Usuario.hasMany(Relatorio,{
    foreignKey:"IdUser"
});

Relatorio.belongsTo(Usuario,{
    foreignKey:"IdUser"
});

/* ==========================================
   LABORATÓRIO
========================================== */

Laboratorio.hasMany(
    ReservaLaboratorio,
    {
        foreignKey:"IdLab"
    }
);

ReservaLaboratorio.belongsTo(
    Laboratorio,
    {
        foreignKey:"IdLab"
    }
);

/* ==========================================
   RELATÓRIO
========================================== */

ReservaLaboratorio.hasMany(
    Relatorio,
    {
        foreignKey:"IdReservaLab"
    }
);

Relatorio.belongsTo(
    ReservaLaboratorio,
    {
        foreignKey:"IdReservaLab"
    }
);

/* ==========================================
   DIAS DISPONÍVEIS LABORATÓRIO
========================================== */

Laboratorio.belongsToMany(
    DiasDispo,
    {
        through:LabDiasDispo,
        foreignKey:"IdLab"
    }
);

DiasDispo.belongsToMany(
    Laboratorio,
    {
        through:LabDiasDispo,
        foreignKey:"IdDia"
    }
);

/* ==========================================
   DIAS DISPONÍVEIS EQUIPAMENTOS
========================================== */

Equipamento.belongsToMany(
    DiasDispo,
    {
        through:EquipDiasDispo,
        foreignKey:"IdEquip"
    }
);

DiasDispo.belongsToMany(
    Equipamento,
    {
        through:EquipDiasDispo,
        foreignKey:"IdDia"
    }
);

/* ==========================================
   RESERVA EQUIPAMENTO
========================================== */

ReservaEquipamento.belongsToMany(
    Equipamento,
    {
        through:ReservaEquipamento,
        foreignKey:"IdReservaEquip"
    }
);

Equipamento.belongsToMany(
    ReservaEquipamento,
    {
        through:ReservaEquipamento,
        foreignKey:"IdEquip"
    }
);

module.exports={

    Usuario,

    Laboratorio,

    Equipamento,

    DiasDispo,

    LabDiasDispo,

    EquipDiasDispo,

    ReservaLaboratorio,

    ReservaEquipamento,

    Relatorio

};
