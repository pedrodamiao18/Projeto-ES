function isCliente(req, res, next) {
    if (req.utilizador && req.utilizador.role === "cliente") {
        return next();
    }
    return res.status(403).json({ erro: "Acesso permitido apenas a clientes" });
}

function isTecnico(req, res, next) {
    if (req.utilizador && req.utilizador.role === "tecnico") {
        return next();
    }
    return res.status(403).json({ erro: "Acesso permitido apenas a administradores" });
}

function isAdministrador (req, res, next){
    if(req.utilizador && req.utilizador.role === "admin"){
        return next();
    }

    return res.status(403).json({erro: "Acesso permitido apenas a administradores"})
}

module.exports = { isCliente, isTecnico, isAdministrador };
