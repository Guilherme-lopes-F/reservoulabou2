const bcrypt = require("bcrypt");
const { Usuario } = require("../models");
const jwt = require("jsonwebtoken");

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

            if (usuario.StatusADM) {
                return res.redirect("/admin");
            }

            return res.redirect("/");

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
            const { Login, Senha, ChaveADM } = req.body;

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
            const chaveConfigurada = process.env.CHAVE_ADMIN;

            const ehAdmin =
                Boolean(chaveConfigurada) &&
                Boolean(ChaveADM) &&
                ChaveADM === chaveConfigurada;

            await Usuario.create({

                Login: Login,

                Senha: hash,

                StatusADM: ehAdmin

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
    /* ==========================
       API CADASTRO (PARA O REACT NATIVE)
    ========================== */

    static async apiCadastrar(req, res) {
        try {
            const { Login, Senha, ChaveADM } = req.body;

            if (!Login || !Senha) {
                return res.status(400).json({ erro: "Todos os campos são obrigatórios." });
            }

            const existe = await Usuario.findOne({ where: { Login } });

            if (existe) {
                return res.status(400).json({ erro: "Login já existente." });
            }

            const hash = await bcrypt.hash(Senha, 10);
            const chaveConfigurada = process.env.CHAVE_ADMIN;

            const ehAdmin =
                Boolean(chaveConfigurada) &&
                Boolean(ChaveADM) &&
                ChaveADM === chaveConfigurada;

            const novoUsuario = await Usuario.create({
                Login: Login,
                Senha: hash,
                StatusADM: ehAdmin
            });

            return res.status(201).json({
                mensagem: "Usuário cadastrado com sucesso!",
                usuario: {
                    id: novoUsuario.IdUser,
                    login: novoUsuario.Login,
                    admin: novoUsuario.StatusADM
                }
            });

        } catch (erro) {
            console.log("--> ERRO NA API CADASTRO:", erro);
            res.status(500).json({ erro: "Erro interno no servidor." });
        }
    }

        /* ==========================
       API Login(PARA O REACT NATIVE)
    ========================== */
    static async apiLogin(req, res) {
        try {
            const { Login, Senha } = req.body;

            if (!Login || !Senha) {
                return res.status(400).json({ erro: "Preencha todos os campos." });
            }

            const usuario = await Usuario.findOne({ where: { Login } });

            if (!usuario) {
                return res.status(401).json({ erro: "Usuário não encontrado." });
            }

            const senhaCorreta = await bcrypt.compare(Senha, usuario.Senha);

            if (!senhaCorreta) {
                return res.status(401).json({ erro: "Senha incorreta." });
            }

            // Gera o Token JWT válido por 7 dias
            const token = jwt.sign(
                { id: usuario.IdUser, login: usuario.Login, admin: usuario.StatusADM },
                process.env.JWT_SECRET || "sua_chave_secreta_jwt_aqui",
                { expiresIn: "7d" }
            );

            return res.json({
                mensagem: "Login realizado com sucesso!",
                token,
                usuario: {
                    id: usuario.IdUser,
                    login: usuario.Login,
                    admin: usuario.StatusADM
                }
            });

        } catch (erro) {
            console.log("--> ERRO NA API LOGIN:", erro);
            res.status(500).json({ erro: "Erro interno no servidor." });
        }
    }

}

module.exports = AuthController;
