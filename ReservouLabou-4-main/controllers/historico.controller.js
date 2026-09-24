const {
    Usuario,
    Laboratorio,
    Equipamento,
    ReservaLaboratorio,
    ReservaEquipamento,
    Relatorio
} = require("../models");

const { Op } = require("sequelize");

class HistoricoController {

    /* =====================================================
       PÁGINA PRINCIPAL DO HISTÓRICO
    ===================================================== */

    static async historico(req, res) {
        try {

            const reservasLaboratorio =
                await ReservaLaboratorio.findAll({
                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Laboratorio
                        }
                    ],
                    order: [
                        ["DataReserva", "DESC"],
                        ["HoraEntrada", "DESC"]
                    ]
                });

            const reservasEquipamento =
                await ReservaEquipamento.findAll({
                    include: [
                        {
                            model: Usuario
                        }
                    ],
                    order: [
                        ["DataReserva", "DESC"],
                        ["HoraEntrada", "DESC"]
                    ]
                });

            return res.render(
                "historico/index",
                {
                    reservasLaboratorio,
                    reservasEquipamento
                }
            );

        } catch (erro) {

            console.log("Erro no histórico:", erro);

            return res.status(500).send(
                "Erro ao carregar o histórico."
            );
        }
    }


    /* =====================================================
       DASHBOARD
    ===================================================== */

    static async dashboard(req, res) {
        try {

            const totalReservasLaboratorio =
                await ReservaLaboratorio.count();

            const totalReservasEquipamento =
                await ReservaEquipamento.count();

            const totalUsuarios =
                await Usuario.count();

            const totalLaboratorios =
                await Laboratorio.count();

            const totalEquipamentos =
                await Equipamento.count();

            const totalRelatorios =
                await Relatorio.count();

            return res.render(
                "historico/dashboard",
                {
                    totalReservasLaboratorio,
                    totalReservasEquipamento,
                    totalUsuarios,
                    totalLaboratorios,
                    totalEquipamentos,
                    totalRelatorios
                }
            );

        } catch (erro) {

            console.log("Erro no dashboard:", erro);

            return res.status(500).send(
                "Erro ao carregar o dashboard."
            );
        }
    }


    /* =====================================================
       ESTATÍSTICAS
    ===================================================== */

    static async estatisticas(req, res) {
        try {

            const totalReservasLaboratorio =
                await ReservaLaboratorio.count();

            const totalReservasEquipamento =
                await ReservaEquipamento.count();

            const totalUsuarios =
                await Usuario.count();

            const totalLaboratorios =
                await Laboratorio.count();

            const totalEquipamentos =
                await Equipamento.count();

            const totalRelatorios =
                await Relatorio.count();

            const reservasLaboratorio =
                await ReservaLaboratorio.findAll({
                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Laboratorio
                        }
                    ],
                    order: [
                        ["DataReserva", "DESC"]
                    ]
                });

            return res.render(
                "historico/estatisticas",
                {
                    totalReservasLaboratorio,
                    totalReservasEquipamento,
                    totalUsuarios,
                    totalLaboratorios,
                    totalEquipamentos,
                    totalRelatorios,
                    reservasLaboratorio
                }
            );

        } catch (erro) {

            console.log("Erro nas estatísticas:", erro);

            return res.status(500).send(
                "Erro ao carregar estatísticas."
            );
        }
    }


    /* =====================================================
       LISTAR RELATÓRIOS
    ===================================================== */

    static async listarRelatorios(req, res) {
        try {

            const relatorios =
                await Relatorio.findAll({

                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: ReservaLaboratorio,
                            include: [
                                {
                                    model: Laboratorio
                                }
                            ]
                        }
                    ],

                    order: [
                        ["DataGeracao", "DESC"]
                    ]
                });

            return res.render(
                "historico/relatorios",
                {
                    relatorios
                }
            );

        } catch (erro) {

            console.log("Erro ao listar relatórios:", erro);

            return res.status(500).send(
                "Erro ao listar relatórios."
            );
        }
    }


    /* =====================================================
       GERAR RELATÓRIO
    ===================================================== */

    static async gerarRelatorio(req, res) {
        try {

            const {
                IdReservaLab,
                Descricao
            } = req.body;

            if (!IdReservaLab) {
                return res.status(400).send(
                    "A reserva deve ser informada."
                );
            }

            const reserva =
                await ReservaLaboratorio.findByPk(
                    IdReservaLab
                );

            if (!reserva) {
                return res.status(404).send(
                    "Reserva não encontrada."
                );
            }

            const IdUser =
                req.user?.IdUser ||
                req.user?.IdUsuario ||
                req.user?.id ||
                req.session?.IdUser ||
                req.session?.IdUsuario ||
                req.session?.usuario?.IdUser ||
                req.session?.usuario?.IdUsuario ||
                req.session?.usuario?.id;

            if (!IdUser) {
                return res.status(401).send(
                    "Usuário não identificado."
                );
            }

            await Relatorio.create({

                IdUser: IdUser,

                IdReservaLab: IdReservaLab,

                Descricao: Descricao || ""

            });

            return res.redirect(
                "/historico/relatorios"
            );

        } catch (erro) {

            console.log("Erro ao gerar relatório:", erro);

            return res.status(500).send(
                "Erro ao gerar relatório."
            );
        }
    }


    /* =====================================================
       EXCLUIR RELATÓRIO
    ===================================================== */

    static async excluirRelatorio(req, res) {
        try {

            const relatorio =
                await Relatorio.findByPk(
                    req.params.id
                );

            if (!relatorio) {
                return res.status(404).send(
                    "Relatório não encontrado."
                );
            }

            await relatorio.destroy();

            return res.redirect(
                "/historico/relatorios"
            );

        } catch (erro) {

            console.log("Erro ao excluir relatório:", erro);

            return res.status(500).send(
                "Erro ao excluir relatório."
            );
        }
    }


    /* =====================================================
       BUSCAR RESERVAS POR USUÁRIO
    ===================================================== */

    static async buscarUsuario(req, res) {
        try {

            const reservasLaboratorio =
                await ReservaLaboratorio.findAll({

                    where: {
                        IdUser: req.params.id
                    },

                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Laboratorio
                        }
                    ],

                    order: [
                        ["DataReserva", "DESC"]
                    ]
                });

            const reservasEquipamento =
                await ReservaEquipamento.findAll({

                    where: {
                        IdUser: req.params.id
                    },

                    include: [
                        {
                            model: Usuario
                        }
                    ],

                    order: [
                        ["DataReserva", "DESC"]
                    ]
                });

            return res.json({
                reservasLaboratorio,
                reservasEquipamento
            });

        } catch (erro) {

            console.log("Erro ao buscar usuário:", erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }


    /* =====================================================
       BUSCAR RESERVAS POR LABORATÓRIO
    ===================================================== */

    static async buscarLaboratorio(req, res) {
        try {

            const reservas =
                await ReservaLaboratorio.findAll({

                    where: {
                        IdLab: req.params.id
                    },

                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Laboratorio
                        }
                    ],

                    order: [
                        ["DataReserva", "DESC"],
                        ["HoraEntrada", "DESC"]
                    ]
                });

            return res.json(reservas);

        } catch (erro) {

            console.log(
                "Erro ao buscar laboratório:",
                erro
            );

            return res.status(500).json({
                erro: erro.message
            });
        }
    }


    /* =====================================================
       BUSCAR RESERVAS POR PERÍODO
    ===================================================== */

    static async buscarPeriodo(req, res) {
        try {

            const {
                inicio,
                fim
            } = req.query;

            if (!inicio || !fim) {
                return res.status(400).json({
                    erro:
                        "Informe as datas inicial e final."
                });
            }

            const reservasLaboratorio =
                await ReservaLaboratorio.findAll({

                    where: {
                        DataReserva: {
                            [Op.between]: [
                                inicio,
                                fim
                            ]
                        }
                    },

                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Laboratorio
                        }
                    ],

                    order: [
                        ["DataReserva", "ASC"],
                        ["HoraEntrada", "ASC"]
                    ]
                });

            const reservasEquipamento =
                await ReservaEquipamento.findAll({

                    where: {
                        DataReserva: {
                            [Op.between]: [
                                inicio,
                                fim
                            ]
                        }
                    },

                    include: [
                        {
                            model: Usuario
                        }
                    ],

                    order: [
                        ["DataReserva", "ASC"],
                        ["HoraEntrada", "ASC"]
                    ]
                });

            return res.json({
                reservasLaboratorio,
                reservasEquipamento
            });

        } catch (erro) {

            console.log(
                "Erro ao buscar período:",
                erro
            );

            return res.status(500).json({
                erro: erro.message
            });
        }
    }


    /* =====================================================
       API DASHBOARD
    ===================================================== */

    static async apiDashboard(req, res) {
        try {

            const totalReservasLaboratorio =
                await ReservaLaboratorio.count();

            const totalReservasEquipamento =
                await ReservaEquipamento.count();

            const totalUsuarios =
                await Usuario.count();

            const totalLaboratorios =
                await Laboratorio.count();

            const totalEquipamentos =
                await Equipamento.count();

            const totalRelatorios =
                await Relatorio.count();

            return res.json({

                totalReservasLaboratorio,

                totalReservasEquipamento,

                totalUsuarios,

                totalLaboratorios,

                totalEquipamentos,

                totalRelatorios

            });

        } catch (erro) {

            console.log(
                "Erro na API do dashboard:",
                erro
            );

            return res.status(500).json({
                erro: erro.message
            });
        }
    }


    /* =====================================================
       API HISTÓRICO
    ===================================================== */

    static async apiHistorico(req, res) {
        try {

            const reservasLaboratorio =
                await ReservaLaboratorio.findAll({

                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: Laboratorio
                        }
                    ],

                    order: [
                        ["DataReserva", "DESC"],
                        ["HoraEntrada", "DESC"]
                    ]
                });

            const reservasEquipamento =
                await ReservaEquipamento.findAll({

                    include: [
                        {
                            model: Usuario
                        }
                    ],

                    order: [
                        ["DataReserva", "DESC"],
                        ["HoraEntrada", "DESC"]
                    ]
                });

            return res.json({

                reservasLaboratorio,

                reservasEquipamento

            });

        } catch (erro) {

            console.log(
                "Erro na API do histórico:",
                erro
            );

            return res.status(500).json({
                erro: erro.message
            });
        }
    }


    /* =====================================================
       API RELATÓRIOS
    ===================================================== */

    static async apiRelatorios(req, res) {
        try {

            const relatorios =
                await Relatorio.findAll({

                    include: [
                        {
                            model: Usuario
                        },
                        {
                            model: ReservaLaboratorio,
                            include: [
                                {
                                    model: Laboratorio
                                }
                            ]
                        }
                    ],

                    order: [
                        ["DataGeracao", "DESC"]
                    ]
                });

            return res.json(relatorios);

        } catch (erro) {

            console.log(
                "Erro na API de relatórios:",
                erro
            );

            return res.status(500).json({
                erro: erro.message
            });
        }
    }


    /* =====================================================
       API EXCLUIR RELATÓRIO
    ===================================================== */

    static async apiExcluirRelatorio(req, res) {
        try {

            const relatorio =
                await Relatorio.findByPk(
                    req.params.id
                );

            if (!relatorio) {
                return res.status(404).json({
                    erro:
                        "Relatório não encontrado."
                });
            }

            await relatorio.destroy();

            return res.json({
                mensagem:
                    "Relatório removido com sucesso."
            });

        } catch (erro) {

            console.log(
                "Erro ao excluir relatório:",
                erro
            );

            return res.status(500).json({
                erro: erro.message
            });
        }
    }
}

module.exports = HistoricoController;
