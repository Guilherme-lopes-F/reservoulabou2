const express = require("express");
const router = express.Router();

const EquipamentoController =
require("../controllers/equipamento.controller");

const auth =
require("../middlewares/auth");

/* =====================================
   PÁGINAS
===================================== */

router.get(
    "/",
    auth,
    EquipamentoController.listar
);

router.get(
    "/novo",
    auth,
    EquipamentoController.cadastroPage
);

router.post(
    "/novo",
    auth,
    EquipamentoController.cadastrar
);

router.get(
    "/editar/:id",
    auth,
    EquipamentoController.editarPage
);

router.post(
    "/editar/:id",
    auth,
    EquipamentoController.editar
);

router.get(
    "/excluir/:id",
    auth,
    EquipamentoController.excluir
);

/* =====================================
   API
===================================== */

router.get(
    "/api",
    EquipamentoController.apiListar
);

router.get(
    "/api/:id",
    EquipamentoController.buscar
);

router.post(
    "/api",
    EquipamentoController.apiCadastrar
);

router.put(
    "/api/:id",
    EquipamentoController.apiEditar
);

router.delete(
    "/api/:id",
    EquipamentoController.apiExcluir
);

module.exports = router;
