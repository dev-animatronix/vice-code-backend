// routes/login.js
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../lib/db.js';

const router = express.Router();

router.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ error: "Champs manquants" });

  try {
    // check l'existence de l'utilisateur
    const user = await prisma.user.findUnique({where: { email },});
    if (!user)
      return res.status(401).json({ error: 'Utilisateur inexistant' });

    // check le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch)
      return res.status(401).json({ error: 'Mot de passe incorrect' });

    // genere un token JWT
    const JWT_SECRET = process.env.JWT_SECRET;
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' } // token valide 1 heure
    );

    // reponse
    res.json({
      message: 'Connexion réussie',
      token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
      }
    });

  } catch(err) {
    console.error('Erreur lors du login :', err);
    res.status(500).json({ error: 'Erreur serveur, réessayez plus tard.' });
  }

});

export default router;
