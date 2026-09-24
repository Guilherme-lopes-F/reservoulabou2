const {

    Laboratorio,

    DiasDispo

} = require("../models");

class LaboratorioController {

    /* ==========================
       LISTAGEM
    ========================== */

    static async listar(req, res) {

        const laboratorios =

            await Laboratorio.findAll({

                include: [

                    DiasDispo

                ]

            });

        res.render(

            "laboratorio/listar",

            {

                laboratorios

            }

        );

    }

    /* ==========================
       API JSON
    ========================== */

    static async apiListar(req, res) {

        const laboratorios =

            await Laboratorio.findAll({

                include: [

                    DiasDispo

                ]

            });

        res.json(laboratorios);

    }

    /* ==========================
       FORM CADASTRO
    ========================== */

    static cadastroPage(req, res) {

        res.render(

            "laboratorio/cadastrar"

        );

    }

    /* ==========================
       CADASTRAR
    ========================== */

    static async cadastrar(req, res) {

        try {

            const {

                NomeLab,

                HoraEntrada,

                HoraSaida

            } = req.body;

            if (

                !NomeLab ||

                !HoraEntrada ||

                !HoraSaida

            ) {

                return res.render(

                    "laboratorio/cadastrar",

                    {

                        erro:

                        "Todos os campos são obrigatórios."

                    }

                );

            }

            const existe =

                await Laboratorio.findOne({

                    where: {

                        NomeLab

                    }

                });

            if (existe) {

                return res.render(

                    "laboratorio/cadastrar",

                    {

                        erro:

                        "Já existe um laboratório com esse nome."

                    }

                );

            }

            if (

                HoraEntrada >= HoraSaida

            ) {

                return res.render(

                    "laboratorio/cadastrar",

                    {

                        erro:

                        "Hora inicial deve ser menor."

                    }

                );

            }

            await Laboratorio.create({

                NomeLab,

                HoraEntrada,

                HoraSaida

            });

            res.redirect(

                "/laboratorios"

            );

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send(erro);

        }

    }

    /* ==========================
       EDITAR
    ========================== */

    static async editarPage(req, res) {

        const laboratorio =

            await Laboratorio.findByPk(

                req.params.id

            );

        res.render(

            "laboratorio/editar",

            {

                laboratorio

            }

        );

    }

    static async editar(req, res) {

        const laboratorio =

            await Laboratorio.findByPk(

                req.params.id

            );

        if (!laboratorio) {

            return res.send(

                "Laboratório não encontrado."

            );

        }

        await laboratorio.update({

            NomeLab:

                req.body.NomeLab,

            HoraEntrada:

                req.body.HoraEntrada,

            HoraSaida:

                req.body.HoraSaida

        });

        res.redirect(

            "/laboratorios"

        );

    }

    /* ==========================
       EXCLUIR
    ========================== */

    static async excluir(req, res) {

        const laboratorio =

            await Laboratorio.findByPk(

                req.params.id

            );

        if (!laboratorio) {

            return res.send(

                "Laboratório inexistente."

            );

        }

        await laboratorio.destroy();

        res.redirect(

            "/laboratorios"

        );

    }

    /* ==========================
       API GET
    ========================== */

    static async buscar(req, res) {

        const laboratorio =

            await Laboratorio.findByPk(

                req.params.id

            );

        if (!laboratorio) {

            return res.status(404).json({

                erro:

                "Laboratório não encontrado."

            });

        }

        res.json(laboratorio);

    }

    /* ==========================
       API PUT
    ========================== */

    static async apiEditar(req, res) {

        const laboratorio =

            await Laboratorio.findByPk(

                req.params.id

            );

        if (!laboratorio) {

            return res.status(404).json({

                erro:

                "Laboratório inexistente."

            });

        }

        await laboratorio.update(req.body);

        res.json({

            mensagem:

            "Atualizado com sucesso."

        });

    }

    /* ==========================
       API DELETE
    ========================== */

    static async apiExcluir(req, res) {

        const laboratorio =

            await Laboratorio.findByPk(

                req.params.id

            );

        if (!laboratorio) {

            return res.status(404).json({

                erro:

                "Laboratório não encontrado."

            });

        }

        await laboratorio.destroy();

        res.json({

            mensagem:

            "Laboratório removido."

        });

    }

}

module.exports = LaboratorioController;
