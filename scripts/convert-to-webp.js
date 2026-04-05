import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

async function convertToWebp(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    console.log(`Converting ${filePath} to ${outputPath}...`);
    
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`✓ Converted: ${outputPath}`);
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error);
  }
}

async function walkDir(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      await walkDir(filePath);
    } else if (stat.isFile()) {
      await convertToWebp(filePath);
    }
  }
}

async function main() {
  console.log('Starting WebP conversion...');
  await walkDir(publicDir);
  console.log('Done!');
}

main().catch(console.error);
