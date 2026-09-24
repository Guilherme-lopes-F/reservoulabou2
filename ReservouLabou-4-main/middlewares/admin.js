module.exports = (req, res, next) => {

    if (!req.session.usuario) {

        return res.redirect("/auth/login");

    }

    if (!req.session.usuario.StatusADM) {

        return res.status(403).render(

            "errors/403",

            {

                titulo: "Acesso Negado",

                mensagem: "Você não possui permissão para acessar esta página."

            }

        );

    }

    res.locals.usuario = req.session.usuario;

    next();

};
