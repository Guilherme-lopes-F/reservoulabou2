const bcrypt = require("bcrypt");
const { Usuario } = require("../models");

class AuthController {

    /* ==========================
       TELAS
    ========================== */

    static loginPage(req, res) {

        res.render("auth/login");

    }

    static cadastroPage(req, res) {

        res.render("auth/cadastro");

    }

    /* ==========================
       LOGIN
    ========================== */

    static async login(req, res) {
        try {
            console.log("--> DADOS RECEBIDOS DO FORMULÁRIO:", req.body);

            const { Login, Senha } = req.body;

            if (!Login || !Senha) {
                console.log("--> ERRO: Campos vazios ou não encontrados!");
                return res.render("auth/login", {
                    erro: "Preencha todos os campos."
                });
            }

            const usuario = await Usuario.findOne({
                where: { Login: Login }
            });

            if (!usuario) {
                console.log("--> ERRO: Usuário não encontrado no banco de dados!");
                return res.render("auth/login", {
                    erro: "Usuário não encontrado."
                });
            }

            const senhaCorreta = await bcrypt.compare(Senha, usuario.Senha);

            if (!senhaCorreta) {
                console.log("--> ERRO: Senha incorreta!");
                return res.render("auth/login", {
                    erro: "Senha incorreta."
                });
            }

            console.log("--> SUCESSO! Login correto. Redirecionando...");

            req.session.usuario = {
                id: usuario.IdUser,
                login: usuario.Login,
                admin: usuario.StatusADM
            };

            res.redirect("/");

        } catch (erro) {
            console.log("--> ERRO NO CATCH:", erro);
            res.status(500).send("Erro interno.");
        }
    }

    /* ==========================
       CADASTRO
    ========================== */

    static async cadastrar(req, res) {

        try {

            // Alterado também no cadastro para 'Login' e 'Senha'
            const { Login, Senha } = req.body;

            if (!Login || !Senha) {

                return res.render("auth/cadastro", {

                    erro: "Todos os campos são obrigatórios."

                });

            }

            const existe =

                await Usuario.findOne({

                    where: {

                        Login: Login

                    }

                });

            if (existe) {

                return res.render("auth/cadastro", {

                    erro: "Login já existente."

                });

            }

            const hash =

                await bcrypt.hash(

                    Senha,

                    10

                );

            await Usuario.create({

                Login: Login,

                Senha: hash,

                StatusADM: false

            });

            res.redirect("/auth/login"); // Corrigido de /login para /auth/login

        }

        catch (erro) {

            console.log(erro);

            res.status(500).send("Erro.");

        }

    }

    /* ==========================
       LOGOUT
    ========================== */

    static logout(req, res) {

        req.session.destroy(() => {

            res.redirect("/login");

        });

    }

    /* ==========================
       API JSON
    ========================== */

    static async apiUsuarios(req, res) {

        const usuarios =

            await Usuario.findAll({

                attributes: [

                    "IdUser",

                    "Login",

                    "StatusADM"

                ]

            });

        res.json(usuarios);

    }

}

module.exports = AuthController;
