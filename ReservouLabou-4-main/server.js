require("dotenv").config();
console.log("DB_NAME:", process.env.DB_NAME);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "TEM SENHA" : "VAZIA");

const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const { engine } = require("express-handlebars");

const sequelize = require("./config/database");

const routes = require("./routes");

const errorHandler = require("./middlewares/errorHandler");

const app = express();

/* ======================================================
   CONFIGURAÇÕES
====================================================== */

app.use(express.urlencoded({

    extended: true

}));

app.use(express.json());

/* ======================================================
   CSS / JS / IMAGENS
====================================================== */

app.use(

    express.static(

        path.join(__dirname, "public")

    )

);

/* ======================================================
   HANDLEBARS
====================================================== */

app.engine(

    "handlebars",

    engine({

        defaultLayout: "main",

        layoutsDir:

            path.join(

                __dirname,

                "views/layouts"

            ),

        partialsDir:

            path.join(

                __dirname,

                "views/partials"

            )

    })

);

app.set(

    "view engine",

    "handlebars"

);

app.set(

    "views",

    path.join(

        __dirname,

        "views"

    )

);

/* ======================================================
   SESSION
====================================================== */

app.use(

    session({

        secret:

            process.env.SESSION_SECRET ||

            "ReservasLabs",

        resave: false,

        saveUninitialized: false,

        cookie: {

            maxAge:

                1000 * 60 * 60 * 24

        }

    })

);

/* ======================================================
   FLASH
====================================================== */

app.use(

    flash()

);

/* ======================================================
   VARIÁVEIS GLOBAIS
====================================================== */

app.use((req, res, next) => {

    res.locals.usuario =

        req.session.usuario || null;

    res.locals.success =

        req.flash("success");

    res.locals.error =

        req.flash("error");

    next();

});

/* ======================================================
   ROTAS
====================================================== */

app.use(

    "/",

    routes

);

/* ======================================================
   404
====================================================== */

app.use((_req, res) => {

    res.status(404).render(

        "errors/404",

        {

            titulo:

                "Página não encontrada"

        }

    );

});

/* ======================================================
   ERROR HANDLER
====================================================== */

app.use(

    errorHandler

);

/* ======================================================
   DATABASE
====================================================== */

sequelize

.sync({

    alter: true

})

.then(() => {

    console.log(

        "Banco sincronizado."

    );

    const PORT =

        process.env.PORT ||

        3000;

    app.listen(

        PORT,

        () => {

            console.log(

                `Servidor iniciado em http://localhost:${PORT}`

            );

        }

    );

})

.catch(err => {

    console.log(err);

});
