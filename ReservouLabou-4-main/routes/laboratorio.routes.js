
const express = require("express");
const router = express.Router();

const LaboratorioController =
    require("../controllers/laboratorio.controller");

const auth =
    require("../middlewares/auth");

const admin =
    require("../middlewares/admin");

/* =====================================
   CONSULTA DE LABORATÓRIOS
===================================== */

router.get(
    "/",
    auth,
    LaboratorioController.listar
);

/* =====================================
   OPERAÇÕES ADMINISTRATIVAS
===================================== */

router.get(
    "/novo",
    auth,
    admin,
    LaboratorioController.cadastroPage
);

router.post(
    "/novo",
    auth,
    admin,
    LaboratorioController.cadastrar
);

router.get(
    "/editar/:id",
    auth,
    admin,
    LaboratorioController.editarPage
);

router.post(
    "/editar/:id",
    auth,
    admin,
    LaboratorioController.editar
);

router.get(
    "/excluir/:id",
    auth,
    admin,
    LaboratorioController.excluir
);

/* =====================================
   API
===================================== */

router.get(
    "/api",
    auth,
    LaboratorioController.apiListar
);

router.get(
    "/api/:id",
    auth,
    LaboratorioController.buscar
);

router.put(
    "/api/:id",
    auth,
    admin,
    LaboratorioController.apiEditar
);

router.delete(
    "/api/:id",
    auth,
    admin,
    LaboratorioController.apiExcluir
);

module.exports = router;
