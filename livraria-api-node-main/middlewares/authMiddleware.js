const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "chave_super_secreta_livraria_2026";

function autenticarToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai após "Bearer "

  if (!token) {
    return res.status(401).json({ erro: "Acesso negado: Token de autenticação não fornecido." });
  }

  jwt.verify(token, JWT_SECRET, (err, usuarioDecodificado) => {
    if (err) {
      return res.status(401).json({ erro: "Token inválido, corrompido ou expirado." });
    }
    req.usuario = usuarioDecodificado;
    next();
  });
}

function exigirRole(roleEsperada) {
  return (req, res, next) => {
    if (!req.usuario || req.usuario.role !== roleEsperada) {
      return res.status(403).json({ 
        erro: `Acesso proibido: Privilégio de ${roleEsperada} exigido para esta operação.` 
      });
    }
    next();
  };
}

module.exports = { autenticarToken, exigirRole };