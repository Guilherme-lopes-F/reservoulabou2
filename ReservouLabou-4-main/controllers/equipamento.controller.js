const {

    ReservaEquipamento,

    ReservaEquipamentoItem,

    Equipamento,

    Usuario

} = require("../models");

const { Op } = require("sequelize");

class ReservaEquipamentoController {

    /* =====================================================
       CALCULAR QUANTIDADE DISPONÍVEL
    ===================================================== */

    static async calcularQuantidadeDisponivel(

        idEquip,

        data,

        horaEntrada,

        horaSaida

    ) {

        const equipamento =

            await Equipamento.findByPk(idEquip);

        if (!equipamento) {

            return 0;

        }

        const reservas =

            await ReservaEquipamento.findAll({

                include:[

                    {

                        model:Equipamento,

                        where:{

                            IdEquip:idEquip

                        }

                    }

                ],

                where:{

                    DataReserva:data

                }

            });

        let reservado = 0;

        reservas.forEach(reserva=>{

            if(

                horaEntrada < reserva.HoraSaida &&

                horaSaida > reserva.HoraEntrada

            ){

                reserva.Equipamentos.forEach(item=>{

                    reservado +=
                    item.Reserva_Equipamento.Quantidade;

                });

            }

        });

        return equipamento.Quantidade - reservado;

    }

    /* =====================================================
       DISPONIBILIDADE
    ===================================================== */

    static async verificarDisponibilidade(req,res){

        try{

            const{

                idEquip,

                data,

                horaEntrada,

                horaSaida

            }=req.query;

            if(

                !idEquip ||

                !data ||

                !horaEntrada ||

                !horaSaida

            ){

                return res.status(400).json({

                    erro:"Parâmetros obrigatórios."

                });

            }

            const disponivel=

                await ReservaEquipamentoController
                .calcularQuantidadeDisponivel(

                    idEquip,

                    data,

                    horaEntrada,

                    horaSaida

                );

            res.json({

                quantidadeDisponivel:

                disponivel

            });

        }

        catch(erro){

            console.log(erro);

            res.status(500).json({

                erro:erro.message

            });

        }

    }

    /* =====================================================
       LISTAR
    ===================================================== */

