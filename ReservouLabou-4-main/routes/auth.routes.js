const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/auth.controller");

/* =====================================
   TELAS
===================================== */

router.get(
    "/login",
    AuthController.loginPage
);

router.get(
    "/cadastro",
    AuthController.cadastroPage
);

/* =====================================
   AUTENTICAÇÃO
===================================== */

router.post(
    "/login",
    AuthController.login
);

router.post(
    "/cadastro",
    AuthController.cadastrar
);

router.get(
    "/logout",
    AuthController.logout
);

/* =====================================
   API
===================================== */

router.get(
    "/api/usuarios",
    AuthController.apiUsuarios
);

module.exports = router;
