// routes/uploadpp.js
import express from 'express';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { authenticateToken } from '../lib/auth.js';
import prisma from '../lib/db.js';

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(), // on traite en mémoire, pas sur disque
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 Mo max
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Seuls les fichiers images sont autorisés.'));
    }
    cb(null, true);
  }
});

router.post('/api/uploadpp', authenticateToken, (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err) {
      // Erreur Multer (ex: fichier non image)
      return res.status(400).json({ error: err.message });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Aucun fichier reçu' });
    }
    next();
  });
}, async (req, res) => {
  try {
    const email = req.user.email;
    const outputPath = `uploads/${email}.png`;

    await sharp(req.file.buffer)
      .resize(256, 256)
      .png()
      .toFile(outputPath);

    await prisma.user.update({
      where: { email },
      data: { avatar: `/uploads/${email}.png` }
    });

    res.json({ message: 'Avatar mis à jour', path: `/uploads/${email}.png` });
  } catch (err) {
    console.error('Erreur upload avatar :', err);
    res.status(500).json({ error: 'Erreur lors du traitement de l\'image' });
  }
});


export default router;
