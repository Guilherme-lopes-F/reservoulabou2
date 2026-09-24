module.exports = (err, req, res, next) => {

    console.error("========================================");
    console.error("ERRO:");
    console.error(err);
    console.error("========================================");

    if (res.headersSent) {

        return next(err);

    }

    const status = err.status || 500;

    if (req.originalUrl.startsWith("/api")) {

        return res.status(status).json({

            sucesso: false,

            erro: err.message || "Erro interno do servidor."

        });

    }

    res.status(status).render(

        "errors/500",

        {

            titulo: "Erro Interno",

            mensagem: err.message || "Ocorreu um erro inesperado."

        }

    );

};