    static async listar(req,res){

        try{

            const reservas=

                await ReservaEquipamento.findAll({

                    include:[

                        Usuario,

                        Equipamento

                    ],

                    order:[

                        ["DataReserva","ASC"],

                        ["HoraEntrada","ASC"]

                    ]

                });

            res.render(

                "reservaEquipamento/listar",

                {

                    reservas

                }

            );

        }

        catch(erro){

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       API JSON
    ===================================================== */

    static async apiListar(req,res){

        try{

            const reservas=

                await ReservaEquipamento.findAll({

                    include:[

                        Usuario,

                        Equipamento

                    ]

                });

            res.json(reservas);

        }

        catch(erro){

            res.status(500).json({

                erro:erro.message

            });

        }

    }

    /* =====================================================
       FORMULÁRIO
    ===================================================== */

    static async cadastroPage(req,res){

        try{

            const equipamentos=

                await Equipamento.findAll({

                    order:[

                        ["NomeEquip","ASC"]

                    ]

                });

            res.render(

                "reservaEquipamento/cadastrar",

                {

                    equipamentos

                }

            );

        }

        catch(erro){

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       CADASTRAR RESERVA
    ===================================================== */

    static async cadastrar(req, res) {

        try {

            const {

                DataReserva,

                HoraEntrada,

                HoraSaida,

                equipamentos

            } = req.body;

            if (

                !DataReserva ||

                !HoraEntrada ||

                !HoraSaida ||

                !equipamentos

            ) {

                return res.render(

                    "reservaEquipamento/cadastrar",

                    {

                        erro: "Preencha todos os campos."

                    }

                );

            }

            if (HoraEntrada >= HoraSaida) {

                return res.render(

                    "reservaEquipamento/cadastrar",

                    {

                        erro: "Horário inválido."

                    }

                );

            }

            const dataAtual = new Date();

            dataAtual.setHours(0,0,0,0);

            const dataReserva = new Date(DataReserva);

            if (dataReserva < dataAtual) {

                return res.render(

                    "reservaEquipamento/cadastrar",

                    {

                        erro: "Não é permitido reservar datas passadas."

                    }

                );

            }

            /* ============================================
               VERIFICAR ESTOQUE
            ============================================ */

            for (const item of equipamentos) {

                const disponivel =

                    await ReservaEquipamentoController
                    .calcularQuantidadeDisponivel(

                        item.IdEquip,

                        DataReserva,

                        HoraEntrada,

                        HoraSaida

                    );

                if (item.Quantidade > disponivel) {

                    return res.render(

                        "reservaEquipamento/cadastrar",

                        {

                            erro:

                            `Quantidade insuficiente para o equipamento ${item.IdEquip}. Disponível: ${disponivel}`

                        }

                    );

                }

            }

            /* ============================================
               CRIA A RESERVA
            ============================================ */

            const reserva =

                await ReservaEquipamento.create({

                    IdUser: req.session.usuario.id,

                    DataReserva,

                    HoraEntrada,

                    HoraSaida

                });

            /* ============================================
               VINCULA EQUIPAMENTOS
            ============================================ */

            for (const item of equipamentos) {

                await ReservaEquipamentoItem.create({

                    IdReservaEquip:

                        reserva.IdReservaEquip,

                    IdEquip:

                        item.IdEquip,

                    Quantidade:

                        item.Quantidade

                });

            }

            res.redirect(

                "/reservas/equipamentos"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send(

                "Erro ao cadastrar."

            );

        }

    }

    /* =====================================================
       API POST
    ===================================================== */

    static async apiCadastrar(req, res) {

        try {

            const {

                IdUser,

                DataReserva,

                HoraEntrada,

                HoraSaida,

                equipamentos

            } = req.body;

            if (

                !IdUser ||

                !DataReserva ||

                !HoraEntrada ||

                !HoraSaida ||

                !equipamentos

            ) {

                return res.status(400).json({

                    erro: "Campos obrigatórios."

                });

            }

            if (

                HoraEntrada >= HoraSaida

            ) {

                return res.status(400).json({

                    erro: "Horário inválido."

                });

            }

            for (const item of equipamentos) {

                const disponivel =

                    await ReservaEquipamentoController
                    .calcularQuantidadeDisponivel(

                        item.IdEquip,

                        DataReserva,

                        HoraEntrada,

                        HoraSaida

                    );

                if (item.Quantidade > disponivel) {

                    return res.status(409).json({

                        erro:

                        `Equipamento ${item.IdEquip} sem estoque suficiente.`,

                        disponivel

                    });

                }

            }

            const reserva =

                await ReservaEquipamento.create({

                    IdUser,

                    DataReserva,

                    HoraEntrada,

                    HoraSaida

                });

            for (const item of equipamentos) {

                await ReservaEquipamentoItem.create({

                    IdReservaEquip:

                        reserva.IdReservaEquip,

                    IdEquip:

                        item.IdEquip,

                    Quantidade:

                        item.Quantidade

                });

            }

            res.status(201).json({

                mensagem:

                "Reserva criada com sucesso.",

                reserva

            });

        }

        catch (erro) {

            console.log(erro);

            res.status(500).json({

                erro: erro.message

            });

        }

    }

    /* =====================================================
       BUSCAR RESERVA
    ===================================================== */

    static async buscar(req, res) {

        try {

            const reserva = await ReservaEquipamento.findByPk(

                req.params.id,

                {

                    include: [

                        Usuario,

                        Equipamento

                    ]

                }

            );

            if (!reserva) {

                return res.status(404).json({

                    erro: "Reserva não encontrada."

                });

            }

            res.json(reserva);

        }

        catch (erro) {

            console.log(erro);

            res.status(500).json({

                erro: erro.message

            });

        }

    }

    /* =====================================================
       FORMULÁRIO DE EDIÇÃO
    ===================================================== */

    static async editarPage(req, res) {

        try {

            const reserva = await ReservaEquipamento.findByPk(

                req.params.id,

                {

                    include: [

                        Equipamento

                    ]

                }

            );

            if (!reserva) {

                return res.send(

                    "Reserva inexistente."

                );

            }

            const equipamentos = await Equipamento.findAll({

                order: [

                    ["NomeEquip","ASC"]

                ]

            });

            res.render(

                "reservaEquipamento/editar",

                {

                    reserva,

                    equipamentos

                }

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       EDITAR RESERVA
    ===================================================== */

    static async editar(req, res) {

        try {

            const reserva = await ReservaEquipamento.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.send(

                    "Reserva inexistente."

                );

            }

            const {

                DataReserva,

                HoraEntrada,

                HoraSaida,

                equipamentos

            } = req.body;

            if (

                HoraEntrada >= HoraSaida

            ) {

                return res.send(

                    "Horário inválido."

                );

            }

            /* ============================================
               VERIFICA ESTOQUE
            ============================================ */

            for (const item of equipamentos) {

                const disponivel =

                    await ReservaEquipamentoController
                    .calcularQuantidadeDisponivel(

                        item.IdEquip,

                        DataReserva,

                        HoraEntrada,

                        HoraSaida

                    );

                if (item.Quantidade > disponivel) {

                    return res.send(

                        `Quantidade insuficiente para o equipamento ${item.IdEquip}.`

                    );

                }

            }

            await reserva.update({

                DataReserva,

                HoraEntrada,

                HoraSaida

            });

            /* ============================================
               REMOVE VÍNCULOS ANTIGOS
            ============================================ */

            await ReservaEquipamentoItem.destroy({

                where: {

                    IdReservaEquip:

                    reserva.IdReservaEquip

                }

            });

            /* ============================================
               CRIA NOVOS VÍNCULOS
            ============================================ */

            for (const item of equipamentos) {

                await ReservaEquipamentoItem.create({

                    IdReservaEquip:

                        reserva.IdReservaEquip,

                    IdEquip:

                        item.IdEquip,

                    Quantidade:

                        item.Quantidade

                });

            }

            res.redirect(

                "/reservas/equipamentos"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       API PUT
    ===================================================== */

    static async apiEditar(req, res) {

        try {

            const reserva = await ReservaEquipamento.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.status(404).json({

                    erro:

                    "Reserva inexistente."

                });

            }

            await reserva.update({

                DataReserva: req.body.DataReserva,

                HoraEntrada: req.body.HoraEntrada,

                HoraSaida: req.body.HoraSaida

            });

            res.json({

                mensagem:

                "Reserva atualizada."

            });

        }

        catch (erro) {

            console.log(erro);

            res.status(500).json({

                erro: erro.message

            });

        }

    }

    /* =====================================================
       EXCLUIR
    ===================================================== */

    static async excluir(req, res) {

        try {

            const reserva = await ReservaEquipamento.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.send(

                    "Reserva inexistente."

                );

            }

            await ReservaEquipamentoItem.destroy({

                where: {

                    IdReservaEquip:

                    reserva.IdReservaEquip

                }

            });

            await reserva.destroy();

            res.redirect(

                "/reservas/equipamentos"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       API DELETE
    ===================================================== */

    static async apiExcluir(req, res) {

        try {

            const reserva = await ReservaEquipamento.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.status(404).json({

                    erro:

                    "Reserva inexistente."

                });

            }

            await ReservaEquipamentoItem.destroy({

                where: {

                    IdReservaEquip:

                    reserva.IdReservaEquip

                }

            });

            await reserva.destroy();

            res.json({

                mensagem:

                "Reserva removida."

            });

        }

        catch (erro) {

            console.log(erro);

            res.status(500).json({

                erro: erro.message

            });

        }

    }

}

module.exports = ReservaEquipamentoController;
