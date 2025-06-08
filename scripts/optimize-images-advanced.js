// scripts/optimize-images-advanced.js
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CRITICAL_IMAGES = [
  'background.png',
  'star_character.png', 
  'title.png',
  'start_button.png'
];

async function optimizeImages() {
  const inputDir = path.join(__dirname, '../public/assets/images');
  const outputDir = path.join(__dirname, '../public/assets/images-optimized');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
    
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const isCritical = CRITICAL_IMAGES.includes(file);
    
    try {
      // WebP 변환 (50-80% 크기 감소)
      await sharp(inputPath)
        .webp({ 
          quality: isCritical ? 90 : 75,
          effort: 6
        })
        .toFile(path.join(outputDir, `${baseName}.webp`));
      
      // 압축된 원본 형식도 생성 (WebP 미지원 브라우저용)
      await sharp(inputPath)
        .png({ 
          quality: isCritical ? 95 : 80,
          compressionLevel: 9
        })
        .toFile(path.join(outputDir, file));
        
      console.log(`✅ ${file} 최적화 완료`);
    } catch (error) {
      console.error(`❌ ${file} 최적화 실패:`, error);
    }
  }
}

optimizeImages();