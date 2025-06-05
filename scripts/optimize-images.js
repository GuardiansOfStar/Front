// scripts/optimize-images.js (새 파일)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizeImages = async () => {
  const publicDir = path.join(__dirname, '../public/assets/images');
  const files = fs.readdirSync(publicDir);
  
  for (const file of files) {
    if (file.endsWith('.png')) {
      const inputPath = path.join(publicDir, file);
      const outputPath = path.join(publicDir, file.replace('.png', '.webp'));
      
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(outputPath);
      
      console.log(`Optimized: ${file} -> ${file.replace('.png', '.webp')}`);
    }
  }
};

optimizeImages();