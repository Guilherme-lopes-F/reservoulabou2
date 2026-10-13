const express = require("express");
const router = express.Router();

router.use(
    "/auth",
    require("./auth.routes")
);

router.use(
    "/laboratorios",
    require("./laboratorio.routes")
);

router.use(
    "/admin/laboratorios",
    require("./adminLaboratorio.routes")
);

router.use(
    "/equipamentos",
    require("./equipamento.routes")
);

router.use(
    "/reservas/laboratorios",
    require("./reservaLaboratorio.routes")
);

router.use(
    "/reservas/equipamentos",
    require("./reservaEquipamento.routes")
);

router.use(
    "/historico",
    require("./historico.routes")
);

// HOME DO ADMINISTRADOR
router.get("/admin", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/auth/login");
    }

    if (!req.session.usuario.admin) {
        return res.redirect("/");
    }

    res.render("admin/adminHome");
});

// HOME GERAL
router.get("/", (req, res) => {
    if (!req.session.usuario) {
        return res.redirect("/auth/login");
    }

    if (req.session.usuario.admin) {
        return res.redirect("/admin");
    }

    res.render("home/home");
});

module.exports = router;
