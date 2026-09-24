const express = require("express");
const router = express.Router();

const ReservaLaboratorioController =
require("../controllers/reservaLaboratorio.controller");

const auth =
require("../middlewares/auth");

/* =====================================
   PÁGINAS
===================================== */

router.get(
    "/",
    auth,
    ReservaLaboratorioController.listar
);

router.get(
    "/novo",
    auth,
    ReservaLaboratorioController.cadastroPage
);

router.post(
    "/novo",
    auth,
    ReservaLaboratorioController.cadastrar
);

router.get(
    "/editar/:id",
    auth,
    ReservaLaboratorioController.editarPage
);

router.post(
    "/editar/:id",
    auth,
    ReservaLaboratorioController.editar
);

router.get(
    "/excluir/:id",
    auth,
    ReservaLaboratorioController.excluir
);

/* =====================================
   HORÁRIOS
===================================== */

router.get(
    "/horarios",
    auth,
    ReservaLaboratorioController.buscarHorariosDisponiveis
);

/* =====================================
   API
===================================== */

router.get(
    "/api",
    ReservaLaboratorioController.apiListar
);

router.get(
    "/api/:id",
    ReservaLaboratorioController.buscar
);

router.post(
    "/api",
    ReservaLaboratorioController.apiCadastrar
);

router.put(
    "/api/:id",
    ReservaLaboratorioController.apiEditar
);

router.delete(
    "/api/:id",
    ReservaLaboratorioController.apiExcluir
);

module.exports = router;
