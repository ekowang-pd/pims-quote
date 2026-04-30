// 重新生成陶瓷产品数据，正确添加标签
const fs = require('fs');

// 读取原始备份或重新生成
// 这里直接从现有数据中修复

const content = fs.readFileSync('./ceramic_products.ts', 'utf-8');
const lines = content.split('\n');

const tagConfigs = [
  { type: 'hot', weight: 3 },
  { type: 'recommend', weight: 3 },
  { type: 'new', weight: 2 },
  { type: 'sale', weight: 2 },
];

const totalWeight = tagConfigs.reduce((sum, t) => sum + t.weight, 0);

function randomTagType() {
  let r = Math.random() * totalWeight;
  for (const config of tagConfigs) {
    r -= config.weight;
    if (r <= 0) return config.type;
  }
  return 'hot';
}

function randomQuoteCount() {
  return Math.floor(Math.random() * 50) + 5;
}

const shouldAddTag = (id) => {
  const num = parseInt(id.split('-')[1]);
  return num % 8 === 0;
};

// 重新解析整个文件
let result = '// Auto-generated, 401 products\nexport const CERAMIC_PRODUCTS = [\n';

// 逐行处理
let inObject = false;
let braceCount = 0;
let currentObject = '';
let objectStartIdx = -1;
let objects = [];

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // 跳过头部
  if (line.startsWith('//') || line.startsWith('export')) continue;
  
  // 检测对象开始
  if (line.trim().startsWith('{')) {
    inObject = true;
    currentObject = line;
    braceCount = 1;
    objectStartIdx = i;
    continue;
  }
  
  if (inObject) {
    currentObject += '\n' + line;
    braceCount += (line.match(/{/g) || []).length;
    braceCount -= (line.match(/}/g) || []).length;
    
    if (braceCount === 0) {
      inObject = false;
      
      // 提取 id
      const idMatch = currentObject.match(/id: '([^']+)'/);
      const id = idMatch ? idMatch[1] : null;
      
      // 移除可能错误插入的 tags
      let cleanObject = currentObject
        .replace(/,\s*\n\s*tags: \[[^\]]*\]\s*,?/g, ',') // 移除错误的 tags
        .replace(/tags: \[[^\]]*\]\s*,?/g, ''); // 移除错误的 tags
      
      // 在对象末尾正确添加标签
      if (id && shouldAddTag(id)) {
        const tagType = randomTagType();
        const quoteCount = randomQuoteCount();
        
        // 在最后一个 } 前插入 tags
        cleanObject = cleanObject.replace(
          /(\})\s*$/,
          `,\n    tags: [{ type: '${tagType}', quoteCount: ${quoteCount} }]\n  }`
        );
      }
      
      objects.push(cleanObject);
      currentObject = '';
    }
  }
}

result += objects.join(',\n\n');
result += '\n];';

// 写回文件
fs.writeFileSync('./ceramic_products.ts', result, 'utf-8');

console.log('数据修复完成！共 ' + objects.length + ' 个产品');
