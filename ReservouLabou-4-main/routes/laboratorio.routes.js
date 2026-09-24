const express = require("express");
const router = express.Router();

const LaboratorioController =
require("../controllers/laboratorio.controller");

const auth =
require("../middlewares/auth");

/* =====================================
   PÁGINAS
===================================== */

router.get(
    "/",
    auth,
    LaboratorioController.listar
);

router.get(
    "/novo",
    auth,
    LaboratorioController.cadastroPage
);

router.post(
    "/novo",
    auth,
    LaboratorioController.cadastrar
);

router.get(
    "/editar/:id",
    auth,
    LaboratorioController.editarPage
);

router.post(
    "/editar/:id",
    auth,
    LaboratorioController.editar
);

router.get(
    "/excluir/:id",
    auth,
    LaboratorioController.excluir
);

/* =====================================
   API
===================================== */

router.get(
    "/api",
    LaboratorioController.apiListar
);

router.get(
    "/api/:id",
    LaboratorioController.buscar
);

router.put(
    "/api/:id",
    LaboratorioController.apiEditar
);

router.delete(
    "/api/:id",
    LaboratorioController.apiExcluir
);

module.exports = router;
