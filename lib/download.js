// lib/download.js
import fs from 'fs/promises';
import path from 'path';

export async function downloadImage(url, filename) {
  const res = await fetch(url);

  if (!res.ok) throw new Error(`Erreur téléchargement image: ${res.statusText}`);

  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const filePath = path.join('uploads', filename);
  await fs.writeFile(filePath, buffer);
}