// scripts/optimize-images-webp.js
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
  const files = fs.readdirSync(inputDir);
  
  for (const file of files) {
    if (!/\.(png|jpg|jpeg)$/i.test(file)) continue;
    
    const inputPath = path.join(inputDir, file);
    const baseName = path.parse(file).name;
    const outputPath = path.join(inputDir, `${baseName}.webp`);
    
    const isCritical = CRITICAL_IMAGES.includes(file);
    
    try {
      // WebP 변환 (기존 PNG와 동일한 폴더에 생성)
      await sharp(inputPath)
        .webp({ 
          quality: isCritical ? 90 : 75,
          effort: 6
        })
        .toFile(outputPath);
        
      // 파일 크기 비교
      const originalSize = fs.statSync(inputPath).size;
      const webpSize = fs.statSync(outputPath).size;
      const reduction = ((originalSize - webpSize) / originalSize * 100).toFixed(1);
      
      console.log(`✅ ${file} → ${baseName}.webp (${reduction}% 감소)`);
    } catch (error) {
      console.error(`❌ ${file} 최적화 실패:`, error);
    }
  }
  
  console.log('\n🚀 WebP 최적화 완료! ReliableImage 컴포넌트가 자동으로 WebP를 사용합니다.');
}

optimizeImages();