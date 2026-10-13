
const express = require("express");
const router = express.Router();

const LaboratorioController =
    require("../controllers/laboratorio.controller");

const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");

router.use(auth, admin);

router.get("/", LaboratorioController.listarAdmin);

router.get("/novo", LaboratorioController.cadastroPageAdmin);
router.post("/novo", LaboratorioController.cadastrarAdmin);

router.get("/editar/:id", LaboratorioController.editarPageAdmin);
router.post("/editar/:id", LaboratorioController.editarAdmin);

router.get("/excluir/:id", LaboratorioController.excluirAdmin);

module.exports = router;
