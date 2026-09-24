const express = require("express");
const router = express.Router();

const ReservaEquipamentoController =
require("../controllers/reservaEquipamento.controller");

const auth =
require("../middlewares/auth");

/* =====================================
   PÁGINAS
===================================== */

router.get(
    "/",
    auth,
    ReservaEquipamentoController.listar
);

router.get(
    "/novo",
    auth,
    ReservaEquipamentoController.cadastroPage
);

router.post(
    "/novo",
    auth,
    ReservaEquipamentoController.cadastrar
);

router.get(
    "/editar/:id",
    auth,
    ReservaEquipamentoController.editarPage
);

router.post(
    "/editar/:id",
    auth,
    ReservaEquipamentoController.editar
);

router.get(
    "/excluir/:id",
    auth,
    ReservaEquipamentoController.excluir
);

router.get(
    "/disponibilidade",
    auth,
    ReservaEquipamentoController.verificarDisponibilidade
);

/* =====================================
   API
===================================== */

router.get(
    "/api",
    ReservaEquipamentoController.apiListar
);

router.get(
    "/api/:id",
    ReservaEquipamentoController.buscar
);

router.post(
    "/api",
    ReservaEquipamentoController.apiCadastrar
);

router.put(
    "/api/:id",
    ReservaEquipamentoController.apiEditar
);

router.delete(
    "/api/:id",
    ReservaEquipamentoController.apiExcluir
);

module.exports = router;
