const express = require("express");
const router = express.Router();

const HistoricoController =
require("../controllers/historico.controller");

const auth =
require("../middlewares/auth");

/* =====================================
   PÁGINAS
===================================== */

router.get(
    "/",
    auth,
    HistoricoController.historico
);

router.get(
    "/dashboard",
    auth,
    HistoricoController.dashboard
);

router.get(
    "/estatisticas",
    auth,
    HistoricoController.estatisticas
);

router.get(
    "/relatorios",
    auth,
    HistoricoController.listarRelatorios
);

router.post(
    "/relatorio",
    auth,
    HistoricoController.gerarRelatorio
);

router.get(
    "/relatorio/excluir/:id",
    auth,
    HistoricoController.excluirRelatorio
);

/* =====================================
   CONSULTAS
===================================== */

router.get(
    "/usuario/:id",
    auth,
    HistoricoController.buscarUsuario
);

router.get(
    "/laboratorio/:id",
    auth,
    HistoricoController.buscarLaboratorio
);

router.get(
    "/periodo",
    auth,
    HistoricoController.buscarPeriodo
);

/* =====================================
   API
===================================== */

router.get(
    "/api/dashboard",
    HistoricoController.apiDashboard
);

router.get(
    "/api/historico",
    HistoricoController.apiHistorico
);

router.get(
    "/api/relatorios",
    HistoricoController.apiRelatorios
);

router.delete(
    "/api/relatorios/:id",
    HistoricoController.apiExcluirRelatorio
);

module.exports = router;
