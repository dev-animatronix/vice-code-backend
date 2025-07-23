import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET)
  throw new Error("La clé JWT_SECRET n'est pas définie. Veuillez définir cette variable d'environnement.");

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Récupère le token après "Bearer"

  if (!token) return res.status(401).json({ error: 'Token manquant' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide' });

    req.user = user; // user contient les données encodées dans le token (ex: userId, email)
    next();
  });
}
