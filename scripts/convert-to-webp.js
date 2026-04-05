import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const publicDir = path.join(process.cwd(), 'public');

console.log('Working directory:', process.cwd());
console.log('Public directory:', publicDir);
console.log('Public exists:', fs.existsSync(publicDir));

async function convertToWebp(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) return;

    const outputPath = filePath.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    
    console.log(`Converting ${path.basename(filePath)} to WebP...`);
    
    await sharp(filePath)
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    // Delete original
    fs.unlinkSync(filePath);
    console.log(`✓ Converted: ${path.basename(outputPath)}`);
  } catch (error) {
    console.error(`Error converting ${filePath}:`, error.message);
  }
}

async function walkDir(dir) {
  if (!fs.existsSync(dir)) {
    console.log(`Directory does not exist: ${dir}`);
    return;
  }

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
  console.log(`Starting WebP conversion in: ${publicDir}`);
  await walkDir(publicDir);
  console.log('Done!');
}

main().catch(console.error);
