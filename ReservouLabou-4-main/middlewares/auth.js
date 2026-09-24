module.exports = (req, res, next) => {

    if (!req.session.usuario) {

        return res.redirect("/auth/login");

    }

    res.locals.usuario = req.session.usuario;

    next();

};
