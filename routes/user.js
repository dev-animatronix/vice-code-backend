//delete, rename
// routes/user.js
import express from 'express';
import { authenticateToken } from '../lib/auth.js';
import prisma from '../lib/db.js';

const router = express.Router();

router.delete('/api/user/', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    await prisma.user.delete({
      where: { id: userId }
    });
    res.json({ message: `Utilisateur ${userId} supprimé` });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    res.status(500).json({ error: "Impossible de supprimer l'utilisateur." });
  }
});
router.put('/api/rename', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { newUsername } = req.body;

  if (!newUsername || typeof newUsername !== 'string') {
    return res.status(400).json({ error: 'Nom d’utilisateur invalide.' });
  }

  try {
    // Vérifie si le nom d'utilisateur est déjà pris
    const existingUser = await prisma.user.findUnique({
      where: { username: newUsername },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Nom d’utilisateur déjà utilisé.' });
    }

    // Met à jour l'utilisateur
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { username: newUsername },
    });

    res.json({ message: 'Nom d’utilisateur mis à jour.', user: updatedUser });
  } catch (error) {
    console.error('Erreur lors du changement de nom d’utilisateur :', error);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
  }
});

export default router;
