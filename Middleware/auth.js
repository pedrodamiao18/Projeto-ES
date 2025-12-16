const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const verifyJwt = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      console.log("Erro de autenticação", err);
      return res.status(401).json({ error: "Token inválido" });
    }
    req.user = decoded;
    req.utilizador = decoded; // mantem compatibilidade com middlewares que usam req.utilizador
    next();
  });
};

const authorizeRole = (requiredRole) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    next();
  };
};

module.exports = {
  verifyJwt,
  authorizeRole
};