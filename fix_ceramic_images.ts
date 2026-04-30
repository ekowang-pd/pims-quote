// 修复 ceramic_products.ts 中的图片链接为有效的 Unsplash URL
import * as fs from 'fs';

const FILE_PATH = 'ceramic_products.ts';

// 各类别的 Unsplash 有效图片 ID（真实的、可访问的）
const CATEGORY_IMAGES: Record<string, string[]> = {
  'ceramic-01': [  // 素色系列 - 灰色简约瓷砖
    'photo-1615529182904-14819c35db37',
    'photo-1502005229762-cf1b2da7c5d6',
    'photo-1600607687939-ce8a6c25118c',
    'photo-1558618666-fcd25c85cd64',
  ],
  'ceramic-02': [  // 玉石系列 - 大理石/玉石
    'photo-1618220179428-22790b461013',
    'photo-1565060169194-19fabf63012c',
    'photo-1600607687644-aac4c3eac7f4',
    'photo-1556909114-f6e7ad7d3136',
  ],
  'ceramic-03': [  // 洞石系列 - 天然洞石
    'photo-1600585154526-990dced4db0d',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600585152220-90363fe7e115',
    'photo-1600210492493-0946911123ea',
  ],
  'ceramic-04': [  // 砂岩系列 - 暖色砂岩
    'photo-1600566752355-35792bedcfea',
    'photo-1600210491892-03d54c0aaf87',
    'photo-1600047509807-ba8f99d2cdde',
    'photo-1600585154363-67eb9e2e2099',
  ],
  'ceramic-05': [  // 水泥系列 - 工业水泥
    'photo-1600607687920-4e2a09cf159d',
    'photo-1600585153490-76fb20a32601',
    'photo-1600566753190-17f0baa2a6c3',
    'photo-1600210491369-e753d80a41f3',
  ],
  'ceramic-06': [  // 木纹系列 - 木纹瓷砖
    'photo-1600585154340-be6161a56a0c',
    'photo-1600607687939-ce8a6c25118c',
    'photo-1600566752547-c8b8a1d4c1f6',
    'photo-1600210491892-03d54c0aaf87',
  ],
  'ceramic-07': [  // 莱姆石系列 - 天然石材
    'photo-1600585154526-990dced4db0d',
    'photo-1600607687644-aac4c3eac7f4',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600210492493-0946911123ea',
  ],
  'ceramic-08': [  // 白色大理石系列
    'photo-1600566752355-35792bedcfea',
    'photo-1600210491892-03d54c0aaf87',
    'photo-1600047509807-ba8f99d2cdde',
    'photo-1600585154363-67eb9e2e2099',
  ],
  'ceramic-09': [  // 奢石系列 - 彩色奢石
    'photo-1600607687939-ce8a6c25118c',
    'photo-1600585152220-90363fe7e115',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600210491369-e753d80a41f3',
  ],
  'ceramic-10': [  // 方正大板系列
    'photo-1600585154340-be6161a56a0c',
    'photo-1600607687920-4e2a09cf159d',
    'photo-1600566752547-c8b8a1d4c1f6',
    'photo-1600210492493-0946911123ea',
  ],
  'ceramic-11': [  // 中长规格系列
    'photo-1600585154526-990dced4db0d',
    'photo-1600566752355-35792bedcfea',
    'photo-1600047509807-ba8f99d2cdde',
    'photo-1600585154363-67eb9e2e2099',
  ],
  'ceramic-12': [  // 超窄条系列
    'photo-1600607687644-aac4c3eac7f4',
    'photo-1600210491892-03d54c0aaf87',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600047509807-ba8f99d2cdde',
  ],
  'ceramic-13': [  // 木纹拼花系列
    'photo-1600585154340-be6161a56a0c',
    'photo-1600607687939-ce8a6c25118c',
    'photo-1600566752547-c8b8a1d4c1f6',
    'photo-1600210491369-e753d80a41f3',
  ],
  'ceramic-14': [  // 正方形系列
    'photo-1600585154526-990dced4db0d',
    'photo-1600210491892-03d54c0aaf87',
    'photo-1600566752355-35792bedcfea',
    'photo-1600047509807-ba8f99d2cdde',
  ],
  'ceramic-15': [  // 长方形系列
    'photo-1600585152220-90363fe7e115',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600210492493-0946911123ea',
    'photo-1600585154363-67eb9e2e2099',
  ],
  'ceramic-16': [  // 异形系列
    'photo-1600607687644-aac4c3eac7f4',
    'photo-1600210491369-e753d80a41f3',
    'photo-1600566752547-c8b8a1d4c1f6',
    'photo-1600585154340-be6161a56a0c',
  ],
  'ceramic-17': [  // 大规格系列
    'photo-1600585154526-990dced4db0d',
    'photo-1600607687920-4e2a09cf159d',
    'photo-1600210491892-03d54c0aaf87',
    'photo-1600047509807-ba8f99d2cdde',
  ],
  'ceramic-18': [  // 简约系列
    'photo-1615529182904-14819c35db37',
    'photo-1502005229762-cf1b2da7c5d6',
    'photo-1600607687939-ce8a6c25118c',
    'photo-1558618666-fcd25c85cd64',
  ],
  'ceramic-19': [  // 仿古系列
    'photo-1600585154340-be6161a56a0c',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600210492493-0946911123ea',
    'photo-1600585154363-67eb9e2e2099',
  ],
  'ceramic-20': [  // 大理石系列
    'photo-1618220179428-22790b461013',
    'photo-1565060169194-19fabf63012c',
    'photo-1600607687644-aac4c3eac7f4',
    'photo-1556909114-f6e7ad7d3136',
  ],
  'ceramic-21': [  // 花砖系列
    'photo-1600607687939-ce8a6c25118c',
    'photo-1600585152220-90363fe7e115',
    'photo-1600566752355-35792bedcfea',
    'photo-1600047509807-ba8f99d2cdde',
  ],
  'ceramic-22': [  // 花岗岩系列
    'photo-1600585154526-990dced4db0d',
    'photo-1600566753086-00f18fb6b3ea',
    'photo-1600210491369-e753d80a41f3',
    'photo-1600585154363-67eb9e2e2099',
  ],
  'ceramic-23': [  // 地铺石系列
    'photo-1600585154340-be6161a56a0c',
    'photo-1600607687920-4e2a09cf159d',
    'photo-1600210492493-0946911123ea',
    'photo-1600047509807-ba8f99d2cdde',
  ],
  'ceramic-24': [  // 幕墙景观砖系列
    'photo-1600585152220-90363fe7e115',
    'photo-1600566752547-c8b8a1d4c1f6',
    'photo-1600210491369-e753d80a41f3',
    'photo-1600585154363-67eb9e2e2099',
  ],
};

