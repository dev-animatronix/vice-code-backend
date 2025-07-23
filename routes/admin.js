// routes/admin.js
//import express from 'express';
//import prisma from '../lib/db.js';
//import { authenticateToken } from '../lib/auth.js';
//
//const router = express.Router();
//
//router.get('/api/admin/users', authenticateToken, async (req, res) => {
//  const admin = await prisma.user.findUnique({
//    where: { id: req.user.userId }
//  });
//
//  if (!admin?.isAdmin) {
//    return res.status(403).json({ error: 'Accès refusé' });
//  }
//
//  const users = await prisma.user.findMany({
//    select: { id: true, email: true, username: true, createdAt: true, isAdmin: true }
//  });
//
//  res.json({ users });
//});
//
//export default router;