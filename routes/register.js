// routes/register.js
import express from 'express';
import bcrypt from 'bcrypt';
import prisma from '../lib/db.js';
import { downloadImage } from '../lib/download.js';

const router = express.Router();

router.post('/api/register', async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password)
    return res.status(400).json({ error: 'Missing fields' });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, username, password: hashedPassword, avatar: `/uploads/${email}` },
    });

    try {
      await downloadImage(`https://api.dicebear.com/9.x/bottts-neutral/png?seed=${email}`, `${email}.png`);
    } catch (err) {
      res.status(500).json({ message: 'Erreur', error: err.message });
    }

    res.status(201).json({ message: 'User created', user: { id: user.id, email: user.email } });
  } catch (err) {
    // Vérifie si l'erreur est une instance d'une erreur Prisma
    if (err.code === 'P2002') {
      // Erreur P2002 signifie violation de contrainte unique
      // err.meta.target donnera le champ (ex: ['email'] ou ['username'])
      if (err.meta.target.includes('email')) {
        return res.status(409).json({ error: 'Cet e-mail est déjà utilisé.' });
      }
      if (err.meta.target.includes('username')) {
        return res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris.' });
      }
      // Fallback si c'est une P2002 mais pas l'email/username (peu probable ici)
      return res.status(409).json({ error: 'Une ressource avec cette valeur existe déjà.' });
    }
    // Pour toutes les autres erreurs non-Prisma ou autres erreurs Prisma non gérées spécifiquement
    console.error(err); // Il est important de logger les erreurs inattendues
    res.status(500).json({ error: 'Une erreur serveur est survenue. Veuillez réessayer plus tard.' });
  }
});

export default router;