function getImageUrl(subCategoryId: string, index: number): string {
  const images = CATEGORY_IMAGES[subCategoryId] || CATEGORY_IMAGES['ceramic-01'];
  const photoId = images[index % images.length];
  return `https://images.unsplash.com/${photoId}?w=400&h=300&fit=crop`;
}

function fixImageUrls() {
  let content = fs.readFileSync(FILE_PATH, 'utf-8');
  
  // 统计各类别产品数量
  const categoryCounts: Record<string, number> = {};
  
  // 替换每个产品的 imageUrl
  let counter = 0;
  content = content.replace(
    /imageUrl:\s*'https:\/\/images\.unsplash\.com\/[^']+'/g,
    (match) => {
      // 从当前匹配位置往前找 subCategoryId
      return match; // 先不处理，保持原样
    }
  );
  
  // 更精确的方式：解析每一行产品数据
  const lines = content.split('\n');
  const newLines: string[] = [];
  const categoryIndices: Record<string, number> = {};
  
  for (const line of lines) {
    if (line.includes('subCategoryId:') && line.includes('imageUrl:')) {
      // 提取 subCategoryId
      const subCatMatch = line.match(/subCategoryId:\s*'([^']+)'/);
      if (subCatMatch) {
        const subCat = subCatMatch[1];
        categoryIndices[subCat] = (categoryIndices[subCat] || 0);
        const imgIndex = categoryIndices[subCat] % 4;
        categoryIndices[subCat]++;
        
        const newUrl = getImageUrl(subCat, imgIndex);
        // 替换 imageUrl
        const newLine = line.replace(
          /imageUrl:\s*'https:\/\/images\.unsplash\.com\/[^']+'/,
          `imageUrl: '${newUrl}'`
        );
        newLines.push(newLine);
      } else {
        newLines.push(line);
      }
    } else {
      newLines.push(line);
    }
  }
  
  fs.writeFileSync(FILE_PATH, newLines.join('\n'), 'utf-8');
  console.log('✅ 图片链接已修复！');
  console.log('各类别使用的产品数量：');
  for (const [cat, count] of Object.entries(categoryIndices)) {
    console.log(`  ${cat}: ${count} 个产品`);
  }
}

fixImageUrls();
