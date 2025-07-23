import express from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../lib/auth.js';

const router = express.Router();

router.get('/api/me', authenticateToken, async (req, res) => {
  try {
    // req.user est défini par le middleware
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, username: true } // ce que tu veux exposer
    });

    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;
