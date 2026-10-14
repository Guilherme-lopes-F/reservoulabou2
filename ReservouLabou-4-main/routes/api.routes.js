const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/auth.controller");
const authApiMiddleware = require("../middlewares/authApi");

// --- ROTAS DE AUTENTICAÇÃO DA API ---
router.post("/auth/login", AuthController.apiLogin);
router.post("/auth/cadastro", AuthController.apiCadastrar);

// --- ROTA DA HOME (Protegida por Token) ---
// O app chama essa rota assim que o usuário entra na Home para pegar os dados iniciais
router.get("/home", authApiMiddleware, async (req, res) => {
    try {
        // Aqui você pode retornar os dados que a sua Home precisa mostrar
        // Exemplo: dados do usuário logado e um resumo (você pode puxar do banco se precisar)
        res.json({
            mensagem: "Bem-vindo à Home da API!",
            usuarioId: req.usuarioId,
            admin: req.usuarioAdmin,
            // Adicione aqui outros dados que a sua tela Home precisar (ex: avisos, status, etc.)
        });
    } catch (error) {
        console.log("Erro na rota Home da API:", error);
        res.status(500).json({ erro: "Erro ao carregar dados da home." });
    }
});

module.exports = router;
