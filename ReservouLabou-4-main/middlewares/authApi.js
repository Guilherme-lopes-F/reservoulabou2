const jwt = require("jsonwebtoken");

module.exports = function(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ erro: "Token não fornecido." });
    }

    // O formato esperado é "Bearer TOKEN_AQUI"
    const partes = authHeader.split(" ");
    if (partes.length !== 2) {
        return res.status(401).json({ erro: "Erro no formato do token." });
    }

    const [scheme, token] = partes;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ erro: "Token mal formatado." });
    }

    jwt.verify(token, process.env.JWT_SECRET || "sua_chave_secreta_jwt_aqui", (err, decoded) => {
        if (err) {
            return res.status(401).json({ erro: "Token inválido ou expirado." });
        }

        // Salva os dados do usuário na requisição para uso posterior
        req.usuarioId = decoded.id;
        req.usuarioAdmin = decoded.admin;
        return next();
    });
};
