const {
    ReservaEquipamento,
    ReservaEquipamentoItem,
    Equipamento,
    Usuario
} = require("../models");

const { Op } = require("sequelize");

class ReservaEquipamentoController {

    static async calcularQuantidadeDisponivel(
        idEquip,
        data,
        horaEntrada,
        horaSaida,
        idReservaIgnorar = null
    ) {
        const equipamento = await Equipamento.findByPk(idEquip);

        if (!equipamento) {
            return 0;
        }

        const whereReserva = {
            DataReserva: data
        };

        if (idReservaIgnorar) {
            whereReserva.IdReservaEquipamento = {
                [Op.ne]: idReservaIgnorar
            };
        }

        const reservas = await ReservaEquipamento.findAll({
            where: whereReserva,
            include: [
                {
                    model: Equipamento,
                    where: {
                        IdEquip: idEquip
                    },
                    through: {
                        attributes: ["Quantidade"]
                    }
                }
            ]
        });

        let reservado = 0;

        reservas.forEach((reserva) => {
            const conflito =
                horaEntrada < reserva.HoraSaida &&
                horaSaida > reserva.HoraEntrada;

            if (!conflito) {
                return;
            }

            if (!reserva.Equipamentos) {
                return;
            }

            reserva.Equipamentos.forEach((equipamentoReservado) => {
                if (
                    equipamentoReservado.Reserva_Equipamento &&
                    equipamentoReservado.Reserva_Equipamento.Quantidade
                ) {
                    reservado += Number(
                        equipamentoReservado.Reserva_Equipamento.Quantidade
                    );
                }
            });
        });

        return Math.max(
            Number(equipamento.Quantidade) - reservado,
            0
        );
    }

