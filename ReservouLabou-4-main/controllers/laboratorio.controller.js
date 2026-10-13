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

     /* ==========================
       LISTAGEM ADMINISTRATIVA
    ========================== */

    
static async listarAdmin(req, res) {
    const laboratorios = await Laboratorio.findAll({
        include: [DiasDispo]
    });

    const laboratoriosFormatados = laboratorios.map(laboratorio =>
        laboratorio.toJSON()
    );

    res.render("admin/laboratorios/listarLab", {
        laboratorios: laboratoriosFormatados
    });
}

    /* ==========================
       FORMULÁRIO ADMINISTRATIVO
    ========================== */

    static cadastroPageAdmin(req, res) {
        res.render("admin/laboratorios/cadastrarLab");
    }

    static async editarPageAdmin(req, res) {
        const laboratorio = await Laboratorio.findByPk(
            req.params.id
        );

        if (!laboratorio) {
            return res.status(404).send(
                "Laboratório não encontrado."
            );
        }

        res.render("admin/laboratorios/editarLab", {
            laboratorio
        });
    }

    
    /* ==========================
       CADASTRAR ADMIN
    ========================== */

    static async cadastrarAdmin(req, res) {
        try {
            const { NomeLab, HoraEntrada, HoraSaida } = req.body;

            if (!NomeLab || !HoraEntrada || !HoraSaida) {
                return res.status(400).send(
                    "Todos os campos são obrigatórios."
                );
            }

            if (HoraEntrada >= HoraSaida) {
                return res.status(400).send(
                    "A hora de entrada deve ser anterior à hora de saída."
                );
            }

            const existe = await Laboratorio.findOne({
                where: { NomeLab }
            });

            if (existe) {
                return res.status(400).send(
                    "Já existe um laboratório com esse nome."
                );
            }

            await Laboratorio.create({
                NomeLab,
                HoraEntrada,
                HoraSaida
            });

            res.redirect("/admin/laboratorios");
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao cadastrar laboratório.");
        }
    }

    /* ==========================
       EDITAR ADMIN
    ========================== */

    static async editarAdmin(req, res) {
        try {
            const laboratorio = await Laboratorio.findByPk(req.params.id);

            if (!laboratorio) {
                return res.status(404).send(
                    "Laboratório não encontrado."
                );
            }

            const { NomeLab, HoraEntrada, HoraSaida } = req.body;

            if (!NomeLab || !HoraEntrada || !HoraSaida) {
                return res.status(400).send(
                    "Todos os campos são obrigatórios."
                );
            }

            if (HoraEntrada >= HoraSaida) {
                return res.status(400).send(
                    "A hora de entrada deve ser anterior à hora de saída."
                );
            }

            await laboratorio.update({
                NomeLab,
                HoraEntrada,
                HoraSaida
            });

            res.redirect("/admin/laboratorios");
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao editar laboratório.");
        }
    }

    /* ==========================
       EXCLUIR ADMIN
    ========================== */

    static async excluirAdmin(req, res) {
        try {
            const laboratorio = await Laboratorio.findByPk(req.params.id);

            if (!laboratorio) {
                return res.status(404).send(
                    "Laboratório não encontrado."
                );
            }

            await laboratorio.destroy();

            res.redirect("/admin/laboratorios");
        } catch (erro) {
            console.log(erro);
            res.status(500).send("Erro ao excluir laboratório.");
        }
    }


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
