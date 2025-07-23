import express from 'express';
import prisma from '../lib/db.js';
import { authenticateToken } from '../lib/auth.js';

const router = express.Router();

// Creation d'un projet
router.post('/api/project', authenticateToken, async (req, res) => {
  let userId = req.user.userId;
  console.log(req.user)
  const { name, html = '', css = '', js = '' } = req.body;
  if (!name) return res.status(400).json({ error: 'Veuillez définir un nom' });

  
  try {
    const existingProject = await prisma.project.findFirst({
      where: {
        name,
        userId,
      },
    });

    if (existingProject) {
      return res.status(409).json({ error: "Un projet avec ce nom existe déjà." });
    }


    const project = await prisma.project.create({
      data: {
        name,
        html,
        css,
        js,
        userId: req.user.userId
      }
    });

    res.status(201).json({ message: 'Projet créé avec succès.', project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur lors de la création du projet.' });
  }
});

// Lister les projets
router.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      where: { userId: req.user.userId }, // filtre sur l'utilisateur connecté
      select: {
        id: true,
        name: true,
        html: true,
        css: true,
        js: true,
      }
    });
    res.json({ projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur lors de la récupération des projets" });
  }
});

// Obtenir un projet
router.get('/api/project/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.id;

  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Projet non trouvé" });
    }

    // Vérifier que le projet appartient bien à l'utilisateur connecté
    if (project.userId !== userId) {
      return res.status(403).json({ error: "Accès refusé" });
    }

    res.status(200).json({ project });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Modification d'un projet
router.put('/api/project/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const projectId = req.params.id;

  // Champs que l'on peut mettre à jour
  const { name, html, css, js } = req.body;

  try {
    // Vérifier que le projet existe
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }

    // Vérifier que le projet appartient bien à l'utilisateur connecté
    if (project.userId !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Mettre à jour seulement les champs fournis
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        // On met à jour seulement si les champs ne sont pas undefined
        ...(name !== undefined && { name }),
        ...(html !== undefined && { html }),
        ...(css !== undefined && { css }),
        ...(js !== undefined && { js }),
      },
    });

    res.status(200).json({ project: updatedProject });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Suppretion d'un projet
router.delete('/api/project/:id', authenticateToken, async (req, res) => {
  const userId = req.user.userId; // récupéré dans le middleware d'authentification
  const projectId = req.params.id;

  try {
    // Vérifier que le projet appartient bien à l'utilisateur connecté
    const project = await prisma.project.findUnique({
      where: { id: projectId }
    });

    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    if (project.userId !== userId) {
      return res.status(403).json({ error: 'Accès refusé' });
    }

    // Supprimer le projet
    await prisma.project.delete({
      where: { id: projectId }
    });

    return res.status(200).json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
});

export default router;