    static async verificarDisponibilidade(req, res) {
        try {
            const {
                idEquip,
                data,
                horaEntrada,
                horaSaida
            } = req.query;

            if (
                !idEquip ||
                !data ||
                !horaEntrada ||
                !horaSaida
            ) {
                return res.status(400).json({
                    erro: "Parâmetros obrigatórios."
                });
            }

            if (horaEntrada >= horaSaida) {
                return res.status(400).json({
                    erro: "A hora de entrada deve ser menor que a hora de saída."
                });
            }

            const disponivel =
                await ReservaEquipamentoController.calcularQuantidadeDisponivel(
                    idEquip,
                    data,
                    horaEntrada,
                    horaSaida
                );

            return res.json({
                quantidadeDisponivel: disponivel
            });

        } catch (erro) {
            console.log(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }

    static async listar(req, res) {
        try {
            const reservas = await ReservaEquipamento.findAll({
                include: [
                    Usuario,
                    Equipamento
                ],
                order: [
                    ["DataReserva", "ASC"],
                    ["HoraEntrada", "ASC"]
                ]
            });

            return res.render(
                "reservaEquipamento/listar",
                {
                    reservas
                }
            );

        } catch (erro) {
            console.log(erro);

            return res.status(500).send(
                "Erro ao listar reservas de equipamentos."
            );
        }
    }

    static async cadastroPage(req, res) {
        try {
            const equipamentos = await Equipamento.findAll({
                order: [
                    ["NomeEquip", "ASC"]
                ]
            });

            return res.render(
                "reservaEquipamento/cadastrar",
                {
                    equipamentos
                }
            );

        } catch (erro) {
            console.log(erro);

            return res.status(500).send(
                "Erro ao carregar página de cadastro."
            );
        }
    }

    static async cadastrar(req, res) {
        try {
            const {
                DataReserva,
                HoraEntrada,
                HoraSaida,
                IdEquip,
                Quantidade
            } = req.body;

            if (
                !DataReserva ||
                !HoraEntrada ||
                !HoraSaida ||
                !IdEquip ||
                !Quantidade
            ) {
                return res.status(400).send(
                    "Todos os campos obrigatórios devem ser preenchidos."
                );
            }

            if (HoraEntrada >= HoraSaida) {
                return res.status(400).send(
                    "A hora de entrada deve ser menor que a hora de saída."
                );
            }

            const quantidade = Number(Quantidade);

            if (
                Number.isNaN(quantidade) ||
                quantidade <= 0
            ) {
                return res.status(400).send(
                    "A quantidade deve ser maior que zero."
                );
            }

            const equipamento = await Equipamento.findByPk(IdEquip);

            if (!equipamento) {
                return res.status(404).send(
                    "Equipamento não encontrado."
                );
            }

            const disponivel =
                await ReservaEquipamentoController.calcularQuantidadeDisponivel(
                    IdEquip,
                    DataReserva,
                    HoraEntrada,
                    HoraSaida
                );

            if (quantidade > disponivel) {
                return res.status(400).send(
                    `Quantidade indisponível. Quantidade disponível: ${disponivel}.`
                );
            }

            const IdUsuario =
                req.user?.IdUsuario ||
                req.user?.id ||
                req.session?.IdUsuario ||
                req.session?.usuario?.IdUsuario;

            if (!IdUsuario) {
                return res.status(401).send(
                    "Usuário não identificado."
                );
            }

            const reserva = await ReservaEquipamento.create({
                IdUsuario: IdUsuario,
                DataReserva: DataReserva,
                HoraEntrada: HoraEntrada,
                HoraSaida: HoraSaida
            });

            await ReservaEquipamentoItem.create({
                IdReservaEquipamento: reserva.IdReservaEquipamento,
                IdEquip: IdEquip,
                Quantidade: quantidade
            });

            return res.redirect("/reservaEquipamento");

        } catch (erro) {
            console.log(erro);

            return res.status(500).send(
                "Erro ao cadastrar reserva de equipamento."
            );
        }
    }

    static async editarPage(req, res) {
        try {
            const { id } = req.params;

            const reserva = await ReservaEquipamento.findByPk(
                id,
                {
                    include: [
                        Usuario,
                        Equipamento
                    ]
                }
            );

            if (!reserva) {
                return res.status(404).send(
                    "Reserva não encontrada."
                );
            }

            const equipamentos = await Equipamento.findAll({
                order: [
                    ["NomeEquip", "ASC"]
                ]
            });

            return res.render(
                "reservaEquipamento/editar",
                {
                    reserva,
                    equipamentos
                }
            );

        } catch (erro) {
            console.log(erro);

            return res.status(500).send(
                "Erro ao carregar reserva."
            );
        }
    }

    static async editar(req, res) {
        try {
            const { id } = req.params;

            const {
                DataReserva,
                HoraEntrada,
                HoraSaida,
                IdEquip,
                Quantidade
            } = req.body;

            const reserva =
                await ReservaEquipamento.findByPk(id);

            if (!reserva) {
                return res.status(404).send(
                    "Reserva não encontrada."
                );
            }

            if (
                !DataReserva ||
                !HoraEntrada ||
                !HoraSaida ||
                !IdEquip ||
                !Quantidade
            ) {
                return res.status(400).send(
                    "Todos os campos obrigatórios devem ser preenchidos."
                );
            }

            if (HoraEntrada >= HoraSaida) {
                return res.status(400).send(
                    "A hora de entrada deve ser menor que a hora de saída."
                );
            }

            const quantidade = Number(Quantidade);

            if (
                Number.isNaN(quantidade) ||
                quantidade <= 0
            ) {
                return res.status(400).send(
                    "A quantidade deve ser maior que zero."
                );
            }

            const equipamento =
                await Equipamento.findByPk(IdEquip);

            if (!equipamento) {
                return res.status(404).send(
                    "Equipamento não encontrado."
                );
            }

            const disponivel =
                await ReservaEquipamentoController.calcularQuantidadeDisponivel(
                    IdEquip,
                    DataReserva,
                    HoraEntrada,
                    HoraSaida,
                    id
                );

            if (quantidade > disponivel) {
                return res.status(400).send(
                    `Quantidade indisponível. Quantidade disponível: ${disponivel}.`
                );
            }

            await reserva.update({
                DataReserva: DataReserva,
                HoraEntrada: HoraEntrada,
                HoraSaida: HoraSaida
            });

            await ReservaEquipamentoItem.destroy({
                where: {
                    IdReservaEquipamento: id
                }
            });

            await ReservaEquipamentoItem.create({
                IdReservaEquipamento: id,
                IdEquip: IdEquip,
                Quantidade: quantidade
            });

            return res.redirect("/reservaEquipamento");

        } catch (erro) {
            console.log(erro);

            return res.status(500).send(
                "Erro ao editar reserva."
            );
        }
    }

    static async excluir(req, res) {
        try {
            const { id } = req.params;

            const reserva =
                await ReservaEquipamento.findByPk(id);

            if (!reserva) {
                return res.status(404).send(
                    "Reserva não encontrada."
                );
            }

            await ReservaEquipamentoItem.destroy({
                where: {
                    IdReservaEquipamento: id
                }
            });

            await reserva.destroy();

            return res.redirect("/reservaEquipamento");

        } catch (erro) {
            console.log(erro);

            return res.status(500).send(
                "Erro ao excluir reserva."
            );
        }
    }

    static async apiListar(req, res) {
        try {
            const reservas =
                await ReservaEquipamento.findAll({
                    include: [
                        Usuario,
                        Equipamento
                    ],
                    order: [
                        ["DataReserva", "ASC"],
                        ["HoraEntrada", "ASC"]
                    ]
                });

            return res.json(reservas);

        } catch (erro) {
            console.log(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }

    static async buscar(req, res) {
        try {
            const { id } = req.params;

            const reserva =
                await ReservaEquipamento.findByPk(
                    id,
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

            return res.json(reserva);

        } catch (erro) {
            console.log(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }

    static async apiCadastrar(req, res) {
        try {
            const {
                DataReserva,
                HoraEntrada,
                HoraSaida,
                IdEquip,
                Quantidade,
                IdUsuario
            } = req.body;

            if (
                !DataReserva ||
                !HoraEntrada ||
                !HoraSaida ||
                !IdEquip ||
                !Quantidade
            ) {
                return res.status(400).json({
                    erro: "Todos os campos obrigatórios devem ser preenchidos."
                });
            }

            if (HoraEntrada >= HoraSaida) {
                return res.status(400).json({
                    erro: "A hora de entrada deve ser menor que a hora de saída."
                });
            }

            const quantidade = Number(Quantidade);

            if (
                Number.isNaN(quantidade) ||
                quantidade <= 0
            ) {
                return res.status(400).json({
                    erro: "Quantidade inválida."
                });
            }

            const equipamento =
                await Equipamento.findByPk(IdEquip);

            if (!equipamento) {
                return res.status(404).json({
                    erro: "Equipamento não encontrado."
                });
            }

            const disponivel =
                await ReservaEquipamentoController.calcularQuantidadeDisponivel(
                    IdEquip,
                    DataReserva,
                    HoraEntrada,
                    HoraSaida
                );

            if (quantidade > disponivel) {
                return res.status(400).json({
                    erro: "Quantidade indisponível.",
                    quantidadeDisponivel: disponivel
                });
            }

            const usuario =
                IdUsuario ||
                req.user?.IdUsuario ||
                req.user?.id ||
                req.session?.IdUsuario ||
                req.session?.usuario?.IdUsuario;

            if (!usuario) {
                return res.status(401).json({
                    erro: "Usuário não identificado."
                });
            }

            const reserva =
                await ReservaEquipamento.create({
                    IdUsuario: usuario,
                    DataReserva: DataReserva,
                    HoraEntrada: HoraEntrada,
                    HoraSaida: HoraSaida
                });

            const item =
                await ReservaEquipamentoItem.create({
                    IdReservaEquipamento:
                        reserva.IdReservaEquipamento,
                    IdEquip: IdEquip,
                    Quantidade: quantidade
                });

            return res.status(201).json({
                mensagem: "Reserva criada com sucesso.",
                reserva: reserva,
                item: item
            });

        } catch (erro) {
            console.log(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }

    static async apiEditar(req, res) {
        try {
            const { id } = req.params;

            const {
                DataReserva,
                HoraEntrada,
                HoraSaida,
                IdEquip,
                Quantidade
            } = req.body;

            const reserva =
                await ReservaEquipamento.findByPk(id);

            if (!reserva) {
                return res.status(404).json({
                    erro: "Reserva não encontrada."
                });
            }

            if (
                !DataReserva ||
                !HoraEntrada ||
                !HoraSaida ||
                !IdEquip ||
                !Quantidade
            ) {
                return res.status(400).json({
                    erro: "Todos os campos obrigatórios devem ser preenchidos."
                });
            }

            if (HoraEntrada >= HoraSaida) {
                return res.status(400).json({
                    erro: "A hora de entrada deve ser menor que a hora de saída."
                });
            }

            const quantidade = Number(Quantidade);

            if (
                Number.isNaN(quantidade) ||
                quantidade <= 0
            ) {
                return res.status(400).json({
                    erro: "Quantidade inválida."
                });
            }

            const equipamento =
                await Equipamento.findByPk(IdEquip);

            if (!equipamento) {
                return res.status(404).json({
                    erro: "Equipamento não encontrado."
                });
            }

            const disponivel =
                await ReservaEquipamentoController.calcularQuantidadeDisponivel(
                    IdEquip,
                    DataReserva,
                    HoraEntrada,
                    HoraSaida,
                    id
                );

            if (quantidade > disponivel) {
                return res.status(400).json({
                    erro: "Quantidade indisponível.",
                    quantidadeDisponivel: disponivel
                });
            }

            await reserva.update({
                DataReserva: DataReserva,
                HoraEntrada: HoraEntrada,
                HoraSaida: HoraSaida
            });

            await ReservaEquipamentoItem.destroy({
                where: {
                    IdReservaEquipamento: id
                }
            });

            const item =
                await ReservaEquipamentoItem.create({
                    IdReservaEquipamento: id,
                    IdEquip: IdEquip,
                    Quantidade: quantidade
                });

            return res.json({
                mensagem: "Reserva atualizada com sucesso.",
                reserva: reserva,
                item: item
            });

        } catch (erro) {
            console.log(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }

    static async apiExcluir(req, res) {
        try {
            const { id } = req.params;

            const reserva =
                await ReservaEquipamento.findByPk(id);

            if (!reserva) {
                return res.status(404).json({
                    erro: "Reserva não encontrada."
                });
            }

            await ReservaEquipamentoItem.destroy({
                where: {
                    IdReservaEquipamento: id
                }
            });

            await reserva.destroy();

            return res.json({
                mensagem: "Reserva excluída com sucesso."
            });

        } catch (erro) {
            console.log(erro);

            return res.status(500).json({
                erro: erro.message
            });
        }
    }
}

module.exports = ReservaEquipamentoController;
