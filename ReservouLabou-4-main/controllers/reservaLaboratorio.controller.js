const {
    ReservaLaboratorio,
    Laboratorio,
    Usuario
} = require("../models");

const { Op } = require("sequelize");

class ReservaLaboratorioController {

    /* =====================================================
       FUNÇÃO AUXILIAR
    ===================================================== */

    static conflitoHorario(
        inicioExistente,
        fimExistente,
        inicioNovo,
        fimNovo
    ) {

        return (

            inicioNovo < fimExistente &&

            fimNovo > inicioExistente

        );

    }

    /* =====================================================
       LISTAR RESERVAS
    ===================================================== */

    static async listar(req, res) {

        try {

            const reservas = await ReservaLaboratorio.findAll({

                include: [

                    Usuario,

                    Laboratorio

                ],

                order: [

                    ["DataReserva", "ASC"],

                    ["HoraEntrada", "ASC"]

                ]

            });

            res.render(

                "reservaLaboratorio/listar",

                {

                    reservas

                }

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro ao listar reservas.");

        }

    }

    /* =====================================================
       API JSON
    ===================================================== */

    static async apiListar(req, res) {

        try {

            const reservas = await ReservaLaboratorio.findAll({

                include: [

                    Usuario,

                    Laboratorio

                ],

                order: [

                    ["DataReserva", "ASC"]

                ]

            });

            res.json(reservas);

        }

        catch (erro) {

            res.status(500).json({

                erro: erro.message

            });

        }

    }

    /* =====================================================
       FORMULÁRIO DE CADASTRO
    ===================================================== */

    static async cadastroPage(req, res) {

        try {

            const laboratorios = await Laboratorio.findAll({

                order: [

                    ["NomeLab", "ASC"]

                ]

            });

            res.render(

                "reservaLaboratorio/cadastrar",

                {

                    laboratorios

                }

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       HORÁRIOS DISPONÍVEIS
    ===================================================== */

    static async buscarHorariosDisponiveis(req, res) {

        try {

            const {

                idLab,

                data

            } = req.query;

            if (!idLab || !data) {

                return res.status(400).json({

                    erro: "Informe laboratório e data."

                });

            }

            const laboratorio = await Laboratorio.findByPk(idLab);

            if (!laboratorio) {

                return res.status(404).json({

                    erro: "Laboratório inexistente."

                });

            }

            const reservas = await ReservaLaboratorio.findAll({

                where: {

                    IdLab: idLab,

                    DataReserva: data

                },

                order: [

                    ["HoraEntrada", "ASC"]

                ]

            });

            const horariosOcupados = reservas.map(reserva => ({

                inicio: reserva.HoraEntrada,

                fim: reserva.HoraSaida

            }));

            res.json({

                laboratorio: laboratorio.NomeLab,

                funcionamento: {

                    inicio: laboratorio.HoraEntrada,

                    fim: laboratorio.HoraSaida

                },

                ocupados: horariosOcupados

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
       VERIFICAR CONFLITO
    ===================================================== */

    static async verificarConflito(

        idLab,

        data,

        horaEntrada,

        horaSaida

    ) {

        const reservas = await ReservaLaboratorio.findAll({

            where: {

                IdLab: idLab,

                DataReserva: data

            }

        });

        for (const reserva of reservas) {

            if (

                ReservaLaboratorioController.conflitoHorario(

                    reserva.HoraEntrada,

                    reserva.HoraSaida,

                    horaEntrada,

                    horaSaida

                )

            ) {

                return true;

            }

        }

        return false;

    }

    /* =====================================================
       CADASTRAR RESERVA
    ===================================================== */

    static async cadastrar(req, res) {

        try {

            const {

                IdLab,

                DataReserva,

                HoraEntrada,

                HoraSaida,

                QuantidadePessoas

            } = req.body;

            /* ============================================
               CAMPOS OBRIGATÓRIOS
            ============================================ */

            if (

                !IdLab ||

                !DataReserva ||

                !HoraEntrada ||

                !HoraSaida ||

                !QuantidadePessoas

            ) {

                return res.render(

                    "reservaLaboratorio/cadastrar",

                    {

                        erro:

                        "Preencha todos os campos."

                    }

                );

            }

            /* ============================================
               DATA PASSADA
            ============================================ */

            const hoje = new Date();

            hoje.setHours(0,0,0,0);

            const dataReserva = new Date(DataReserva);

            if (dataReserva < hoje) {

                return res.render(

                    "reservaLaboratorio/cadastrar",

                    {

                        erro:

                        "Não é possível reservar datas passadas."

                    }

                );

            }

            /* ============================================
               LABORATÓRIO EXISTE?
            ============================================ */

            const laboratorio =

                await Laboratorio.findByPk(IdLab);

            if (!laboratorio) {

                return res.render(

                    "reservaLaboratorio/cadastrar",

                    {

                        erro:

                        "Laboratório inexistente."

                    }

                );

            }

            /* ============================================
               HORÁRIO INVÁLIDO
            ============================================ */

            if (

                HoraEntrada >= HoraSaida

            ) {

                return res.render(

                    "reservaLaboratorio/cadastrar",

                    {

                        erro:

                        "Hora inicial maior que hora final."

                    }

                );

            }

            /* ============================================
               HORÁRIO DO LAB
            ============================================ */

            if (

                HoraEntrada < laboratorio.HoraEntrada ||

                HoraSaida > laboratorio.HoraSaida

            ) {

                return res.render(

                    "reservaLaboratorio/cadastrar",

                    {

                        erro:

                        "Horário fora do funcionamento do laboratório."

                    }

                );

            }

            /* ============================================
               CONFLITO DE HORÁRIO
            ============================================ */

            const conflito =

                await ReservaLaboratorioController
                .verificarConflito(

                    IdLab,

                    DataReserva,

                    HoraEntrada,

                    HoraSaida

                );

            if (conflito) {

                return res.render(

                    "reservaLaboratorio/cadastrar",

                    {

                        erro:

                        "Já existe uma reserva nesse horário."

                    }

                );

            }

            /* ============================================
               SALVAR
            ============================================ */

            await ReservaLaboratorio.create({

                IdUser:

                    req.session.usuario.id,

                IdLab,

                DataReserva,

                HoraEntrada,

                HoraSaida,

                QuantidadePessoas

            });

            res.redirect(

                "/reservas/laboratorios"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send(

                "Erro ao cadastrar reserva."

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

                IdLab,

                DataReserva,

                HoraEntrada,

                HoraSaida,

                QuantidadePessoas

            } = req.body;

            if (

                !IdUser ||

                !IdLab ||

                !DataReserva ||

                !HoraEntrada ||

                !HoraSaida ||

                !QuantidadePessoas

            ) {

                return res.status(400).json({

                    erro:

                    "Campos obrigatórios."

                });

            }

            const laboratorio =

                await Laboratorio.findByPk(IdLab);

            if (!laboratorio) {

                return res.status(404).json({

                    erro:

                    "Laboratório inexistente."

                });

            }

            if (

                HoraEntrada >= HoraSaida

            ) {

                return res.status(400).json({

                    erro:

                    "Horário inválido."

                });

            }

            if (

                HoraEntrada < laboratorio.HoraEntrada ||

                HoraSaida > laboratorio.HoraSaida

            ) {

                return res.status(400).json({

                    erro:

                    "Horário fora do funcionamento."

                });

            }

            const conflito =

                await ReservaLaboratorioController
                .verificarConflito(

                    IdLab,

                    DataReserva,

                    HoraEntrada,

                    HoraSaida

                );

            if (conflito) {

                return res.status(409).json({

                    erro:

                    "Horário ocupado."

                });

            }

            const reserva =

                await ReservaLaboratorio.create({

                    IdUser,

                    IdLab,

                    DataReserva,

                    HoraEntrada,

                    HoraSaida,

                    QuantidadePessoas

                });

            res.status(201).json(reserva);

        }

        catch (erro) {

            console.log(erro);

            res.status(500).json({

                erro:

                erro.message

            });

        }

    }
    /* =====================================================
       BUSCAR RESERVA
    ===================================================== */

    static async buscar(req, res) {

        try {

            const reserva = await ReservaLaboratorio.findByPk(

                req.params.id,

                {

                    include: [

                        Usuario,

                        Laboratorio

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
       TELA DE EDIÇÃO
    ===================================================== */

    static async editarPage(req, res) {

        try {

            const reserva = await ReservaLaboratorio.findByPk(

                req.params.id

            );

            const laboratorios = await Laboratorio.findAll({

                order: [

                    ["NomeLab", "ASC"]

                ]

            });

            if (!reserva) {

                return res.send(

                    "Reserva inexistente."

                );

            }

            res.render(

                "reservaLaboratorio/editar",

                {

                    reserva,

                    laboratorios

                }

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* =====================================================
       EDITAR
    ===================================================== */

    static async editar(req, res) {

        try {

            const reserva = await ReservaLaboratorio.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.send(

                    "Reserva não encontrada."

                );

            }

            const {

                IdLab,

                DataReserva,

                HoraEntrada,

                HoraSaida,

                QuantidadePessoas

            } = req.body;

            const laboratorio = await Laboratorio.findByPk(IdLab);

            if (!laboratorio) {

                return res.send(

                    "Laboratório inexistente."

                );

            }

            if (

                HoraEntrada >= HoraSaida

            ) {

                return res.send(

                    "Horário inválido."

                );

            }

            const reservasMesmoDia = await ReservaLaboratorio.findAll({

                where: {

                    IdLab,

                    DataReserva,

                    IdReservaLab: {

                        [Op.ne]: req.params.id

                    }

                }

            });

            let conflito = false;

            reservasMesmoDia.forEach(item => {

                if (

                    ReservaLaboratorioController.conflitoHorario(

                        item.HoraEntrada,

                        item.HoraSaida,

                        HoraEntrada,

                        HoraSaida

                    )

                ) {

                    conflito = true;

                }

            });

            if (conflito) {

                return res.send(

                    "Já existe reserva neste horário."

                );

            }

            await reserva.update({

                IdLab,

                DataReserva,

                HoraEntrada,

                HoraSaida,

                QuantidadePessoas

            });

            res.redirect(

                "/reservas/laboratorios"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send(

                "Erro ao editar."

            );

        }

    }

    /* =====================================================
       API PUT
    ===================================================== */

    static async apiEditar(req, res) {

        try {

            const reserva = await ReservaLaboratorio.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.status(404).json({

                    erro:

                    "Reserva inexistente."

                });

            }

            await reserva.update(req.body);

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

            const reserva = await ReservaLaboratorio.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.send(

                    "Reserva inexistente."

                );

            }

            await reserva.destroy();

            res.redirect(

                "/reservas/laboratorios"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send(

                "Erro."

            );

        }

    }

    /* =====================================================
       API DELETE
    ===================================================== */

    static async apiExcluir(req, res) {

        try {

            const reserva = await ReservaLaboratorio.findByPk(

                req.params.id

            );

            if (!reserva) {

                return res.status(404).json({

                    erro:

                    "Reserva inexistente."

                });

            }

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

module.exports = ReservaLaboratorioController;
